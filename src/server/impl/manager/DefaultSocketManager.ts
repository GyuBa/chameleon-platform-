import SocketManager from "../../manager/SocketManager";
import {DefaultSocket} from "../../../types/chameleon-platform";

export default class DefaultSocketManager extends SocketManager {

    getAllSockets() {
        return this.server?.sockets as DefaultSocket[];
    }


    json(data: any, sockets: DefaultSocket[] = this.getAllSockets()) {
        sockets.forEach(s => s.write(JSON.stringify(data) + '\0'));
    }
}