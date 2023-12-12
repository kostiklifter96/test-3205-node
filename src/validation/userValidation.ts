import Joi from "joi";
import { IUser } from "../types/types";

export const userValidation = (data: IUser) => {
    const schema = Joi.object({
        email: Joi.string().min(8).max(25).required().email(),
        number: Joi.string().min(6),
    });

    return schema.validate(data);
};
