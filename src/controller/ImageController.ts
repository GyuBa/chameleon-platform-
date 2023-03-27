import {Region} from '../entities/Region';
import {Image} from '../entities/Image';
import {DataSource, ObjectLiteral} from 'typeorm';
import {BaseController} from './interfaces/BaseController';

export class ImageController extends BaseController<Image> {
    constructor(source: DataSource) {
        super(source, Image);
    }

    async createImage(imageInput: Image, region: Region) {
        try {
            const image = new Image();
            image.repository = imageInput.repository;
            image.tags = imageInput.tags;
            image.region = region;
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

    async findImageByName(name: string) {
        try {
            return await this.repository
                .createQueryBuilder()
                .select()
                .where('name=:name', {name})
                .getMany();
        } catch (e) {
            console.error(e)
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
                });
        } catch (e) {
            console.error(e);
        }
    }

    async deleteImage(imageId: number) {

        try {
            await this.repository
                .createQueryBuilder()
                .delete()
                .from(Image)
                .where('id=:id', {id: imageId})
                .execute();
        } catch (e) {
            console.error(e);
        }
    }
}