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
exports.deleteClubs = exports.updateAndReturnById = exports.getOneClub = exports.getClub = exports.deleteClub = exports.countClub = exports.insertClub = void 0;
const club_entity_1 = require("src/domain/club.entity");
function insertClub(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club.save(data);
    });
}
exports.insertClub = insertClub;
function countClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club.count(query);
    });
}
exports.countClub = countClub;
function deleteClub(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club.createQueryBuilder()
            .delete()
            .from(club_entity_1.Club)
            .where("CLUB_ID = :CLUB_ID", { CLUB_ID: id })
            .execute();
    });
}
exports.deleteClub = deleteClub;
function getClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO ::: If alerady member
        console.log(" Query ::: ", query);
        const clubRepository = club_entity_1.Club.getRepository();
        return yield clubRepository.createQueryBuilder('club')
            // .where('club.CLUB_ID NOT IN (:...clubIds)', {
            //     clubIds: query.listClubId
            // })
            .where('LOWER(club.NAME) LIKE LOWER(:nameKeyword) OR club.SEARCH_ID = :searchId', {
            nameKeyword: `%${query.name}%`,
            searchId: `%${query.id}%`
        })
            .getMany();
    });
}
exports.getClub = getClub;
function getOneClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club.findOne(query);
    });
}
exports.getOneClub = getOneClub;
function updateAndReturnById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club
            .createQueryBuilder()
            .update(club_entity_1.Club)
            .set(Object.assign({}, data))
            .where("ID = :id", { id })
            .returning('*')
            .execute();
    });
}
exports.updateAndReturnById = updateAndReturnById;
function deleteClubs(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_entity_1.Club.createQueryBuilder()
            .delete()
            .from(club_entity_1.Club)
            .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .execute();
    });
}
exports.deleteClubs = deleteClubs;
//# sourceMappingURL=club.repository.js.map