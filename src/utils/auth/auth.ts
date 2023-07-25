import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

// export const extractBearerToken = (req: any , res: any , next: any) => {
//     // let next: any = {};
//     let token = req.headers.authorization;
//     return next;
// };

export default function authenticate(req: any, res: any, next: any): any {
    let token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
        if (error) {
            console.error(error);
            // throw new GraphQLError('User is not authenticated', {
            //     extensions: {
            //       code: 'UNAUTHENTICATED',
            //       http: { status: 401 },
            //     },
            //   });
            return error
        } else if (data) {
            let user = data;
            req.user = user;
        }
        next();
    });
}
