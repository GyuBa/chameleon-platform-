import HTTPServer from '../HTTPServer';
import * as fs from 'fs';
import {DefaultSocketServer, DefaultWSServer, PlatformConfig} from '../../types/chameleon-platform';
import {DataSource} from "typeorm";
import {PlatformService} from "../../service/interfaces/PlatformService";

export default class PlatformServer {
    static httpServer: HTTPServer;
    static wsServer: DefaultWSServer;
    static socketServer: DefaultSocketServer;
    static config: PlatformConfig;
    private static source: DataSource;

    private constructor() {
        /* empty */
    }

    static init(params: { httpServer: HTTPServer, wsServer: DefaultWSServer, socketServer: DefaultSocketServer }) {
        this.loadConfig();
        this.source = new DataSource(this.config.db);
        PlatformService.init(this.source);

        this.httpServer = params.httpServer;
        this.wsServer = params.wsServer;
        this.socketServer = params.socketServer;
    }

    static loadConfig() {
        // TODO: 장기적으로 DataSource.ts의 서버 설정 부분을 config.json에 포함시킬 것
        if (!fs.existsSync('config.json')) {
            fs.writeFileSync('config.json', JSON.stringify({
                httpPort: 5000,
                socketExternalHost: '',
                socketPort: 5050,
                defaultDockerServer: 'default',
                dockerServers: {default: {host: '', port: 0}},
                db: {
                    type: 'mysql',
                    host: '',
                    port: 0,
                    username: '',
                    password: '',
                    database: '',
                }
            }, null, 4), 'utf8');
        }
        PlatformServer.config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    }

    static async start() {
        try {
            await this.source.initialize();
            console.log('Data Source has been initialized!');
        } catch (error) {
            console.error('Error during Data Source initialization:', error);
        }

        this.httpServer.listen(this.config.httpPort);
        this.socketServer.listen(this.config.socketPort);
    }

    static async stop() {
        await this.source.destroy();
        this.httpServer.close();
        this.socketServer.close();
    }

    static getDockerServer(dockerServer: string) {
        return dockerServer ? this.config.dockerServers[dockerServer] : this.config.dockerServers[this.config.defaultDockerServer];
    }
}

