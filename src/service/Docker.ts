import {Request, Response} from 'express';
import * as Dockerode from 'dockerode';
import {createRegion, findRegionByHost} from '../controller/RegionController';
import {uploadImage} from './ImageUploadService';
import {RegionInterface} from '../interface/RegionInterface';
import {createImage} from '../controller/ImageController';
import {ImageInterface} from '../interface/ImageInterface';
import {createModel} from '../controller/ModelController';
import {ModelInterface} from '../interface/ModelInterface';
import {findUserById} from "../controller/UserController";

export async function importImage(req: Request, res: Response, next: () => void) {
    const {regionName, host, port, repository, tags, modelName, description, inputType, outputType} = req.body;
    const path = await uploadImage(req);
    const docker = new Dockerode({host, port});
    let region = await findRegionByHost(host);

    if (region === null) {
        const regionInput: RegionInterface = {
            name: regionName,
            host,
            port
        } as RegionInterface;
        region = createRegion(regionInput);
    }

    const imageInput: ImageInterface = {
        repository,
        tags
    } as ImageInterface;
    const image = await createImage(imageInput, region);

    try {
        await docker.importImage(path, {repo: repository, tag: tags});
    } catch (e) {
        console.error(e);
        res.status(501).send({
            'msg': 'something_was_wrong'
        });
    }

    const modelInput: ModelInterface = {
        name: modelName,
        description,
        inputType,
        outputType
    } as ModelInterface;
    await createModel(modelInput, image, await findUserById(req.user['id']));
    // console.log(await findModelByImage(image));
    res.status(200).send({'msg': 'ok'});
}
