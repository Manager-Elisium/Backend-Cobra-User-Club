import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { countTable, insertTable, listTable } from 'src/repository/club-table.repository';
import { getUserDetailClub } from 'src/repository/club-user.repository';
import { UserType } from 'src/domain/club-user.entity';

async function createTableService(data: any) {
    try {
        const { NAME } = data;
        const query = {
            where: {
                NAME
            }
        }
        const isPresent = await countTable(query);
        if (isPresent) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Table Name is exists."
            );
        }
        const setData = {
            DESIGN_TYPE: data?.DESIGN_TYPE,
            NO_OF_PLAYER: data?.NO_OF_PLAYER,
            TURN_TIME: data?.TURN_TIME,
            NAME: data?.NAME,
            ENTRY_FEES: data?.ENTRY_FEES,
            RAKE: data?.RAKE,
            IN_GAME_INTERACTIONS: data?.IN_GAME_INTERACTIONS,
            CLUB_ID: data?.CLUB_ID,
            TABLE_ID: data?.TABLE_ID
        }
        const create = await insertTable(setData);
        if (!create) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Table is not created."
            );
        }
        return create;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Table is not created."
        );
    }
}



async function getTableListService(data: any) {
    try {
        const { clubId, USER_ID, tableNumber, isRunningTable } = data;
        const query = !!tableNumber ? {
            where: {
                NO_OF_PLAYER: parseInt(tableNumber),
                IN_RUNNING_TABLE: isRunningTable,
                CLUB_ID: clubId
            },
            relations: ['CLUB_ID']
        } : {
            where: {
                IN_RUNNING_TABLE: isRunningTable,
                CLUB_ID: clubId
            },
            relations: ['CLUB_ID']
        }
        const getClub = await getUserDetailClub({
            where: { USER_ID, CLUB_ID: clubId, IS_DELETE: false },
            relations: ['CLUB_ID']
        })
        const listTableDetails = await listTable(query);
        console.log(`getClub :::: `, getClub?.some((data) => data.TYPE === UserType.OWNER))
        if (getClub?.some((data) => data.TYPE === UserType.OWNER)) {
            const getPlayerChip = getClub?.find((data) => data.TYPE === UserType.PLAYER);
            const ownerPlayer = getClub?.find((data) => data.TYPE === UserType.OWNER);
            return { getClub: [{ ...ownerPlayer, PLAYER_ID: getPlayerChip?.ID, CHIP: getPlayerChip?.CHIP }], listTableDetails };
        } else {
            return { getClub, listTableDetails };
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Table List is not found."
        );
    }
}

export { createTableService, getTableListService };