import { NextFunction } from "express";
import { Response, Request } from "express";
import { decrypt, encrypt } from "src/common/encrypt";
import { listClubService } from "../service/admin-club.service";
import { settingClubService } from "../service/setting.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function settingClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID,
        };
        const updateSetting = await settingClubService(body);
        return res.json(await encrypt(JSON.stringify({ status: true, message: "Setting Club successfully" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

export { settingClubController };