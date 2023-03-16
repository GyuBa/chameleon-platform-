import {DefaultSocket, DefaultSocketServer, SocketHandler} from "../../../types/chameleon-platform";
import {BaseService} from "../../../service/interfaces/BaseService";


export default class DefaultSocketHandler extends BaseService implements SocketHandler<DefaultSocketServer, DefaultSocket> {
    onReady(server: DefaultSocketServer, socket: DefaultSocket) {
        /* empty */
    }

    onData(server: DefaultSocketServer, socket: DefaultSocket, data: Buffer) {
        /* empty */
    }


    onClose(server: DefaultSocketServer, socket: DefaultSocket, hadError: boolean) {
        /* empty */
    }
}

