"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllTransaction = exports.getAllTransactionAgent = exports.getAllTransactionPlayer = exports.getAllTransactionOwner = exports.getTransactionPlayer = exports.getTransactionOwner = exports.insertManyTransaction = void 0;
const chip_transaction_entity_1 = require("src/domain/chip-transaction.entity");
const club_user_entity_1 = require("src/domain/club-user.entity");
function insertManyTransaction(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.insert(data);
    });
}
exports.insertManyTransaction = insertManyTransaction;
function getTransactionOwner(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.find({
            where: [{ SENDER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE },
                { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE }],
            relations: ['SENDER', 'RECEIVER'],
            // take: query.TAKE,
            // skip: query.SKIP,
            order: {
                CREATED_DATE: "DESC",
            }
        });
    });
}
exports.getTransactionOwner = getTransactionOwner;
function getAllTransactionOwner(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.find({
            where: [{ SENDER: { ID: query.SENDER_ID } },
                { RECEIVER: { ID: query.SENDER_ID } }],
            relations: ['SENDER', 'RECEIVER'],
            order: {
                CREATED_DATE: "DESC",
            }
        });
    });
}
exports.getAllTransactionOwner = getAllTransactionOwner;
function getAllTransactionAgent(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.find({
            where: [{ SENDER: { ID: query.SENDER_ID, TYPE: club_user_entity_1.UserType.AGENT } },
                { RECEIVER: { ID: query.SENDER_ID } }],
            relations: ['SENDER', 'RECEIVER'],
            order: {
                CREATED_DATE: "DESC",
            }
        });
    });
}
exports.getAllTransactionAgent = getAllTransactionAgent;
function getTransactionPlayer(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.find({
            where: { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE },
            relations: ['SENDER', 'RECEIVER'],
            order: {
                CREATED_DATE: "DESC",
            }
        });
    });
}
exports.getTransactionPlayer = getTransactionPlayer;
function getAllTransactionPlayer(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_transaction_entity_1.ChipTransaction.find({
            where: { RECEIVER: { ID: query.SENDER_ID }, TRANSACTION_TYPE: query.TRANSACTION_TYPE },
            relations: ['SENDER', 'RECEIVER'],
            order: {
                CREATED_DATE: "DESC",
            }
        });
    });
}
exports.getAllTransactionPlayer = getAllTransactionPlayer;
function deleteAllTransaction(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        const userIds = yield userClubRepository
            .createQueryBuilder('userClub')
            .where('userClub.CLUB_ID = :CLUB_ID', { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .getMany();
        const userIdArray = userIds.map(userClub => userClub.ID);
        return yield chip_transaction_entity_1.ChipTransaction
            .createQueryBuilder()
            .delete()
            .from(chip_transaction_entity_1.ChipTransaction)
            .where("RECEIVER IN (:...userIds)", { userIds: userIdArray })
            .orWhere("SENDER IN (:...userIds)", { userIds: userIdArray })
            .execute();
    });
}
exports.deleteAllTransaction = deleteAllTransaction;
//# sourceMappingURL=chip-transaction.repository.js.map