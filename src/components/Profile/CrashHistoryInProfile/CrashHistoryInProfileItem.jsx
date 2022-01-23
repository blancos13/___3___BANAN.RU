import React from "react"
import { CrashAllBetsItem } from "../../CrashPage/CrashAllBets"
import "./CrashHistoryInProfileItem.scss"

const CrashHistoryInProfileItem = ({
    totalBetsValue,
    time,
    betsValueWin,
    gameId,
    items,
    kofX,
    kofxVictory,
    skinsVictory,
    allPlayers,
    gameText,
    playersText,
}) => {
    return (
        <div
            class={`crash-history-in-profile-item ${
                !kofxVictory && "crash-history-in-profile-item-crashed"
            }`}
        >
            <header class='crash-history-in-profile-item__header crash-history-in-profile-item-header'>
                <div
                    class={`${
                        kofX < 1.3
                            ? "red-x-in-history"
                            : kofX >= 2
                            ? "yellow-x-in-history"
                            : "grey-x-in-history"
                    } crash-history-in-profile-item-header__kof-x`}
                >
                    {kofX}x
                </div>

                <div class='crash-history-in-profile-item-header__game-id'>
                    {gameText} #{gameId} ({playersText}: {allPlayers})
                </div>

                <div class='crash-history-in-profile-item-header__time'>{time}</div>
            </header>

            <footer class='crash-history-in-profile-item__footer'>
                <CrashAllBetsItem
                    weapoinItemContainerStyle={{ background: "rgba(30,30,35,0)" }}
                    key={gameId + totalBetsValue}
                    crashed={!kofxVictory}
                    betsValueWin={betsValueWin}
                    totalBetsSumma={totalBetsValue}
                    skinsVictory={skinsVictory}
                    items={items}
                    kofX={kofxVictory}
                    withoutAvatar={true} // true!
                    inGame={false}
                />
            </footer>
        </div>
    )
}

export default CrashHistoryInProfileItem
