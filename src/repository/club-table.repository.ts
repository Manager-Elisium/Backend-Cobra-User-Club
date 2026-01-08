import { ClubTable } from "src/domain/club-table.entity";


async function insertTable(data: any) {
    return await ClubTable.save(data);
}


async function countTable(query: any) {
    return await ClubTable.count(query);
}

async function listTable(query: any) {
    return await ClubTable.find(query)
}


async function getOneTable(query: any) {
    return await ClubTable.findOne(query)
}

async function updateTable(query: any, data: any) {
    return await ClubTable.update(query, data);
}


async function updateAndReturnByIdTable(id: string, data: any) {
    return await ClubTable
        .createQueryBuilder()
        .update(ClubTable)
        .set({ ...data })
        .where("ID = :id", { id })
        .returning('*')
        .execute();
}


async function getUserAndClubById(id: string) {
    const clubTableRepository = ClubTable.getRepository();
    const clubTable = await clubTableRepository
        .createQueryBuilder('table')
        .leftJoinAndSelect('table.CLUB_ID', 'CLUB_DETAILS')
        .where('table.ID = :id', { id: id })
        .getOne();
    return clubTable;
}

// localhost:3002/season/get-season-reward
//   const seasonRepository = Season.getRepository();
//   const season = await seasonRepository
//       .createQueryBuilder('user')
//       .leftJoinAndSelect('user.REWARDS', 'REWARDS')
//       .where('user.START_DATE >= :startDate', { startDate: query.startDate })
//       .andWhere('user.END_DATE <= :endDate', { endDate: query.endDate })
//       .andWhere('user.IS_DELETED = false')
//       .andWhere('REWARDS.IS_DELETED = false')
//       .orderBy('REWARDS.LEVEL', 'ASC')
//       .getOne();
//   return season;


async function deleteAllTable(query: any) {
    return await ClubTable
        .createQueryBuilder()
        .delete()
        .from(ClubTable)
        .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query?.CLUB_ID })
        .returning('*')
        .execute();
}

export { insertTable, countTable, listTable, getOneTable, updateAndReturnByIdTable, getUserAndClubById, updateTable, deleteAllTable };