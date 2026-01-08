import { NextFunction, Response, Request } from "express";
import { decrypt, encrypt } from "src/common/encrypt";
import { inviteNewPlayerService, joinClubService, memberClubService, searchInvitedClubService } from "../service/invited.service";
const secretKey = 'SM20zD0thg8T5Gz3scOSQ2W4r6r7GJqR';

async function memberClubController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { clubId, userClubId, type } = req.query;
        const memberList = await memberClubService({ clubId, userClubId, type: !!type ? type : "", USER_ID: token?.ID });
        // return res.json({ status: true, list, message: "User Club successfully" });
        return res.send(await encrypt(JSON.stringify({ status: true, memberList, message: "Member List in Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function listInvitePlayerController(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.body;
        const { clubId } = req.query;
        const invitationList = await inviteNewPlayerService({ clubId, USER_ID: token?.ID });
        // return res.json({ status: true, invitationList, message: "User Club Invite Player successfully" });
        return res.send(await encrypt(JSON.stringify({ status: true, invitationList, message: "Invitation List in Club" }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function joinClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        let decryptBody: any = await decrypt({ public_key, content }, secretKey);
        const { userId } = req.query;
        const {
            clubId,
            isJoin } = JSON.parse(decryptBody);
        let invitedClub = await joinClubService({
            REQUESTED_USER_ID: token?.ID, clubId: clubId, // compnay - club
            USER_ID: userId, // emploayee
            isJoin
        });
        return res.send(await encrypt(JSON.stringify({
            status: true, invitedClub,
            message: isJoin ? "Join Invited Club" : "Remove Requested User"
        }), secretKey));
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}


async function searchUserClub(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_key, content, token } = req.body;
        const { name_id, clubId } = req.query;
        let {message, status, searchUserInClub} = await searchInvitedClubService({
            REQUESTED_USER_ID: token?.ID, clubId: clubId,
            name_id
        });
        if(!!name_id) {
            return res.send(await encrypt(JSON.stringify({
                status,
                searchUserInClub,
                message,
            }), secretKey));
        } else {
            return res.send(await encrypt(JSON.stringify({
                status,
                searchUserInClub,
                message
            }), secretKey));
        }
        
    } catch (error) {
        return res.json(await encrypt(JSON.stringify({ status: false, message: error?.message ?? "" }), secretKey));
    }
}

export { memberClubController, listInvitePlayerController, joinClub, searchUserClub };