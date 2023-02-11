import {Wallet} from '../entities/Wallet';
import {User} from '../entities/User';
import {BaseController} from "./interfaces/BaseController";

export class WalletController extends BaseController<Wallet> {
    constructor() {
        super(Wallet);
    }

    async createWallet(user: User) {
        try {
            const wallet = new Wallet();
            wallet.user = user;
            await this.repository.save(wallet);
            return wallet;
        } catch (e) {
            console.error(e);
        }
    }

    async findWalletByUserId(userId: number) {
        try {
            const wallet = await this.repository.findOne({
                where: {user: {id: userId}},
            });
            return wallet;
        } catch (e) {
            console.error(e);
        }
    }

    async updateWallet(userId: number, amount: number) {
        try {
            const wallet = await this.findWalletByUserId(userId);
            await this.repository
                .createQueryBuilder()
                .update(wallet)
                .set({
                    point: () => `point + ${amount}`
                })
                .where('userId=:userId', {userId})
                .execute();
        } catch (e) {
            console.error(e);
        }
    }
}