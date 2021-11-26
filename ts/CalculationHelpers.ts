import { GameConstants } from "./GameConstants.ts"

export function getDistanceBetween(latlng1: { lat: number, lng: number }, latlng2: { lat: number, lng: number }): number {
    var dx = latlng1.lng - latlng2.lng,
        dy = latlng1.lat - latlng2.lat;

    return Math.sqrt(dx * dx + dy * dy);
}

export function getGoodScore(distance: number): number {
    var defaultMultiplier = 0;
    if (distance > GameConstants.MAX_RADIUS) defaultMultiplier = 1;
    if (distance > GameConstants.MAX_SCORE) return 0;

    return GameConstants.MAX_SCORE - (distance * defaultMultiplier)
}

export function pluck(array: Array<any>, key: string): Array<any> {
    return array.map(function (item) { return item[key]; });
}
