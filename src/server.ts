import express from "express";
import router from "./router/router";
const app = express();
import chalk from "chalk";
import morgan from "./logger/morgan";
import { generateInitialUsers } from "./initialData/initialDataService";
import cors from "./cors/cors";
import { connectToDatabase } from "./dataAccess/mongo";

app.use(morgan);
app.use(cors);
app.use(express.json());
app.use(router);
connectToDatabase()
const PORT = 8181;
app.listen(PORT, () => {
  console.log(chalk.blueBright(`Server listening on port: ${PORT}`));
  generateInitialUsers()
    .then(() => console.log(chalk.magentaBright("Initial Users Created!")))
    .catch((error) => console.log(error));
});
