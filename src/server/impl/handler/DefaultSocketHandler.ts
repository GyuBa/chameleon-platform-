import {DefaultSocket, DefaultSocketServer, SocketHandler} from '../../../types/chameleon-platform';
import {PlatformService} from '../../../service/interfaces/PlatformService';


export default class DefaultSocketHandler extends PlatformService implements SocketHandler<DefaultSocketServer, DefaultSocket> {
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

