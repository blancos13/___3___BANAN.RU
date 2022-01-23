import { connect } from "react-redux"
import React from "react"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import copyIcn from "../../assets/image/copyIcn.svg"
import { compose } from "redux"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import GamesHistory from "../GamesHistory/GamesHistory"
import { useTranslation } from "react-i18next"
import "../../utils/i18next"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"

const CrashHistoryLine = ({
    XsHistory,
    hash,
    toggleShowModalWindow,
    setModalChild,
}) => {
    const { t } = useTranslation()

    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    return (
        <div class='crash__history-line crash-history-line'>
            <div class='crash-history-line__x-history'>
                {XsHistory.map((x, i) => {
                    if (
                        i >
                        (mediaQueries.laptop
                            ? mediaQueries.mobileS
                                ? 1
                                : 2
                            : 5)
                    )
                        return

                    return (
                        <BlackBtn
                            key={i + x}
                            classAdd={[
                                x < 1.3
                                    ? "red-x-in-history"
                                    : x >= 2
                                    ? "yellow-x-in-history"
                                    : "grey-x-in-history",
                            ]}
                            notButton={true}
                        >
                            {x}x
                        </BlackBtn>
                    )
                })}
                <div class='crash-history-line__fade' />
            </div>

            <GreyBtn
                onClick={() => {
                    toggleShowModalWindow()
                    setModalChild(<GamesHistory />, t("history.modalTitle"))
                }}
                classAdd={["crash-history-line__btn-check-history"]}
            >
                {t("header.History")}
            </GreyBtn>
            <div class='crash-history-line__hash'>
                {t("crash.Hash")}: <span>{hash}</span>{" "}
                <button>
                    <img src={copyIcn} alt='copy' />
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => state.crashInfo

const mapDispatchToProps = {}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withToggleShowModalWindow
)(CrashHistoryLine)
