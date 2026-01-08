import { Club } from "src/domain/club.entity";


async function insertClub(data: any) {
    return await Club.save(data);
}


async function countClub(query: any) {
    return await Club.count(query);
}


async function deleteClub(id: string) {
    return await Club.createQueryBuilder()
        .delete()
        .from(Club)
        .where("CLUB_ID = :CLUB_ID", { CLUB_ID: id })
        .execute();
}



async function getClub(query: any) {
    // TODO ::: If alerady member
    console.log(" Query ::: ", query)
    const clubRepository = Club.getRepository();
    return await clubRepository.createQueryBuilder('club')
        // .where('club.CLUB_ID NOT IN (:...clubIds)', {
        //     clubIds: query.listClubId
        // })
        .where('LOWER(club.NAME) LIKE LOWER(:nameKeyword) OR club.SEARCH_ID = :searchId', {
            nameKeyword: `%${query.name}%`,
            searchId: `%${query.id}%`
        })
        .getMany();
}


async function getOneClub(query: any) {
    return await Club.findOne(query);
}

async function updateAndReturnById(id: string, data: Club) {
    return await Club
        .createQueryBuilder()
        .update(Club)
        .set({ ...data })
        .where("ID = :id", { id })
        .returning('*')
        .execute();
}


async function deleteClubs(query: any) {
    return await Club.createQueryBuilder()
        .delete()
        .from(Club)
        .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query?.CLUB_ID })
        .execute();
}

export { insertClub, countClub, deleteClub, getClub, getOneClub, updateAndReturnById, deleteClubs }