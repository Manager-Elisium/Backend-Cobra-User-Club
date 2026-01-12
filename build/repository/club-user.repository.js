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
exports.subtractAgentChip = exports.addAgentChip = exports.deleteUserClub = exports.subtractChip = exports.addChip = exports.getUserType = exports.getTypeSumByClubIdForPlayer = exports.getTypeSumByClubIdForAgent = exports.getTypeSumByClubIdForOwner = exports.updateUser = exports.getUserDetailClub = exports.playerUserClub = exports.listUserClub = exports.createUserClub = void 0;
const club_user_entity_1 = require("src/domain/club-user.entity");
const typeorm_1 = require("typeorm");
function createUserClub(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub.save(data);
    });
}
exports.createUserClub = createUserClub;
function listUserClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        const result = yield userClubRepository
            .createQueryBuilder('userClub')
            .where('userClub.USER_ID = :userId', { userId: query.USER_ID })
            .andWhere('userClub.IS_DELETE = false')
            .select([
            'userClub.TYPE as USER_TYPE',
            'club.ID as CLUB_ID',
            'club.SEARCH_ID as SEARCH_ID',
            'club.NAME as CLUB_NAME',
            'club.AVATAR as CLUB_AVATAR',
            'club.COUNTRY_CODE as COUNTRY_CODE',
            'club.USER_ID as USER_ID'
        ])
            .groupBy('userClub.TYPE, club.ID')
            .leftJoin('userClub.CLUB_ID', 'club')
            .orderBy('club.CREATED_DATE', 'ASC')
            .getRawMany();
        return result;
    });
}
exports.listUserClub = listUserClub;
function playerUserClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        const result = yield userClubRepository
            .createQueryBuilder('userClub')
            .where('userClub.USER_ID = :userId', { userId: query.USER_ID })
            .andWhere('userClub.TYPE IN (:...types)', {
            types: [club_user_entity_1.UserType.PLAYER, club_user_entity_1.UserType.AGENT]
        })
            .andWhere('userClub.IS_DELETE = false')
            .select([
            'club.ID as CLUB_ID'
        ])
            .groupBy('club.ID')
            .leftJoin('userClub.CLUB_ID', 'club')
            .getRawMany();
        return result;
    });
}
exports.playerUserClub = playerUserClub;
function getUserDetailClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub.find(query);
    });
}
exports.getUserDetailClub = getUserDetailClub;
function getTypeSumByClubIdForOwner(clubId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        return yield userClubRepository.createQueryBuilder('user_club')
            .select('user_club.TYPE', 'TYPE')
            .addSelect('SUM(user_club.CHIP)', 'CHIP')
            .addSelect('SUM(user_club.AGENT_CHIP)', 'AGENT_CHIP')
            .where('user_club.CLUB_ID = :clubId', { clubId })
            .andWhere('user_club.IS_DELETE = false')
            .groupBy('user_club.TYPE')
            .getRawMany();
    });
}
exports.getTypeSumByClubIdForOwner = getTypeSumByClubIdForOwner;
function getTypeSumByClubIdForAgent(clubId, agentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        return yield userClubRepository.createQueryBuilder('user_club')
            .select('user_club.TYPE', 'TYPE')
            .addSelect('SUM(user_club.CHIP)', 'CHIP')
            .where('user_club.CLUB_ID = :clubId', { clubId })
            .andWhere('user_club.REFERRED_ID = :agentId', { agentId })
            .andWhere('user_club.IS_DELETE = false')
            .groupBy('user_club.TYPE')
            .getRawMany();
    });
}
exports.getTypeSumByClubIdForAgent = getTypeSumByClubIdForAgent;
function getTypeSumByClubIdForPlayer(clubId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userClubRepository = club_user_entity_1.UserClub.getRepository();
        return yield userClubRepository.createQueryBuilder('user_club')
            .select('user_club.TYPE', 'TYPE')
            .addSelect('SUM(user_club.CHIP)', 'CHIP')
            .where('user_club.CLUB_ID = :clubId', { clubId })
            .andWhere('user_club.USER_ID = :clubId', { userId })
            .andWhere('user_club.IS_DELETE = false')
            .groupBy('user_club.TYPE')
            .getRawMany();
    });
}
exports.getTypeSumByClubIdForPlayer = getTypeSumByClubIdForPlayer;
function getUserType(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub.findOne(query);
    });
}
exports.getUserType = getUserType;
function updateUser(query, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub.update(query, data);
    });
}
exports.updateUser = updateUser;
function addChip(data, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub
            .createQueryBuilder()
            .update(club_user_entity_1.UserClub)
            .returning('*')
            .set({ CHIP: () => { var _a; return `CHIP + ${(_a = Number(data === null || data === void 0 ? void 0 : data.CHIP)) !== null && _a !== void 0 ? _a : 0}`; } })
            .where({ ID: (0, typeorm_1.In)(condition === null || condition === void 0 ? void 0 : condition.ID) })
            .execute();
    });
}
exports.addChip = addChip;
function subtractChip(data, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub
            .createQueryBuilder()
            .update(club_user_entity_1.UserClub)
            .set({ CHIP: () => { var _a; return `CHIP - ${(_a = Number(data === null || data === void 0 ? void 0 : data.CHIP)) !== null && _a !== void 0 ? _a : 0}`; } })
            .where({ ID: (0, typeorm_1.In)(condition === null || condition === void 0 ? void 0 : condition.ID) })
            .execute();
    });
}
exports.subtractChip = subtractChip;
function addAgentChip(data, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub
            .createQueryBuilder()
            .update(club_user_entity_1.UserClub)
            .returning('*')
            .set({ AGENT_CHIP: () => { var _a; return `AGENT_CHIP + ${(_a = Number(data === null || data === void 0 ? void 0 : data.CHIP)) !== null && _a !== void 0 ? _a : 0}`; } })
            .where({ ID: (0, typeorm_1.In)(condition === null || condition === void 0 ? void 0 : condition.ID) })
            .execute();
    });
}
exports.addAgentChip = addAgentChip;
function subtractAgentChip(data, condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub
            .createQueryBuilder()
            .update(club_user_entity_1.UserClub)
            .returning('*')
            .set({ AGENT_CHIP: () => { var _a; return `AGENT_CHIP - ${(_a = Number(data === null || data === void 0 ? void 0 : data.CHIP)) !== null && _a !== void 0 ? _a : 0}`; } })
            .where({ ID: (0, typeorm_1.In)(condition === null || condition === void 0 ? void 0 : condition.ID) })
            .execute();
    });
}
exports.subtractAgentChip = subtractAgentChip;
function deleteUserClub(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_user_entity_1.UserClub
            .createQueryBuilder()
            .delete()
            .from(club_user_entity_1.UserClub)
            .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .execute();
    });
}
exports.deleteUserClub = deleteUserClub;
//# sourceMappingURL=club-user.repository.js.map