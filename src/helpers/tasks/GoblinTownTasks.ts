import { NftSale } from "alchemy-sdk";
import { BigNumber } from "ethers";
import Web3 from "web3";
import { NftCollectionData } from "../../Types";
import { getOpenseaContractDataFor } from "../IndexingData/OpenseaContracts";
import { getAllBuysForWallet, getAllSalesForWallet } from "../WalletHelper";

export const GOBLIN_TOWN_ADDRESS = "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e";

interface IGoblinData {
    top: number,
    bottom: number,
    convinced: number,
    openseaData: NftCollectionData | null
}

export async function getGoblinTownData(wallet: string, buys: NftSale[], sells: NftSale[]) {

    let points = 0;

    let openseaData = getOpenseaContractDataFor(GOBLIN_TOWN_ADDRESS);

    let goblinData: IGoblinData = {
        top: 0,
        bottom: 0,
        convinced: 0,
        openseaData: openseaData
    }

    let goblinBuys = buys.filter(x => x.contractAddress.toLowerCase() == GOBLIN_TOWN_ADDRESS.toLowerCase());
    let goblinSells = sells.filter(x => x.contractAddress.toLowerCase() == GOBLIN_TOWN_ADDRESS.toLowerCase());

    for(const buy of goblinBuys) {
        let cost = BigNumber.from(buy.sellerFee.amount);

        if(buy.protocolFee && buy.protocolFee.amount)
            cost = cost.add(BigNumber.from(buy.protocolFee.amount))

        if(buy.royaltyFee && buy.royaltyFee.amount)
            cost = cost.add(BigNumber.from(buy.royaltyFee.amount));

        let total = parseFloat(parseFloat(Web3.utils.fromWei(cost.toString(), 'ether')).toFixed(4));

        if(total >= 3) {
            goblinData.top++
            points += 25000;
        }

        if(buy.blockNumber <= 14963052) {
            goblinData.convinced++;
            points += 50000;
        }
    }

    for(const sale of goblinSells) {
        let cost = BigNumber.from(sale.sellerFee.amount);

        if(sale.protocolFee && sale.protocolFee.amount)
            cost = cost.add(BigNumber.from(sale.protocolFee.amount))

        if(sale.royaltyFee && sale.royaltyFee.amount)
            cost = cost.add(BigNumber.from(sale.royaltyFee.amount));

        let total = parseFloat(parseFloat(Web3.utils.fromWei(cost.toString(), 'ether')).toFixed(4));

        if(total <= .05) {
            goblinData.bottom++
            points += 25000;
        }
    }

    return {goblinData, points};
}