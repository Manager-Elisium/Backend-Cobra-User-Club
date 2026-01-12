import axios from "axios";
import { ErrorCodes } from "src/common/error-type";
import StandardError from "src/common/standard-error";
import { UserClub, UserType } from "src/domain/club-user.entity";
import {
  clubUser,
  countRequestClub,
  createRequestClub,
  deleteClubRequestByClub,
  invitedClubUser,
} from "src/repository/club-request.repository";
import {
  getUserDetailClub,
  getUserType,
  listUserClub,
} from "src/repository/club-user.repository";
import { getOneClub } from "src/repository/club.repository";
import { In, Not } from "typeorm";

async function memberClubService(data: any) {
  try {
    let getClubType;
    if (!!data?.userClubId) {
      getClubType = await getUserType({
        where: {
          CLUB_ID: data?.clubId,
          ID: data?.userClubId,
          IS_DELETE: false,
        },
      });
    } else {
      getClubType = await getUserType({
        where: {
          CLUB_ID: data?.clubId,
          USER_ID: data?.USER_ID,
          IS_DELETE: false,
        },
      });
    }
    // if (getClubType?.length > 0) {
    const getType = getClubType;
    if (getType?.TYPE === "Owner") {
      const query = {
        where: {
          CLUB_ID: data?.clubId,
          IS_DELETE: false,
        },
      };
      const getUserDetail = await getUserDetailClub(query);
      const ownerData = getUserDetail?.find((data) => {
        return data?.USER_ID === getType?.USER_ID && data?.TYPE === "Owner";
      });
      const ownerPlayerData = getUserDetail?.find(
        (data) => data?.USER_ID === getType?.USER_ID && data?.TYPE === "Player"
      );
      const playerData = getUserDetail?.filter(
        (data) => data?.USER_ID !== getType?.USER_ID
      );
      const getUser = [
        {
          ...ownerData,
          CHIP: ownerPlayerData?.CHIP,
          PLAYER_ID: ownerPlayerData?.ID,
        },
        ...playerData,
      ];
      const getUserList = [ownerData, ...playerData]?.map(
        (data) => data?.USER_ID
      );
      // const getUserList = getUser?.filter((data) => data?.USER_ID === getType?.USER_ID && getType?.TYPE !== UserType.PLAYER);
      let userInfo = (await axios.post(
        `http://43.204.102.183:3003/friend/list-user-details`,
        {
          userId: getUserList.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )) as any;
      if (data?.type === "Agent") {
        return getUser
          ?.filter((data) => data.TYPE === "Agent")
          ?.map((data) => {
            let getData = userInfo?.data?.users?.find(
              (inner) => inner.ID === data.USER_ID
            );
            // let isOwner = getUserList?.includes(data?.USER_ID);
            return {
              ...data,
              USER_NAME: getData?.USER_NAME,
              AVATAR: getData?.AVATAR,
              FB_PROFILE: getData?.FB_PROFILE,
              COUNTRY_CODE: getData?.COUNTRY_CODE,
              FRAME: getData?.FRAME,
              ONLINE: getData?.ONLINE,
              SOCKET_ID: getData?.SOCKET_ID,
              TYPE: data?.TYPE,
            };
          });
      } else if (data?.type === "Player") {
        return getUser
          ?.filter((data) => data.TYPE === "Player")
          ?.map((data) => {
            let getData = userInfo?.data?.users?.find(
              (inner) => inner.ID === data.USER_ID
            );
            // let isOwner = getUserList?.includes(data.USER_ID);
            return {
              ...data,
              USER_NAME: getData?.USER_NAME,
              AVATAR: getData?.AVATAR,
              FB_PROFILE: getData?.FB_PROFILE,
              COUNTRY_CODE: getData?.COUNTRY_CODE,
              FRAME: getData?.FRAME,
              ONLINE: getData?.ONLINE,
              SOCKET_ID: getData?.SOCKET_ID,
              TYPE: data?.TYPE,
            };
          });
      } else {
        return getUser?.map((data) => {
          let getData = userInfo?.data?.users?.find(
            (inner) => inner.ID === data.USER_ID
          );
          // let isOwner = getUserList?.includes(data.USER_ID);
          return {
            ...data,
            USER_NAME: getData?.USER_NAME,
            AVATAR: getData?.AVATAR,
            FB_PROFILE: getData?.FB_PROFILE,
            COUNTRY_CODE: getData?.COUNTRY_CODE,
            FRAME: getData?.FRAME,
            ONLINE: getData?.ONLINE,
            SOCKET_ID: getData?.SOCKET_ID,
            TYPE: data?.TYPE,
          };
        });
      }
    } else if (getType?.TYPE === "Agent") {
      const query = {
        where: {
          CLUB_ID: data?.clubId,
          REFERRED_ID: { ID: getClubType?.ID },
          TYPE: In([UserType.AGENT, UserType.PLAYER]),
          IS_DELETE: false,
        },
      };
      const getAgentUser = await getUserDetailClub(query);
      const getUser = [...getAgentUser, getClubType];
      const getUserList = [
        ...getUser?.map((data) => data.USER_ID),
        getType?.USER_ID,
      ];
      let userInfo = (await axios.post(
        `http://43.204.102.183:3003/friend/list-user-details`,
        {
          userId: getUserList.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )) as any;
      return [
        ...getUser?.map((data) => {
          let getData = userInfo?.data?.users?.find(
            (inner) => inner.ID === data.USER_ID
          );
          let isOwner = getUserList?.includes(data.USER_ID);
          return {
            ...data,
            USER_NAME: getData?.USER_NAME,
            AVATAR: getData?.AVATAR,
            FB_PROFILE: getData?.FB_PROFILE,
            COUNTRY_CODE: getData?.COUNTRY_CODE,
            FRAME: getData?.FRAME,
            ONLINE: getData?.ONLINE,
            SOCKET_ID: getData?.SOCKET_ID,
            TYPE: data?.TYPE,
          };
        }),
      ];
    } else {
      const query = {
        where: {
          CLUB_ID: data?.clubId,
          USER_ID: data.USER_ID,
          TYPE: In([UserType.PLAYER]),
          IS_DELETE: false,
        },
      };
      const getUser = await getUserDetailClub(query);
      const getUserList = getUser?.map((data) => data.USER_ID);
      let userInfo = (await axios.post(
        `http://43.204.102.183:3003/friend/list-user-details`,
        {
          userId: getUserList.toString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )) as any;
      return getUser?.map((data) => {
        let getData = userInfo?.data?.users?.find(
          (inner) => inner.ID === data.USER_ID
        );
        let isOwner = getUserList?.includes(data.USER_ID);
        return {
          ...data,
          USER_NAME: getData?.USER_NAME,
          AVATAR: getData?.AVATAR,
          FB_PROFILE: getData?.FB_PROFILE,
          COUNTRY_CODE: getData?.COUNTRY_CODE,
          FRAME: getData?.FRAME,
          ONLINE: getData?.ONLINE,
          SOCKET_ID: getData?.SOCKET_ID,
          TYPE: data?.TYPE,
        };
      });
    }
    // }
    // else {
    //     return getClubType;
    // }
  } catch (error) {
    throw new StandardError(
      ErrorCodes.API_VALIDATION_ERROR,
      error?.message ?? "Club Member List is not found."
    );
  }
}

async function inviteNewPlayerService(data: any) {
  try {
    const query = {
      where: {
        CLUB_ID: data?.clubId,
        IS_DELETE: false,
      },
    };
    let invitedUser = await clubUser({
      where: {
        REQUESTED_USER_ID: data?.USER_ID,
        INVITED: { CLUB_ID: data?.clubId },
      },
    });
    const getUser = await getUserDetailClub(query);
    let friendList = (await axios.get(
      `http://43.204.102.183:3003/friend/my-friend-list/${data?.USER_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )) as any;
    const currentClubUser = getUser?.map((data) => data.USER_ID);
    const currentFriend = friendList?.data?.friends?.filter(
      (data) => !currentClubUser.includes(data.ID)
    );
    const currentInvited = invitedUser?.map((data) => data?.INVITED_USER_ID);
    return currentFriend?.map((data) => {
      const isSendRequest = currentInvited?.includes(data?.ID);
      return {
        ...data,
        IS_SEND_REQUEST: isSendRequest,
      };
    });
  } catch (error) {
    throw new StandardError(
      ErrorCodes.API_VALIDATION_ERROR,
      error?.message ?? "Club Member List is not found."
    );
  }
}

async function joinClubService(data: any) {
  try {
    if (data.isJoin) {
      // Request
      // INVITED: Club;

      // Request
      // INVITED_USER_ID: string;

      // Club Owner OR Request Agent
      // Accept - Decline
      // REQUESTED_USER_CLUB_ID: string;

      // Club Owner OR Request Agent
      // Accept - Decline
      // REQUESTED_USER_ID: string;

      console.log(`Request Data :::: `, data);

      const query = {
        where: {
          INVITED_USER_ID: data.USER_ID, // Send Request ID
          INVITED: { CLUB_ID: data.clubId }, // Request CLub
        },
      };
      const isPresentClubRequest = await countRequestClub(query);
      console.log(`isPresentClubRequest :::: `, isPresentClubRequest);
      if (isPresentClubRequest) {
        throw new StandardError(
          ErrorCodes.API_VALIDATION_ERROR,
          "Already Send Request This Club."
        );
      }
      const getQuery = {
        where: {
          CLUB_ID: data.clubId,
        },
      };
      const getClub = await getOneClub(getQuery);
      console.log(`getClub :::: `, getClub);
      const isAgent = getClub?.USER_ID != data?.REQUESTED_USER_ID;
      console.log(`isAgent :::: `, isAgent);
      const getQueryData = {
        where: {
          CLUB_ID: data.clubId,
          USER_ID: data?.USER_ID,
        },
      };

      const getClubUser = await getUserType(getQueryData);
      console.log(`getClubUser :::: `, getClubUser);
      const insertQuery = {
        INVITED_USER_ID: data.USER_ID, // Request: Club ID (in body)
        INVITED: data.clubId, // Request: Club ID (in body)
        REQUESTED_USER_ID: data?.REQUESTED_USER_ID, // Accept - Decline
        REQUESTED_USER_CLUB_ID: getClubUser?.ID, // Accept - Decline
        IS_AGENT: isAgent,
      };

      const sendRequest = await createRequestClub(insertQuery);
      return sendRequest;
    } else {
      const query = {
        INVITED_USER_ID: data.USER_ID,
        INVITED: data.clubId, // Request CLub
      };
      const deleteRequest = await deleteClubRequestByClub(query);
      return deleteRequest?.raw?.[0];
    }
  } catch (error) {
    throw new StandardError(
      ErrorCodes.API_VALIDATION_ERROR,
      error?.message ?? "Request Join Club -- Error."
    );
  }
}

async function searchInvitedClubService(data: any) {
  try {
    const query = {
      where: {
        CLUB_ID: data?.clubId,
        USER_ID: Not(data?.REQUESTED_USER_ID),
        IS_DELETE: false,
      },
    };
    const getCurrentUser = await getUserDetailClub(query);
    const getCurrentUserId = getCurrentUser?.map((data) => data.USER_ID);
    console.log(`getCurrentUserId :::: `, getCurrentUserId);
    let friendList = (await axios.post(
      `http://43.204.102.183:3003/friend/search-invite-club-user`,
      {
        userId: getCurrentUser?.map((data) => data.USER_ID),
        name_id: data?.name_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )) as any;
    if (getCurrentUserId.includes(friendList?.data?.users?.ID)) {
      return { status: false, message: "Player is alreday in club." };
    }
    const getRequestUser = await clubUser({
      where: {
        INVITED_USER_ID: friendList?.data?.users?.ID,
      },
    });
    const IS_SEND_REQUEST =
      getRequestUser?.[0]?.INVITED_USER_ID === friendList?.data?.users?.ID;
    if (!!friendList?.data?.users?.ID) {
      return {
        status: true,
        searchUserInClub: { ...friendList?.data?.users, IS_SEND_REQUEST },
        message: "Get User",
      };
    } else {
      return { status: false, message: "Not Found" };
    }
  } catch (error) {
    throw new StandardError(
      ErrorCodes.API_VALIDATION_ERROR,
      error?.message ?? "Request Join Club -- Error."
    );
  }
}

export {
  memberClubService,
  inviteNewPlayerService,
  joinClubService,
  searchInvitedClubService,
};
