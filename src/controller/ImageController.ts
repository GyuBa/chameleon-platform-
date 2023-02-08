/* TODO
 [x] create
 [x] find by id, property
 [ ] update
 */

import {source} from "../DataSource";
import {Region} from "../entities/Region";
import {Image} from "../entities/Image";
import {ImageInterface} from "../interface/ImageInterface";

export async function createImage(imageInput: ImageInterface, region: Region) {
    const imageRepository = source.getRepository('Image');
    try {
        const image = new Image();
        image.repository = imageInput.repository;
        image.tags = imageInput.tags;
        image.region = region;
        await imageRepository.save(image);
    } catch (e) {
        console.error(e);
    }
}

export async function findImagenById(id: number) {
    const imageRepository = source.getRepository('Image');
    try {
        return await imageRepository
            .createQueryBuilder('image')
            .select()
            .where('id=:id', {id: id})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

export async function findImageByProperty(tags: string, repository: string) {
    const regionRepository = source.getRepository('Region');
    try {
        return await regionRepository
            .createQueryBuilder('region')
            .select()
            .where('tags = :tags AND repository = :repository', {tags: tags, repository: repository})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}