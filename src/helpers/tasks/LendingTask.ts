import { AssetTransfersCategory, AssetTransfersResult } from "alchemy-sdk"
import { alchemy } from "../../services/Eth"
import fs from  'fs'
import LENDING_TRANSFERS_JSON from '../../../data/LendingTransfers.json'

const LENDING_TRANSFERS = LENDING_TRANSFERS_JSON as AssetTransfersResult[]

export async function getTimesUsedLendingProtocols(wallet: string) {

    let transfers = LENDING_TRANSFERS.filter(x => x.from.toLowerCase() == wallet.toLowerCase());

    const BASE_POINTS = 5000;

    let transferCount = transfers.length;

    let points = BASE_POINTS * transferCount;

    return {transferCount, points};
}