import * as express from 'express';
import {getUserPoint, updatePoint} from "../service/PointService";

const PointRouter = express.Router();

PointRouter.get('/',  getUserPoint);
PointRouter.post('/update', updatePoint);

export default PointRouter;