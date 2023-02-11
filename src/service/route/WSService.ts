import {Request, Response} from 'express';
import {RouteService} from '../interfaces/route/RouteService';

export class WSService extends RouteService {
    initRouter() {
        this.router.get('/', (req: Request, res: Response) => {
            res.send('Socket');
        });
    }
}