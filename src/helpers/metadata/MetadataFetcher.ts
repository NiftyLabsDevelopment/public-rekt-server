import AWS from 'aws-sdk';
import { Metadata } from '../../Types';
import { getTokenData } from './MetadataUpdater';
import { BigNumber } from 'ethers';
import { Response } from 'express';
import { addToMetadataQueue, isAlreadyInQueue } from './MetadataListener';
import { fixVehicleMetadata } from '../../VehicleFixes/FixVehicleMetadata';

// Configure AWS
AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.AWS_PUBLIC_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4'
});

const s3 = new AWS.S3();

const sourceBucket = 'biginc-private';
const destinationBucket = 'biginc-public';

export async function getHistoryForToken(tokenId: number) {
    
    let tokenData = await getTokenData(tokenId);

    const listObjectsResponse = await s3.listObjectsV2({
        Bucket: destinationBucket,
        Prefix: `${tokenData.tokenType}/${tokenId}/`
    }).promise();

    const objects = listObjectsResponse.Contents;

    if(!objects || objects.length === 0) {
        console.log("No objects found in bucket");
        return;
    }
    
    const objectKeys = objects.map(object => object.Key);

    let metadata: Metadata[] = [];

    for(let i = 0; i < objectKeys.length; i++) {
        const objectKey = objectKeys[i];

        if(!objectKey) {
            console.log("No object key found");
            return;
        }

        const getObjectResponse = await s3.getObject({
            Bucket: destinationBucket,
            Key: objectKey
        }).promise();

        if(!getObjectResponse.Body) {
            console.log("No object body found");
            return;
        }

       

        const objectBody = getObjectResponse.Body.toString('utf-8');
        let metadataItem = JSON.parse(objectBody) as Metadata;

        let image_data = metadataItem.image.split("/");

        let image_type = image_data[0];
        let image_id = image_data[1];

        let imageKey = `${image_type}/images/${image_id}.png`;

        let signedUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: sourceBucket,
            Key: imageKey,
            Expires: 60 * 60 * 24 * 7 //7 days
        });
        fixVehicleMetadata(metadataItem);

        metadataItem.image = signedUrl;
        

        let paddedTokenId = 500000 + tokenId;

        metadataItem.name = "BiG iNC Employee #" + paddedTokenId.toString();

        metadata.push(metadataItem);
    }

    return metadata;
}

export async function getMetadataForToken(tokenId: number, res: Response, attempt = 0) {

    if(isAlreadyInQueue(tokenId)) {
        res.send("Token is currently being generated");
        return;
    }

    let tokenData = await getTokenData(tokenId);

    if(!tokenData.exists)
        return "Token does not exist";

    let metadataFound = true;

    await s3.headObject({
        Bucket: destinationBucket,
        Key: `${tokenData.tokenType}/${tokenId}/${tokenData.upgrade}`
    }).promise().catch(err => {
        let error = err as AWS.AWSError;

        if(error.code === 'NotFound') {
            metadataFound = false;
        }
    });

    if(metadataFound){
        console.log("Metadata found for token " + tokenId);

        let metadata = await s3.getObject({
            Bucket: destinationBucket,
            Key: `${tokenData.tokenType}/${tokenId}/${tokenData.upgrade}`
        }).promise();

        if(!metadata.Body) {
            console.log("No metadata body found");
            return;
        }

        let parsedMetadata = JSON.parse(metadata.Body.toString()) as Metadata;

        let image_data = parsedMetadata.image.split("/");

        let image_type = image_data[0];
        let image_id = image_data[1];
        
        let imageKey = `${image_type}/images/${image_id}.png`;

        let signedUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: sourceBucket,
            Key: imageKey,
            Expires: 60 * 60 * 24 * 7 //7 days
        });

        fixVehicleMetadata(parsedMetadata);

        parsedMetadata.image = signedUrl;


        res.json(parsedMetadata)
    }

    if(!metadataFound && attempt == 0) {
        addToMetadataQueue(tokenId, res);
        return;
    }

    if(!metadataFound) {
        console.log("Metadata not found for token " + tokenId);
        
        let metadata = await updateMetadataForToken(tokenId, tokenData.tokenType.toNumber(), tokenData.upgrade.toNumber());

        res.json(metadata);

    }
}

async function getRandomMetadataKey(tokenType: number) {

    const listObjectsResponse = await s3.listObjectsV2({
        Bucket: sourceBucket,
        Prefix: `${tokenType.toString()}/metadata/`
    }).promise();

    const objects = listObjectsResponse.Contents;
    
    if(!objects || objects.length === 0) {
        console.log("No objects found in bucket");
        return;
    }

    const objectKeys = objects.map(object => object.Key);

    const MAX = objectKeys.length;

    let randomIndex = Math.floor(Math.random() * MAX);

    const randomObjectKey = objectKeys[randomIndex];

    if(!randomObjectKey) {
        console.log("No object keys found");
        return;
    }

    return randomObjectKey;
}

async function deleteFromPoolAndConfirm(key: string) {

    await s3.deleteObject({
        Bucket: sourceBucket,
        Key: key
    }).promise();

    let wasDeleted = false;

    await s3.headObject({
        Bucket: sourceBucket,
        Key: key
    }).promise().catch(err => {
        let error = err as AWS.AWSError;

        if(error.code === 'NotFound') {
            wasDeleted = true;
        }
    });

    return wasDeleted;
}

export async function updateMetadataForToken(tokenId: number, tokenType: number, upgrade: number) {


    const newKey = `${tokenType}/${tokenId}/${upgrade}`;

    const randomObjectKey = await getRandomMetadataKey(tokenType);

    if(!randomObjectKey) {
        console.log("No random object key found");
        return;
    }

    const getObjectResponse = await s3.getObject({
        Bucket: sourceBucket,
        Key: randomObjectKey
    }).promise();

    if(!getObjectResponse.Body) {
        console.log("No object body found");
        return;
    }

    const objectBody = getObjectResponse.Body.toString('utf-8');

    console.log(objectBody);

    let metadata = JSON.parse(objectBody) as Metadata;

    let isDeleted = await deleteFromPoolAndConfirm(randomObjectKey);

    if(!isDeleted) {
        console.log("Object not deleted");
        return;
    }

    let image_data = metadata.image.split("/");

    let image_type = image_data[0];
    let image_id = image_data[1];

    let imageKey = `${image_type}/images/${image_id}.png`;

    let signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: sourceBucket,
        Key: imageKey,
        Expires: 60 * 60 * 24 * 7 //7 days
    });


    let paddedTokenId = 500000 + tokenId;

    metadata.name = "BiG iNC Employee #" + paddedTokenId.toString();

    if(upgrade > 0)
        metadata.attributes.push({
            trait_type: "Helped Defect",
            value: upgrade.toString()
        });

    let uploaded = true;

    await s3.putObject({
        Bucket: destinationBucket,
        Key: newKey,
        Body: JSON.stringify(metadata)
    }).promise().catch(err => {
        uploaded = false;
    });

    if(!uploaded) {
        console.log("Metadata not uploaded");
        return;
    }

    fixVehicleMetadata(metadata);

    metadata.image = signedUrl;



    console.log("Metadata uploaded");
    return metadata;

}