import { SignatureLike } from '@ethersproject/bytes';
import { ethers } from 'ethers';

export async function verifyLogin(sig: SignatureLike, wallet: string, entropy: number, expires: number) {

    let timeNow = Math.floor(Date.now() / 1000);

    if(timeNow >= expires)
        return false;

    const hash = "BIG INC\n" + "Action: Login\nEntropy: " + entropy + "\nExpires: " + expires;

    const msgHash = ethers.utils.hashMessage(hash);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, sig);

    return isSameAddress(recoveredAddress, wallet);
}

export function isSameAddress(address1: string, address2: string): Boolean {
    return address1.toLowerCase() == address2.toLowerCase();
}

export function getChecksumWallet(wallet: string): string {
    return ethers.utils.getAddress(wallet);
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}