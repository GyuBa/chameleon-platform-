import {Request, Response} from "express";
import * as Dockerode from "dockerode";
import {createRegion, findRegionByHost} from "../controller/RegionController";
import {uploadImage} from "./ImageUploadService";
import {RegionInterface} from "../interface/RegionInterface";
import {createImage} from "../controller/ImageController";
import {ImageInterface} from "../interface/ImageInterface";

export async function importImage(req: Request, res: Response, next: Function) {
    const {name, host, port, repository, tags} = req.body;
    const path = await uploadImage(req);
    const docker = new Dockerode({host: host, port: port});
    let region = await findRegionByHost(host);
    if(region === null) {
        const regionInput: RegionInterface = {
            name,
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
    console.log(image);
    console.log(path);
    console.log(region);
}