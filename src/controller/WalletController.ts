import {Wallet} from '../entities/Wallet';
import {source} from '../DataSource';
import {User} from '../entities/User';

export async function createWallet(user: User) {
    const walletRepository = source.getRepository('Wallet');
    try {
        const wallet = new Wallet();
        wallet.user = user;
        await walletRepository.save(wallet);
        return wallet;
    } catch (e) {
        console.error(e);
    }
}

export async function findWalletByUserId(userId: number) {
    const walletRepository = source.getRepository('Wallet');
    try {
        const wallet = await walletRepository.findOne({
            where: {user: {id: userId}},
        });
        return wallet;
    } catch (e) {
        console.error(e);
    }
}

export async function updateWallet(userId: number, amount: number) {
    const walletRepository = source.getRepository('Wallet');
    try {
        const wallet = await findWalletByUserId(userId);
        await walletRepository
            .createQueryBuilder()
            .update(Wallet)
            .set({
                point: () => `point + ${amount}`
            })
            .where('userId=:userId', {userId})
            .execute();
    } catch (e) {
        console.error(e);
    }
}