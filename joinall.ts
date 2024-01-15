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
  if (fs.readFileSync("chainlist.json")) {
    const data = fs.readFileSync("chainlist.json", "utf8");
    fs.writeFile(`chainlist-bk.json`, data, (e) => {
      if (e) {
        console.error("error: ", e);
      }
      console.log("Backup last chainlist.json to chainlist-bk.json");
    });
  }
  fs.writeFile(`chainlist.json`, JSON.stringify(final, null, 2), (e) => {
    if (e) {
      console.error("error: ", e);
    }
    console.log("Joined all");
  });
};
joinAll();
