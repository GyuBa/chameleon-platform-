import * as express from 'express';
import {userPoint} from "../service/PointService";

const PointRouter = express.Router();

PointRouter.get('/',  userPoint);

export default PointRouter;