import { AssetTransfersResult, OwnedNft, TransferredNft } from "alchemy-sdk";
import { NftCollectionData } from "../../Types";
import { getOpenseaContractDataFor } from "../IndexingData/OpenseaContracts";

export const NFT_COLLECTIONS = [
    '0x32973908FaeE0Bf825A343000fE412ebE56F802A',
    '0x2EE6AF0dFf3A1CE3F7E3414C52c48fd50d73691e',
    '0x5Af0D9827E0c53E4799BB226655A1de152A425a5',
    '0x8Ca5209d8CCe34b0de91C2C4b4B14F20AFf8BA23',
    '0x3F0785095A660fEe131eEbcD5aa243e529C21786',
    '0x4Db1f25D3d98600140dfc18dEb7515Be5Bd293Af',
    '0x9A534628B4062E123cE7Ee2222ec20B86e16Ca8F',
    '0xf78296dFcF01a2612C2C847F68ad925801eeED80',
    '0x5078981549A1CC18673eb76fb47468f546aAdc51',
    '0x74A69DF3aDc7235392374f728601E49807DE4B30',
    '0x3B3Bc9b1dD9F3C8716Fff083947b8769e2ff9781',
    '0x9C008A22D71B6182029b694B0311486e4C0e53DB',
    '0xafbA8C6B3875868a90E5055e791213258a9fe7a7',
    '0xeC9C519D49856Fd2f8133A0741B4dbE002cE211b',
    '0x3a8778A58993bA4B941f85684D74750043A4bB5f',
    '0x56c707414bC4C9d3fd71a19d3C266295Cf7f7312',
    '0x85f740958906b317de6ed79663012859067E745B',
    '0x36d30B3b85255473D27dd0F7fD8F35e36a9d6F06',
    '0x716039AB9Ce2780e35450B86Dc6420f22460C380',
    '0x4F8730E0b32B04beaa5757e5aea3aeF970E5B613',
    '0x5F9E300108Fb156cFbE21C48A870876E97745af9',
    '0xeC516eFECd8276Efc608EcD958a4eAB8618c61e8',
    '0x1cBB182322Aee8ce9F4F1f98d7460173ee30Af1F',
    '0x8634666bA15AdA4bbC83B9DbF285F73D9e46e4C2',
    '0x74EcB5F64363bd663abd3eF08dF75dD22d853BFC',
    '0x9E02FFd6643f51aaAFa0f0E2a911Bf25EF2684Cb',
    '0x3C99F2A4b366D46bcf2277639A135A6D1288EcEB',
    '0x4581649aF66BCCAeE81eebaE3DDc0511FE4C5312',
    '0xf3E6DbBE461C6fa492CeA7Cb1f5C5eA660EB1B47',
    '0x31F3bba9b71cB1D5e96cD62F0bA3958C034b55E9',
    '0x9336888C4fC4ADae3C7CEd55be2B54884c052D59',
    '0x4961DB588Dd962abB20927Aa38fA33E5225B3be2',
    '0xe21EBCD28d37A67757B9Bc7b290f4C4928A430b1',
    '0x3776e86B9a14c4D020eB3aC6888FD21864C500A9',
    '0x15c2B137E59620552BD0D712Fe7279cF1f47468d',
    '0x5EaeADdA470245343249452E744e423F489AbBc4',
    '0x9761f45FeFEB521f48DDF40Daf6c3b3B3a498C5b',
    '0x82258c0F6ad961CE259eA3A134d32484125E4E40',
    '0x8584e7A1817C795f74Ce985a1d13b962758FE3CA',
    '0xf32e1bdE889eCf672FFAe863721C8f7d280F853b',
    '0x6d05064fe99e40F1C3464E7310A23FFADed56E20',
    '0x4a8B01E437C65FA8612e8b699266c0e0a98FF65c',
    '0x6F0365ca2c1Dd63473F898A60f878A07e0f68A26',
    '0xA74E199990FF572A320508547Ab7f44EA51e6F28',
    '0x80a4B80C653112B789517eb28aC111519b608b19',
    '0x86f6Bf16F495AFc065DA4095Ac12ccD5e83a8c85',
    '0xD4d871419714B778eBec2E22C7c53572b573706e',
    '0x343f999eAACdFa1f201fb8e43ebb35c99D9aE0c1',
    '0x71B11Ac923C967CD5998F23F6dae0d779A6ac8Af',
    '0x312d09D1160316A0946503391B3D1bcBC583181b',
    '0xE5af63234f93aFD72a8b9114803E33F6d9766956'
  ]


interface IContractData {
    contract: string,
    amount: number,
    openseaData: NftCollectionData | null
}

export async function stillHoldingEmbarrassingMints(nfts: OwnedNft[]) {

    let stillHolding: IContractData[] = [];

    let total = 0;

    for(const collection of NFT_COLLECTIONS) {
        let nftData = nfts.filter(x => x.contract.address && (x.contract.address.toLowerCase() == collection.toLowerCase()));
        
        if(nftData.length == 0)
            continue;

        let openseaData = getOpenseaContractDataFor(collection);

        let holding: IContractData = {
            contract: collection,
            amount: nftData.length,
            openseaData: openseaData
        }

        total += holding.amount;

        stillHolding.push(holding);

    }    
    
    const BASE_POINTS = 5000;

    let points = BASE_POINTS * total;

    return {stillHolding, points};
}

export async function getEmbarrassingNftsMintedFor(minted: AssetTransfersResult[]) {

    let mintData: IContractData[] = [];

    let total = 0;

    for(const collection of NFT_COLLECTIONS) {
        let mints = minted.filter(x => x.rawContract.address && (x.rawContract.address.toLowerCase() == collection.toLowerCase()));

        if(mints.length == 0)
            continue;

        let openseaData = getOpenseaContractDataFor(collection);

        let data: IContractData = {
            contract: collection,
            amount: mints.length,
            openseaData: openseaData
        }

        total += data.amount;

        mintData.push(data);

    }

    const BASE_POINTS = 5000;

    let points = BASE_POINTS * total;

    return {mintData, points};
}
