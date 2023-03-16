import WSServer from '../WSServer';
import ServerSocketManager from './ServerSocketManager';

export default abstract class WSManager extends ServerSocketManager<WSServer<any, WSManager>> {
}