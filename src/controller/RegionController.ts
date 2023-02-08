/* TODO
 [x] create
 [x] find by name, host, id
 [ ] update
 */

import {RegionInterface} from "../interface/RegionInterface";
import {source} from "../DataSource";
import {Region} from "../entities/Region";

export async function createRegion(regionInput: RegionInterface) {
    const regionRepository = source.getRepository('Region');
    try {
        const region = new Region();
        region.name = regionInput.name;
        region.host = regionInput.host;
        region.port = regionInput.port;
        await regionRepository.save(region);
    } catch (e) {
        console.error(e);
    }
}

export async function findRegionById(id: number) {
    const regionRepository = source.getRepository('Region');
    try {
        return await regionRepository
            .createQueryBuilder('region')
            .select()
            .where('id=:id', {id: id})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

export async function findRegionByName(name: string) {
    const regionRepository = source.getRepository('Region');
    try {
        return await regionRepository
            .createQueryBuilder('region')
            .select()
            .where('name=:name', {name: name})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}

export async function findRegionByHost(port: number) {
    const regionRepository = source.getRepository('Region');
    try {
        return await regionRepository
            .createQueryBuilder('region')
            .select()
            .where('port=:port', {port: port})
            .getOne();
    } catch (e) {
        console.error(e);
    }
}
