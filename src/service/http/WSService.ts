import * as express from 'express';
import {Application, Request, Response} from 'express';
import {HTTPService} from '../interfaces/http/HTTPService';
import {Server} from 'http';

export class WSService extends HTTPService {
    init(app: Application, server: Server) {
        const router = express.Router();
        router.get('/', (req: Request, res: Response) => {
            res.send('Socket');
        });
        // this.app.use('/ws', router);
    }
}