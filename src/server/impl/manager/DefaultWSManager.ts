import WSManager from "../../manager/WSManager";
import {DefaultWSocket} from "../../../types/chameleon-platform";

export default class DefaultWSManager extends WSManager {
    json(data: any, sockets: DefaultWSocket[] = this.getAllSockets()) {
        sockets.forEach(s => s.send(JSON.stringify(data)));
    }

    getAllSockets() {
        return this.server?.sockets as DefaultWSocket[];
    }
}