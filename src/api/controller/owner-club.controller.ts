
import { NextFunction, Response, Request } from "express";
import { encrypt, decrypt } from "src/common/encrypt";
import { acceptDeclineUserClubService, createClubService, invitedUserClubService, joinClubService, listUserClubService, requestedUserClubService, searchUserClubService, updateClubService, updateNoticeClubService } from "../service/club.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function createClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { NAME, AVATAR, COUNTRY_CODE } = JSON.parse(decryptBody);
        let createClub = await createClubService({ NAME, AVATAR, COUNTRY_CODE, USER_ID: token?.ID });
        return res.send(await encrypt(JSON.stringify({ status: true, createClub, message: "Create Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function updateClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        const { clubId } = req.query;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { NAME, AVATAR } = JSON.parse(decryptBody);
        let updateClub = await updateClubService({ NAME, AVATAR, USER_ID: token?.ID, clubId });
        return res.send(await encrypt(JSON.stringify({ status: true, updateClub, message: "Update Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function updateNoticeClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        const { clubId } = req.query;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { NOTICE_NAME, NOTICE_DESCRIPTION } = JSON.parse(decryptBody);
        let updateClub = await updateNoticeClubService({ NOTICE_NAME, NOTICE_DESCRIPTION, USER_ID: token?.ID, clubId });
        return res.send(await encrypt(JSON.stringify({ status: true, updateClub, message: "Update Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function listClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, } = req.body;
        let { clubList, countInvitations, countRequested } = await listUserClubService({ USER_ID: token?.ID });
        console.log(token?.ID, " Token")
        return res.send(await encrypt(JSON.stringify({ status: true, clubList, countInvitations, countRequested, message: "List Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function searchClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        // TODO :: Single Input
        const { name_id } = req.query;
        let listClub = await searchUserClubService({
            USER_ID: token?.ID, name: name_id || "", id: name_id || ""
        });
        return res.send(await encrypt(JSON.stringify({ status: true, listClub, message: "Get Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


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
            INVITED_USER_ID: token?.ID
        });
        return res.send(await encrypt(JSON.stringify({ status: true, requestedClubList, message: "Requested Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

async function invitedClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        // You receive request
        let invitedClubList = await invitedUserClubService({
            REQUESTED_USER_ID: token?.ID
        });
        return res.send(await encrypt(JSON.stringify({ status: true, invitedClubList, message: "Invited Club" }), secretKey));
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


export { createClub, updateClub, updateNoticeClub, listClub, searchClub, joinClub, requestedClub, invitedClub, acceptDeclineRequestClub };