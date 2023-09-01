import { AssetTransfersResult, NftSale } from "alchemy-sdk";
import { BigNumber } from "ethers";
import Web3 from "web3";
import { alchemy } from "../../services/Eth";
import { getAllBuysForWallet, getAllSalesForWallet } from "../WalletHelper";


export async function getNftProfitsFor(wallet: string, buys: NftSale[], sales: NftSale[], mints: AssetTransfersResult[]) {

    /*for(let i = 0; i < buys.length; i++) {
        let thisT = buys[i];

        let totalEth = BigNumber.from(0);

        if(thisT.protocolFee && thisT.protocolFee.amount) {
            let protocolFee = BigNumber.from(thisT.protocolFee.amount);

            totalEth = totalEth.add(protocolFee);
        }

        if(thisT.sellerFee && thisT.sellerFee.amount) {
            let sellerFee = BigNumber.from(thisT.sellerFee.amount);

            totalEth = totalEth.add(sellerFee);
        }

        if(thisT.royaltyFee && thisT.royaltyFee.amount) {
            let royaltyFee = BigNumber.from(thisT.royaltyFee.amount);

            totalEth = totalEth.add(royaltyFee);
        }

        ethSpent = ethSpent.add(totalEth);
    }*/

    let ethChange = BigNumber.from(0);

    for(let i = 0; i < sales.length; i++) {
        let thisT = sales[i];
    
        let didMint = false;

        let buy = buys.find(b => b.tokenId == thisT.tokenId && b.contractAddress == thisT.contractAddress);
        let mint: AssetTransfersResult | undefined;

        if(!buy) {
            mint = mints.find(m => Number(m.tokenId) == Number(thisT.tokenId) && String(m.rawContract.address).toLowerCase() == String(thisT.contractAddress).toLowerCase());

            if(!mint)
                continue;

            didMint = true;
        }


        let totalEth = BigNumber.from(0);

        if(buy) {

            if(buy.protocolFee && buy.protocolFee.amount) {
                let protocolFee = BigNumber.from(buy.protocolFee.amount);
    
                totalEth = totalEth.add(protocolFee);
            }
    
            if(buy.sellerFee && buy.sellerFee.amount) {
                let sellerFee = BigNumber.from(buy.sellerFee.amount);
    
                totalEth = totalEth.add(sellerFee);
            }
    
            if(buy.royaltyFee && buy.royaltyFee.amount) {
                let royaltyFee = BigNumber.from(buy.royaltyFee.amount);
    
                totalEth = totalEth.add(royaltyFee);
            }

        }

        if(mint) {

            if(mint.value) {
                let mintFee = BigNumber.from(mint.value);

                totalEth = totalEth.add(mintFee);
            }

        }

        

        ethChange = ethChange.add(BigNumber.from(thisT.sellerFee.amount)).sub(totalEth);
    }

    let difference = parseFloat(parseFloat(Web3.utils.fromWei(ethChange.toString(), 'ether')).toFixed(4));

    const BASE_POINTS = 1000; 

    let roundedUp = Math.round(difference);

    let points = (BASE_POINTS * roundedUp) * -1;

    console.log("NFT Profit Task: ", difference, points)

    return {difference, points};

    
}