import { Server } from './helper/server';
import dotenv from 'dotenv';
import { connectToMongo }from './utils/mongodb/mongodb'

dotenv.config();
const Port = process.env.PORT;
const server = new Server(Number(Port));
server.start();
connectToMongo()
