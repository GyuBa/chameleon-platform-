import * as express from 'express';
import {Application, Request, Response} from 'express';
import * as Dockerode from 'dockerode';
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

    async toPermalLink(repository: string, tag: string) {
        try {
            const tagName = tag.toLowerCase().replaceAll(' ','-');
            const repositoryName = repository.toLowerCase();
            const result = await this.imageController.findImageLikeTag(repositoryName, tagName);
            console.log(repositoryName, tagName);
            console.log('result');
            console.log('result');
            console.log(result);
            if(result.length == 0) {
                return tagName;
            } else {
                console.log('lastIndex');
                const lastIndex: number = await this.getLastIndex(repositoryName, tagName);
                console.log(lastIndex);
                return tagName + '-' + (lastIndex + 1).toString();
            }
        } catch (e) {
            console.error(e);
        }
    }
    //함수 2개 요약 필요 getLastIndex, toPermalLink
    async getLastIndex(repository: string, tags: string) {
        const imageList = await this.imageController.findImageLikeTag(repository, tags);
        const lastImage = imageList[imageList.length - 1];

        if(tags.length == lastImage.tags.length) return 0;
        else {
            const tag = lastImage.tags;
            const index = tag.indexOf(tags);
            const result = tag.slice(index + tags.length + 1, tag.length)
            return parseInt(result);
        }
    }
    async getImageId(req: Request, res: Response, next: Function) {
        const {host, port} = req.body;
        const docker = new Dockerode({host, port});

        try {
            // console.log(await docker.listImages())
            const dockerImage1 = await docker.getImage('express:Dummy');
            const image = await dockerImage1.inspect()
            console.log('dockerImage1-1');
            console.log(image.Id);
            console.log(await (await docker.getImage(image.Id).inspect()))
            console.log(await this.getLastIndex('express', 'Dummy'));
        } catch(e) {
            console.error(e)
        }
        return res.status(200).send(RESPONSE_MESSAGE.OK);
    }

    async handleUpload(req: Request, res: Response, next: Function) {
        const {regionName, modelName, description, inputType, outputType, parameter} = req.body;
        if (!(regionName && modelName && description && inputType && outputType && req.files.file && parameter)) return res.status(501).send(RESPONSE_MESSAGE.NON_FIELD);
        if (!(req.isAuthenticated())) return res.status(501).send(RESPONSE_MESSAGE.NOT_AUTH);

        const region: Region = await this.regionController.findRegionByName(regionName);
        if(!region) return res.status(501).send(RESPONSE_MESSAGE.REG_NOT_FOUND);

        const path = await this.uploadImage(req, res, next);
        const docker = new Dockerode({host: region.host, port:region.port});

        const imageInput: Image = new Image();
        const imageName: string = await this.toPermalLink(req.user['username'], modelName);

        console.log(req.user);
        imageInput.repository = req.user['username'].toLowerCase();
        imageInput.tags = imageName;

        const image = await this.imageController.createImage(imageInput, region);

        try {
            await docker.importImage(path, {repo: req.user['username'].toLowerCase(), tag: imageName});
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
        model.uniqueName = imageName;
        console.log('Model');
        await this.modelController.createModel(model);
        // TODO: as 처리 깔끔하게
        // console.log(await findModelByImage(image));

        console.log(await docker.getImage(imageInput.repository + ':' + imageInput.tags).inspect());
        return res.status(200).send(RESPONSE_MESSAGE.OK);
    }
}
