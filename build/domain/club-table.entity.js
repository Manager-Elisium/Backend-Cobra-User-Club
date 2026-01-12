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
exports.ClubTable = exports.TableDesignType = void 0;
const typeorm_1 = require("typeorm");
const club_entity_1 = require("./club.entity");
var TableDesignType;
(function (TableDesignType) {
    TableDesignType["STANDARD"] = "Standard";
    TableDesignType["EXCLUSIVE"] = "Exclusive";
})(TableDesignType || (exports.TableDesignType = TableDesignType = {}));
let ClubTable = class ClubTable extends typeorm_1.BaseEntity {
};
exports.ClubTable = ClubTable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "ID" }),
    __metadata("design:type", String)
], ClubTable.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { enum: TableDesignType, default: TableDesignType.STANDARD }),
    __metadata("design:type", String)
], ClubTable.prototype, "DESIGN_TYPE", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ClubTable.prototype, "NO_OF_PLAYER", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ClubTable.prototype, "TURN_TIME", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubTable.prototype, "NAME", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ClubTable.prototype, "ENTRY_FEES", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], ClubTable.prototype, "RAKE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ClubTable.prototype, "IN_GAME_INTERACTIONS", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => club_entity_1.Club, (club) => club.JOINT_USERS, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'CLUB_ID' }),
    __metadata("design:type", club_entity_1.Club)
], ClubTable.prototype, "CLUB_ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ClubTable.prototype, "IN_RUNNING_TABLE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ClubTable.prototype, "CREATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], ClubTable.prototype, "UPDATED_DATE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Object)
], ClubTable.prototype, "JOINT_TABLE_CLUB_USER", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ClubTable.prototype, "JOINT_PLAYER", void 0);
exports.ClubTable = ClubTable = __decorate([
    (0, typeorm_1.Entity)({ name: "CLUB_TABLE" })
], ClubTable);
// TABLE_ID
// ENTRY_FEES
// CLUB_ID
// JOINT_TABLE_CLUB_USER
// JOINT_PLAYER
//# sourceMappingURL=club-table.entity.js.map