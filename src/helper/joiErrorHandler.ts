import { IError } from "../utils/interface/common"

export const JoiError = (error: any): IError => {
    let err: IError;
    err.message = error.details[0].message;
    err.code = undefined;
    return err;
}
