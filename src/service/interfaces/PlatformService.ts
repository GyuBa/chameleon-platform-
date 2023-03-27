import {ImageController} from '../../controller/ImageController';
import {ModelController} from '../../controller/ModelController';
import {WalletController} from '../../controller/WalletController';
import {UserController} from '../../controller/UserController';
import {RegionController} from '../../controller/RegionController';
import {DataSource} from "typeorm";
import {SessionController} from "../../controller/SessionController";

export abstract class PlatformService {
    private static _imageController;
    protected get imageController(): ImageController {
        return PlatformService._imageController;
    }

    private static _modelController;
    protected get modelController(): ModelController {
        return PlatformService._modelController;
    }

    private static _regionController;
    protected get regionController(): RegionController {
        return PlatformService._regionController;
    }

    private static _sessionController;
    protected get sessionController(): SessionController {
        return PlatformService._sessionController;
    }


    private static _userController;
    protected get userController(): UserController {
        return PlatformService._userController;
    }

    private static _walletController;
    protected get walletController(): WalletController {
        return PlatformService._walletController;
    }

    public static init(source: DataSource) {
        this._imageController = new ImageController(source);
        this._modelController = new ModelController(source);
        this._regionController = new RegionController(source);
        this._sessionController = new SessionController(source);
        this._userController = new UserController(source);
        this._walletController = new WalletController(source);
    }
}