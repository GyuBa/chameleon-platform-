import {Wallet} from "../entities/Wallet";
import {source} from "../DataSource";
import {User} from "../entities/User";

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

export async function readWallet(userId: number) {
    const walletRepository = source.getRepository('Wallet');
    try {
        const wallet = await walletRepository.find({
            where: {user: {id: userId}},
        });
        console.log(wallet);
        return wallet;
    }
    catch (e) {
        console.error(e)
    }
}