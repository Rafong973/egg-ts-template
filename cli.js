#!/usr/bin/env node

const path = require("path");
const sao = require("sao");

let args = process.argv.slice(2);

if (!args[0]) {
  throw new Error(
    "请输入项目名称！！！\n eg. npm run cli project_xxxx or yarn cli project_xxxx"
  );
}

// In a custom directory or current directory
let outDir = path.resolve(args[0]);

const generator = path.resolve(__dirname, "./");

console.log(`> Generating meiway dingzhi project in ${outDir}`);

// See https://sao.js.org/#/advanced/standalone-cli
sao({
  generator,
  outDir,
})
  .run()
  .catch(err => {
    console.trace(err);
    process.exit(1);
  });
