"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Club_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Club = void 0;
const typeorm_1 = require("typeorm");
const club_user_entity_1 = require("./club-user.entity");
const club_request_entity_1 = require("./club-request.entity");
const ormconfig_1 = require("src/connection/ormconfig");
const request_entity_1 = require("./request.entity");
let Club = Club_1 = class Club extends typeorm_1.BaseEntity {
    assignRoomSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            const entityManager = ormconfig_1.AppDataSource.getRepository(Club_1);
            const sequenceQuery = "SELECT nextval('club_sequence')";
            const result = yield entityManager.query(sequenceQuery);
            const randomString = [...Array(6)].map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
            this.SEARCH_ID = `${randomString}${result[0].nextval}`;
        });
    }
};
exports.Club = Club;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], Club.prototype, "CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Club.prototype, "NAME", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Club.prototype, "SEARCH_ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Club.prototype, "USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Club.prototype, "AVATAR", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Club.prototype, "TOTAL_GAME_PLAYED", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "IN" }),
    __metadata("design:type", String)
], Club.prototype, "COUNTRY_CODE", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], Club.prototype, "NOTICE_NAME", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], Club.prototype, "NOTICE_DESCRIPTION", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => club_user_entity_1.UserClub, (userClub) => userClub.CLUB_ID),
    __metadata("design:type", Array)
], Club.prototype, "JOINT_USERS", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => club_request_entity_1.ClubRequest, (userClub) => userClub.INVITED),
    __metadata("design:type", Array)
], Club.prototype, "REQUEST_USERS", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.Request, (requestClub) => requestClub.REQUEST_TO_CLUB_ID),
    __metadata("design:type", Array)
], Club.prototype, "REQUEST_TO_CLUB", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Club.prototype, "CREATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Club.prototype, "UPDATED_DATE", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Club.prototype, "assignRoomSequence", null);
exports.Club = Club = Club_1 = __decorate([
    (0, typeorm_1.Entity)({ name: "CLUB" })
], Club);
// CREATE SEQUENCE IF NOT EXISTS public.club_sequence
//     INCREMENT 1
//     START 1
//     MINVALUE 1
//     MAXVALUE 9223372036854775807
//     CACHE 1
//     OWNED BY "CLUB"."SEARCH_ID";
//# sourceMappingURL=club.entity.js.map