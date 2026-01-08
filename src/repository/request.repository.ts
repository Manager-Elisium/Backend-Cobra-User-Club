import { Request } from "src/domain/request.entity";


async function countRequestClub(query: any) {
    return await Request.count(query);
}

async function createRequestClub(data: any) {
    return await Request.save(data);
}


async function requestedClubUser(query: any) {
    return await Request.find({
        where: { REQUEST_FROM_USER_ID: query.USER_ID },
        relations: ['REQUEST_TO_CLUB_ID']
    });
}


async function requestedCount(query: any) {
    return await Request.count({
        where: { REQUEST_FROM_USER_ID: query.USER_ID }
    });
}

async function deleteClubRequest(id: string) {
    return await Request.createQueryBuilder()
        .delete()
        .from(Request)
        .returning('*')
        .where("REQUEST_ID = :REQUEST_ID", { REQUEST_ID: id })
        .execute();
}

async function requestedUserListClub(query: any) {
    return await Request.find({
        where: { REQUEST_TO_CLUB_ID: { CLUB_ID: query.CLUB_ID } },
        relations: ['REQUEST_TO_CLUB_ID']
    })
}

async function deleteRequestClub(query: any) {
    return await Request
        .createQueryBuilder()
        .delete()
        .from(Request)
        .where("REQUEST_TO_CLUB_ID = :CLUB_ID", { CLUB_ID: query?.CLUB_ID })
        .execute();
}

// async function invitedClubUser(query: any) {
//     return await ClubRequest.find({
//         where: { REQUESTED_USER_ID: query.REQUESTED_USER_ID },
//         relations: ['INVITED']
//     })
// }


// async function countInvitedClubUser(query: any) {
//     return await ClubRequest.count({
//         where: { INVITED_USER_ID: query.USER_ID },
//         relations: ['INVITED']
//     })
// }

// async function clubUser(query: any) {
//     return await ClubRequest.find(query)
// }


// async function invitationsCount(query: any) {
//     return await ClubRequest.count({
//         where: { INVITED_USER_ID: query.USER_ID }
//     });
// }

// async function deleteClubRequestByClub(data: any) {
//     return await ClubRequest.createQueryBuilder()
//         .delete()
//         .from(ClubRequest)
//         .returning('*')
//         .where("INVITED_USER_ID = :INVITED_USER_ID", { INVITED_USER_ID: data.INVITED_USER_ID })
//         .andWhere('INVITED = :INVITED', { INVITED: data.INVITED })
//         .execute();
// }

export {
    countRequestClub, createRequestClub, requestedClubUser, requestedCount,
    deleteClubRequest, requestedUserListClub, deleteRequestClub
    // invitedClubUser, clubUser,
    // invitationsCount, deleteClubRequestByClub,
    // countInvitedClubUser
};