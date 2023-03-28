import * as express from 'express';
import {Application, Request, Response} from 'express';
import * as Dockerode from 'dockerode';
import {User} from '../../entities/User';
import {DIR_PATH_UPLOADED_IMAGE, RESPONSE_MESSAGE} from '../../constant/Constants';
import {Region} from '../../entities/Region';
import {Image} from '../../entities/Image';
import {Model} from '../../entities/Model';
import {HTTPService} from '../interfaces/http/HTTPService';
import {Server} from 'http';

export class ModelService extends HTTPService {
    init(app: Application, server: Server) {
        const router = express.Router();
        router.post('/upload', this.handleUpload);
        router.get('/list', this.handleList);
        router.put('/update', this.handleUpdate);
        router.put('/execute', this.handleExecute);
        app.use('/model', router);
    }

    async handleExecute(req: Request, res: Response, next: Function) {
        if (!req.isAuthenticated()) res.status(401).send(RESPONSE_MESSAGE.NOT_AUTH);
        const modelId = req.body.modelId;
        const model = await this.modelController.findModelById(modelId);
        if (!model) res.status(401).send(RESPONSE_MESSAGE.WRONG_INFO);
        const image = model.image;
        const region = image.region;
        /* const docker = new Dockerode(region);
        docker.createImage() */
    }

    async handleList(req: Request, res: Response, next: Function) {
        if (!req.isAuthenticated()) res.status(401).send(RESPONSE_MESSAGE.NOT_AUTH);
        const result = await this.modelController.getAllModel();
        return res.status(200).send({result});
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

    async handleUpdate(req: Request, res: Response, next: Function) {
        const {modelId, repository, modelName, description, inputType, outputType} = req.body;

        if (!(modelId && repository && modelName && description && inputType && outputType))
            return res.status(401).send(RESPONSE_MESSAGE.NON_FIELD);
        try {
            const prevModel = await this.modelController.findModelById(modelId);
            await this.modelController.updateModel(modelId, {name: modelName, inputType, outputType, description});
            await this.imageController.updateImage(prevModel.image.id, {repository});
        } catch (e) {
            console.error(e);
            return res.status(501).send(RESPONSE_MESSAGE.SERVER_ERROR);
        }

        return res.status(200).send(RESPONSE_MESSAGE.OK);
    }

    async deleteModel(req: Request, res: Response, next: Function) {
        const {modelId, imageId} = req.body;

        if (!(modelId && imageId)) return res.status(401).send(RESPONSE_MESSAGE.NON_FIELD);
        if (!req.isAuthenticated()) return res.status(401).send(RESPONSE_MESSAGE.NOT_AUTH);

        try {
            await this.modelController.deleteModel(modelId);
            await this.imageController.deleteImage(imageId);
        } catch (e) {
            console.error(e);
            return res.status(501).send(RESPONSE_MESSAGE.SERVER_ERROR);
        }

        return res.status(200).send(RESPONSE_MESSAGE.OK);
    }

    async handleUpload(req: Request, res: Response, next: Function) {
        const {regionName, host, port, repository, tags, modelName, description, inputType, outputType} = req.body;

        if (!(modelName && description && inputType && outputType && req.files.file)) return res.status(501).send(RESPONSE_MESSAGE.NON_FIELD);
        if (!(req.isAuthenticated())) return res.status(501).send(RESPONSE_MESSAGE.NOT_AUTH);

        const path = await this.uploadImage(req, res, next);
        const docker = new Dockerode({host, port});
        let region = await this.regionController.findRegionByHost(host);

        if (region === null) {
            if (!(regionName && host && port))
                return res.status(501).send(RESPONSE_MESSAGE.NON_FIELD);
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
            res.status(501).send(RESPONSE_MESSAGE.SERVER_ERROR);
        }

        const model: Model = new Model();
        model.name = modelName;
        model.description = description;
        model.inputType = inputType;
        model.outputType = outputType;
        model.image = image;
        model.register = await this.userController.findUserById(req.user['id'] as number);

        await this.modelController.createModel(model);
        // TODO: as 처리 깔끔하게
        // console.log(await findModelByImage(image));
        return res.status(200).send(RESPONSE_MESSAGE.OK);
    }
}
