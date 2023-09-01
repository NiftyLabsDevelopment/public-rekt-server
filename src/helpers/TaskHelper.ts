import { ethers } from "ethers";
import { Response } from "express";
import { app } from "../services/Server";
import { getEthGasSpent } from "./tasks/GasSpentTask";
import { getRektTokensCount } from "./tasks/RektTokensTask";
import { getArtGobblersBoughtFor } from "./tasks/ArtGobblersTask";
import { getEmbarrassingNftsMintedFor, stillHoldingEmbarrassingMints } from "./tasks/SillyMintsTask";
import { getNftProfitsFor } from "./tasks/NftProfitTask";
import { getTimesDumpedOnByInfluencers } from "./tasks/InflurencerDumpTask";
import { checkIfBoughtTop } from "./tasks/BoughtTopTasks";
import { getGoblinTownData } from "./tasks/GoblinTownTasks";
import { getCompromisedNFTCountFor } from "./tasks/OpenseaCompromised";
import { getAllBuysForWallet, getAllMintsForWallet, getAllNftsForWallet, getAllSalesForWallet, getUnrealizedProfit } from "./WalletHelper";
import { getTimesUsedLendingProtocols } from "./tasks/LendingTask";
import { handleAllTasks, reorganiseTasksForDay } from "./DaySplitter";
import User from "../schemas/User";
import fs from 'fs';
import Fail from "../schemas/Fail";
import { fetchOpenseaData, getOpenseaUserDataFor } from "./IndexingData/OpenseaWallets";
import { getRektDay, setRektDay } from "./DayHandler";
import { getAllUsersFinished, getRankForWallet } from "./LeaderboardBuilder";
import { getOpenseaContractDataFor } from "./IndexingData/OpenseaContracts";
import UserQuestion from "../schemas/UserQuestion";

const base_path = process.cwd();

export interface QueueState {
    state: string,
    queue: number
}

export type TaskData = Awaited<ReturnType<typeof getTaskDataFor>>;

let rekt_queue: string[] = [];
let queue_active: Boolean = false;

let queue_state_for = new Map<string, QueueState>();
export let current_wallet = "";

let queue_finished_count = 0;
let queue_count = 0;

interface BackupData {
    queue: string[],
    queue_states: { wallet: string, state: string, queue: number }[],
    queue_finished: number,
    queue_current_count: number,
    current_wallet: string
}

export function backupQueueData() {
    let save_path = `${base_path}/backup`;

    let queue_states: { wallet: string, state: string, queue: number }[] = [];

    for(const [key, value] of queue_state_for)
        queue_states.push({wallet: key, state: value.state, queue: value.queue});
    

    let queue = rekt_queue;
    let queue_finished = queue_finished_count;
    let queue_current_count = queue_count;

    let backup_data: BackupData = { queue, queue_states, queue_finished, queue_current_count, current_wallet };

    fs.writeFileSync(`${save_path}/queuedata.json`, JSON.stringify(backup_data, null, 4));
}

export async function restoreBackup() {
    let save_path = `${base_path}/backup`;

    if(!fs.existsSync(`${save_path}/queuedata.json`))
        return;

    let data = fs.readFileSync(`${save_path}/queuedata.json`).toString();

    let parsed = JSON.parse(data) as BackupData;

    rekt_queue = parsed.queue;
    queue_finished_count = parsed.queue_finished;
    queue_count = parsed.queue_current_count;

    for(const data of parsed.queue_states)
        queue_state_for.set(data.wallet, {state: data.state, queue: data.queue})

    if(parsed.current_wallet != "") {
        current_wallet = parsed.current_wallet;
        rekt_queue.unshift(parsed.current_wallet);
    }
    
    return;

}

export async function checkQueue() {
    if(queue_active)
        return;

    queue_active = true;

    while(rekt_queue.length > 0) {
        let rekt = rekt_queue.shift();

        if(!rekt) {
            queue_active = false;
            return;
        }

        await getTaskDataFor(rekt);

        queue_finished_count++;
    }

    queue_active = false;
}

export function getStateForWallet(wallet: string) {
    let queue_state = queue_state_for.get(wallet);

    if(wallet.toLowerCase() == current_wallet.toLowerCase()) return { state: 'active', queue: 0 } as QueueState;

    if(queue_state == undefined) return { state: 'none', queue: 0 } as QueueState;

    if(queue_state.state == 'ready') return { state: 'ready', queue: 0 } as QueueState;

    let queue = queue_state.queue - queue_finished_count;

    return {state: 'queue', queue: queue};
}

function startForWallet(wallet: string) {
    let queue_state = queue_state_for.get(wallet);

    if(queue_state != undefined && queue_state.state == 'queue') return false;

    if(queue_state == undefined) queue_state = { state: 'queue', queue: queue_count++ };

    if(queue_state.state == 'fail') queue_state = { state: 'queue', queue: queue_count++ };

    if(queue_state.state == 'ready') return { state: 'ready', queue: 0 } as QueueState;

    queue_state_for.set(wallet, queue_state);

    return true
}

