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
exports.ClubRequest = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("./club.entity");
let ClubRequest = class ClubRequest extends typeorm_1.BaseEntity {
};
exports.ClubRequest = ClubRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], ClubRequest.prototype, "REQUEST_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (userRequest) => userRequest.REQUEST_USERS, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'INVITED' }),
    __metadata("design:type", club_entity_1.Club)
], ClubRequest.prototype, "INVITED", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubRequest.prototype, "INVITED_USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], ClubRequest.prototype, "REQUESTED_USER_CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubRequest.prototype, "REQUESTED_USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ClubRequest.prototype, "IS_AGENT", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ClubRequest.prototype, "CREATED_DATE", void 0);
exports.ClubRequest = ClubRequest = __decorate([
    (0, typeorm_1.Entity)({ name: "REQUEST_CLUB" })
], ClubRequest);
//# sourceMappingURL=club-request.entity.js.map