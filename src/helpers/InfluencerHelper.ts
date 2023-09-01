import User from "../schemas/User";
import { handleDelegateLogin, handlePreloadLogin } from "./UserHelper";

let influencers = ["0x020cA66C30beC2c4Fe3861a94E4DB4A498A35872","0xc5F59709974262c4AFacc5386287820bDBC7eB3A","0xbb60AAc81a89623aeb6D5C801938411b3b268BF2","0x0AB6CFe285F078d69363cC3cCA881689de0fc915","0x5ea9681C3Ab9B5739810F8b91aE65EC47de62119","0xC46Db2d89327D4C41Eb81c43ED5e3dfF111f9A8f","0xD387A6E4e84a6C86bd90C158C6028A58CC8Ac459","0x442DCCEe68425828C106A3662014B4F131e3BD9b","0xca7cF06fc4053f1b74c332750e4E360f6C1F5f4E","0x5a2880870f5bFCDD082a62D611E6aa5241dA70F9","0xA442dDf27063320789B59A8fdcA5b849Cd2CDeAC","0xc6b0562605D35eE710138402B878ffe6F2E23807","0xBA19BA5233b49794c33f01654e99A60E579E6f29","0xed2ab4948bA6A909a7751DEc4F34f303eB8c7236","0xe4bbcbff51e61d0d95fcc5016609ac8354b177c4","0xff0bd4aa3496739d5667adc10e2b843dfab5712b","0xb6aa5a1aa37a4195725cdf1576dc741d359b56bd","0x0Ed1E02164A2A9FaD7A9F9b5B9e71694c3faD7F2","0xa0eaf6b0df87132c9a28e450a43c1d906defb60b","0xa679c6154b8d4619af9f83f0bf9a13a680e01ecf","0xE21DC18513e3e68a52F9fcDaCfD56948d43a11c6","0xc4505db8cc490767fa6f4b6f0f2bdd668b357a5d","0x7F90F772d4DAfb54601dfA4D6022F2542a409C98","0xbea020c3bd417f30de4d6bd05b0ed310ac586cc0","0xee81a1bc1034b0906b132c98bed477b896b731da","0xc1064e3662b0718357e9050694a3bfeaabede8ab","0x3becf83939f34311b6bee143197872d877501b11","0x58473e9ac681c4424ca74619281ff71801d002d6","0x0394451c1238cec1e825229e692aa9e428c107d8","0xc86B12d850FdBBF3260a7BAAE862F85857aAdBBa","0x31185f782a7c11044566d70dfcf1c8175486f451","0xbbdac7ba85af15420afd1f4aa3313c3535b15cde","0x0864224f3cc570ab909ebf619f7583ef4a50b826","0x33560bB4E2c132346980890A04193616359A04Dc","0x3b417faee9d2ff636701100891dc2755b5321cc3","0x1616b4C7cdb4093BeFBCca62F3198993327a8e9e","0x8ea95Bdc5cDddC0b7EbAd841F0c1f2cA6168b6a9","0x7d4823262bd2c6e4fa78872f2587dda2a65828ed","0x46316e182d560d6b8454946168e69484e2186e14","0x3a8db289e94465181e54353571fa7880857c0d87","0x79f261f483b7cef4f995c1f8a0f46f88450423e3","0x8d3bc45d7b30013c37c141f6ce7c981b2613efaa","0xb55eb9bd32d6ab75d7555192e7a3a7ca0bcd5738","0x3c6aeff92b4b35c2e1b196b57d0f8ffb56884a17","0xfc811061134fA6cCFd22f56Cc91bf6450BeA2D01","0x66f21FfC3fA1fb2770426e3c5c209b83B375Dcc3","0x7217bc604476859303a27f111b187526231a300c","0xaa1b056286a66a9e6752c26776ac034c662a51d5","0x3781d92e5449b5b689fee308ded44882085b6312","0xdbf2445e5049c04cda797dae60ac885e7d79df9d","0xd2aff66959ee0e6f92ee02d741071ddb5084bebb","0x35cded880959f93c415723902f91f964367a4dcd","0x4b1bdae6b46c2ed904581d7e4bf2b71e5f3f7072","0x5B4b7F43140E79a4452408CE10dd64FD17D8a2E5","0x886478D3cf9581B624CB35b5446693Fc8A58B787","0x5a418d8bc0C074A4A8fa88d1322dc51Cc1cb9d29","0x63a9dbCe75413036B2B778E670aaBd4493aAF9F3","0x3e25dac1092031116E2A7d59953dCEC2824A6C6A","0xe957A3f551e4EE66F960e7d90F3de0e380Ca600c","0x4c47FC9583A2cd55ecA27F566c02AdC282B2813b","0x0F0eAE91990140C560D4156DB4f00c854Dc8F09E","0xBE5DCA554e58CE63C716a76BC1E34273d21Aff82","0xc3f17178311899B068d0E2C86253E087DAB5ba8f","0x56bDc5fE7f9752E7F5a381E394acFE72A724462b","0xeB1c22baACAFac7836f20f684C946228401FF01C","0x39Cc9C86E67BAf2129b80Fe3414c397492eA8026","0xf0D6999725115E3EAd3D927Eb3329D63AFAEC09b","0xD60f499D1A45E9Aadf9633B460B2c96030EB827b","0xF68e4d63C8Ea83083d1cB9858210Cf2b03D8266B","0x7B42A219Bb14d0719757a391D7cC6AA7F371E144","0x2Debdf4427CcBcfDbC7f29D63964499a0ec184F6","0xf476Cd75BE8Fdd197AE0b466A2ec2ae44Da41897","0xf3860788D1597cecF938424bAABe976FaC87dC26","0x307fa253ab864Cbf57483415909B37C36dF3b8c8","0x59a5493513bA2378Ed57aE5ecfB8A027E9D80365","0xFAB97682e0b4B1589786382EebA1b758FFAe7Ff9","0x1DA5331994e781AB0E2AF9f85bfce2037A514170","0x95Ed0B8aF5400452a12cd47F130175335e46e732","0x17106B7EE3c4D1Ad690b9CaF2B2a2A6e1bDe49D0","0xfBfF1eBff67093A239bC1343aE6a5e3372A14Ac0","0x3f8cD3cc58391E704A2A0fab2482B8116Cb9D670","0x741047AE552E58e89f1FF51D9a06e5d9DfbA3fEb","0xd9fb67111ee14F4D2cC0c8be137679200b85198C","0x30905B34Ddd66C4BEC74a24B447c944A6f1c236F","0x29EA412CC10A9cfC08c2298f382b2Fe01e6CA83b","0x590cFb3e1c9dBEB6B4aFe8Cebf6432D08C5a0BC8","0x9aAdDc5040D2093dC0dafC0803CbfcA822341BCa","0x363ef108036C3910bfA83116E2cd21928Cf39e03","0x408630f7f8Dd26f5E64B279b199E10DbaFD6236B","0xea39c551834D07EE2EE87f1cEFF843c308e089AF","0xaf469C4a0914938e6149CF621c54FB4b1EC0c202","0x2474A7227877F2b65185F09468AF7C6577FA207C","0x46EFbAedc92067E6d60E84ED6395099723252496","0xC218D847a18E521Ae08F49F7c43882b6d1963c60","0x2C2FC2f6c1B1c2cB6d46ca0d66CFC372e5183C16","0x1b523DC90A79cF5ee5d095825e586e33780f7188","0x8FD2b9B078fCe64D1a1202f60443821baD30e631","0x08f1dAfBe1ae73C42917F645FD5e5f933848E5B0","0x315BD7cA72934502B4a4683D7F6ba9fad1362473","0x59a851891E2F0a1eA91351b042DD75b10aF095D0","0xa4c441f1D5b94a6Cf826b81B596A74fdFca0477F","0xb7C933cbDAcB223a62D1b4E904462BC597e04f83","0x2a93E999816c9826aDe0B51AAa2d83240d8F4596","0xA41A4b84D74E085bd463386d55c3b6dDe6aa2759","0x2Aea5D8a7E1bF1e820F3057A47cc5F82627f7fF0","0x90e5aa59a9dF2ADd394df81521DbBEd5F3c4A1A3","0xaF34964b228d7C671fDaC25A277F9d9A33Fa9730","0xc3F4728F673181e20862D21d028CFEaAcfB6d409","0x8b51C1Ba09EE33e7649CAc62cCb6d0f410F5647A","0x716eb921F3B346d2C5749B5380dC740d359055D7","0xfDeD90A3B1348425577688866f798f94d77A0D02","0xd863c0f47bDeB7f113EA85b3cb3D95c667f17Ab4","0xBeC69dfcE4c1fA8b7843FEE1Ca85788d84A86B06","0x08942872046fa44BC6456E491E8dE11de8bae73E","0xDB842C6Df048cFD661e8c33a73bA64470bAE22aa","0xFe5573C66273313034F7fF6050c54b5402553716","0xa4c623295bD8a9E9860fe2eC209da2CbC6343e65","0xC35f3F92A9F27A157B309a9656CfEA30E5C9cCe3","0x6942049509693fbb63d7F1395DAe5cFE1CCEc1BA","0xCF388E3e5742C8B78ff13bF07445da255A124248","0x9270aF5Ee9518C6875F9790ab8dFaC1867759eb1","0xA22DF8a27f62AD49e2A3D23cEa0A86421ec1151c","0xf7801B8115f3Fe46AC55f8c0Fdb5243726bdb66A","0xf0c55dA3a8274f6843434dF0da437eD4AC0Dd310","0x32952286Fad2CaA5BC9ae65F4c901E1e85D21E93","0xc5c7b46843014B1591e9aF24de797156cde67f08","0x22871d53dDa2aEBDaD96272197E7cC52F81e92FD","0x1Dc301854bfeCB4Ba03Eb417579585C2b8Ea12c1","0xb855567A17c266C1D82a52bb093EF5b6a66Deb01","0xe5ee2B9d5320f2D1492e16567F36b578372B3d9F","0xec47741B1102b74C51cd673Fe5572719aDd8a838","0x333345727be2Ec482BaF99a25CB1765Cb7B78DE6","0xDcaE87821FA6CAEA05dBc2811126f4bc7fF73bd1","0x9e437B064CFC7801808c5e476ABfafA5069aB55B","0xB43eebAC012cB2f12e1eC258a6eCE20A7aa4712f","0x9Bc27a47B4413c51f884AE4e4b9170F3A0D7f742","0xb39F3b058148144572c79EBe24b17ba405cE7D9d","0xa041b07Dbdbc743afaEdDcd383da6600eBF168Fc","0x0d41F957181E584dB82d2E316837B2DE1738C477","0x7Bb4e62469Ed4AEB0fa39Bc46020D619945f8E84","0x80569d11cFc16710C125cB6226b38FDbBe8cF52e","0x3177a46EF4afcA9361816e9DC000f967BFce427c","0xC67c60cD6d82Fcb2fC6a9a58eA62F80443E32683","0xF296178d553C8Ec21A2fBD2c5dDa8CA9ac905A00","0x4298e663517593284Ad4FE199b21815BD48a9969","0xc8f8e2F59Dd95fF67c3d39109ecA2e2A017D4c8a","0x26c8B00EBF5b3E13e3978B59fd01627E83E4fEf5","0x228d3c657b8e59Fc76c4e38B86F2E4C42Cd3AF30","0x4FbC3dA68150A816865d780c6D724dfe30eF8dCC","0x9094b9De66790E0a5aB0e3299D38AFB037be458B","0xF85573067D21dD8AB5d2BAe2399627E27FC88547","0x1D4830b3d6Bfc441bDd12400fea264E66b22897a","0x11360F0c5552443b33720a44408aba01a809905e","0x8Ee94E820E7e898f47ac934A755d7382D088Edd4","0x7Dcb39fe010A205f16ee3249F04b24d74C4f44F1","0x127063c94F2D661727c9dcdCdFA983d19650cF57","0xEE33FF0D8e7d06B16c0e26296EF72098C7f305C5","0x983110309620D911731Ac0932219af06091b6744","0x45f6E731798684B1Cf9D980777c9d636E1064ffc","0x1e32a859d69dde58d03820F8f138C99B688D132F","0x801707059a55D748b23b02043c71b7A3D976F071","0x9aAF2F84AfB2162A1efA57018bd4B1Ae0dA28ccE"]


export async function preLoadInfluencers() {

    for(const wallet of influencers)
        await handlePreloadLogin(wallet);
    
}