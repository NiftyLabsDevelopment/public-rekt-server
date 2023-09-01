import { BigNumber } from "ethers";
import { alchemy } from "../../services/Eth";

interface IRektTokens {
    amount: number,
    contracts: string[]
}

export async function getRektTokensCount(wallet: string) {
    let balances = await alchemy.core.getTokenBalances(wallet, ["0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9", "0xd2877702675e6cEb975b4A1dFf9fb7BAF4C91ea9", "0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d", "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD", "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", "0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b", "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b", "0x64d91f12ece7362f91a6f8e7940cd55f05060b92","0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3","0x42d6622dece394b54999fbd73d108123806f6a18","0xd26114cd6ee289accf82350c8d8487fedb8a0c07","0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f","0x389999216860ab8e0175387a0c90e5c52522c945","0x1599fe55cda767b1f631ee7d414b41f5d6de393d","0xCC8Fa225D80b9c7D42F96e9570156c65D6cAAa25","0x4d224452801aced8b2f0aebe155379bb5d594381","0x235737dbb56e8517391473f7c964db31fa6ef280","0xcf0c122c6b73ff809c693db761e7baebe62b6a2e","0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"]);

    let tokenBalances = balances.tokenBalances;

    let inWallet = 0;

    let contracts: string[] = [];

    for(const token of tokenBalances) {
        if(token.tokenBalance && "0x0000000000000000000000000000000000000000000000000000000000000000".length == token.tokenBalance.length) {
            let bal = BigNumber.from(token.tokenBalance);

            if(bal.gt(0)) {
                inWallet++;
                contracts.push(token.contractAddress);
            }
        }
    }

    let toReturn: IRektTokens = {
        amount: inWallet,
        contracts: contracts
    }

    const BASE_POINTS = 5000;

    let points = BASE_POINTS * inWallet;

    return {toReturn, points};
}
