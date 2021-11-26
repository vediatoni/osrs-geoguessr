import { MongoClient, Database } from "../deps.ts";
import { getConnectionUrl } from "../config/mongo.ts";

const client = new MongoClient();
client.connectWithUri(getConnectionUrl());

const main = client.database("rslocator");
const easy = client.database("rslocator-easy");
const hard = client.database("rslocator-hard");
const f2p = client.database("rslocator-f2p");
const rs3 = client.database("rslocator-rs3");

const Databases: { [key: string]: Database } = {
    "easy": easy,
    "hard": hard,
    "f2p": f2p,
    "rs3": rs3,
    "main": main
}

export default Databases;