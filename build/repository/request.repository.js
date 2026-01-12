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
exports.deleteRequestClub = exports.requestedUserListClub = exports.deleteClubRequest = exports.requestedCount = exports.requestedClubUser = exports.createRequestClub = exports.countRequestClub = void 0;
const request_entity_1 = require("src/domain/request.entity");
function countRequestClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.count(query);
    });
}
exports.countRequestClub = countRequestClub;
function createRequestClub(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.save(data);
    });
}
exports.createRequestClub = createRequestClub;
function requestedClubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.find({
            where: { REQUEST_FROM_USER_ID: query.USER_ID },
            relations: ['REQUEST_TO_CLUB_ID']
        });
    });
}
exports.requestedClubUser = requestedClubUser;
function requestedCount(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.count({
            where: { REQUEST_FROM_USER_ID: query.USER_ID }
        });
    });
}
exports.requestedCount = requestedCount;
function deleteClubRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.createQueryBuilder()
            .delete()
            .from(request_entity_1.Request)
            .returning('*')
            .where("REQUEST_ID = :REQUEST_ID", { REQUEST_ID: id })
            .execute();
    });
}
exports.deleteClubRequest = deleteClubRequest;
function requestedUserListClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request.find({
            where: { REQUEST_TO_CLUB_ID: { CLUB_ID: query.CLUB_ID } },
            relations: ['REQUEST_TO_CLUB_ID']
        });
    });
}
exports.requestedUserListClub = requestedUserListClub;
function deleteRequestClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield request_entity_1.Request
            .createQueryBuilder()
            .delete()
            .from(request_entity_1.Request)
            .where("REQUEST_TO_CLUB_ID = :CLUB_ID", { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .execute();
    });
}
exports.deleteRequestClub = deleteRequestClub;
//# sourceMappingURL=request.repository.js.map