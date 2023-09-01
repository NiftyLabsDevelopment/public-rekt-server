import { NftSale } from "alchemy-sdk";
import { getAllBuysForWallet } from "../WalletHelper"

interface IDumpoor {
    address: string,
    amount: number
}

let dumpoors = [
    '0xbb60AAc81a89623aeb6D5C801938411b3b268BF2',
    '0xc5F59709974262c4AFacc5386287820bDBC7eB3A',
    '0xa32560268DffF7e62cd0cDa1dcc699406321aED6',
    '0x0AB6CFe285F078d69363cC3cCA881689de0fc915',
    '0x0AB6CFe285F078d69363cC3cCA881689de0fc915',
    '0x4907911cf8911510B89Bc7147a25700b2d260F36',
    '0x0B18cD32055D75B168Cb1e96C11154342066DB9A',
    '0x1010595F96Ab62b31BfeAc411Ec5f8f60DB5DC23',
    '0xC46Db2d89327D4C41Eb81c43ED5e3dfF111f9A8f',
    '0xD387A6E4e84a6C86bd90C158C6028A58CC8Ac459',
    '0x442DCCEe68425828C106A3662014B4F131e3BD9b',
    '0x8AD272Ac86c6C88683d9a60eb8ED57E6C304bB0C',
    '0x0b8F4C4E7626A91460dac057eB43e0de59d5b44F',
    '0x5a2880870f5bFCDD082a62D611E6aa5241dA70F9',
    '0xf0D6999725115E3EAd3D927Eb3329D63AFAEC09b',
    '0x9E29A34dFd3Cb99798E8D88515FEe01f2e4cD5a8',
    '0x7Bb4e62469Ed4AEB0fa39Bc46020D619945f8E84',
    '0xaf469C4a0914938e6149CF621c54FB4b1EC0c202',
    '0x591F8a2deCC1c86cce0c7Bea22Fa921c2c72fb95',
    '0xb39F3b058148144572c79EBe24b17ba405cE7D9d',
    '0xa041b07Dbdbc743afaEdDcd383da6600eBF168Fc',
    '0x9Bc27a47B4413c51f884AE4e4b9170F3A0D7f742',
    '0x025577fc6163751CE81801dacC945CD543f6376F',
    '0x3e25dac1092031116E2A7d59953dCEC2824A6C6A',
    '0xA442dDf27063320789B59A8fdcA5b849Cd2CDeAC',
    '0x8dBb75c576B71B43eea54398F8606aeC530181dc',
    '0x0F0eAE91990140C560D4156DB4f00c854Dc8F09E',
    '0xCe90a7949bb78892F159F428D0dC23a8E3584d75',
    '0x54BE3a794282C030b15E43aE2bB182E14c409C5e',
    '0xB6Aa5a1AA37a4195725cDF1576dc741d359b56bd',
    '0xc6b0562605D35eE710138402B878ffe6F2E23807',
    '0x19847a32B0eB348b006C79c1FB2d3aE1276c6028',
    '0xBA19BA5233b49794c33f01654e99A60E579E6f29',
    '0x588672a61Fb89f2dcD9a70001F06E8B692567755',
    '0x3f8cD3cc58391E704A2A0fab2482B8116Cb9D670',
    '0xfD22004806A6846EA67ad883356be810F0428793',
    '0xed2ab4948bA6A909a7751DEc4F34f303eB8c7236',
    '0xB7fc0c0E31a416B3C26F9A7c0C3046C4b40169F2'
]


export async function getTimesDumpedOnByInfluencers(wallet: string, buys: NftSale[]) {
    let allDumpedOn: IDumpoor[] = [];

    let total = 0;

    for(const dumpoor of dumpoors) {
        let dumpedOn = buys.filter(x => x.sellerAddress.toLowerCase() == dumpoor.toLowerCase()).length;

        if(dumpedOn == 0)
            continue;

        let dump: IDumpoor = {
            address: dumpoor,
            amount: dumpedOn
        }

        total += dump.amount;

        allDumpedOn.push(dump);
    }

    const BASE_POINTS = 2500;

    let points = BASE_POINTS * total;

    return {allDumpedOn, points};
}
