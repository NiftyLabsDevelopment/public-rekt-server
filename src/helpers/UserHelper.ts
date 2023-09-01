import { SignatureLike } from "@ethersproject/bytes";
import { Response } from "express";
import { app } from "../services/Server";
import { getChecksumWallet, verifyLogin } from "../utils/utils";
import { ethers } from 'ethers';
import User from "../schemas/User";
import { addEventToQueue, getStateForWallet, QueueState } from "./TaskHelper";
import UserQuestion, { IUserQuestion } from "../schemas/UserQuestion";

export async function startUserListener() {

    app.post('/login', async (req, res) => {
        let sig = req.body.sig;
        let wallet = req.body.wallet;
        let entropy = req.body.entropy;
        let expires = req.body.expires;

        console.log(req.body)


        handleLogin(sig, wallet, entropy, expires, res);
    })

}

export async function getUserByToken(token: string) {
    let user = await User.findOne({token: token});

    return user;
}

export async function handlePreloadLogin(wallet: string) {
    let w = getChecksumWallet(wallet);

    let token = generateUserToken(wallet);

    let user = await User.findOne({wallet: wallet});

    if(!user) {

        user = new User({
            wallet: wallet,
            token: token,
            rektFinished: false
        });

        await user.save();
    }

    if(!user.rektFinished)
        addEventToQueue(user.wallet);
    

}


export async function handleDelegateLogin(wallet: string, answers: IUserQuestion) {
    let w = getChecksumWallet(wallet);

    let token = generateUserToken(wallet);

    let user = await User.findOne({wallet: wallet});

    if(!user) {

        user = new User({
            wallet: wallet,
            token: token,
            rektFinished: false
        });

        await user.save();
    }

    let answer = await UserQuestion.findOne({user: user._id});

    if(!answer) {
        answer = new UserQuestion({
            user: user._id,
            answers: answers
        });

        await answer.save();
    }

    if(!user.rektFinished)
        addEventToQueue(user.wallet);
    

}

async function handleLogin(sig: SignatureLike, wallet: string, entropy: number, expires: number, res: Response) {
    let isSignatureValid = await verifyLogin(sig, wallet, entropy, expires);

    if(!isSignatureValid) {
        res.json({
            success: false,
            message: "Invalid signature"
        });

        return;
    }

    wallet = getChecksumWallet(wallet);
    let token = generateUserToken(wallet);

    let user = await User.findOne({wallet: wallet});

    if(!user) {

        user = new User({
            wallet: wallet,
            token: token,
            rektFinished: false
        });

    }

    user.token = token;

    await user.save();

    res.json({
        success: true,
        token: user.token
    });
}

export function generateUserToken(wallet: string): string {
    let rand = Math.floor(Math.random() * 5000000);

    let token = ethers.utils.solidityKeccak256(["address", "uint256", "string"], [wallet, rand, "you are rekt"]);

    return token;
}