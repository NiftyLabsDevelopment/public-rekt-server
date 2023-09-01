import { OwnedNft } from "alchemy-sdk";
import axios from "axios";
import { alchemy } from "../../services/Eth";
import { Asset } from "../../Types";

export async function getCompromisedNFTCountFor(wallet: string) {

    let nftsOwned = await getNftsFor(wallet);

    let compromisedCount = nftsOwned.filter(x => !x.supports_wyvern).length;

    return compromisedCount;
}

async function getNftsFor(wallet: string) {

    let nfts: Asset[] = [];
    
    let options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/assets',
        params: {
          owner: wallet,
          limit: '200',
        },
        headers: {accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY}
    };
      
    let res = await axios.request(options);

    nfts = res.data.assets as Asset[]

    while(res.data.next) {

        let options2 = {
            method: 'GET',
            url: 'https://api.opensea.io/api/v1/assets',
            params: {
              owner: wallet,
              limit: '200',
              cursor: res.data.next
            },
            headers: {accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY}
        };
          
        res = await axios.request(options2);

        let nfts2: Asset[] = res.data.assets as Asset[];

        nfts = nfts.concat(nfts2);
    }

    return nfts;
}
