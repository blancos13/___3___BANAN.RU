import React, { useState, useEffect, useRef } from "react"
import socket from "../../api/api"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import Options from "../common/Options/Options"
import InfoItemsLarge from "../common/infoItemsLarge/infoItemsLarge"
import bananaIcon from "../../assets/image/bananaIcn.svg"
import topRatio from "../../assets/image/topRatio.svg"
import pistol from "../../assets/image/pistol.svg"
import playerIcnYellow from "../../assets/image/playerIcnYellow.svg"
import playerIcn from "../../assets/image/playerIcn.svg"
import winRate from "../../assets/image/winRate.svg"
import loadingIcon from "../../assets/image/loadingIcon.svg"
import templateAva from "../../assets/image/templateAva.svg"
import SendInput from "../common/SendInput/SendInput"
import WithdrawDeposit from "../common/WithdrawDeposit/WithdrawDeposit"
import ChooseSide from "./ChooseSide"
import CrashHistoryInProfile from "./CrashHistoryInProfile/CrashHistoryInProfile"
import Preloader from "../common/Preloader/Preloader"
import Checkbox from "../common/Checkbox/Checkbox"
import { toggleBlurMessages } from "../../redux/reducers/ChatReducer"
import { connect, useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./Profile.scss"

const AnonimSettings = ({ checkBoxLabel }) => {
    const dispatch = useDispatch()

    const isMsgBlur = useSelector((state) => state.Chat.blurMessages)

    useEffect(() => {
        localStorage.setItem("isMsgBlur", isMsgBlur)
    }, [isMsgBlur])

    return (
        <div class='anonim-settings'>
            <div class='anonim-settings__body'>
                <Checkbox
                    style={{
                        transform: "translateX(-28px)",
                        width: "140px",
                        whiteSpace: "nowrap",
                    }}
                    onChange={() => dispatch(toggleBlurMessages())}
                    checked={isMsgBlur}
                >
                    {checkBoxLabel}
                </Checkbox>

                <div class='anonim-settings__template'>
                    <div className='anonim-settings__ava-block'>
                        <div class='anonim-settings__default-ava'>
                            <img src={templateAva} alt='ava' />
                        </div>
                        <span>Joyce</span>
                    </div>

                    <div class='anonim-settings__arrow'>
                        <div class='anonim-settings__arrow-inner'></div>
                    </div>
                    <div className='anonim-settings__ava-block'>
                        <div class='anonim-settings__blured-ava'>
                            <img src={templateAva} alt='ava' />
                        </div>
                        <span>*****</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --------------------------

const TradeUrlSettings = ({
    yourTradeUrl,
    findTheLinkLabel,
    saveLabel,
    settradeUrl,
    tradeUrl,
    dataTradeUrl,
}) => {
    return (
        <div class='profile-settings__trade-url'>
            <SendInput
                updateNewText={settradeUrl}
                innerInput={tradeUrl}
                placeholder={dataTradeUrl ? dataTradeUrl : yourTradeUrl}
                classAddDiv={["divInput"]}
                sendBtn={false}
            />

            <GreyBtn
                onClick={() => {
                    window.open(
                        "http://steamcommunity.com/id/jackyfox/tradeoffers/privacy",
                        "_blank"
                    )
                }}
                classAdd={["findUrl"]}
            >
                {findTheLinkLabel}
            </GreyBtn>

            <YellowBtn
                onClick={() => {
                    socket.emit("UPDATE_TRADEURL", tradeUrl)
                }}
                classAdd={["profile__deposit", "btnSave"]}
            >
                {saveLabel}
            </YellowBtn>
        </div>
    )
}

// --------------------------

const Profile = ({
    data,
    Withdraw,
    isMyProfile,
    showPreloader,
    showAnswer,
}) => {
    const { t } = useTranslation()

    let timer = useRef("")

    const [tradeUrl, settradeUrl] = useState(data.tradeUrl)
    const [refCode, setRefCode] = useState(
        `${window.location.origin}/?ref=${data.refCode}`
    )

    const historyOptions = {
        Deposits: t("profile.history.Deposits") || "Deposits",
        Withdrawals: t("profile.history.Withdrawals") || "Withdrawals",
        "Crash bets": t("profile.history.Crash bets") || "Crash bets",
    }

    const [optionSelect, setOptionSelect] = useState("Crash bets")

    const changeRefCode = (text) => {
        setRefCode(
            `${window.location.origin}/?ref=${
                text.split("=")[1] ? text.split("=")[1] : data.refCode
            }`
        )
        clearTimeout(timer.current)
        timer.current = setTimeout(
            (_socket) => {
                _socket.emit(
                    "UPDATE_REFCODE",
                    text.split("=")[1] ? text.split("=")[1] : data.refCode
                )
            },
            1250,
            socket
        )
    }

    useEffect(() => {
        setRefCode(`${window.location.origin}/?ref=${data.refCode}`)
    }, [data.refCode])

    return (
        <div class='profile'>
            {showPreloader ? (
                <Preloader />
            ) : (
                <>
                    <header class='profile__userInfo'>
                        <div className='profile__gridient' />

                        <img src={data.photo}></img>
                        <span>{data.nickSteam}</span>

                        {isMyProfile && (
                            <div className='info_info'>
                                <BlackBtn
                                    notButton={true}
                                    classAdd={["profile__balance"]}
                                >
                                    <div class='weapon-item__price'>
                                        <img
                                            src={bananaIcon}
                                            alt='bananaIcon'
                                        />

                                        {data.balance.stringNice()}
                                    </div>
                                </BlackBtn>
                                <YellowBtn classAdd={["profile__deposit"]}>
                                    {t("profile.header.Deposit")}
                                </YellowBtn>
                            </div>
                        )}

                        <InfoItemsLarge classAdd={["profile__gameInfo1"]}>
                            <img src={pistol} />
                            <span>{data.gamesPlayed}</span>
                            <span>{t("profile.header.info.Games played")}</span>
                        </InfoItemsLarge>
                        <InfoItemsLarge classAdd={["profile__gameInfo2"]}>
                            <img src={topRatio} />
                            <span>X {data.topRatio}</span>
                            <span>{t("profile.header.info.Top ratio")}</span>
                        </InfoItemsLarge>
                        <InfoItemsLarge classAdd={["profile__gameInfo3"]}>
                            <img src={winRate} />
                            <span>{data.winRate}%</span>
                            <span>{t("profile.header.info.Winrate")}</span>
                        </InfoItemsLarge>
                    </header>
                    {isMyProfile && (
                        <>
                            <div class='profile__settings profile-settings'>
                                <h4>{t("profile.tradeUrlSettings.title")}</h4>

                                <TradeUrlSettings
                                    yourTradeUrl={t(
                                        "profile.tradeUrlSettings.Your trade url" //текст который переводиться
                                    )}
                                    findTheLinkLabel={t(
                                        "profile.tradeUrlSettings.Find the link" //текст который переводиться
                                    )}
                                    saveLabel={t(
                                        "profile.tradeUrlSettings.Save"
                                    )} //текст который переводиться
                                    settradeUrl={settradeUrl}
                                    tradeUrl={tradeUrl}
                                    dataTradeUrl={data.tradeUrl}
                                />

                                <div className='profile-settings__couple'>
                                    <ChooseSide />

                                    <AnonimSettings
                                        checkBoxLabel={t(
                                            "profile.anonimSettings.For streamers"
                                        )}
                                    />
                                </div>
                            </div>

                            <div class='profile__referal profile-referal'>
                                <h4>{t("profile.referral.title")}</h4>
                                <SendInput
                                    updateNewText={changeRefCode}
                                    innerInput={refCode}
                                    classAddDiv={["profile-referal__input"]}
                                    sendBtn={false}
                                />
                                <div className='profile-referal__info-blocks'>
                                    <InfoItemsLarge>
                                        <img src={playerIcnYellow} />
                                        <span>{data?.invited || 0}</span>
                                        <span>
                                            {t("profile.referral.Invited")}
                                        </span>
                                    </InfoItemsLarge>
                                    <InfoItemsLarge>
                                        <span style={{ color: "#FFC632" }}>
                                            /
                                        </span>
                                        <span>{data?.percent || 0}%</span>
                                        <span>
                                            {t("profile.referral.Your percent")}
                                        </span>
                                    </InfoItemsLarge>
                                    <InfoItemsLarge>
                                        <img src={bananaIcon} />
                                        <span>{data?.received || 0}</span>
                                        <span>
                                            {t("profile.referral.Received")}
                                        </span>
                                    </InfoItemsLarge>
                                </div>
                                <div className='profile-referal__info-line'>
                                    <BlackBtn
                                        notButton={true}
                                        classAdd={[
                                            "profile-referal__info-line-item",
                                        ]}
                                    >
                                        <img
                                            src={loadingIcon}
                                            alt='loadingIcon'
                                        />
                                        <span>
                                            {t("profile.referral.Your level")}:{" "}
                                        </span>
                                        <span>{data.level}</span>
                                    </BlackBtn>
                                    <BlackBtn
                                        notButton={true}
                                        classAdd={[
                                            "profile-referal__info-line-item",
                                        ]}
                                    >
                                        <img src={playerIcn} alt='playerIcn' />
                                        <span>
                                            {t(
                                                "profile.referral.more to get level",
                                                {
                                                    forNextLevel:
                                                        data.howInvitedNextLevel ||
                                                        0,
                                                    level: data.level + 1 || 0,
                                                }
                                            )}
                                        </span>
                                    </BlackBtn>

                                    <Link
                                        onClick={() =>
                                            showAnswer("FAQ-REFERAL_LINK")
                                        }
                                        to='/faq'
                                        className='profile-referal__go-faq referal-go-faq'
                                    >
                                        <div className='referal-go-faq__body'>
                                            <b>?</b>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                    <div class='profile__data'>
                        <div className='profile__data-body'>
                            <h4>{t("profile.history.title")}</h4>
                            <Options
                                value={optionSelect}
                                handleChange={(e) => {
                                    console.log(Object.values(historyOptions))
                                    console.log(
                                        Object.keys(historyOptions).find(
                                            (k) =>
                                                historyOptions[k] ===
                                                e.target.value
                                        )
                                    )
                                    setOptionSelect(
                                        Object.keys(historyOptions).find(
                                            (k) =>
                                                historyOptions[k] ===
                                                e.target.value
                                        )
                                    )
                                }}
                                classAdd={["optionClass"]}
                            >
                                {isMyProfile
                                    ? Object.values(historyOptions)
                                    : Object.values(historyOptions).slice(-1)}
                            </Options>

                            <div className='profile__data-selected'>
                                <div class='profile__data-grid'>
                                    {optionSelect == "Deposits" && isMyProfile
                                        ? ""
                                        : ""}
                                    {optionSelect == "Withdrawals" &&
                                        isMyProfile &&
                                        Withdraw.withdraw.map((v, i) => (
                                            <WithdrawDeposit
                                                info={{
                                                    ...v,
                                                    text: v.weaponName,
                                                    summa: v.price,
                                                }}
                                                i={i}
                                            />
                                        ))}
                                    {optionSelect == "Crash bets" && (
                                        <CrashHistoryInProfile
                                            crashBets={data.CrashBets}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Profile
