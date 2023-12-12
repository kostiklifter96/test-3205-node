import cors from "cors";
import express from "express";
import { searchUser } from "./controllers/searchUser.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3001;

app.post("/searchUser", searchUser);

app.listen(PORT, () => {
    console.log(`server start ${PORT}`);
});
