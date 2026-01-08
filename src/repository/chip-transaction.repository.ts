import { ChipTransaction, TransactionType } from "src/domain/chip-transaction.entity";
import { UserClub, UserType } from "src/domain/club-user.entity";

async function insertManyTransaction(data: []) {
    return await ChipTransaction.insert(data);
}

async function getTransactionOwner(query: any) {
    return await ChipTransaction.find({
        where: [{ SENDER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE }, 
            { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE }],
        relations: ['SENDER', 'RECEIVER'],
        // take: query.TAKE,
        // skip: query.SKIP,
        order: {
            CREATED_DATE: "DESC",
        }
    })
}


async function getAllTransactionOwner(query: any) {
    return await ChipTransaction.find({
        where: [{ SENDER: { ID: query.SENDER_ID } }, 
            { RECEIVER: { ID: query.SENDER_ID }}],
        relations: ['SENDER', 'RECEIVER'],
        order: {
            CREATED_DATE: "DESC",
        }
    })
}


async function getAllTransactionAgent(query: any) {
    return await ChipTransaction.find({
        where: [{ SENDER: { ID: query.SENDER_ID, TYPE: UserType.AGENT } }, 
            { RECEIVER: { ID: query.SENDER_ID }}],
        relations: ['SENDER', 'RECEIVER'],
        order: {
            CREATED_DATE: "DESC",
        }
    })
}

async function getTransactionPlayer(query: any) {
    return await ChipTransaction.find({
        where: { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE },
        relations: ['SENDER', 'RECEIVER'],
        order: {
            CREATED_DATE: "DESC",
        }
    })
}


async function getAllTransactionPlayer(query: any) {
    return await ChipTransaction.find({
        where: { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE },
        relations: ['SENDER', 'RECEIVER'],
        order: {
            CREATED_DATE: "DESC",
        }
    })
}

async function deleteAllTransaction(query: any) {
    const userClubRepository = UserClub.getRepository();
    const userIds = await userClubRepository
        .createQueryBuilder('userClub')
        .where('userClub.CLUB_ID = :CLUB_ID', { CLUB_ID: query?.CLUB_ID })
        .getMany();   
    const userIdArray = userIds.map(userClub => userClub.ID);
    return await ChipTransaction
        .createQueryBuilder()
        .delete()
        .from(ChipTransaction)
        .where("RECEIVER IN (:...userIds)", { userIds: userIdArray })
        .orWhere("SENDER IN (:...userIds)", { userIds: userIdArray })
        .execute()
}

export { insertManyTransaction, getTransactionOwner, getTransactionPlayer, getAllTransactionOwner, getAllTransactionPlayer, getAllTransactionAgent, deleteAllTransaction };
