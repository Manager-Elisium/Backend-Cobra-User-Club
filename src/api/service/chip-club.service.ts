import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { addAgentChip, addChip, getUserType, subtractAgentChip, subtractChip } from 'src/repository/club-user.repository';
import { deleteChipRequest, getChipRequestList, getRequestChip, insertOneChip } from 'src/repository/chip-request.repository';
import { TransactionType } from 'src/domain/chip-transaction.entity';
import { insertManyTransaction } from 'src/repository/chip-transaction.repository';
import { UserType } from 'src/domain/club-user.entity';

async function chipRequestService(data: any) {
    try {
        const {
            clubId,
            USER_CLUB_ID,
            CHIP
        } = data;
        const getUser = await getUserType({
            where: { ID: USER_CLUB_ID }, relations: ['REFERRED_ID']
        });
        if (getUser?.TYPE === "Player") {
            if (getUser?.REFERRED_ID?.TYPE === "Owner") {
                const requestData = {
                    CLUB_ID: clubId,
                    REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                    RECEIVER_CLUB_USER_ID: getUser?.REFERRED_ID?.ID,
                    CHIP: CHIP,
                    IS_AGENT: false
                };
                return await insertOneChip(requestData);
            } else if (getUser?.REFERRED_ID?.TYPE === "Agent") {
                const requestData = {
                    CLUB_ID: clubId,
                    REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                    RECEIVER_CLUB_USER_ID: getUser?.REFERRED_ID?.ID,
                    CHIP: CHIP,
                    IS_AGENT: true
                };
                return await insertOneChip(requestData);
            }
        } else if (getUser?.TYPE === "Agent") {
            if (getUser?.REFERRED_ID?.TYPE === "Owner") {
                const requestData = {
                    CLUB_ID: clubId,
                    REQUEST_CLUB_USER_ID: USER_CLUB_ID,
                    RECEIVER_CLUB_USER_ID: getUser?.REFERRED_ID?.ID,
                    CHIP: CHIP,
                    IS_AGENT: false
                };
                return await insertOneChip(requestData);
            }
        } else {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Chip Service is not reachable."
            );
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club Service is not reachable."
        );
    }
}


async function chipRequestListService(data: any) {
    try {
        const {
            clubId,
            USER_CLUB_ID
        } = data;
        const chipRequestList = await getRequestChip({ USER_CLUB_ID: USER_CLUB_ID });
        return { chipRequestList };
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club Service is not reachable."
        );
    }
}


async function chipAcceptDeclineService(data: any) {
    try {
        const {
            clubId,
            USER_CLUB_ID,
            CHIP_REQUEST_ID,
            isAccept
        } = data;
        if (isAccept) {
            const getUser = await getUserType({
                where: { ID: USER_CLUB_ID }
            });
            if (getUser.TYPE === "Owner") {
                const chipAcceptDecline = await deleteChipRequest({ ID: CHIP_REQUEST_ID });
                const insertTransaction: any = [];
                for (let index = 0; index < chipAcceptDecline?.raw?.length; index++) {
                    const RECEIVER = chipAcceptDecline?.raw?.[index]?.REQUEST_CLUB_USER_ID;
                    const SENDER = chipAcceptDecline?.raw?.[index]?.RECEIVER_CLUB_USER_ID;
                    const CHIP = chipAcceptDecline?.raw?.[index]?.CHIP;
                    insertTransaction.push({
                        RECEIVER,
                        SENDER,
                        CHIP,
                        TRANSACTION_TYPE: TransactionType.CHIP_SEND
                    });
                    const getAgentUser = await getUserType({
                        where: { ID: RECEIVER }
                    });
                    if (getAgentUser?.TYPE === UserType.AGENT) {
                        await addAgentChip({ CHIP: CHIP }, { ID: [RECEIVER] });
                    } else {
                        await addChip({ CHIP: CHIP }, { ID: [RECEIVER] });
                    }
                }
                await insertManyTransaction(insertTransaction);
                return { status: true, message: "Add Chip" };
            } else if (getUser.TYPE === "Agent") {
                let getChips = await getChipRequestList({ ID: CHIP_REQUEST_ID });
                let sum = getChips?.reduce((prev, current) => {
                    return prev + current?.CHIP;
                }, 0)
                if (sum > getUser?.AGENT_CHIP) {
                    throw new StandardError(
                        ErrorCodes.API_VALIDATION_ERROR,
                        "Chip is not sufficient."
                    );
                }
                const chipAcceptDecline = await deleteChipRequest({ ID: CHIP_REQUEST_ID });
                const insertTransaction: any = [];
                for (let index = 0; index < chipAcceptDecline?.raw?.length; index++) {
                    const RECEIVER = chipAcceptDecline?.raw?.[index]?.REQUEST_CLUB_USER_ID;
                    const SENDER = chipAcceptDecline?.raw?.[index]?.RECEIVER_CLUB_USER_ID;
                    const CHIP = chipAcceptDecline?.raw?.[index]?.CHIP;
                    insertTransaction.push({
                        RECEIVER,
                        SENDER,
                        CHIP,
                        TRANSACTION_TYPE: TransactionType.CHIP_SEND
                    });
                    await addChip({ CHIP: CHIP }, { ID: [RECEIVER] });
                }
                await insertManyTransaction(insertTransaction);
                await subtractAgentChip({ CHIP: sum }, { ID: [getUser.ID] });
                return { status: true, message: "Add Chip" };
            }
        } else {
            const chipAcceptDecline = await deleteChipRequest({ ID: CHIP_REQUEST_ID });
            return { status: false, message: "Chip Request Successfully Decline." };
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club Service is not reachable."
        );
    }
}

async function addChipService(data: any) {
    try {
        const {
            USER_CLUB_ID,
            CHIP,
            type
        } = data;
        if (type === "add") {
            await addChip({ CHIP: CHIP }, { ID: [USER_CLUB_ID] });
            return { message: "Add Chip" };
        } else if (type === "subtract") {
            await subtractChip({ CHIP: CHIP }, { ID: [USER_CLUB_ID] });
            return { message: "Subtract Chip" };
        } else {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Chip Service is not reachable."
            );
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Add and Subtract Service are not reachable."
        );
    }
}

export { chipRequestService, chipRequestListService, chipAcceptDeclineService, addChipService };