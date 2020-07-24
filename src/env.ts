import * as dotenv from "dotenv";
import * as path from "path";

const { NODE_ENV } = process.env;

console.log(`*** Starting Server. 3 steps ***`);
console.log(`1. node enviornment is ${NODE_ENV}`);

dotenv.config({
  path: path.resolve(
    process.cwd(),
    NODE_ENV === "development" ? ".env.development" : ".env"
  ),
});
