import { ethers } from 'ethers';
import BigInc from '../../../data/BigIncABI.json';
import { BigIncABI } from '../../../types/ethers-contracts';

const BIG_INC_ADDRESS = "0x895688bf87D73cc7dA27852221799D31B027e300";

const alchemy_provider = new ethers.providers.AlchemyProvider("mainnet", "x2clG0iamQo50Ymz3JD1IuTkvf0MGRO1")

export const BIG_INC_CONTRACT = new ethers.Contract(
  BIG_INC_ADDRESS,
  BigInc,
  alchemy_provider
) as BigIncABI;


export async function getTokenData(id: number) {

  let data = await BIG_INC_CONTRACT.tokenData(id);

  return { exists: data[0], tokenType: data[1], upgrade: data[2] }
}