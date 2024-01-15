import axios from "axios";
import { csl } from "./func";
import * as fs from "fs";

export const joinAll = () => {
  let final: any = [];
  const chainlist = "chainlist";
  fs.readdirSync(chainlist).forEach((dir) => {
    fs.readdirSync(chainlist + "/" + dir).forEach((file) => {
      csl("file: ", file);
      const data: string = fs.readFileSync(
        chainlist + "/" + dir + "/" + file,
        "utf8"
      );
      const js = JSON.parse(data);
      final.push(js);
    });
  });

  fs.writeFile(`FINAL3.json`, JSON.stringify(final, null, 2), (e) => {
    if (e) {
      console.error("error: ", e);
    }
    console.log("Joined all");
  });
};
joinAll();
