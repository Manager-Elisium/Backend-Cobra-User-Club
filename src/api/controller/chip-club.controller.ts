import { NextFunction } from "express";
import { Response, Request } from "express";
import { decrypt, encrypt } from "src/common/encrypt";
import { addChipService, chipAcceptDeclineService, chipRequestListService, chipRequestService } from "../service/chip-club.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';


async function chipSendRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID
        };
        const chipRequest = await chipRequestService(body);
        return res.json(await encrypt(JSON.stringify({ status: true, message: "Chip Send Request Successfully" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function chipRequestListController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID
        };
        const { chipRequestList } = await chipRequestListService(body);
        return res.json(await encrypt(JSON.stringify({ status: true, chipRequestList, message: "Chip List Request Successfully" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function chipAcceptDeclineController(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { clubId } = req.query;
        const body = {
            ...JSON.parse(decryptBody),
            clubId,
            USER_ID: token?.ID
        };
        const { status, message } = await chipAcceptDeclineService(body);
        if (status) {
            return res.json(await encrypt(JSON.stringify({ status: true, message: "Chip Accept Decline Request Successfully" }), secretKey));
        } else {
            return res.json(await encrypt(JSON.stringify({ status: true, message: message }), secretKey));
        }
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function addChipRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const { USER_CLUB_ID, CHIP } = req.body;
        const body = {
            USER_CLUB_ID,
            CHIP,
            type: "add"
        };
        const addChip = await addChipService(body);
        return res.json({ status: true });
    } catch (error) {
        return res.json({ status: false});
    }
}

async function subtractChipRequestController(req: Request, res: Response, next: NextFunction) {
    try {
        const { USER_CLUB_ID, CHIP } = req.body;
        const body = {
            USER_CLUB_ID,
            CHIP,
            type: "subtract"
        };
        const subtractChip = await addChipService(body);
        return res.json({ status: true });
    } catch (error) {
        return res.json({ status: false});
    }
}

export { chipSendRequestController, chipRequestListController, chipAcceptDeclineController, addChipRequestController, subtractChipRequestController };