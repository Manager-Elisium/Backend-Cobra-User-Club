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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClubService = void 0;
const standard_error_1 = __importDefault(require("src/common/standard-error"));
const error_type_1 = require("src/common/error-type");
function listClubService(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = data;
            return {
                "list": [{
                        "POSTION": "Owner",
                        "NAME": "Club 1",
                        "TOTAL_GAME_PLAYED": 100,
                        "CURRENT_CHIP": 0
                    }, {
                        "POSTION": "Agent",
                        "NAME": "Club 2",
                        "TOTAL_GAME_PLAYED": 100,
                        "CURRENT_CHIP": 10000
                    }, {
                        "POSTION": "Player",
                        "NAME": "Club 1",
                        "CURRENT_CHIP": 1000,
                        "TOTAL_GAME_PLAYED": 100
                    }]
            };
        }
        catch (error) {
            throw new standard_error_1.default(error_type_1.ErrorCodes.API_VALIDATION_ERROR, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Club Service is not reachable.");
        }
    });
}
exports.listClubService = listClubService;
//# sourceMappingURL=admin-club.service.js.map