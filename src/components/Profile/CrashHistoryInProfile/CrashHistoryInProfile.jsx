import React from "react"
import CrashHistoryInProfileItem from "./CrashHistoryInProfileItem"
import { useTranslation } from "react-i18next"
import "../../../utils/i18next"
import "./CrashHistoryInProfile.scss"
/* 
    betsValueWin: 2.83
    gameId: 25718
    items: (2) [{…}, {…}]
    kofX: 4.92
    kofxVictory: 1.48
    skinsVictory: {idItem: '6124a24de9a15ea77ad325f8', weaponName: 'FAMAS | Valence (Minimal Wear)', price: 2.83, imgSrc: 'https://community.cloudflare.steamstatic.com/econo…dwZtaQnV-Fi4k-vph8e0vcmYzXBlvCNw7X7UgVXp1iHYIfHn/', rarity: 'Restricted'}
    time: "10:59"
    totalBetsValue
 */

const CrashHistoryInProfile = ({ crashBets }) => {
    const { t } = useTranslation()

    return (
        <div class='crash-history-in-profile'>
            <div class='crash-history-in-profile__column'>
                {crashBets.map((bet) => (
                    <CrashHistoryInProfileItem
                        playersText={t("history.Game")}
                        gameText={t("crash.players")}
                        key={bet.gameId}
                        {...bet}
                    />
                ))}
            </div>
        </div>
    )
}

export default CrashHistoryInProfile
