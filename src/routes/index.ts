import { Router } from 'express';

import router from './userRoutes';


const route = Router();

route.use(process.env.BASE_URL, router);

export default route;