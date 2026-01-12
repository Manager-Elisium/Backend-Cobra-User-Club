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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClub = exports.UserType = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("./club.entity");
var UserType;
(function (UserType) {
    UserType["OWNER"] = "Owner";
    UserType["AGENT"] = "Agent";
    UserType["PLAYER"] = "Player";
})(UserType || (exports.UserType = UserType = {}));
let UserClub = class UserClub extends typeorm_1.BaseEntity {
};
exports.UserClub = UserClub;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], UserClub.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserClub.prototype, "USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { enum: UserType, default: UserType.PLAYER }),
    __metadata("design:type", String)
], UserClub.prototype, "TYPE", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (club) => club.JOINT_USERS, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'CLUB_ID' }),
    __metadata("design:type", club_entity_1.Club)
], UserClub.prototype, "CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserClub.prototype, "IN_GAME_INTERACTIONS", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserClub.prototype, "CLUB_NOTIFICATION", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserClub.prototype, "CHIP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserClub.prototype, "AGENT_CHIP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], UserClub.prototype, "CREATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], UserClub.prototype, "UPDATED_DATE", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserClub, userClub => userClub.ID, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'REFERRED_ID' }),
    __metadata("design:type", UserClub)
], UserClub.prototype, "REFERRED_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], UserClub.prototype, "MAIN_SOCKET_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], UserClub.prototype, "GAME_PLAY_SOCKET_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserClub.prototype, "IN_COUNT_PLAYER", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserClub.prototype, "IS_DELETE", void 0);
exports.UserClub = UserClub = __decorate([
    (0, typeorm_1.Entity)({ name: "USER_CLUB" })
], UserClub);
//# sourceMappingURL=club-user.entity.js.map