import {Request, Response} from 'express';
import {RouteService} from '../interfaces/route/RouteService';

// TODO: management exception
export class PointService extends RouteService {
    initRouter() {
        this.router.get('/', this.getUserPoint);
        this.router.post('/update', this.updatePoint);
    }

    async getUserPoint(req: Request, res: Response) {
        const {id} = req.query;
        const point = await this.walletController.findWalletByUserId(Number(id));
        return res.status(200).send({
            'point': point.point,
        });
    }

    async getUserWallet(req: Request, res: Response) {
        const {id} = req.query;
        const wallet = await this.walletController.findWalletByUserId(Number(id));
        return res.status(200).send({
            'point': wallet,
        });
    }

    async updatePoint(req: Request, res: Response) {
        const {userId, amount} = req.body;
        await this.walletController.updateWallet(userId, amount);

        return res.status(200).send({
            'msg': 'ok',
        });
    }
}