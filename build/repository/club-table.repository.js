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
exports.deleteAllTable = exports.updateTable = exports.getUserAndClubById = exports.updateAndReturnByIdTable = exports.getOneTable = exports.listTable = exports.countTable = exports.insertTable = void 0;
const club_table_entity_1 = require("src/domain/club-table.entity");
function insertTable(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable.save(data);
    });
}
exports.insertTable = insertTable;
function countTable(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable.count(query);
    });
}
exports.countTable = countTable;
function listTable(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable.find(query);
    });
}
exports.listTable = listTable;
function getOneTable(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable.findOne(query);
    });
}
exports.getOneTable = getOneTable;
function updateTable(query, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable.update(query, data);
    });
}
exports.updateTable = updateTable;
function updateAndReturnByIdTable(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable
            .createQueryBuilder()
            .update(club_table_entity_1.ClubTable)
            .set(Object.assign({}, data))
            .where("ID = :id", { id })
            .returning('*')
            .execute();
    });
}
exports.updateAndReturnByIdTable = updateAndReturnByIdTable;
function getUserAndClubById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const clubTableRepository = club_table_entity_1.ClubTable.getRepository();
        const clubTable = yield clubTableRepository
            .createQueryBuilder('table')
            .leftJoinAndSelect('table.CLUB_ID', 'CLUB_DETAILS')
            .where('table.ID = :id', { id: id })
            .getOne();
        return clubTable;
    });
}
exports.getUserAndClubById = getUserAndClubById;
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
function deleteAllTable(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_table_entity_1.ClubTable
            .createQueryBuilder()
            .delete()
            .from(club_table_entity_1.ClubTable)
            .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .returning('*')
            .execute();
    });
}
exports.deleteAllTable = deleteAllTable;
//# sourceMappingURL=club-table.repository.js.map