import { AssetTransfersCategory, AssetTransfersResponse, AssetTransfersResult, NftSale, OwnedNft, TransferredNft } from "alchemy-sdk";
import { alchemy } from "../services/Eth";
import axios from "axios";
import { app } from "../services/Server";
import { BigNumber, ethers } from "ethers";
import { delay } from "../utils/utils";
import { Response } from "express";
import Web3 from "web3";

export let GET_MINTS_FOR = [
    '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258',
    '0x32973908faee0bf825a343000fe412ebe56f802a',
    '0x2ee6af0dff3a1ce3f7e3414c52c48fd50d73691e',
    '0x5af0d9827e0c53e4799bb226655a1de152a425a5',
    '0x8ca5209d8cce34b0de91c2c4b4b14f20aff8ba23',
    '0x3f0785095a660fee131eebcd5aa243e529c21786',
    '0x4db1f25d3d98600140dfc18deb7515be5bd293af',
    '0x9a534628b4062e123ce7ee2222ec20b86e16ca8f'
]

export async function startWalletListener() {

    app.get('/opensea/:wallet', async (req, res) => {
        let wallet = ethers.utils.getAddress(req.params.wallet);

        let data = await getOpenseaData(wallet);

        res.json(data);
    })
}

export async function getUnrealizedProfit(buys: NftSale[], nfts: OwnedNft[]) {

    let totalUnrealisedLoss = 0;

    for(const nft of nfts) {
        let tokenId = nft.tokenId;
        let contract = nft.contract.address;

        let potenitalBuys = buys.filter(x => x.contractAddress == contract && x.tokenId == tokenId);

        potenitalBuys = potenitalBuys.sort((a, b) => b.blockNumber - a.blockNumber);

        if(potenitalBuys.length == 0)
            continue;

        if(!nft.contract.openSea)
            continue;

        let latestBuy = potenitalBuys[0];

        let floor = nft.contract.openSea.floorPrice;

        if(!floor)
            continue;

        let cost = getCostOfNftSale(latestBuy);

        let difference = floor - cost;


        totalUnrealisedLoss += difference;
        
    }

    const BASE_POINTS = 500;

    let roundedLoss = Math.round(totalUnrealisedLoss);

    let points = (BASE_POINTS * roundedLoss) * -1;

    return {totalUnrealisedLoss, points};
}

function getCostOfNftSale(sale: NftSale) {
    let cost = BigNumber.from(sale.sellerFee.amount);

    if(sale.protocolFee && sale.protocolFee.amount)
        cost = cost.add(BigNumber.from(sale.protocolFee.amount));

    if(sale.royaltyFee && sale.royaltyFee.amount)
        cost = cost.add(BigNumber.from(sale.royaltyFee.amount));

    let formatted = parseFloat(parseFloat(Web3.utils.fromWei(cost.toString(), 'ether')).toFixed(4));

    return formatted;
}

export async function getAllNftsForWallet(wallet: string) {
    let allNfts: OwnedNft[] = [];

    let nfts = await alchemy.nft.getNftsForOwner(wallet);

    allNfts = nfts.ownedNfts;

    while(nfts.pageKey != undefined) {
        console.log("Getting more nfts.. page: " + nfts.pageKey);

        nfts = await alchemy.nft.getNftsForOwner(wallet, {pageKey:nfts.pageKey});

        allNfts = allNfts.concat(nfts.ownedNfts);
    }

    return allNfts;
}

export async function getAllMintsForWallet(wallet: string, filter: boolean = true) {
    let allMints: AssetTransfersResult[] = [];

    try {

        let mints: AssetTransfersResponse;

        if(filter) {
            mints = await alchemy.core.getAssetTransfers({
                fromAddress: "0x0000000000000000000000000000000000000000",
                toAddress: wallet,
                contractAddresses: [],
                category: [AssetTransfersCategory.ERC721]
            });
        } else {
            mints = await alchemy.core.getAssetTransfers({
                fromAddress: "0x0000000000000000000000000000000000000000",
                toAddress: wallet,
                category: [AssetTransfersCategory.ERC721]
            });
        }


        allMints = mints.transfers;

        while(mints.pageKey) {
            console.log("Getting more mints.. page: " + mints.pageKey);

            if(filter) {
                mints = await alchemy.core.getAssetTransfers({
                    fromAddress: "0x0000000000000000000000000000000000000000",
                    toAddress: wallet,
                    contractAddresses: [],
                    category: [AssetTransfersCategory.ERC721],
                    pageKey: mints.pageKey
                });
            } else {
                mints = await alchemy.core.getAssetTransfers({
                    fromAddress: "0x0000000000000000000000000000000000000000",
                    toAddress: wallet,
                    category: [AssetTransfersCategory.ERC721],
                    pageKey: mints.pageKey
                });
            }

            allMints = allMints.concat(mints.transfers);
        }

        allMints = allMints.filter((mint) => {
            return parseInt(mint.blockNum) < 17070057;
        })

        return allMints;
    } catch(e) {
        
        if(filter) {
            console.log("Error getting mints for wallet: " + wallet);
            console.log("Trying again without filter..");
            let nonFiltered = await getAllMintsForWallet(wallet, false);

            allMints = nonFiltered;
        } else {
            console.log("Something bad happened getting mints for wallet: " + wallet + " without filter");
            throw new Error("Something bad happened getting mints for wallet: " + wallet + " without filter" + e)
        }

    }

    return allMints;
}

export async function getAllBuysForWallet(wallet: string) {

    let allBuys: NftSale[] = [];

    let buys = await alchemy.nft.getNftSales({
        buyerAddress: wallet
    });

    allBuys = buys.nftSales;

    while(buys.pageKey) {


        console.log("Getting more buys.. page: " + buys.pageKey);

        buys = await alchemy.nft.getNftSales({
            buyerAddress: wallet,
            pageKey: buys.pageKey
        });

        allBuys = allBuys.concat(buys.nftSales);
    }

    allBuys = allBuys.filter((sale) => {
        return sale.blockNumber < 17070057;
    })

    let filteredBuys: NftSale[] = [];

    for(const buy of allBuys) {
        if(buy.sellerFee && (buy.sellerFee.symbol == "ETH" || buy.sellerFee.symbol == "WETH")) {
            filteredBuys.push(buy);
        }
    }

    return filteredBuys;
}

export async function getAllSalesForWallet(wallet: string) {

    let allBuys: NftSale[] = [];

    let buys = await alchemy.nft.getNftSales({
        sellerAddress: wallet
    });

    allBuys = buys.nftSales;

    while(buys.pageKey != undefined) {


        console.log("Getting more sales.. page: " + buys.pageKey);
        buys = await alchemy.nft.getNftSales({
            sellerAddress: wallet,
            pageKey: buys.pageKey
        });

        allBuys = allBuys.concat(buys.nftSales);
    }

    allBuys = allBuys.filter((sale) => {
        return sale.blockNumber < 17070057;
    })
    
    let filteredBuys: NftSale[] = [];

    for(const buy of allBuys) {
        if(buy.sellerFee && (buy.sellerFee.symbol == "ETH" || buy.sellerFee.symbol == "WETH")) {
            filteredBuys.push(buy);
        }
    }

    return filteredBuys;
}

export async function getOpenseaData(wallet: string) {
    const options = {
        method: 'GET',
        url: 'https://api.opensea.io/user/' + wallet,
        headers: {
          accept: 'application/json', 'X-API-KEY': process.env.OPENSEA_API_KEY,
        }
      };
  
      let response = await axios.request(options);
  
      return response.data;
}