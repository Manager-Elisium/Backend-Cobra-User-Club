import { addAgentChip, addChip, getTypeSumByClubIdForAgent, getTypeSumByClubIdForOwner, getTypeSumByClubIdForPlayer, getUserType, subtractAgentChip, subtractChip } from "src/repository/club-user.repository";
import { ErrorCodes } from "src/common/error-type";
import StandardError from "src/common/standard-error";
import { countInvitedClubUser } from "src/repository/club-request.repository";
import { TransactionType } from "src/domain/chip-transaction.entity";
import { getAllTransactionAgent, getAllTransactionOwner, getAllTransactionPlayer, getTransactionOwner, getTransactionPlayer, insertManyTransaction } from "src/repository/chip-transaction.repository";
import { countChipRequestClubUser } from "src/repository/chip-request.repository";
import { UserType } from "src/domain/club-user.entity";

async function getClubAndUserType(data: any) {
    try {
        const getUserTypo = await getUserType({
            where: { USER_ID: data?.USER_ID, CLUB_ID: data?.clubId }
        });
        // owner-1) unlimited (manthan), 2) agent (total chip), 3) player (total chip), 4) current chip (khud player)
        // agent-1) agent - player(total chip), 2) agent current chip (send player chip), 3) current chip (khub player)
        if (getUserTypo?.TYPE === "Owner") {
            const getDashBoard = await getTypeSumByClubIdForOwner(data?.clubId);
            const getPlayerTypo = await getUserType({
                where: { USER_ID: data?.USER_ID, CLUB_ID: data?.clubId, TYPE: UserType.PLAYER }
            });
            const allTypes = ["Owner", "Agent", "Player"];
            const currentResultMap = new Map(getDashBoard.map(item => [item.TYPE, item]));
            console.log(`currentResultMap ::: `, currentResultMap)
            let agent_as_player = 0;
            const finalResult = allTypes.map(type => {
                if (type === "Agent") {
                    agent_as_player += Number((currentResultMap?.get(type) || { CHIP: "0" })?.CHIP ?? "0")
                    return {
                        TYPE: type,
                        CHIP: (currentResultMap?.get(type) || { CHIP: "0" })?.AGENT_CHIP ?? "0"
                    }
                } else {
                    return {
                        TYPE: type,
                        CHIP: (Number((currentResultMap.get(type) || { CHIP: "0" }).CHIP) + agent_as_player).toString()
                    }
                }
            });
            finalResult.push({
                TYPE: "Own Player",
                CHIP: getPlayerTypo?.CHIP?.toString() ?? "0"
            })
            console.log(`Final Result ::: `, finalResult)
            const countInvitedClubPlayer = await countInvitedClubUser({ USER_ID: data?.USER_ID });
            const countChipRequest = await countChipRequestClubUser({ USER_CLUB_ID: getUserTypo?.ID });
            return { message: "Owner Dashboard", getDashBoard: finalResult, countInvitedClubPlayer, countChipRequest };
        } else if (getUserTypo?.TYPE === "Agent") {
            const getDashBoard = await getTypeSumByClubIdForAgent(data?.clubId, getUserTypo?.ID);
            const allTypes = ["Player"];
            const currentResultMap = new Map(getDashBoard.map(item => [item.TYPE, item]));
            const finalResult = allTypes.map(type => ({
                TYPE: type,
                CHIP: (currentResultMap.get(type) || { CHIP: "0" }).CHIP
            }));
            finalResult.push({
                TYPE: "Current Agent Chip",
                CHIP: getUserTypo?.AGENT_CHIP?.toString() ?? "0"
            })
            finalResult.push({
                TYPE: "Current Player Chip",
                CHIP: getUserTypo?.CHIP?.toString() ?? "0"
            })
            console.log(`getDashBoard ::: `, getDashBoard)
            console.log(`getUserTypo?.TYPE ::::: `, finalResult);
            const countInvitedClubPlayer = await countInvitedClubUser({ USER_ID: data?.USER_ID });
            const countChipRequest = await countChipRequestClubUser({ USER_CLUB_ID: getUserTypo?.ID });
            return { message: "Agent Dashboard", getDashBoard: finalResult, countInvitedClubPlayer, countChipRequest };
        } else if (getUserTypo?.TYPE === "Player") {
            const getDashBoard = await getTypeSumByClubIdForPlayer(data?.clubId, data?.USER_ID);
            return { message: "Player Dashboard", getDashBoard };
        } else {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "User Type Service."
            );
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Dashboard User Service."
        );
    }
}


