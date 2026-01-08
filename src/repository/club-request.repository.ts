import { ClubRequest } from "src/domain/club-request.entity";


async function countRequestClub(query: any) {
    return await ClubRequest.count(query);
}

async function createRequestClub(data: any) {
    return await ClubRequest.save(data);
}

/**
 * @deprecated
 * 
 */
async function requestedClubUser(query: any) {
    return await ClubRequest.find({
        where: { INVITED_USER_ID: query.INVITED_USER_ID },
        relations: ['INVITED']
    })
}

async function invitedClubUser(query: any) {
    return await ClubRequest.find({
        where: { INVITED_USER_ID: query.REQUESTED_USER_ID },
        relations: ['INVITED']
    })
}


async function countInvitedClubUser(query: any) {
    return await ClubRequest.count({
        where: { INVITED_USER_ID: query.USER_ID },
        relations: ['INVITED']
    })
}

async function clubUser(query: any) {
    return await ClubRequest.find(query)
}

async function requestedCount(query: any) {
    return await ClubRequest.count({
        where: { REQUESTED_USER_ID: query.USER_ID }
    });
}

async function invitationsCount(query: any) {
    return await ClubRequest.count({
        where: { INVITED_USER_ID: query.USER_ID }
    });
}


async function deleteClubRequest(id: string) {
    return await ClubRequest.createQueryBuilder()
        .delete()
        .from(ClubRequest)
        .returning('*')
        .where("REQUEST_ID = :REQUEST_ID", { REQUEST_ID: id })
        .execute();
}

async function deleteClubRequestByClub(data: any) {
    return await ClubRequest.createQueryBuilder()
        .delete()
        .from(ClubRequest)
        .returning('*')
        .where("INVITED_USER_ID = :INVITED_USER_ID", { INVITED_USER_ID: data.INVITED_USER_ID })
        .andWhere('INVITED = :INVITED', { INVITED: data.INVITED })
        .execute();
}

async function deleteAllClubRequest(data: any) {
    return await ClubRequest.createQueryBuilder()
        .delete()
        .from(ClubRequest)
        .where('INVITED = :INVITED', { INVITED: data.CLUB_ID })
        .execute();
}

export {
    countRequestClub, createRequestClub, requestedClubUser, invitedClubUser, clubUser,
    requestedCount, invitationsCount, deleteClubRequest, deleteClubRequestByClub,
    countInvitedClubUser, deleteAllClubRequest
};