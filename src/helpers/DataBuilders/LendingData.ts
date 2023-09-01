import { AssetTransfersCategory, AssetTransfersResult } from 'alchemy-sdk';
import fs from 'fs';
import { alchemy } from '../../services/Eth';

const LENDING_CONTRACTS = [
    '0x0d02755a5700414b26ff040e1de35d337df56218',
    '0xc28f7ee92cd6619e8eec6a70923079fbafb86196',
    '0xFa4D5258804D7723eb6A934c11b1bd423bC31623',
    '0xd636a2fc1c18a54db4442c3249d5e620cf8fe98f',
    '0x810fdbc7e5cfe998127a1f2aa26f34e64e0364f4',
    '0x4e5f305bfca77b17f804635a9ba669e187d51719',
    '0x2be665ee27096344b8f015b1952d3dfdb4db4691',
    '0xdf7806eaa13497efffdb1541d6b0fdd1a9566fd0',
    '0x6837a113aa7393ffbd5f7464e7313593cd2dd560',
    '0x1de562b03184521f9a699e9290a6d578cd32008d',
    '0x7bc8c4d106f084304d6c224f48ac02e6854c7ac5',
    '0x3d4d8cbd9c1087e9463143cb9762c41f18ac0f03',
    '0x9921da2908cc59b13ddbcf45e64bfa91c78c4249',
    '0x271c7603aaf2bd8f68e8ca60f4a4f22c4920259f',
    '0xaf5e4c1bfac63e355cf093eea3d4aba138ea4089',
    '0x5b9caa47a52e4bfbbce2f2a9f858c2a501b48c42',
    '0x7b179f9bfbe50cfa401c1cdde3cb2c339c6635f3',
    '0xc45775baa4a6040414f3e199767033257a2a91b9',
    '0xded112453bd8ea88cdab214cfd92ab06e232e9d7',
    '0x0a36f4bf39ed7d4718bd1b8dd759c19986ccd1a7',
    '0x229e09d943a94c162a662ba0ffbcad21521b477a',
    '0xdd245b7823ee82d14419ce072ef815868f0d1f1a',
    '0x2acd96c8db23978a3dd32448a2477b132b4436e4',
    '0x72695c2af4193029e0669f2c01d84b619d8c25e7',
    '0xcaa0aa80637262fd3ba6dd5b5598a2bafac27ce8',
    '0xe793eaedc048b7441ed61b51acb5df107af996c2',
    '0x4b94b38bec611a2c93188949f017806c22097e9f',
    '0xd0bf9a40febdfca596fde589a343c6cda37a7b90',
    '0xc001f165f7d7542d22a1e82b4640512034a91c7d',
    '0x46db8fda0be00e8912bc28357d1e28e39bb404e2',
    '0xb36b65400e13ff57dfda29bbb7dc79eaa7eca14c',
    '0xf42366f60ccc0f454b505fd72fb070e7f23b8171',
    '0xcfd74e932b49eef26f6527091821ada8a9a4cbda',
    '0xa74abb04486f6926802cf6c3719c41b9ea10e49b',
    '0x8252Df1d8b29057d1Afe3062bf5a64D503152BC8',


]

export async function getAllTransfersToLendingProtocols() {
    let allTransfers: AssetTransfersResult[] = [];

    for(const contract of LENDING_CONTRACTS) {
        let transfers = await getTransfersTo(contract);

        allTransfers = allTransfers.concat(transfers);
    }

    fs.writeFile('./data/LendingTransfers.json', JSON.stringify(allTransfers, null, 4), function() {
        console.log("Wrote data");
    })
}

async function getTransfersTo(address: string) {
    let allTransfers: AssetTransfersResult[] = [];
    

    let transfers = await alchemy.core.getAssetTransfers({
        toAddress: address,
        category: [AssetTransfersCategory.ERC721]
    });

    allTransfers = transfers.transfers;

    while(transfers.pageKey) {
        console.log("Getting more transfers.. page: " + transfers.pageKey);


        transfers = await alchemy.core.getAssetTransfers({
            toAddress: address,
            category: [AssetTransfersCategory.ERC721],
            pageKey: transfers.pageKey
        });

        allTransfers = allTransfers.concat(transfers.transfers);
    }

    return allTransfers;
}