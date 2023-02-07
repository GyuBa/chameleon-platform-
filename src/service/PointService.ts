import {readWallet} from "../controller/WalletController";
import {Request, Response} from 'express';

export async function userPoint(req: Request, res: Response, next: () => void) {
    const {id} = req.query;
    const point = await readWallet(Number(id));
    return res.status(200).send({
        'point': point,
    })
}