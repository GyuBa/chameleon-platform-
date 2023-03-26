import HTTPServer from '../HTTPServer';
import * as fs from 'fs';
import {DefaultSocketServer, DefaultWSServer, PlatformConfig} from '../../types/chameleon-platform';

export default class PlatformServer {
    static httpServer: HTTPServer;
    static wsServer: DefaultWSServer;
    static socketServer: DefaultSocketServer;
    static config: PlatformConfig;

    private constructor() {
        /* empty */
    }

    static init(params: { httpServer: HTTPServer, wsServer: DefaultWSServer, socketServer: DefaultSocketServer }) {
        this.httpServer = params.httpServer;
        this.wsServer = params.wsServer;
        this.socketServer = params.socketServer;
        this.loadConfig();
    }

    static loadConfig() {
        // TODO: 장기적으로 DataSource.ts의 서버 설정 부분을 config.json에 포함시킬 것
        if (!fs.existsSync('config.json')) {
            fs.writeFileSync('config.json', JSON.stringify({
                httpPort: 5000,
                socketExternalHost: '',
                socketPort: 5050,
                defaultDockerServer: 'default',
                dockerServers: {default: {host: '', port: 0}}
            }, null, 4), 'utf8');
        }
        PlatformServer.config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    }

    static listen() {
        this.httpServer.listen(this.config.httpPort);
        this.socketServer.listen(this.config.socketPort);
    }

    static close() {
        this.httpServer.close();
        this.socketServer.close();
    }

    static getDockerServer(dockerServer: string) {
        return dockerServer ? this.config.dockerServers[dockerServer] : this.config.dockerServers[this.config.defaultDockerServer];
    }
}

