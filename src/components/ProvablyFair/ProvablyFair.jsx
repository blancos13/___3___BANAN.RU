import React from "react"
import AboutGameHistory, {
    AboutGameHistoryHead,
} from "../GamesHistory/AboutGameHistory"
import "./ProvablyFair.scss"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"

const ProvablyFair = ({ id, game, setModalOnBtnBefore, setModalChild }) => {
    const { t } = useTranslation()

    setModalOnBtnBefore(() => {
        setModalChild(
            <AboutGameHistory
                id={id}
                game={game}
                setModalOnBtnBefore={setModalOnBtnBefore}
                setModalChild={setModalChild}
            />,
            `${t("history.Game")} #${id}`,
            true
        )
    })

    return (
        <div className={`provably-fair`}>
            <div className='provably-fair__container'>
                <AboutGameHistoryHead
                    verifyInner={t("provably-fair.title")}
                    game={game}
                    withoutProvablyFair={true} //crashRes , salt
                >
                    <div className={`provably-fair__head-bottom`}>
                        {t("provably-fair.verifyGuide", {
                            crashRes: game?.kofX ? game.kofX : 1.71,
                            salt: game?.salt
                                ? game.salt
                                : "6505a15facbb1245685108ff60d78c35",
                        })}
                    </div>
                </AboutGameHistoryHead>

                <div className='provably-fair__body'>
                    {t("provably-fair.description", {
                        returnObjects: true,
                    }).map((paragraph) => (
                        <p>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProvablyFair
