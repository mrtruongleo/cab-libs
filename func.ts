import util from "util";
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
