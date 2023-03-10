import {Region} from '../entities/Region';
import {Image} from '../entities/Image';
import {ObjectLiteral} from 'typeorm';
import {BaseController} from './interfaces/BaseController';

export class ImageController extends BaseController<Image>{
    constructor() {
        super(Image);
    }

    async createImage(imageInput: Image, region: ObjectLiteral) {
        try {
            const image = new Image();
            image.repository = imageInput.repository;
            image.tags = imageInput.tags;
            image.region = region as Region;
            await this.repository.save(image);
            return image;
        } catch (e) {
            console.error(e);
        }
    }

    async findImageById(id: number) {
        try {
            return await this.repository
                .createQueryBuilder('image')
                .select()
                .where('id=:id', {id})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    async findImageByProperty(tags: string, repository: string) {
        try {
            return await this.repository
                .createQueryBuilder('region')
                .select()
                .where('tags=:tags', {tags})
                .andWhere('repository=:repository', {repository})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    async updateImage(imageId: number, imageData: { repository: string }) {
        const {repository} = imageData;

        try {
            const image = await this.findImageById(imageId);
            await this.repository
                .createQueryBuilder('image')
                .update(image)
                .set({
                    repository: repository
                })
        } catch (e) {
            console.error(e);
        }
    }
}