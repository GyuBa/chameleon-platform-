import {Request, Response} from 'express';
import * as Dockerode from 'dockerode';
import {User} from '../../entities/User';
import {DIR_PATH_UPLOADED_IMAGE} from '../../constant/Constants';
import {Region} from '../../entities/Region';
import {Image} from '../../entities/Image';
import {Model} from '../../entities/Model';
import {RouteService} from '../interfaces/route/RouteService';

// TODO: 이름으로 ModelService와 "model/" path를 사용하는 것이 낫지 않은지?
export class UploadService extends RouteService {
    initRouter() {
        this.router.post('/image', this.importImage);
    }

    async uploadImage(req: Request, res: Response, next: Function) {
        const uploadFile = req.files.file;
        console.log(uploadFile);
        console.log(DIR_PATH_UPLOADED_IMAGE);
        if ('mv' in uploadFile) {
            const path = 'uploads/' + uploadFile.name;
            await uploadFile?.mv(
                path,
                function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            return path;
        }
        return '';
    }

    async importImage(req: Request, res: Response, next: Function) {
        const {regionName, host, port, repository, tags, modelName, description, inputType, outputType} = req.body;
        const path = await this.uploadImage(req, res, next);
        const docker = new Dockerode({host, port});
        let region = await this.regionController.findRegionByHost(host);

        if (region === null) {
            const regionInput: Region = new Region();
            regionInput.name = regionName;
            regionInput.host = host;
            regionInput.port = port;
            region = await this.regionController.createRegion(regionInput);
        }

        const imageInput: Image = new Image();
        imageInput.repository = repository;
        imageInput.tags = tags;

        const image = await this.imageController.createImage(imageInput, region);

        try {
            await docker.importImage(path, {repo: repository, tag: tags});
        } catch (e) {
            console.error(e);
            res.status(501).send({
                'msg': 'something_was_wrong'
            });
        }

        const modelInput: Model = new Model();
        modelInput.name = modelName;
        modelInput.description = description;
        modelInput.inputType = inputType;
        modelInput.outputType = outputType;

        await this.modelController.createModel(modelInput, image, await this.userController.findUserById(req.user['id'] as number) as User);
        // TODO: as 처리 깔끔하게
        // console.log(await findModelByImage(image));
        res.status(200).send({'msg': 'ok'});
    }
}
