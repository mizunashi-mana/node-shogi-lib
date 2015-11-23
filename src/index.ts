/// <reference path="./lib/typings.d.ts" />

import * as CSON from "cson";
import * as sp from "sonparser";

import * as tutil from "./lib/type-util";

export interface OnBoardData {
  komas: string[][];
  colors: number[][];
}

export interface BoardData {
  width: number;
  height: number;
  onboard: OnBoardData;
}

export interface GameSetData {
  playercount: number;
  board: BoardData;
}

export interface KomaData {
  name: string;
  show: string;
  moves: string[][];
  narikoma?: string;
  origkoma?: string;
}

export interface KomaSetData {
  komas: tutil.HashMap<KomaData>;
}

const koma_parser = sp.hasProperties<KomaData>([
  ["name", sp.string],
  ["show", sp.string],
  ["moves", sp.array(sp.array(sp.string))],
  ["narikoma", sp.string.option("NONE")],
  ["origkoma", sp.string.option("NONE")],
]);

const komaset_parser = sp.hasProperties<KomaSetData>([
  ["komas", sp.array(koma_parser).map((arr) => {
    let result: tutil.HashMap<KomaData> = {};
    for (const kdata of arr) {
      result[kdata.name] = kdata;
    }
    return result;
  })],
]);

const gameset_parser = sp.hasProperties<GameSetData>([
  ["playercount", sp.number],
  ["board", sp.hasProperties<GameSetData>([
    ["width", sp.number],
    ["height", sp.number],
    ["onboard", sp.hasProperties<OnBoardData>([
      ["komas", sp.array(sp.array(sp.string))],
      ["colors", sp.array(sp.array(sp.number))],
    ])],
  ])],
]);

const gameset_data = gameset_parser
  .parse(
    CSON.requireFile("data/assets/gamesets/standard.cson")
  );

const komaset_data = komaset_parser
  .parse(
    CSON.requireFile("data/assets/komasets/standard.cson")
  );

console.log(gameset_data);
console.log(komaset_data);
