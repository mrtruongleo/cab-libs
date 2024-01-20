import util from "util";
import * as readline from "readline";
import * as process from "process";
export const csl = (...texts: (string | any)[]) => {
  let res: string[] = [];
  //console.log(JSON.stringify(texts.join(""), null, 2));
  for (const text of texts) {
    if (typeof text !== ("string" || "number")) {
      res.push(util.inspect(text, false, null, true /* enable colors */));
    } else {
      res.push(text);
    }
  }
  console.log(res.join(""));
};
export const sleep = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waiting = async (s: number) => {
  for (let i = s; i > 0; i--) {
    const message = util.format(`Waiting ${i} seconds before new request`);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(message);
    await sleep(1000);
  }
};
