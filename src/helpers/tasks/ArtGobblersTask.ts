import { NftSale } from "alchemy-sdk";
import { alchemy } from "../../services/Eth";


export async function getArtGobblersBoughtFor(buys: NftSale[]) {

    return buys.filter(x => x.contractAddress.toLowerCase() == "0x60bb1e2aa1c9acafb4d34f71585d7e959f387769").length;
}