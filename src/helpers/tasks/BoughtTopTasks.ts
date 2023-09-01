import { NftSale } from "alchemy-sdk";
import { BigNumber } from "ethers";
import Web3 from "web3";
import { alchemy } from "../../services/Eth";
import { NftCollectionData } from "../../Types";
import { getOpenseaContractDataFor } from "../IndexingData/OpenseaContracts";
import { getAllBuysForWallet } from "../WalletHelper";

interface IBoughtTop {
    contract: string,
    top: number,
    name: string
}

export const BOUGHT_TOP_CONTRACTS: IBoughtTop[] = [
    {name: "Azuki", contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544", top: 22},
    {name: "Clonex", contract: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B", top: 5},
    {name: "CoolCats", contract: "0x1A92f7381B9F03921564a437210bB9396471050C", top: 2},
    {name: "GutterCats", contract: "0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452", top: 1.5},
    {name: "Moonbirds", contract: "0x23581767a106ae21c074b2276D25e5C3e136a68b", top: 5},
    {name: "Doodles", contract: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e", top: 5},
    {name: "WorldOfWomen", contract: "0xe785E82358879F061BC3dcAC6f0444462D4b5330", top: 2},
    {name: "Loot", contract: "0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7", top: 0.75},
    {name: "VeeFriends", contract: "0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB", top: 5},
    {name: "PunksComicIssueOne", contract: "0x5ab21Ec0bfa0B29545230395e3Adaca7d552C948", top: 1},
    {name: "ArtGobblers", contract: "0x60bb1e2aa1c9acafb4d34f71585d7e959f387769", top: 0.5},
    {name: "BAYC", contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", top: 80},
    {name: "MutantApes", contract: "0x60e4d786628fea6478f785a6d7e704777c86a7c6", top: 17},
    {name: "NFTWorlds", contract: "0xbd4455da5929d5639ee098abfaa3241e9ae111af", top: 4},
    {name: "Cryptoadz ", contract: "0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6", top: 1.5},
    {name: "BAKC", contract: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623", top: 6.5},
    {name: "Mfers ", contract: "0x79fcdef22feed20eddacbb2587640e45491b757f", top: 1.5},
    {name: "Otherdeed  ", contract: "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258", top: 2},
    {name: "InvisibleFriends ", contract: "0x59468516a8259058bad1ca5f8f4bff190d30e066", top: 2.5},
    {name: "MurakamiFlowers", contract: "0x7d8820fa92eb1584636f4f5b8515b5476b75171a", top: 1.2},
    {name: "Proof Pass", contract: "0x08d7c0242953446436f34b4c78fe9da38c73668d", top: 15},
    {name: "Creature World", contract: "0xc92ceddfb8dd984a89fb494c376f9a48b999aafc", top: 0.2},
    {name: "Creepz", contract: "0xfe8c6d19365453d26af321d0e8c910428c23873f", top: 2},
    {name: "Lazy Lions", contract: "0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0", top: 0.5},
    {name: "Metaheros/Inhabitants", contract: "0x6dc6001535e15b9def7b0f6a20a2111dfa9454e2", top: 0.8},
    {name: "Cyberkongz", contract: "0x57a204aa1042f6e66dd7730813f4024114d74f37", top: 20},
    {name: "SuperNormal", contract: "0xd532b88607b1877fe20c181cba2550e3bbd6b31c", top: 0.4},
    {name: "Coolmans Universe", contract: "0xa5c0bd78d1667c13bfb403e2a3336871396713c5", top: 0.1},
    {name: "SupDucks", contract: "0x3fe1a4c1481c8351e91b64d5c398b159de07cbc5", top: 0.12},
    {name: "Damien Hirst - The Currency", contract: "0xaadc2d4261199ce24a4b0a57370c4fcf43bb60aa", top: 4},
    {name: "Goblintown", contract: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e", top: 0.5},
    {name: "IlluminatiNFT", contract: "0x26badf693f2b103b021c670c852262b379bbbe8a", top: 0.3},
    {name: "Nakamigos", contract: "0xd774557b647330c91bf44cfeab205095f7e6c367", top: 0.6},
    {name: "Pudgy Penguins", contract: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8", top: 5},
    {name: "Renga", contract: "0x394e3d3044fc89fcdd966d3cb35ac0b32b0cda91", top: 1.2},
    {name: "Sappy Seals", contract: "0x364c828ee171616a39897688a831c2499ad972ec", top: 0.8},
    {name: "Rektguy", contract: "0xb852c6b5892256c264cc2c888ea462189154d8d7", top: 1}
];

export interface ITopBuys {
    name: string,
    amount: number,
    openseaData: NftCollectionData | null
}

function getAddressFromName(name: string) {
    for(const data of BOUGHT_TOP_CONTRACTS)
        if(data.name == name) 
            return data.contract;
    
    return "";
}

export async function checkIfBoughtTop(wallet: string, buys: NftSale[]) {

    let boughtTopMap = new Map<string, number>();

    let totalCount = 0;

    for(const nftData of BOUGHT_TOP_CONTRACTS)
        didBuyTopOf(nftData, buys, boughtTopMap);

    let topBuys: ITopBuys[] = [];

    for(const key of boughtTopMap.keys()) {
        let amt = boughtTopMap.get(key);

        let contract = getAddressFromName(key);
        let openseaData = getOpenseaContractDataFor(contract);

        let buy: ITopBuys = {
            name: key,
            amount: amt ? amt : 0,
            openseaData: openseaData
        }

        totalCount += buy.amount;
        
        topBuys.push(buy);
    }

    const BASE_POINTS = 2500;

    let points = BASE_POINTS * totalCount;

    return {topBuys, points};
}

function didBuyTopOf(nft: IBoughtTop, buys: NftSale[], boughtTopMap: Map<string, number>) {
    let searched = buys.filter(x => x.contractAddress.toLowerCase() == nft.contract.toLowerCase());

    for(const buy of searched) {
        let cost = BigNumber.from(0);
        let price = BigNumber.from(buy.sellerFee.amount);

        if(buy.royaltyFee && buy.royaltyFee.amount)
            cost = cost.add(BigNumber.from(buy.royaltyFee.amount));

        if(buy.protocolFee && buy.protocolFee.amount)
            cost = cost.add(BigNumber.from(buy.protocolFee.amount));

        cost = cost.add(price);

        let formatted = parseFloat(parseFloat(Web3.utils.fromWei(cost.toString(), 'ether')).toFixed(4));

        if(formatted >= nft.top) {
            let amount = boughtTopMap.get(nft.name)

            if(!amount) amount = 0;

            amount++;

            boughtTopMap.set(nft.name, amount);
        }
    }

}
