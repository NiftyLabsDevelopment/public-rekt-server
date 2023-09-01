import axios, { AxiosResponse } from "axios";
import { ethers } from "ethers";
import { UserAccount } from "../../Types";
import fs from 'fs';

export let opensea_user_data = new Map<string, UserAccount>();

let wallet_queue: string[] = [];
let queue_active: Boolean = false;

async function checkQueue() {
    if(queue_active)
        return;

    queue_active = true;

    while(wallet_queue.length > 0) {
        let wallet = wallet_queue.shift();

        if(!wallet) {
            queue_active = false;
            return;
        }

        await fetchOpenseaData(wallet);
    }

    queue_active = false;
}


export function backupOpenseaUserData() {

    let toSave: { wallet: string, user_data: UserAccount }[] = [];

    for(const [key, value] of opensea_user_data)
        toSave.push({wallet: key, user_data: value});

    fs.writeFileSync(`./backup/openseadata.json`, JSON.stringify(toSave, null, 4));
}

export async function restoreOpenseaUserData() {

    if(!fs.existsSync(`./backup/openseadata.json`))
        return;

    let data = fs.readFileSync(`./backup/openseadata.json`).toString();


    let parsed = JSON.parse(data) as {wallet: string, user_data: UserAccount}[];


    for(const data of parsed)
        opensea_user_data.set(data.wallet, data.user_data);

    
    console.log("Restored opensea user data", parsed);

    return;

}

export function getOpenseaUserDataFor(wallet: string) {
    let data = opensea_user_data.get(ethers.utils.getAddress(wallet));

    if(data == undefined) {
        wallet_queue.push(ethers.utils.getAddress(wallet));
        checkQueue();
        return undefined;
    }

    return data;
}

export async function fetchOpenseaData(wallet: string) {
    const options = {
        method: 'GET',
        url: 'https://api.opensea.io/user/' + ethers.utils.getAddress(wallet),
        headers: {
          accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY,
        }
      };

    let response: AxiosResponse<any, any>;

    try {
        response = await axios.request(options);
    } catch (e) {
        let userAcc: UserAccount = {
            username: "null",
            account: {
                user: { username: "null" },
                profile_img_url: "null",
                address: "null",
                config: "null",
                currencies: {}
            }
        }

        opensea_user_data.set(wallet, userAcc);
        return;
    }

      if(response.status != 200)
        return undefined;
  
      let userData = response.data as UserAccount;

      opensea_user_data.set(wallet, userData);

      return userData;
}