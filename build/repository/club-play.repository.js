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
exports.deleteAndReturnById = exports.updateAndReturnById = exports.findOne = exports.createClubPlay = void 0;
const club_play_entity_1 = require("src/domain/club-play.entity");
function createClubPlay(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_play_entity_1.ClubPlay.save(data);
    });
}
exports.createClubPlay = createClubPlay;
function findOne(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_play_entity_1.ClubPlay.findOneBy(data);
    });
}
exports.findOne = findOne;
function deleteAndReturnById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_play_entity_1.ClubPlay
            .createQueryBuilder()
            .delete()
            .from(club_play_entity_1.ClubPlay)
            .where("ID = :ID", { ID: id })
            .returning('*')
            .execute();
    });
}
exports.deleteAndReturnById = deleteAndReturnById;
function updateAndReturnById(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield club_play_entity_1.ClubPlay
            .createQueryBuilder()
            .update(club_play_entity_1.ClubPlay)
            .set(Object.assign({}, data))
            .where("ID = :id", { id })
            .returning('*')
            .execute();
    });
}
exports.updateAndReturnById = updateAndReturnById;
//# sourceMappingURL=club-play.repository.js.map