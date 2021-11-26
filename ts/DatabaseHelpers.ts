import IGameSchema from "../models/game.ts";
import IscoreSchema from "../models/score.ts";
import ILocation from "../models/location.ts";
import Databases from "../db/mongo.ts"
import { GameConstants } from "./GameConstants.ts"
import { pluck } from "./CalculationHelpers.ts";

export async function addToLeaderboards(game: IGameSchema, name: string, ip: string, gameType: string) {
    try {
        let score_collection = Databases[gameType].collection<IscoreSchema>("scores");

        let new_score: IscoreSchema = {
            ip: ip,
            name: name,
            date: new Date().toUTCString(),
            score: game?.score
        }

        game.addedToLeaderboards = true;

        await score_collection.insertOne(new_score);
        await Databases[gameType].collection<IGameSchema>("games").updateOne({ id: game.id, authCookie: game.authCookie }, game)
    } catch (error) {
        throw error;
    }
}

export async function getRandomLocations(gameType: string): Promise<ILocation[]> {
    try {
        let locationsArray: Array<ILocation> = new Array<ILocation>();

        for (let i = 0; i < GameConstants.MAX_ROUNDS; i++) {
            locationsArray.push(await getRandomLocation(pluck(locationsArray, "id"), gameType));
        }

        return locationsArray;
    }
    catch (error) {
        throw error;
    }
}

export async function getGame(id: string, authCookie: string, gameType: string) {
    return await Databases[gameType].collection<IGameSchema>("games").findOne({ id: id, authCookie: authCookie });
}

export async function getRandomLocation(previousLocations: Array<number>, gameType: string): Promise<ILocation> {
    try {
        let locations_collection = Databases[gameType].collection<ILocation>("locations");
        let locations: Array<ILocation> = await locations_collection.find({ id: { $nin: previousLocations } });
        let location: ILocation = locations[Math.floor(Math.random() * locations.length)];
        return location;
    }
    catch (error) {
        throw error;
    }
}

export async function updateGame(gameType: string, id: string, authCookie: string, game: IGameSchema) {
    await Databases[gameType].collection<IGameSchema>("games").updateOne({ id: id, authCookie: authCookie }, game)
}

export async function newGame(game: IGameSchema, gameType: string) {
    await Databases[gameType].collection<IGameSchema>("games").insertOne(game)
}
//TODO INSERT GAME