async function chipSendOutClub(data: any) {
    try {
        const { USER_CLUB_ID, CHIP, USER_ID } = data;
        const getUserTypo = await getUserType({
            where: { USER_ID: USER_ID, CLUB_ID: data?.clubId }
        });
        let totalChip = 0;
        const insertTransaction: any = [];
        for (let index = 0; index < USER_CLUB_ID.length; index++) {
            const RECEIVER = USER_CLUB_ID[index];
            if (getUserTypo?.TYPE === "Owner") {
                const getUserOwnerTypo = await getUserType({
                    where: { ID: RECEIVER }
                });
                if (getUserOwnerTypo?.TYPE === UserType.AGENT) {
                    USER_CLUB_ID.splice(index, 1);
                    const addChipPlayerAndAgent = await addAgentChip({ CHIP: CHIP }, { ID: [getUserOwnerTypo.ID] });
                }
            }
            if (getUserTypo?.TYPE === "Agent" && getUserTypo?.ID === RECEIVER) {
                if (getUserTypo.AGENT_CHIP >= totalChip) {
                    USER_CLUB_ID.splice(index, 1);
                    const addChipPlayerForAgent = await addChip({ CHIP: CHIP }, { ID: [RECEIVER] });
                    console.log(`addChipPlayerForAgent ::: `, addChipPlayerForAgent)
                    if (addChipPlayerForAgent?.affected) {
                        const subtractPlayerForAgent = await subtractAgentChip({ CHIP: CHIP }, { ID: [RECEIVER] });
                        console.log(`subtractPlayerForAgent ::: `, subtractPlayerForAgent)
                    }
                }
            }
            insertTransaction.push({
                RECEIVER, SENDER: getUserTypo.ID, CHIP, TRANSACTION_TYPE: TransactionType.CHIP_SEND
            })
            totalChip += CHIP;
        }
        if (getUserTypo?.TYPE === "Owner") {
            const addChipPlayerAndAgent = await addChip({ CHIP: CHIP }, { ID: USER_CLUB_ID });
            await insertManyTransaction(insertTransaction);
            return { message: "Add Chip", addChipPlayerAndAgent, success: true };
        } else if (getUserTypo?.TYPE === "Agent") {
            if (getUserTypo.AGENT_CHIP >= totalChip) {
                if (USER_CLUB_ID?.length > 0) {
                    await addChip({ CHIP: CHIP }, { ID: USER_CLUB_ID });
                    await subtractAgentChip({ CHIP: CHIP }, { ID: [getUserTypo?.ID] });
                }
                await insertManyTransaction(insertTransaction);
                return { message: "Add Chip", success: true };
            } else {
                return { message: "You don't have enough chip.", success: false };
            }

        } else {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Send Chip Service."
            );
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Send Chip Service."
        );
    }
}

async function chipClaimBackClub(data: any) {
    try {
        const { USER_CLUB_ID, CHIP, USER_ID } = data;
        const getUserTypo = await getUserType({
            where: { USER_ID: USER_ID, CLUB_ID: data?.clubId }
        });
        let totalChip = 0;
        const insertTransaction: any = [];
        for (let index = 0; index < USER_CLUB_ID.length; index++) {
            const RECEIVER = USER_CLUB_ID[index];
            insertTransaction.push({
                RECEIVER, SENDER: getUserTypo.ID, CHIP, TRANSACTION_TYPE: TransactionType.CLAIM_BACK
            })
            if (getUserTypo?.TYPE === "Owner") {
                const getUserOwnerTypo = await getUserType({
                    where: { ID: RECEIVER }
                });
                if (getUserOwnerTypo?.TYPE === UserType.AGENT) {
                    USER_CLUB_ID.splice(index, 1);
                    await subtractAgentChip({ CHIP: CHIP }, { ID: [getUserOwnerTypo.ID] });
                }
            }
            totalChip += CHIP;
        }
        if (getUserTypo?.TYPE === "Owner") {
            const claimChipPlayerAndAgent = await subtractChip({ CHIP: CHIP }, { ID: USER_CLUB_ID });
            await insertManyTransaction(insertTransaction);
            return { message: "Claim Chip", claimChipPlayerAndAgent };
        } else if (getUserTypo?.TYPE === "Agent") {
            await subtractChip({ CHIP: CHIP }, { ID: USER_CLUB_ID });
            await addAgentChip({ CHIP: totalChip }, { ID: [getUserTypo.ID] });
            await insertManyTransaction(insertTransaction);
            return { message: "Claim Chip" };
        } else {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Claim Chip Service."
            );
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Claim Chip Service."
        );
    }
}


async function transactionClub(data: any) {
    try {
        const { USER_CLUB_ID, CHIP, CLUB: USER_ID, LIMIT, START, TRANSACTION_TYPE } = data;
        const getUserTypo = await getUserType({
            where: { USER_ID: USER_ID, CLUB_ID: data?.clubId }
        });
        if (getUserTypo?.TYPE === "Owner") {
            if (TRANSACTION_TYPE.toLowerCase() === "all") {
                const transaction = await getAllTransactionOwner({
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Transaction", transaction };
            } else {
                const transaction = await getTransactionOwner({
                    TRANSACTION_TYPE,
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Transaction", transaction };
            }
        } else if (getUserTypo?.TYPE === "Agent") {
            if (TRANSACTION_TYPE.toLowerCase() === "all") {
                const transaction = await getAllTransactionAgent({
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Transaction", transaction };
            } else {
                const transaction = await getTransactionOwner({
                    TRANSACTION_TYPE,
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Transaction", transaction };
            }
        } else {
            if (TRANSACTION_TYPE.toLowerCase() === "all") {
                const transaction = await getAllTransactionPlayer({
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Player Transaction", transaction };
            } else {
                const transaction = await getTransactionPlayer({
                    TRANSACTION_TYPE,
                    SENDER_ID: getUserTypo?.ID,
                    TAKE: LIMIT,
                    SKIP: START
                });
                return { message: "Player Transaction", transaction };
            }
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Claim Chip Service."
        );
    }
}

export { getClubAndUserType, chipSendOutClub, chipClaimBackClub, transactionClub };