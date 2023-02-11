import {source} from '../DataSource';
import {Region} from '../entities/Region';
import {Image} from '../entities/Image';
import {ImageInterface} from '../interface/ImageInterface';
import {ObjectLiteral} from 'typeorm';

export async function createImage(imageInput: ImageInterface, region: ObjectLiteral) {
    const imageRepository = source.getRepository('Image');
    try {
        const image = new Image();
        image.repository = imageInput.repository;
        image.tags = imageInput.tags;
        image.region = region as Region;
        await imageRepository.save(image);
        return image;
    } catch (e) {
        console.error(e);
    }
}

export async function findImageById(id: number) {
    const imageRepository = source.getRepository('Image');
    try {
        return await imageRepository
            .createQueryBuilder('image')
            .select()
            .where('id=:id', {id})
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
            .where('tags=:tags', {tags})
            .andWhere('repository=:repository', {repository})
            .getOne();
        // TODO: where 문법 더 깔끔한거 없는지?
    } catch (e) {
        console.error(e);
    }
}