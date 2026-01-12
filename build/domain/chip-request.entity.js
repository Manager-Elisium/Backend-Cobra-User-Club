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
exports.ChipRequest = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("./club.entity");
const club_user_entity_1 = require("./club-user.entity");
let ChipRequest = class ChipRequest extends typeorm_1.BaseEntity {
};
exports.ChipRequest = ChipRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], ChipRequest.prototype, "REQUEST_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (club) => club.CLUB_ID, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'CLUB_ID' }),
    __metadata("design:type", club_entity_1.Club)
], ChipRequest.prototype, "CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_user_entity_1.UserClub, userClub => userClub.ID),
    (0, typeorm_1.JoinColumn)({ name: "REQUEST_CLUB_USER_ID" }),
    __metadata("design:type", club_user_entity_1.UserClub)
], ChipRequest.prototype, "REQUEST_CLUB_USER_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_user_entity_1.UserClub, userClub => userClub.ID),
    (0, typeorm_1.JoinColumn)({ name: "RECEIVER_CLUB_USER_ID" }),
    __metadata("design:type", club_user_entity_1.UserClub)
], ChipRequest.prototype, "RECEIVER_CLUB_USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ChipRequest.prototype, "CHIP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ChipRequest.prototype, "IS_AGENT", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ChipRequest.prototype, "CREATED_DATE", void 0);
exports.ChipRequest = ChipRequest = __decorate([
    (0, typeorm_1.Entity)({ name: "REQUEST_CHIP" })
], ChipRequest);
//# sourceMappingURL=chip-request.entity.js.map