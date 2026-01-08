import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { createUserClub, getUserType } from 'src/repository/club-user.repository';
import { UserType } from 'src/domain/club-user.entity';
import { countRequestClub, createRequestClub, deleteClubRequest, requestedClubUser, requestedUserListClub } from 'src/repository/request.repository';

async function joinClubService(data: any) {
    try {
    // REQUEST_FROM_USER_ID: string;
    // REQUEST_TO_USER_CLUB_ID: string;
    // REQUEST_TO_USER_ID: string;
    // REQUEST_TO_CLUB_ID: Club;

        const query = {
            where: {
                REQUEST_FROM_USER_ID: data.USER_ID, // Send Request ID
                REQUEST_TO_CLUB_ID: { CLUB_ID: data.id } // Request CLub
            }
        };
        const isPresentClubRequest = await countRequestClub(query);
        if (isPresentClubRequest) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Already Send Request This Club."
            );
        }
        const getQuery = {
            where: {
                CLUB_ID: data.id,
                TYPE: UserType.OWNER
            }
        };
        const getClub = await getUserType(getQuery);
        const insertQuery = {
            REQUEST_FROM_USER_ID: data.USER_ID, // Request: Club ID (in body)
            REQUEST_TO_CLUB_ID: data.id, // Request: Club ID (in body)
            REQUEST_TO_USER_ID: getClub?.USER_ID, // Accept - Decline
            REQUEST_TO_USER_CLUB_ID: getClub?.ID // Accept - Decline
        }
        const sendRequest = await createRequestClub(insertQuery);
        return sendRequest;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Request Join Club -- Error."
        );
    }
}


async function requestedUserClubService(data: any) {
    try {
        const query = {
            USER_ID: data.USER_ID
        }
        const requestedUserClub = await requestedClubUser(query);
        return requestedUserClub;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Request Join Club -- Error."
        );
    }
}


async function acceptDeclineUserClubService(data: any) {
    try {
        const deleteRequest = await deleteClubRequest(data?.REQUEST_ID);
        if (data.isAccept) {
            const jointClub = {
                USER_ID: deleteRequest?.raw?.[0]?.REQUEST_FROM_USER_ID,
                CLUB_ID: deleteRequest?.raw?.[0]?.REQUEST_TO_CLUB_ID,
                REFERRED_ID: deleteRequest?.raw?.[0]?.REQUEST_TO_USER_CLUB_ID
            }
            await createUserClub(jointClub);
        }
        return { message: data.isAccept ? "Join Successfully Club." : "Decline Join Club." };
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Accept - Decline User Service."
        );
    }
}


async function requestedListUserService(data: any) {
    try {
        const query = {
            CLUB_ID: data.CLUB_ID
        }
        const requestedUserClub = await requestedUserListClub(query);
        return requestedUserClub;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Request Join Club -- Error."
        );
    }
}

export { joinClubService, requestedUserClubService, acceptDeclineUserClubService, requestedListUserService };