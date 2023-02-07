import {readWallet, updateWallet} from "../controller/WalletController";
import {Request, Response} from 'express';

//TODO management exception
export async function getUserPoint(req: Request, res: Response) {
    const {id} = req.query;
    const point = await readWallet(Number(id));
    return res.status(200).send({
        'point': point.point,
    });
}

export async function getUserWallet(req: Request, res: Response) {
    const {id} = req.query;
    const wallet = await readWallet(Number(id));
    return res.status(200).send({
        'point': wallet,
    });
}

export async function updatePoint(req: Request, res: Response) {
    const {userId, amount} = req.body;
    await updateWallet(userId, amount);

    return res.status(200).send({
        'msg': 'ok',
    });
}