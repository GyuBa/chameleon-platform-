import {ImageController} from '../../controller/ImageController';
import {ModelController} from '../../controller/ModelController';
import {WalletController} from '../../controller/WalletController';
import {UserController} from '../../controller/UserController';
import {RegionController} from '../../controller/RegionController';


export abstract class BaseService {
    private static _imageController = new ImageController();
    protected get imageController(): ImageController {
        return BaseService._imageController;
    }

    private static _modelController = new ModelController();
    protected get modelController(): ModelController {
        return BaseService._modelController;
    }

    private static _regionController = new RegionController();
    protected get regionController(): RegionController {
        return BaseService._regionController;
    }

    private static _userController = new UserController();
    protected get userController(): UserController {
        return BaseService._userController;
    }

    private static _walletController = new WalletController();
    protected get walletController(): WalletController {
        return BaseService._walletController;
    }
}