import User, { IUser } from "../schemas/User";
import { app } from "../services/Server";
import { UserAccount } from "../Types";
import { getRektDay, setRektDay } from "./DayHandler";
import { reorganiseTasksForDay } from "./DaySplitter";
import { getOpenseaUserDataFor } from "./IndexingData/OpenseaWallets";

let last_updated = 0;

let leaderboard: LeaderboardEntry[] = [];

interface LeaderboardEntry {
    points: number,
    wallet: string,
    userData: UserAccount | undefined
}

export async function startLeaderboardListener() {
    
    app.get('/leaderboard', (req, res) => {

        let last = getLastLeaderboardUpdatedTime();
        
        res.json({leaderboard, last});
    })

    /*app.get('/leaderboard/:first/:skip', (req, res) => {

        let last = getLastLeaderboardUpdatedTime();

        let first = parseInt(req.params.first);
        let skip = parseInt(req.params.skip);

        let leaderboardData: LeaderboardEntry[] = [];


        for(let i = skip; i < leaderboard.length; i++) {
            leaderboardData.push(leaderboard[i]);

            if(leaderboardData.length == first) break;
        }
        
        res.json({leaderboardData, last});
    });*/

    app.get('/leaderboard/:type/:amount', (req, res) => {

        let sort = String(req.params.type);
        let amount = parseInt(req.params.amount);

        if(sort != "top" && sort != "bottom") {
            res.json({error: "Invalid sort type", options: "top, bottom"});
            return;
        }

        if(amount > 1000) amount = 1000;
        if(amount < 0) amount = 0;

        let last = getLastLeaderboardUpdatedTime();


        let leaderboardData: LeaderboardEntry[] = [];


        if(sort == "top") {

            for(let i = 0; i < leaderboard.length; i++) {
                leaderboardData.push(leaderboard[i]);

                if(leaderboardData.length == amount) break;
            }
            
        } else {

            for(let i = leaderboard.length - 1; i >= 0; i--) {
                leaderboardData.push(leaderboard[i]);

                if(leaderboardData.length == amount) break;
            }
        }
        
        res.json({leaderboardData, last});
    });

    app.get('/leaderboard/:day', async (req, res) => {
        let day = parseInt(req.params.day);

        if(day > getRektDay())
            day = getRektDay();

        if(day < 0) day = 0;
        if(day > 8) day = 8;

        await buildLeaderboard();

        let last = getLastLeaderboardUpdatedTime();
        
        res.json({leaderboard, last});
    })
}

export function getRankForWallet(wallet: string) {

    for(let i = 0; i < leaderboard.length; i++) {
        if(leaderboard[i].wallet.toLowerCase() == wallet.toLowerCase())
            return i;
    }

    return 10000;
}

export function startLeaderboardBuilder() {
    buildLeaderboard();

    /*setInterval(() => {
        buildLeaderboard();
    }, 1000 * 60 * 60) //Updates every hour*/
}

async function buildLeaderboard() {
    let users = await getAllUsersFinished();

    let day = getRektDay();

    let leaderboard_entries: LeaderboardEntry[] = [];

    for(const user of users) {
        let userData = reorganiseTasksForDay(user, day);

        let points = 0;

        for(const data of userData)
            points += data.points;

        let openseaData = getOpenseaUserDataFor(user.wallet);

        leaderboard_entries.push({ wallet: user.wallet, points: points, userData: openseaData});
    }

    leaderboard_entries.sort((a,b) => b.points - a.points);

    leaderboard = leaderboard_entries;

    last_updated = Date.now() / 1000;
}

export function addUserToLeaderboard(user: IUser) {
    let userData = reorganiseTasksForDay(user, getRektDay());

    let points = 0;

    for(const data of userData)
        points += data.points;

    let openseaData = getOpenseaUserDataFor(user.wallet);

    leaderboard.push({ wallet: user.wallet, points: points, userData: openseaData });

    leaderboard.sort((a,b) => b.points - a.points);

    last_updated = Date.now() / 1000;
}


//use pagination to avoid mongodb 16MB query cap.
export async function getAllUsersFinished() {
    const limit = 1500;
    let skip = 0;

    let users: IUser[] = [];

    while (true) {
        const documents = await User.find({rektFinished: true}).skip(skip).limit(limit);

        if(documents.length == 0)
            break;

        users = users.concat(documents);

        skip += limit;
    }

    return users;
}

export function getLastLeaderboardUpdatedTime() {
    let current = Date.now() / 1000;

    let difference = current - last_updated;

    if(difference < 60)
        return difference.toFixed(0) + " second" + (Number(difference.toFixed(0)) > 1 ? 's' : '') + " ago.";

    let minutes = Math.floor(difference / 60);

    return minutes + " minute" + (minutes > 1 ? 's' : '') + " ago.";
}