import { ethers } from "ethers";
import DelegateCashAbi from '../../data/DelegateCash.json';
import { DelegateCash } from "../../app/contracts/DelegateCash"
import User, { IUser } from "../schemas/User";
import { handleDelegateLogin } from "./UserHelper";
import { IUserQuestion } from "../schemas/UserQuestion";

const PROVIDER = new ethers.providers.AlchemyProvider(
    "mainnet",
    process.env.ALCHEMY_KEY
)

const DELEGATE_CONTRACT = new ethers.Contract("0x00000000000076A84feF008CDAbe6409d2FE638B", DelegateCashAbi, PROVIDER) as DelegateCash;

export async function getDelegatorData(user: IUser, answers: IUserQuestion) {
    let linkedWallets: string[] = [];

    let delegations = await DELEGATE_CONTRACT.getDelegationsByDelegate(user.wallet);

    for(const delegation of delegations) {
        linkedWallets.push(delegation.vault);
    }

    for(const wallet of linkedWallets) {
        await handleDelegateLogin(wallet, answers);
    }
}