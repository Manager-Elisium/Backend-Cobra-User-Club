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
exports.Request = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("./club.entity");
let Request = class Request extends typeorm_1.BaseEntity {
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], Request.prototype, "REQUEST_ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "REQUEST_FROM_USER_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", String)
], Request.prototype, "REQUEST_TO_USER_CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "REQUEST_TO_USER_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (userRequest) => userRequest.REQUEST_USERS, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'REQUEST_TO_CLUB_ID' }),
    __metadata("design:type", club_entity_1.Club)
], Request.prototype, "REQUEST_TO_CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Request.prototype, "CREATED_DATE", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Entity)({ name: "CLUB_REQUEST" })
], Request);
//# sourceMappingURL=request.entity.js.map