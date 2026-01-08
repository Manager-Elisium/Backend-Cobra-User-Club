import { NextFunction } from "express";
import { Response, Request } from "express";
import { decrypt, encrypt } from "src/common/encrypt";
import { listClubService } from "../service/admin-club.service";
const secretKey = 'SWS0zf0thg8T5Gz3scOSQ2W4r6r7GJAg';

async function adminClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.query;
        const list = await listClubService({ userId });
        let encryptedData = encrypt(JSON.stringify(list), secretKey);
        const decryptData = await decrypt(await encryptedData, secretKey) as any;
        console.log("Decrypt Data : " , decryptData)
        return res.json({ status: true, data: await encryptedData, message: "User Club successfully" });
    } catch (error) {
        return res.json({ status: false, message: error?.message ?? "" });
    }
}

export { adminClubController };