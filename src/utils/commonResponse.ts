import { Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SendResponse = (res: Response,token:any,data: any = { message: "Invalid Request" }, status = 400) => {
    res.status(status).json({ status: true, data,token });
    // res.send(status).json({msg});
}
export default SendResponse;