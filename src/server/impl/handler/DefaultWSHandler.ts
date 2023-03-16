import {RawData} from "ws";
import {DefaultWSocket, DefaultWSServer, WebSocketHandler} from "../../../types/chameleon-platform";
import {BaseService} from "../../../service/interfaces/BaseService";


export default class DefaultWSHandler extends BaseService implements WebSocketHandler<DefaultWSServer, DefaultWSocket> {
    onReady(server: DefaultWSServer, socket: DefaultWSocket) {
        /* empty */
    }

    onMessage(server: DefaultWSServer, socket: DefaultWSocket, rawData: RawData, isBinary: boolean) {
        /* empty */
    }

    onClose(server: DefaultWSServer, socket: DefaultWSocket, code: number, reason: Buffer) {
        /* empty */
    }
}

