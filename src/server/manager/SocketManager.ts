import ServerSocketManager from "./ServerSocketManager";
import SocketServer from "../SocketServer";

export default abstract class SocketManager extends ServerSocketManager<SocketServer<any, SocketManager>> {
}