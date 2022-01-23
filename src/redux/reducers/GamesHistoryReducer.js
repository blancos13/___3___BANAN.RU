export const SET_HISTORY = "SET_HISTORY"
export const LOAD_GAME = "LOAD_GAME"
export const SET_GAME_TYPE = "SET_GAME_TYPE"

const defaultState = {
    gameActive: {
        allBets: [],
        totalBetsSumma: "",
        amountOfPlayers: 0,
        weaponsValue: 0,

        kofX: "1.00",
        hash: "fefef",
        salt: "fefefe",
    },
    games: [
        {
            kofX: 123.4,
            id: 34567,
            time: "12:23",
            betsValue: 312.23,
            amountOfPlayers: 9,
        },
    ],
    currentGameType: "Crash",
}

const GamesHistoryReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_GAME_TYPE:
            return {
                ...state,
                currentGameType: action.gameType,
            }
        case SET_HISTORY:
            return {
                ...state,
                games: action.games,
            }
        case LOAD_GAME:
            return {
                ...state,
                gameActive: action.game,
            }
        default:
            return state
    }
}

export const setNewHistory = (games) => ({
    type: SET_HISTORY,
    games,
})

export const setGameType = (gameType) => ({
    type: SET_GAME_TYPE,
    gameType,
})

export const loadGame = (game) => ({
    type: LOAD_GAME,
    game,
})

export default GamesHistoryReducer
