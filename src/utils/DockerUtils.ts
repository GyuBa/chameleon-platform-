import {HTTPService} from "../service/interfaces/http/HTTPService";
import {Image} from "../entities/Image";
import * as Dockerode from "dockerode";

export class DockerUtils {
    static async createContainer(image: Image) {
        const docker = new Dockerode(image.region);
        // const container = await docker.createContainer({Image});
    }
}