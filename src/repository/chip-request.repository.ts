import { ChipRequest } from "src/domain/chip-request.entity";
import { In } from "typeorm";

async function insertOneChip(data: any) {
    return await ChipRequest.insert(data);
}

async function getRequestChip(query: any) {
    return await ChipRequest.find({
        where: { RECEIVER_CLUB_USER_ID: { ID: query.USER_CLUB_ID } },
        relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID']
    })
}

async function deleteChipRequest(data: any) {
    return await ChipRequest
        .createQueryBuilder()
        .delete()
        .from(ChipRequest)
        .where({ REQUEST_ID: In(data?.ID) })
        .returning('*')
        .execute();
}

async function getChipRequestList(data: any) {
    return await ChipRequest.find({ 
        where: { REQUEST_ID: In(data?.ID) },
        relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID'] 
    });
}


async function countChipRequestClubUser(query: any) {
    return await ChipRequest.count({
        where: { RECEIVER_CLUB_USER_ID: { ID: query.USER_CLUB_ID } },
        relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID']
    })
}


async function deleteAllChipRequest(query: any) {
    return await ChipRequest
        .createQueryBuilder()
        .delete()
        .from(ChipRequest)
        .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query?.CLUB_ID })
        .returning('*')
        .execute();

}

export { insertOneChip, getRequestChip, deleteChipRequest, getChipRequestList, countChipRequestClubUser, deleteAllChipRequest };