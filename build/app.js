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
exports.createApp = void 0;
// eslint-disable @typescript-eslint/no-explicit-any
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./api/index");
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.set('env', process.env.NODE_ENV || 'production');
        app.set('port', process.env.PORT);
        app.use(express_1.default.json({ limit: '10mb', type: 'application/json' }));
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use('/', index_1.apiRouter);
        app.get('/', (req, res) => {
            return res.status(200).json({ message: '!You have successfully started the application!' });
        });
        return app;
    });
}
exports.createApp = createApp;
//# sourceMappingURL=app.js.map