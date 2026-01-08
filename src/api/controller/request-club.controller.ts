import { NextFunction, Response, Request } from "express";
import { encrypt, decrypt } from "src/common/encrypt";
import { acceptDeclineUserClubService, joinClubService, requestedListUserService, requestedUserClubService } from "../service/request-club.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function joinClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { id } = req.query;
        let joinRequestClub = await joinClubService({
            USER_ID: token?.ID, id: id || ""
        });
        return res.send(await encrypt(JSON.stringify({ status: true, joinRequestClub, message: "Request Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function requestedClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        // You send request
        let requestedClubList = await requestedUserClubService({
            USER_ID: token?.ID
        });
        return res.send(await encrypt(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function acceptDeclineRequestClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { requestId, isAccept } = req.query;
        const reqBody = {
            USER_ID: token?.ID,
            REQUEST_ID: requestId,
            isAccept: isAccept === 'true' || isAccept === 'True' ? true : false
        }
        let acceptDeclineRequest = await acceptDeclineUserClubService(reqBody);
        return res.send(await encrypt(JSON.stringify({ status: true, message: acceptDeclineRequest?.message }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function requestedListClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { clubId } = req.query;
        // You send request
        let requestedClubList = await requestedListUserService({
            USER_ID: token?.ID,
            CLUB_ID: clubId
        });
        return res.send(await encrypt(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

export { joinClub, requestedClub, acceptDeclineRequestClub, requestedListClub };