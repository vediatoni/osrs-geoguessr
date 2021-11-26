import ILocation from "./location.ts"

export default interface IgameSchema {
    id: string,
    authCookie: string,
    score: number,
    round: number,
    locations: Array<ILocation>;
    ip: string,
    addedToLeaderboards: boolean,
    date: Date;
}