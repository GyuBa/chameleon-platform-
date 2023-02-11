import {Region} from '../entities/Region';
import {BaseController} from './interfaces/BaseController';

export class RegionController extends BaseController<Region> {
    constructor() {
        super(Region);
    }

    async createRegion(regionInput: Region) {
        try {
            const region = new Region();
            region.name = regionInput.name;
            region.host = regionInput.host;
            region.port = regionInput.port;
            await this.repository.save(region);
            return region;
        } catch (e) {
            console.error(e);
        }
    }

    async findRegionById(id: number) {
        try {
            return await this.repository
                .createQueryBuilder('region')
                .select()
                .where('id=:id', {id})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    async findRegionByHost(host: string) {
        try {
            return await this.repository
                .createQueryBuilder('region')
                .select()
                .where('host=:host', {host})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }

    async findRegionByPort(port: number) {
        try {
            return await this.repository
                .createQueryBuilder('region')
                .select()
                .where('port=:port', {port})
                .getOne();
        } catch (e) {
            console.error(e);
        }
    }
}