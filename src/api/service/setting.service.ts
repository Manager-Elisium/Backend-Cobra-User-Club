import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { deleteUserClub, getUserDetailClub, getUserType, updateUser } from 'src/repository/club-user.repository';
import { UserClub, UserType } from 'src/domain/club-user.entity';
import { deleteAllTransaction } from 'src/repository/chip-transaction.repository';
import { deleteAllTable } from 'src/repository/club-table.repository';
import { deleteAllChipRequest } from 'src/repository/chip-request.repository';
import { deleteAllClubRequest } from 'src/repository/club-request.repository';
import { deleteRequestClub } from 'src/repository/request.repository';
import { deleteClubs } from 'src/repository/club.repository';



async function settingClubService(data: any) {
    try {
        const {
            clubId,
            USER_ID,
            USER_CLUB_ID
        } = data;
        const club_id = clubId;
        delete data.clubId, delete data.USER_ID, delete data.USER_CLUB_ID;
        const query = {
            ID: !!USER_CLUB_ID ? USER_CLUB_ID : USER_ID
        }
        if (!!data.TYPE) {
            if (data.TYPE === "Agent") {
                data.TYPE = UserType.AGENT;
            } else if (data.TYPE === "Player") {
                data.TYPE = UserType.PLAYER;
            }
        }
        if (!!data.IS_DELETE) {
            data.IS_DELETE = true;
            const getUserClub = await getUserType({
                where: { ID: USER_CLUB_ID }
            });
            if (getUserClub?.TYPE === "Owner") {
                // Delete All Data
                // club table
                // transaction
                // chip request
                // club request
                // request
                // player, agent, owner
                // club
                await deleteAllTable({ CLUB_ID: club_id });
                await deleteAllTransaction({ CLUB_ID: club_id });
                await deleteAllChipRequest({ CLUB_ID: club_id });
                await deleteAllClubRequest({ CLUB_ID: club_id });
                await deleteRequestClub({ CLUB_ID: club_id });
                await deleteUserClub({ CLUB_ID: club_id });
                await deleteClubs({ CLUB_ID: club_id });
            } else if (getUserClub?.TYPE === "Agent") {
                // Under Remove All User
                // agent , player update delete
                // update : owner  
                const getUser = await updateUser(query, data as UserClub);
                if (getUser?.affected) {
                    const whereUser = {
                        REFERRED_ID: getUser?.raw?.[0]?.ID
                    }
                    const updateUsers = {
                        REFERRED_ID: getUser?.raw?.[0]?.REFERRED_ID 
                    }
                    await updateUser(whereUser, updateUsers as UserClub);
                }
                return getUser
            } else if (getUserClub?.TYPE === "Player") { 
                // Remove Player
                // update : owner
                const getUser = await updateUser(query, data as UserClub);
                return getUser
            }
        } else {
            const getUser = await updateUser(query, data as UserClub);
            return getUser;
        }
        
    } catch (error) {
        console.log(`Delete Error :::: `, error)
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club Service is not reachable."
        );
    }
}

export { settingClubService };