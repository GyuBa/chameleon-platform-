import {Request, Response} from 'express';
import {RouteService} from '../interfaces/route/RouteService';
import {RESPONSE_MSG} from '../../constant/Constants';

// TODO: management exception
export class PointService extends RouteService {
    initRouter() {
        this.router.get('/', this.getUserPoint);
        this.router.post('/update', this.updatePoint);
    }

    async getUserPoint(req: Request, res: Response) {
        const {id} = req.query;
        if(!id) return res.status(501).send({'msg':RESPONSE_MSG.NON_FIELD});
        console.log(id);
        const point = await this.walletController.findWalletByUserId(Number(id));
        return res.status(200).send({
            'point': point.point,
        });
    }

    async getUserWallet(req: Request, res: Response) {
        const {id} = req.query;
        if(!req.isAuthenticated()) return res.status(501).send({'msg':RESPONSE_MSG.NOT_AUTH});
        if(!id) return res.status(501).send({'msg':RESPONSE_MSG.NON_FIELD});
        const wallet = await this.walletController.findWalletByUserId(Number(id));
        return res.status(200).send({
            'wallet': wallet,
        });
    }

    async updatePoint(req: Request, res: Response) {
        const {userId, amount} = req.body;
        if(!req.isAuthenticated()) return res.status(501).send({'msg':RESPONSE_MSG.NOT_AUTH});
        if(!(userId && amount)) return res.status(501).send({'msg':RESPONSE_MSG.NON_FIELD});
        if (!(await this.walletController.findWalletByUserId(Number(userId)))) return res.status(501).send({'msg':RESPONSE_MSG.NOT_FOUND});
        await this.walletController.updateWallet(userId, amount);
        return res.status(200).send({
            'msg': 'ok',
        });
    }
}