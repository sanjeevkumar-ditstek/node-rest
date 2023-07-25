import Joi from "joi";
import Roles from "../../../../utils/enum/roles";

export const createSchema = Joi.object().keys({
    name: Joi.string().valid(...Object.values(Roles)),
});

export const getSchema =Joi.object().keys({
    id: Joi.string().required(),
});

// updateSchema
export const updateSchema =Joi.object().keys({
    name: Joi.string().valid(...Object.values(Roles)),
});