import { Response } from "express";
import { app } from "../../services/Server";
import { getHistoryForToken, getMetadataForToken } from "./MetadataFetcher";

let metadata_queue: {id: number, res: Response}[] = [];
let queue_active = false;


export async function checkQueue() {
    try {
        if(queue_active)
            return;

        queue_active = true;

        while(metadata_queue.length > 0) {
            let metadata_request = metadata_queue.shift();

            if(!metadata_request) {
                queue_active = false;
                return;
            }

            let response = await getMetadataForToken(metadata_request.id, metadata_request.res, 1);

            metadata_request.res.json(response);
        }

        queue_active = false;
    } catch(e) {
        console.log("Error in metadata queue: " + e);
        queue_active = false;

        checkQueue();
    }
}

export function isAlreadyInQueue(id: number) {
    return metadata_queue.find(m => m.id == id);
}

export function addToMetadataQueue(id: number, res: Response) {
    metadata_queue.push({id, res});

    checkQueue();
}


export async function startMetadataListener() {
    app.get('/metadata/:id', async (req, res) => {
        getMetadataForToken(parseInt(req.params.id), res);
    });

    app.get('/history/:id', async (req, res) => {
        let m = await getHistoryForToken(parseInt(req.params.id));

        if(!m) {
            res.status(404).send("Metadata not found");
            return;
        }

        res.json(m);

    });
}