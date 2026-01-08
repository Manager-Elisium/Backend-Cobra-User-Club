import StandardError from 'src/common/standard-error';
import { ErrorCodes } from 'src/common/error-type';
import { countClub, insertClub } from 'src/repository/club.repository';



async function listClubService(data: any) {
    try {
        const { userId } = data;
        return {
            "list": [{
                "POSTION": "Owner",
                "NAME": "Club 1",
                "TOTAL_GAME_PLAYED": 100,
                "CURRENT_CHIP": 0
            }, {
                "POSTION": "Agent",
                "NAME": "Club 2",
                "TOTAL_GAME_PLAYED": 100,
                "CURRENT_CHIP": 10000
            }, {
                "POSTION": "Player",
                "NAME": "Club 1",
                "CURRENT_CHIP": 1000,
                "TOTAL_GAME_PLAYED": 100
            }]
        }
    } catch (error) {
        throw new StandardError(
            ErrorCodes.API_VALIDATION_ERROR,
            error?.message ?? "Club Service is not reachable."
        );
    }
}

export { listClubService };