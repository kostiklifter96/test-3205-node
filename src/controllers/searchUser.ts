import { Request, Response } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { IUser } from "../types/types";
import { userValidation } from "../validation/userValidation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data: IUser[] = JSON.parse(
    readFileSync(path.join(__dirname, "../../src/data/users.json"), "utf8"),
);

function checkFromJson(email: string) {
    const resultArr: IUser[] = data.filter((el) => el.email === email);

    return resultArr;
}

const sessionMap = new Map<String, (arg0: string) => void>();
const requestTimeout = 5000;

export const searchUser = (request: Request, response: Response) => {
    const { error } = userValidation(request.body);

    if (error) {
        console.log("error: " + error);

        return response
            .status(400)
            .json({
                result: false,
                error: JSON.stringify(error.details[0].message),
            });
    }

    const email = request.body.email;

    const requestPromise = new Promise((res, rej) => {
        if (sessionMap.get(email)) {
            sessionMap.get(email)?.("Rejected");
        }

        sessionMap.set(email, rej);

        setTimeout(() => {
            const userArr = checkFromJson(email);
            sessionMap.delete(email);
            res(userArr);
        }, requestTimeout);
    });

    requestPromise
        .then((unused) =>
            response.status(200).json({ result: "ok", data: unused }),
        )
        .catch((reason) => response.status(400).json({ result: reason }));
};
