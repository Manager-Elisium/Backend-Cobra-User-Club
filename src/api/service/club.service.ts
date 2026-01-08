import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { countClub, deleteClub, getClub, getOneClub, insertClub, updateAndReturnById } from 'src/repository/club.repository';
import { createUserClub, getUserDetailClub, getUserType, listUserClub, playerUserClub } from 'src/repository/club-user.repository';
import { countRequestClub, createRequestClub, deleteClubRequest, invitationsCount, invitedClubUser, requestedClubUser } from 'src/repository/club-request.repository';
import { Club } from 'src/domain/club.entity';
import { Not } from 'typeorm';
import { UserType } from 'src/domain/club-user.entity';
import { requestedCount } from 'src/repository/request.repository';



async function createClubService(data: any) {
    try {
        const { NAME } = data;
        const query = {
            where: {
                NAME
            }
        }
        const isPresent = await countClub(query);
        if (isPresent) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club Name is exists."
            );
        }
        const club = new Club();
        club.NAME = data.NAME;
        club.AVATAR = data.AVATAR;
        club.COUNTRY_CODE = data.COUNTRY_CODE;
        club.USER_ID = data.USER_ID;
        const create = await club.save();
        if (!create) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club is not created."
            );
        }
        const setData = {
            USER_ID: data?.USER_ID,
            TYPE: 'Owner',
            CLUB_ID: create?.CLUB_ID,
            CHIP: 0
        }
        const createUser = await createUserClub(setData);
        if (!createUser) {
            await deleteClub(create?.CLUB_ID);
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club is not created."
            );
        }
        const setCreateData = {
            USER_ID: data?.USER_ID,
            TYPE: 'Player',
            CLUB_ID: create?.CLUB_ID,
            CHIP: 0,
            REFERRED_ID: createUser?.ID
        }
        const createPlayer = await createUserClub(setCreateData);
        if (!createPlayer) {
            await deleteClub(create?.CLUB_ID);
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club is not created."
            );
        }
        
        delete create?.NOTICE_NAME, delete create.NOTICE_DESCRIPTION;
        const getClub = await getUserDetailClub({
            where: { ID: createUser.ID, CLUB_ID: create.CLUB_ID, IS_DELETE: false },
            relations: ['CLUB_ID']
        });
        return getClub;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club is not created."
        );
    }
}



async function updateClubService(data: any) {
    try {
        const { NAME, AVATAR } = data;
        const query = {
            where: {
                NAME,
                CLUB_ID: Not(data?.clubId)
            }
        }
        const isPresent = await countClub(query);
        if (isPresent) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club Name is exists."
            );
        }
        const update = await updateAndReturnById(data?.clubId, { NAME, AVATAR } as Club);
        if (!update) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club is not created."
            );
        }
        return update?.raw?.[0];
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club is not created."
        );
    }
}


async function updateNoticeClubService(data: any) {
    try {
        const { NOTICE_NAME, NOTICE_DESCRIPTION } = data;
        const update = await updateAndReturnById(data?.clubId, { NOTICE_NAME, NOTICE_DESCRIPTION } as Club);
        if (!update) {
            throw new StandardError(
                ErrorCodes.API_VALIDATION_ERROR,
                "Club is not updated."
            );
        }
        return update?.raw?.[0];
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club is not updated."
        );
    }
}


async function listUserClubService(data: any) {
    try {
        const query = {
            USER_ID: data.USER_ID,
            TYPE: "Player"
        };
        const getClubs = await Promise.all([
            await listUserClub(query),
            await requestedCount(query),
            await invitationsCount(query)]);
        console.log(`getClubs :::: `, getClubs?.[0])
        const ownerClub = (getClubs)?.[0]?.filter((fData) => fData?.user_id === data?.USER_ID && fData?.user_type !== "Player"); 
        const agentClub = (getClubs)?.[0]?.filter((fData) => fData?.user_id !== data?.USER_ID && fData?.user_type === "Agent");   
        const playerClub = (getClubs)?.[0]?.filter((fData) => fData?.user_id !== data?.USER_ID && fData?.user_type === "Player");
        console.log(`Owner Club `, ownerClub);
        console.log(`Player Club `, playerClub);
        return { clubList: [...(ownerClub), ...(agentClub), ...(playerClub)] ?? [], countRequested: (getClubs)?.[1] ?? 0, countInvitations: (getClubs)?.[2] ?? 0 };
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club List is not found."
        );
    }
}


