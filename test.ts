import * as cspr from "casper-js-sdk";
import * as bs58 from "bs58";
// const kp = cspr.Keys.Secp256K1.loadKeyPairFromPrivateFile("./scr.pem");
// console.log(kp.privateKey.length);
// console.log(bs58.encode(kp.privateKey));
// console.log(kp.publicKey.toHex());
// ("020250b5ac93f7996a23c829cdd7dd73f3dd11b2477fadb4186f04b44e3b92168ccd");

// PublicKey casper nomenclature:
// - public key = base16 hex => algo prefix + public key hex
// - account hash - internal representation of a public key with a fixed length
// ED = 01 public keys should be 66 chars long (with the prefix)
// SEC = 02 public keys should be 68 chars long (with the prefix)
// Public key
// 0202dbd8aa505043287fd1baa460cfda3c1012a2d2bd6c5714959020f000fb7f2d82
// Account hash
// 83d0cd1297be978e66f96fb2afce013a23d2a441f9a397a3d19d97b5f0a26399
const obj = {
  mnemonic:
    "ginger industry language author symbol foster path gauge flee juice cushion attend wine task engage behave drill fossil cook toilet example click record hip",
  index: undefined,
}; // const mnemonic =
//   "castle gold fiscal october neither salmon inhale eternal comfort unable festival fire";
//   castle gold fiscal october neither salmon inhale eternal comfort unable festival fire
// 034321a9babbce613f979449b435372e873e7067bbbc2514d3da774d73968eaaac
// 7hZpZg5v8ptXf6gFHKcWGi6sFGNYkFe6o7RZY1XJQJEk
const edKeyPair = cspr.HDKeys.Ed25519HDKey.fromMnemonic(obj.mnemonic);
const index = obj.index ? obj.index : 0;
const key1 = edKeyPair.derive("m/44'/506'/0'/0/" + index);
const privateKey = key1.privateKey;
const pub = key1.publicKey.toHex();
const bs58PrivateKey = bs58.encode(privateKey);
console.log(pub);
console.log(bs58PrivateKey);
