import { startServer } from "./services/Server";
import dotenv from 'dotenv';
import { startDatabase } from "./services/Database";
import { startQuestionnaireListener } from "./helpers/QuestionHelper";
import { backupQueueData, checkQueue, getTaskDataFor, restoreBackup } from "./helpers/TaskHelper";
import { cacheData } from "./helpers/IndexingData/DataBuilderMain";
import { startLeaderboardBuilder } from "./helpers/LeaderboardBuilder";
import { cacheOpenseaContractData, getOpenseaContractDataFor } from "./helpers/IndexingData/OpenseaContracts";
import { backupOpenseaUserData, restoreOpenseaUserData } from "./helpers/IndexingData/OpenseaWallets";
import { preLoadInfluencers } from "./helpers/InfluencerHelper";

dotenv.config();

async function init() {
    await restoreBackup();
    await restoreOpenseaUserData();

    await startServer();
    await startDatabase();
    startLeaderboardBuilder();

    checkQueue();
    await startQuestionnaireListener();

    await preLoadInfluencers();

    //cacheOpenseaContractData();

    
}

init();

process.on('beforeExit', () => {
    try {
        backupQueueData();
        backupOpenseaUserData();
    } catch(e) {
        console.log(e);

        process.exit(0);
    }

    process.exit(0);
})

process.on('SIGINT', function() {
    console.log('Caught interrupt signal');
    try {
        backupQueueData();
        backupOpenseaUserData();
    } catch(e) {
        console.log(e);

        process.exit(0);
    }

    process.exit(0);
  });

process.on('uncaughtException', function(e) {
    console.log(e);
})