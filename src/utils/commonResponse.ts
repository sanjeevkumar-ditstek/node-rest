import { Response } from 'express';
import StatusCodeEnum from './statusCodeEnum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SendResponse = (
  res: Response,
  data: any = { message: 'Invalid Request' },
  status = StatusCodeEnum.BAD_REQUEST
) => {
  res.status(status).json({ data });
};
export default SendResponse;
