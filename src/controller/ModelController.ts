import {source} from '../DataSource';
import {Model} from '../entities/Model';
import {Image} from '../entities/Image';
import {ModelInterface} from '../interface/ModelInterface';
import {User} from '../entities/User';

export async function createModel(modelInput: ModelInterface, image: Image, user: User) {
    const modelRepository = source.getRepository('Model');
    try {
        const model = new Model();
        model.name = modelInput.name;
        model.description = modelInput.description;
        model.inputType = modelInput.inputType;
        model.outputType = modelInput.outputType;
        model.register = user;
        model.image = image;
        await modelRepository.save(model);
        return model;
    } catch (e) {
        console.error(e);
    }
}

export async function findModelById(id: number) {
    const modelRepository = source.getRepository('Model');
    try {
        return await modelRepository
            .createQueryBuilder('model')
            .select()
            .where('id=:id', {id})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

//image update 시 update 가 아니라 기존 image 재 등록
export async function findModelByImage(image: Image) {
    const modelRepository = source.getRepository(Model);
    try {
        return await modelRepository
            .createQueryBuilder('model')
            .select('model')
            .where('imageId=:id', image)
            .getOne();
    } catch (e) {
        console.error(e);
    }
}