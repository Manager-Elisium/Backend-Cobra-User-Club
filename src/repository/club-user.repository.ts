import { UserClub, UserType } from "src/domain/club-user.entity";
import { In } from "typeorm";


async function createUserClub(data: any) {
    return await UserClub.save(data);
}


async function listUserClub(query: any) {
    const userClubRepository = UserClub.getRepository();
    const result = await userClubRepository
        .createQueryBuilder('userClub')
        .where('userClub.USER_ID = :userId', { userId: query.USER_ID })
        .andWhere('userClub.IS_DELETE = false')
        .select([
            'userClub.TYPE as USER_TYPE',
            'club.ID as CLUB_ID',
            'club.SEARCH_ID as SEARCH_ID',
            'club.NAME as CLUB_NAME',  //'COUNT(userClub.TYPE) as count'
            'club.AVATAR as CLUB_AVATAR',
            'club.COUNTRY_CODE as COUNTRY_CODE',
            'club.USER_ID as USER_ID'
        ])
        .groupBy('userClub.TYPE, club.ID')
        .leftJoin('userClub.CLUB_ID', 'club')
        .orderBy('club.CREATED_DATE', 'ASC')
        .getRawMany();

    return result;
}


async function playerUserClub(query: any) {
    const userClubRepository = UserClub.getRepository();
    const result = await userClubRepository
        .createQueryBuilder('userClub')
        .where('userClub.USER_ID = :userId', { userId: query.USER_ID })
        .andWhere('userClub.TYPE IN (:...types)', {
            types: [UserType.PLAYER, UserType.AGENT]
        })
        .andWhere('userClub.IS_DELETE = false')
        .select([
            'club.ID as CLUB_ID'
        ])
        .groupBy('club.ID')
        .leftJoin('userClub.CLUB_ID', 'club')
        .getRawMany();
    return result;
}



async function getUserDetailClub(query: any) {
    return await UserClub.find(query);
}


async function getTypeSumByClubIdForOwner(clubId: string): Promise<{ TYPE: string; CHIP: number; AGENT_CHIP: number }[]> {
    const userClubRepository = UserClub.getRepository();
    return await userClubRepository.createQueryBuilder('user_club')
        .select('user_club.TYPE', 'TYPE')
        .addSelect('SUM(user_club.CHIP)', 'CHIP')
        .addSelect('SUM(user_club.AGENT_CHIP)', 'AGENT_CHIP')
        .where('user_club.CLUB_ID = :clubId', { clubId })
        .andWhere('user_club.IS_DELETE = false')
        .groupBy('user_club.TYPE')
        .getRawMany();
}

async function getTypeSumByClubIdForAgent(clubId: string, agentId: string): Promise<{ TYPE: string; CHIP: number }[]> {
    const userClubRepository = UserClub.getRepository();
    return await userClubRepository.createQueryBuilder('user_club')
        .select('user_club.TYPE', 'TYPE')
        .addSelect('SUM(user_club.CHIP)', 'CHIP')
        .where('user_club.CLUB_ID = :clubId', { clubId })
        .andWhere('user_club.REFERRED_ID = :agentId', { agentId })
        .andWhere('user_club.IS_DELETE = false')
        .groupBy('user_club.TYPE')
        .getRawMany();
}

async function getTypeSumByClubIdForPlayer(clubId: string, userId: string): Promise<{ TYPE: string; CHIP: number }[]> {
    const userClubRepository = UserClub.getRepository();
    return await userClubRepository.createQueryBuilder('user_club')
        .select('user_club.TYPE', 'TYPE')
        .addSelect('SUM(user_club.CHIP)', 'CHIP')
        .where('user_club.CLUB_ID = :clubId', { clubId })
        .andWhere('user_club.USER_ID = :clubId', { userId })
        .andWhere('user_club.IS_DELETE = false')
        .groupBy('user_club.TYPE')
        .getRawMany();
}

async function getUserType(query: any) {
    return await UserClub.findOne(query);
}

async function updateUser(query: any, data: UserClub) {
    return await UserClub.update(query, data);
}

async function addChip(data: any, condition: any) {
    return await UserClub
        .createQueryBuilder()
        .update(UserClub)
        .returning('*')
        .set({ CHIP: () => `CHIP + ${Number(data?.CHIP) ?? 0}` })
        .where({ID : In(condition?.ID)})
        .execute();
}

async function subtractChip(data: any, condition: any) {
    return await UserClub
        .createQueryBuilder()
        .update(UserClub)
        .set({ CHIP: () => `CHIP - ${Number(data?.CHIP) ?? 0}` })
        .where({ID : In(condition?.ID)})
        .execute();
}

async function addAgentChip(data: any, condition: any) {
    return await UserClub
        .createQueryBuilder()
        .update(UserClub)
        .returning('*')
        .set({ AGENT_CHIP: () => `AGENT_CHIP + ${Number(data?.CHIP) ?? 0}` })
        .where({ID : In(condition?.ID)})
        .execute();
}

async function subtractAgentChip(data: any, condition: any) {
    return await UserClub
        .createQueryBuilder()
        .update(UserClub)
        .returning('*')
        .set({ AGENT_CHIP: () => `AGENT_CHIP - ${Number(data?.CHIP) ?? 0}` })
        .where({ID : In(condition?.ID)})
        .execute();
}

async function deleteUserClub(query: any) {
    return await UserClub
        .createQueryBuilder()
        .delete()
        .from(UserClub)
        .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query?.CLUB_ID })
        .execute()
}

export { createUserClub, listUserClub, playerUserClub, getUserDetailClub, updateUser, getTypeSumByClubIdForOwner,
    getTypeSumByClubIdForAgent, getTypeSumByClubIdForPlayer, getUserType, addChip, subtractChip, deleteUserClub, addAgentChip, subtractAgentChip }