/// <reference path="./lib/typings.d.ts" />

import * as sp from "sonparser";

import * as tutil from "./lib/type-util";
import * as util from "./lib/util";

export interface OnBoardKomaData {
  komas: string[][];
  colors: number[][];
}

export interface OnHandKomaData {
  komas: tutil.HashMap<number>;
  color: number;
}

export interface BoardData {
  width: number;
  height: number;
  onboard: OnBoardKomaData;
  onhands: OnHandKomaData[];
}

export interface GameSetData {
  playercount: number;
  board: BoardData;
}

export interface KomaData {
  name: string;
  show: string;
  moves: string[][];
  narikoma: string;
  origkoma: string;
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

    result["NONE"] = {
      name: "NONE",
      show: "　",
      moves: [],
      narikoma: "NONE",
      origkoma: "NONE",
    };

    return result;
  })],
]);

const gameset_parser = sp.hasProperties<GameSetData>([
  ["playercount", sp.number],
  ["board", sp.hasProperties<GameSetData>([
    ["width", sp.number],
    ["height", sp.number],
    ["onboard", sp.hasProperties<OnBoardKomaData>([
      ["komas", sp.array(sp.array(sp.string.map((s) => s == "" ? "NONE" : s)))],
      ["colors", sp.array(sp.array(sp.number))],
    ])],
    ["onhands", sp.array(sp.hasProperties<OnHandKomaData>([
      ["komas", sp.array]
    ]))]
  ])],
]);

const gameset_data = sp.parseFileWithResult("data/assets/gamesets/standard.cson", gameset_parser)
  .report().except();

const komaset_data = sp.parseFileWithResult("data/assets/komasets/standard.cson", komaset_parser)
  .report().except();


function printBoard(bd: BoardData): void {
  const sep_str = util.repeat(bd.width, "+ー") + "+";

  console.log(sep_str);
  for (let r = 0; r < bd.height; r++) {
    let s = "|";
    for (let c = 0; c < bd.width; c++) {
      const koma = komaset_data.komas[bd.onboard.komas[r][c]];
      s += `${koma.show}|`;
    }
    console.log(s);
    console.log(sep_str);
  }
}

printBoard(gameset_data.board);

