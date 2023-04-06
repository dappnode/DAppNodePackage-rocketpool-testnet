// {"status":"success","error":"","registered":true,"claimedIntervals":[56],"unclaimedIntervals":[{"index":57,"treeFilePath":"/rocketpool/data/rewards-trees/rp-rewards-prater-57.json","treeFileExists":true,"merkleRootValid":true,"cid":"bafybeiaoaqclhe6jdiahmxs6s63sie7pmozgyidxhmwaiwbxgbh3inb2cy","startTime":"2023-01-14T01:26:36Z","endTime":"2023-01-17T01:26:36Z","nodeExists":true,"collateralRplAmount":"1461537981670659624","oDaoRplAmount":"0","smoothingPoolEthAmount":"1433631862842254","merkleProof":["0x2534d68bf0cb76af98dd2e3ac2625ed4a34bef1ba2147a7c97566926c5273831","0x751b02a06a9736cba864ca86e8f200fe1228f9147cd4e70e6fe23ffa685dbc1b","0x4f22b572a5fa22dbb8bfbdb1a8e7eeea809dbd4779c13868dc197904f9ce529f","0x20d09fd65134c74d336c83901076409a9578878ad186308497fbf96c53ecce21","0x087600260a92a055d562d3876db7e8425b1a8195aed8e6ba33cf9a9a7bb04897","0xb381961511f332ff64b5b3241f8a063cabf02d88dfb93cbb2d0298e6e4db6cc6","0xf57a33b61a70915604aab5253d6da4d36d81f6637287c975e358f6d839ee762b","0xe8e73f4c1738147b90544c4881f07003bf2d655d0d2971610de074c6e6d706a2","0x71a0bf8e311f88c1a71059e4d98afd7b2e91f20997ab3d1b7d9561246c1c4a65","0xd921f7168f0f6042d6f248e221b70a0d9433a4dfafae887c023d52243b3604e4","0x178fd2cbdee0ff192bc0c4ab5a63d218690a3751538e813370641797ee259aa4"]}],"invalidIntervals":null,"rplStake":287559058321718419577,"rplPrice":24396530793706321,"activeMinipools":2,"isAtlasDeployed":true,"effectiveRplStake":287559058321718419577,"minimumRplStake":131166190269377066398,"maximumRplStake":1967492854040655995979,"ethMatched":32000000000000000000,"ethMatchedLimit":70154434213549953255,"pendingMatchAmount":0,"borrowedCollateralRatio":0.2192326069173436,"bondedCollateralRatio":0.2192326069173436}

import { Status } from './Status';

export interface GetRewardsInfo {
    status: Status;
    error: string;
    registered: boolean;
    claimedIntervals: number[];
    unclaimedIntervals: UnclaimedInterval[];
    invalidIntervals: any;
    rplStake: number;
    rplPrice: number;
    activeMinipools: number;
    isAtlasDeployed: boolean;
    effectiveRplStake: number;
    minimumRplStake: number;
    maximumRplStake: number;
    ethMatched: number;
    ethMatchedLimit: number;
    pendingMatchAmount: number;
    borrowedCollateralRatio: number;
    bondedCollateralRatio: number;
}

export interface UnclaimedInterval {
    index: number;
    treeFilePath: string;
    treeFileExists: boolean;
    merkleRootValid: boolean;
    cid: string;
    startTime: string;
    endTime: string;
    nodeExists: boolean;
    collateralRplAmount: string;
    oDaoRplAmount: string;
    smoothingPoolEthAmount: string;
    merkleProof: string[];
}
    