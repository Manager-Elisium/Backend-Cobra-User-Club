
import { ClubPlay } from "src/domain/club-play.entity";
import { FindOptionsWhere, Not } from "typeorm";

async function createClubPlay(data: any) {
    return await ClubPlay.save(data);
}

async function findOne(data: any) {
    return await ClubPlay.findOneBy(data);
}

async function deleteAndReturnById(id: string) {
    return await ClubPlay
        .createQueryBuilder()
        .delete()
        .from(ClubPlay)
        .where("ID = :ID", { ID: id })
        .returning('*')
        .execute();
}

async function updateAndReturnById(id: string, data: any) {
    return await ClubPlay
        .createQueryBuilder()
        .update(ClubPlay)
        .set({ ...data })
        .where("ID = :id", { id })
        .returning('*')
        .execute();
}

export { createClubPlay, findOne, updateAndReturnById, deleteAndReturnById };