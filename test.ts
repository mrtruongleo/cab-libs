let chain: string = "";
process.argv.forEach(function (val, index, array) {
  if (index === 2) chain = val;
});
console.log(chain);
