import express from 'express';
import cors from 'cors';
import { startUserListener } from '../helpers/UserHelper';
import { startTaskListener } from '../helpers/TaskHelper';
import { startLeaderboardListener } from '../helpers/LeaderboardBuilder';
import { startWalletListener } from '../helpers/WalletHelper';
import { startMetadataListener } from '../helpers/metadata/MetadataListener';

cors({credentials: true, origin: true});

export const app = express();

app.use(cors());
app.use( express.json() );
app.set('json spaces', 4);

const port = process.env.PORT || 8081;

let server = null;


export async function startServer() {
    server = app.listen(
        port,
        () => console.log(`Server online on port ${port}`)
    );

    app.get('/', (req, res) => {
        res.send("I'm alive!");
    })

    startUserListener();
    startWalletListener();
    startTaskListener();
    startLeaderboardListener();
    startMetadataListener();
}