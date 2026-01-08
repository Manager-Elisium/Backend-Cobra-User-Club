import { NextFunction } from "express";
import { Response, Request } from "express";
import { decrypt, encrypt } from "src/common/encrypt";
import { chipClaimBackClub, chipSendOutClub, getClubAndUserType, transactionClub, } from "../service/counter.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function dashboardClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { clubId } = req.query;
        const body = {
            clubId,
            USER_ID: token?.ID
        };
        const { getDashBoard, countInvitedClubPlayer, countChipRequest } = await getClubAndUserType(body);
        return res.json(await encrypt(JSON.stringify({ status: true, getDashBoard, countInvitedClubPlayer, countChipRequest, message: "Setting Club successfully" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function chipSendOutClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID,
        };
        const { addChipPlayerAndAgent, success, message } = await chipSendOutClub(body);
        if (success) {
            return res.json(await encrypt(JSON.stringify({ status: true, message: "Add Chip Successfully" }), secretKey));
        } else {
            return res.json(await encrypt(JSON.stringify({ status: false, message }), secretKey));
        }
        
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function chipClaimBackClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID,
        };
        const { claimChipPlayerAndAgent } = await chipClaimBackClub(body);
        return res.json(await encrypt(JSON.stringify({ status: true, message: "Claim Chip Successfully" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function transactionClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            CLUB: token?.ID, // User Id 
        };
        const { transaction } = await transactionClub(body);
        return res.json(await encrypt(JSON.stringify({ status: true, transaction, message: "Transaction" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

export { dashboardClubController, chipSendOutClubController, chipClaimBackClubController, transactionClubController };