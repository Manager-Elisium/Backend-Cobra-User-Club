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
exports.info = exports.warning = exports.error = exports.success = void 0;
const chalk_1 = __importDefault(require("chalk"));
function success(requestName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.green(requestName, JSON.stringify(params)));
    });
}
exports.success = success;
function error(requestName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.red(requestName, JSON.stringify(params)));
    });
}
exports.error = error;
function warning(requestName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.magenta(requestName, JSON.stringify(params)));
    });
}
exports.warning = warning;
function info(requestName, params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.yellowBright(requestName, JSON.stringify(params)));
    });
}
exports.info = info;
//# sourceMappingURL=logger.js.map