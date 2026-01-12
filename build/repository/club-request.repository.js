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
exports.deleteAllClubRequest = exports.countInvitedClubUser = exports.deleteClubRequestByClub = exports.deleteClubRequest = exports.invitationsCount = exports.requestedCount = exports.clubUser = exports.invitedClubUser = exports.requestedClubUser = exports.createRequestClub = exports.countRequestClub = void 0;
const club_request_entity_1 = require("src/domain/club-request.entity");
function countRequestClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.count(query);
    });
}
exports.countRequestClub = countRequestClub;
function createRequestClub(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.save(data);
    });
}
exports.createRequestClub = createRequestClub;
/**
 * @deprecated
 *
 */
function requestedClubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.find({
            where: { INVITED_USER_ID: query.INVITED_USER_ID },
            relations: ['INVITED']
        });
    });
}
exports.requestedClubUser = requestedClubUser;
function invitedClubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.find({
            where: { INVITED_USER_ID: query.REQUESTED_USER_ID },
            relations: ['INVITED']
        });
    });
}
exports.invitedClubUser = invitedClubUser;
function countInvitedClubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.count({
            where: { INVITED_USER_ID: query.USER_ID },
            relations: ['INVITED']
        });
    });
}
exports.countInvitedClubUser = countInvitedClubUser;
function clubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.find(query);
    });
}
exports.clubUser = clubUser;
function requestedCount(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.count({
            where: { REQUESTED_USER_ID: query.USER_ID }
        });
    });
}
exports.requestedCount = requestedCount;
function invitationsCount(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.count({
            where: { INVITED_USER_ID: query.USER_ID }
        });
    });
}
exports.invitationsCount = invitationsCount;
function deleteClubRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.createQueryBuilder()
            .delete()
            .from(club_request_entity_1.ClubRequest)
            .returning('*')
            .where("REQUEST_ID = :REQUEST_ID", { REQUEST_ID: id })
            .execute();
    });
}
exports.deleteClubRequest = deleteClubRequest;
function deleteClubRequestByClub(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.createQueryBuilder()
            .delete()
            .from(club_request_entity_1.ClubRequest)
            .returning('*')
            .where("INVITED_USER_ID = :INVITED_USER_ID", { INVITED_USER_ID: data.INVITED_USER_ID })
            .andWhere('INVITED = :INVITED', { INVITED: data.INVITED })
            .execute();
    });
}
exports.deleteClubRequestByClub = deleteClubRequestByClub;
function deleteAllClubRequest(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_request_entity_1.ClubRequest.createQueryBuilder()
            .delete()
            .from(club_request_entity_1.ClubRequest)
            .where('INVITED = :INVITED', { INVITED: data.CLUB_ID })
            .execute();
    });
}
exports.deleteAllClubRequest = deleteAllClubRequest;
//# sourceMappingURL=club-request.repository.js.map