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
exports.deleteAllChipRequest = exports.countChipRequestClubUser = exports.getChipRequestList = exports.deleteChipRequest = exports.getRequestChip = exports.insertOneChip = void 0;
const chip_request_entity_1 = require("src/domain/chip-request.entity");
const typeorm_1 = require("typeorm");
function insertOneChip(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest.insert(data);
    });
}
exports.insertOneChip = insertOneChip;
function getRequestChip(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest.find({
            where: { RECEIVER_CLUB_USER_ID: { ID: query.USER_CLUB_ID } },
            relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID']
        });
    });
}
exports.getRequestChip = getRequestChip;
function deleteChipRequest(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest
            .createQueryBuilder()
            .delete()
            .from(chip_request_entity_1.ChipRequest)
            .where({ REQUEST_ID: (0, typeorm_1.In)(data === null || data === void 0 ? void 0 : data.ID) })
            .returning('*')
            .execute();
    });
}
exports.deleteChipRequest = deleteChipRequest;
function getChipRequestList(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest.find({
            where: { REQUEST_ID: (0, typeorm_1.In)(data === null || data === void 0 ? void 0 : data.ID) },
            relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID']
        });
    });
}
exports.getChipRequestList = getChipRequestList;
function countChipRequestClubUser(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest.count({
            where: { RECEIVER_CLUB_USER_ID: { ID: query.USER_CLUB_ID } },
            relations: ['REQUEST_CLUB_USER_ID', 'RECEIVER_CLUB_USER_ID']
        });
    });
}
exports.countChipRequestClubUser = countChipRequestClubUser;
function deleteAllChipRequest(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield chip_request_entity_1.ChipRequest
            .createQueryBuilder()
            .delete()
            .from(chip_request_entity_1.ChipRequest)
            .where("CLUB_ID = :CLUB_ID", { CLUB_ID: query === null || query === void 0 ? void 0 : query.CLUB_ID })
            .returning('*')
            .execute();
    });
}
exports.deleteAllChipRequest = deleteAllChipRequest;
//# sourceMappingURL=chip-request.repository.js.map