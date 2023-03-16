export default class ServerSocketManager<Server> {
    protected server?: Server;

    init(server: Server) {
        this.server = server;
    }
}