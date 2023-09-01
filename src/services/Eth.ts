import { Alchemy, Network } from 'alchemy-sdk';


const settings = {
    apiKey: "x2clG0iamQo50Ymz3JD1IuTkvf0MGRO1",
    network: Network.ETH_MAINNET,
};

export let alchemy = new Alchemy(settings);
