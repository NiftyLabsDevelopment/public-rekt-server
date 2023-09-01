import axios from "axios";
import { BigNumber } from "ethers";
import Web3 from "web3";
import { EtherscanTransaction } from "../../Types";

export async function getGasData(wallet: string) {
    let allTransactions: EtherscanTransaction[] = [];

    let link = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=asc&apikey=T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7`

    let response = await axios.get(link);

    allTransactions = allTransactions.concat(response.data.result as EtherscanTransaction[]);

    while(response.data.result.length >= 10000) {
        let highestBlock = getHighestBlockFromTransactions(response.data.result as EtherscanTransaction[]);

        let nextLink = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=${highestBlock}&endblock=99999999&sort=asc&apikey=T9RV3FGW573WX9YX45F1Z89MEMEUNQXUC7`
    
        response = await axios.get(nextLink);

        allTransactions = allTransactions.concat(response.data.result as EtherscanTransaction[]);
    }

    allTransactions = allTransactions.filter(x => Number(x.blockNumber) <= 17070057);
    
    let gasSpent = parseTransactions(allTransactions);

    let roundedGas = Math.round(parseFloat(gasSpent));

    const BASE_POINTS = 1000;

    let points = roundedGas * 1000;
    
    return {gasSpent, points};
}

function getHighestBlockFromTransactions(transactions: EtherscanTransaction[]) {
    let highest = 0;

    for(const tx of transactions) {
        let block = Number(tx.blockNumber);

        if(block > highest) highest = block;
    }

    return highest;
}

function parseTransactions(transactions: EtherscanTransaction[]) {
    console.log("Transaction count:", transactions.length);

    let total = BigNumber.from(0);

    for(const tx of transactions) {
        let gasUsed = BigNumber.from(tx.gasUsed);
        let gasPrice = BigNumber.from(tx.gasPrice);

        let cost = gasPrice.mul(gasUsed);

        total = total.add(cost);
    }

    let formattedCost = Web3.utils.fromWei(total.toString(), 'ether');

    return formattedCost;
}

export async function getEthGasSpent(wallet: string) {

    let gasData = await getGasData(wallet);

    return gasData;

}