import express from 'express';

import userController from '../controller/userController';

import {auth} from '../middleware/auth';

const router = express.Router();

const controller = new userController();

router.post('/register',auth.upload,controller.create);

router.post('/login',controller.login);

router.get('/welcome',auth.verifyToken,controller.welcome);

router.post('/uploadFiles',auth.multiupload,controller.storeMultiImages);

export default router;