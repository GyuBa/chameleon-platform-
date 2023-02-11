import * as express from 'express';
import {Request, Response} from 'express';

const SocketRouter = express.Router();
SocketRouter.get('/', (req: Request, res: Response) => {
    res.send('Socket');
});

export default SocketRouter;
