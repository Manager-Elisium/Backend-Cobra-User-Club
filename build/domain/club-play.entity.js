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
exports.ClubPlay = void 0;
const typeorm_1 = require("typeorm");
const club_table_entity_1 = require("./club-table.entity");
let ClubPlay = class ClubPlay extends typeorm_1.BaseEntity {
};
exports.ClubPlay = ClubPlay;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], ClubPlay.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ClubPlay.prototype, "IS_GAME_FINISH", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ClubPlay.prototype, "CURRENT_ROUND_NUMBER", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_table_entity_1.ClubTable, (club) => club.ID, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'TABLE_ID' }),
    __metadata("design:type", club_table_entity_1.ClubTable)
], ClubPlay.prototype, "TABLE_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ClubPlay.prototype, "WIN_USER", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "USERS", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "TURN_DECIDE_DECK", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "ROUND_INFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ClubPlay.prototype, "CURRENT_TURN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "GAME_DECK", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "DROP_DECK", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], ClubPlay.prototype, "USER_WIN_RANK", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "CURRENT_DROP_DECK", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Object)
], ClubPlay.prototype, "PREVIOUS_DROP_DECK", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ClubPlay.prototype, "CREATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { nullable: true }),
    __metadata("design:type", Date)
], ClubPlay.prototype, "UPDATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { nullable: true }),
    __metadata("design:type", Date)
], ClubPlay.prototype, "GAME_FINISH_DATE", void 0);
exports.ClubPlay = ClubPlay = __decorate([
    (0, typeorm_1.Entity)({ name: "CLUB_PLAY" })
], ClubPlay);
//# sourceMappingURL=club-play.entity.js.map