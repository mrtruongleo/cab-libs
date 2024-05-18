import axios from "axios";
import { csl } from "./func";
import * as fs from "fs";

export const joinAll = () => {
  let final: any = [];
  const _dir = "defi";
  fs.readdirSync(_dir).forEach((dir) => {
    fs.readdirSync(_dir + "/" + dir).forEach((file) => {
      csl("file: ", file);
      const data: string = fs.readFileSync(
        _dir + "/" + dir + "/" + file,
        "utf8"
      );
      const js = JSON.parse(data);
      final.push(js);
    });
  });
  if (fs.readFileSync("defi.json")) {
    const data = fs.readFileSync("defi.json", "utf8");
    fs.writeFile(`defi-bk.json`, data, (e) => {
      if (e) {
        console.error("error: ", e);
      }
      console.log("Backup last defi.json to defi-bk.json");
    });
  }
  fs.writeFile(`defi.json`, JSON.stringify(final, null, 2), (e) => {
    if (e) {
      console.error("error: ", e);
    }
    console.log("Joined all defi");
  });
};
joinAll();
