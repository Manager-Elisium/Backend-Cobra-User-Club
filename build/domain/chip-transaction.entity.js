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
exports.ChipTransaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const club_user_entity_1 = require("./club-user.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["CHIP_SEND"] = "Chip Send";
    TransactionType["CLAIM_BACK"] = "Claimed Back";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let ChipTransaction = class ChipTransaction extends typeorm_1.BaseEntity {
};
exports.ChipTransaction = ChipTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], ChipTransaction.prototype, "TRANSACTION_ID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_user_entity_1.UserClub, userClub => userClub.ID),
    (0, typeorm_1.JoinColumn)({ name: "RECEIVER" }),
    __metadata("design:type", club_user_entity_1.UserClub)
], ChipTransaction.prototype, "RECEIVER", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_user_entity_1.UserClub, userClub => userClub.ID),
    (0, typeorm_1.JoinColumn)({ name: "SENDER" }),
    __metadata("design:type", club_user_entity_1.UserClub)
], ChipTransaction.prototype, "SENDER", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ChipTransaction.prototype, "CHIP", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { enum: TransactionType, default: TransactionType.CHIP_SEND }),
    __metadata("design:type", String)
], ChipTransaction.prototype, "TRANSACTION_TYPE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ChipTransaction.prototype, "CREATED_DATE", void 0);
exports.ChipTransaction = ChipTransaction = __decorate([
    (0, typeorm_1.Entity)({ name: "CHIP_TRANSACTION_CLUB" })
], ChipTransaction);
//# sourceMappingURL=chip-transaction.entity.js.map