async function searchUserClubService(data: any) {
    try {
        console.log(`Data ::: `, data)
        const query = {
            USER_ID: data.USER_ID
        };
        const searchClub = await playerUserClub(query);
        console.log(`searchClub ::: `, searchClub)
        const listClubId = searchClub?.map((data) => data?.club_id) ?? [];
        const getQuery = {
            listClubId,
            name: data?.name,
            id: data?.id
        };
        const getList = await getClub(getQuery);
        console.log(`getList dd ::::: `, getList?.filter((fData) => fData?.USER_ID !== data?.USER_ID))
        return getList?.filter((fData) => !listClubId.includes(fData?.CLUB_ID) && fData?.USER_ID !== data?.USER_ID) ?? [];
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club List is not found."
        );
    }
}


async function joinClubService(data: any) {
    try {
        const query = {
            where: {
                INVITED_USER_ID: data.USER_ID, // Send Request ID
                INVITED: { CLUB_ID: data.id } // Request CLub
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
            INVITED_USER_ID: data.USER_ID, // Request: Club ID (in body)
            INVITED: data.id, // Request: Club ID (in body)
            REQUESTED_USER_ID: getClub?.USER_ID, // Accept - Decline
            REQUESTED_USER_CLUB_ID: getClub?.ID // Accept - Decline
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
        const requestQuery = {
            REQUESTED_USER_ID: data.INVITED_USER_ID
        }
        const reqquestedUserClub = await requestedClubUser(requestQuery);
        return reqquestedUserClub;
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Request Join Club -- Error."
        );
    }
}


async function invitedUserClubService(data: any) {
    try {
        const requestQuery = {
            REQUESTED_USER_ID: data.REQUESTED_USER_ID
        }
        const reqquestedUserClub = await invitedClubUser(requestQuery);
        return reqquestedUserClub;
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
            let referredId = deleteRequest?.raw?.[0]?.REQUESTED_USER_CLUB_ID;
            if (!referredId) {
                const getQueryData = {
                    where: {
                        CLUB_ID: deleteRequest?.raw?.[0]?.INVITED,
                        USER_ID: deleteRequest?.raw?.[0]?.REQUESTED_USER_ID,
                    }
                };
                const getClubUser = await getUserType(getQueryData);
                referredId = getClubUser?.ID;
            }
            const jointClub = {
                USER_ID: deleteRequest?.raw?.[0]?.INVITED_USER_ID,
                CLUB_ID: deleteRequest?.raw?.[0]?.INVITED,
                REFERRED_ID: referredId ?? null
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



export {
    createClubService, updateClubService, updateNoticeClubService, listUserClubService, searchUserClubService,
    joinClubService, requestedUserClubService, invitedUserClubService, acceptDeclineUserClubService
};


interface ClubEntry {
    user_type: string;
    club_id: string;
    search_id: string;
    club_name: string;
    club_avatar: string;
    country_code: string;
    user_id: string;
}


// Function to remove duplicates based on user_id and club_id
const removeDuplicates = (entries: ClubEntry[]): ClubEntry[] => {
    const seen = new Set<string>();
    return entries.filter(entry => {
        const key = `${entry.user_id}_${entry.club_id}`;
        console.log(`key :::: `, key)
        if (seen.has(key)) {
            return false;
        } else {
            seen.add(key);
            return true;
        }
    });
};