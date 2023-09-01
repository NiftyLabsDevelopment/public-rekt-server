import axios from "axios";
import { ethers } from "ethers";
import { NftCollectionData } from "../../Types";
import { BOUGHT_TOP_CONTRACTS } from "../tasks/BoughtTopTasks";
import { GOBLIN_TOWN_ADDRESS } from "../tasks/GoblinTownTasks";
import { NFT_COLLECTIONS } from "../tasks/SillyMintsTask";
import fs from 'fs';
import { delay } from "../../utils/utils";
import OPENSEA_CONTRACT_JSON from '../../../data/OpenseaContractData.json';
import { GET_MINTS_FOR } from "../WalletHelper";

const OPENSEA_CONTRACT_DATA = OPENSEA_CONTRACT_JSON as NftCollectionData[];


export async function cacheOpenseaContractData() {
    let contracts: string[] = [];

    BOUGHT_TOP_CONTRACTS.map(x => contracts.push(x.contract));

    contracts.push(GOBLIN_TOWN_ADDRESS);

    NFT_COLLECTIONS.map(x => contracts.push(x));

    GET_MINTS_FOR.map(x => contracts.push(x));

    let nft_data: NftCollectionData[] = [];

    for(const contract of contracts) {
        let options = {
            method: 'GET',
            url: 'https://api.opensea.io/api/v1/asset_contract/' + ethers.utils.getAddress(contract),
            headers: {
              accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY,
            }
          };
          
        await delay(250);
          
        let response = await axios.request(options);

        console.log("Getting contract data for:", contract)
        
        if(!response.data.collection)
          continue;

        let data: NftCollectionData = {
            image_url: response.data.collection.image_url,
            name: response.data.collection.name,
            address: response.data.address
        }

        nft_data.push(data);
    }

    fs.writeFile('./data/OpenseaContractData.json', JSON.stringify(nft_data, null, 4), () => {console.log("Wrote file")});
}

export function getOpenseaContractDataFor(contract: string) {
    for(const data of OPENSEA_CONTRACT_DATA) {
        if(data.address.toLowerCase() == contract.toLowerCase())
            return data;
    }

    return null;
}