export async function addEventToQueue(wallet: string) {

    if(!startForWallet(wallet))
        return;

    rekt_queue.push(wallet);

    checkQueue();
}

export async function startTaskListener() {

    app.get('/progress/:wallet', async(req, res) => {
        let wallet = ethers.utils.getAddress(req.params.wallet);

        res.json(getStateForWallet(wallet));
    });

    app.get('/setday/:day/:secret', async(req, res) => {
        if(req.params.secret != "88d8caea2e31279bebe877a14d3767a859a543a6690de44984af0dac4682431e") {
            res.json({success: false, message: "Invalid secret"});
            return;
        }
        
        let day = Number(req.params.day);

        if(day < 0) day = 0;
        if(day > 8) day = 8;

        setRektDay(Number(req.params.day));

        res.json({success: true});
    });

    app.get('/getanswers/:secret', async(req, res) => {
        if(req.params.secret != "88d8caea2e31279bebe877a14d3767a859a543a6690de44984af0dac4682431e") {
            res.json({success: false, message: "Invalid secret"});
            return;
        }
    
        let users = await getAllUsersFinished();
        let answers = await UserQuestion.find();
    
        // Create a map to store answers with the user ID as the key
        let answerMap = new Map();
        for (const answer of answers) {
            answerMap.set(answer.user.toString().toLowerCase(), answer.answer);
        }
    
        let answer_data: {wallet: string, answers: string[]}[] = [];
    
        for(const user of users) {
            let userId = user._id.toString().toLowerCase();
            let myAnswers = answerMap.get(userId);
    
            if(!myAnswers) continue;
    
            answer_data.push({wallet: user.wallet, answers: myAnswers});
        }
    
        // Set the content type and attachment headers
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename=answers.json'
        });
    
        // Send the JSON data as a downloadable file
        res.send(JSON.stringify(answer_data));
    });

    app.get('/tasks/:wallet/:day', async(req, res) => {
        let user = await User.findOne({wallet: req.params.wallet});
        let day = Number(req.params.day);

        if(day > getRektDay())
            day = getRektDay();

        if(!user) {
            res.json({
                success: false,
                message: "User not found with wallet"
            });

            return;
        }

        
        let rank = getRankForWallet(user.wallet);
        let openseaData = getOpenseaUserDataFor(user.wallet);

        if(user.rektFinished) {
            let data = reorganiseTasksForDay(user, day);

            let gotTwitterBonus = user.twitterBonus ? true : false;

            res.json({success: true, data: data, state: {state: 'ready', queue: 0}, rank: rank, openseaData: openseaData, twitterBonus: gotTwitterBonus});

            return;
        }

        let state = getStateForWallet(user.wallet);

        res.json({
            success: true,
            state: state,
            rank: rank,
            openseaData: openseaData
        });
    })

}


export async function getTaskDataFor(wallet: string) {
    try {
        console.log("Checking wallet:", wallet);

        current_wallet = wallet;

        console.log("Getting buys");
        let buys = await getAllBuysForWallet(wallet);
        
        console.log("Getting sales");
        let sales = await getAllSalesForWallet(wallet);

        console.log("Getting mints");
        let mints = await getAllMintsForWallet(wallet);

        console.log("Getting nfts");
        let nfts = await getAllNftsForWallet(wallet);

        //Task One
        let profits = await getNftProfitsFor(wallet, buys, sales, mints); 

        //Task Two
        let gasSpent = await getEthGasSpent(wallet);

        //Task Three
        let topBought = await checkIfBoughtTop(wallet, buys);

        //Task Four
        let rektTokens = await getRektTokensCount(wallet);

        //Task Five
        let sillyMints = await getEmbarrassingNftsMintedFor(mints);

        //Task Six
        let stillHoldingSillyMints = await stillHoldingEmbarrassingMints(nfts);

        //Task Seven
        let dumpoors = await getTimesDumpedOnByInfluencers(wallet, buys);

        //Task Nine
        let unrealizedProfit = await getUnrealizedProfit(buys, nfts);

        let totalPoints = profits.points + gasSpent.points + topBought.points + rektTokens.points + sillyMints.points + stillHoldingSillyMints.points + dumpoors.points + unrealizedProfit.points;

        let returnData = ({
            profits,
            gasSpent,
            topBought,
            rektTokens,
            sillyMints,
            stillHoldingSillyMints,
            dumpoors,
            unrealizedProfit,
            totalPoints
        })

        await handleAllTasks(returnData, wallet);

        queue_state_for.set(wallet, {state: 'ready', queue: 0});

        current_wallet = "";

        try {
            fetchOpenseaData(wallet);
        } catch (e) {
            console.log(e);
        }

        return returnData;

    } catch(e) {
        console.log(e);
        queue_active = false;
        queue_state_for.set(wallet, {state: 'fail', queue: 0});
        addEventToQueue(wallet);
        current_wallet = "";

        checkQueue();

        try {
            let fail = new Fail({wallet: wallet, error: JSON.stringify(e)});
            fail.save();
        } catch (e) {
            console.log(e);
        }

    }
}