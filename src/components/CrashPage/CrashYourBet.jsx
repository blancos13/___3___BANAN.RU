import React, { useState } from "react"
import { connect } from "react-redux"
import BlackBtn from "../common/BlackBtn/BlackBtn"
import WeaponItem from "../Weapon-item/WeaponItem"
import Options from "../common/Options/Options"
import editIcn from "../../assets/image/editIcn.svg"
import SendInput from "../common/SendInput/SendInput"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import bananIcn from "../../assets/image/bananIcnNoPd.svg"
import successIcn from "../../assets/image/successIcn.svg"
import knifeEmpty from "../../assets/image/knifeEmpty.svg"
import socket from "../../api/api"
import { setKofX, setOptionX } from "../../redux/reducers/crashBlockBet_Reducer"
import { useTranslation } from "react-i18next"
import "../../utils/i18next"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"

const CrashYourBet = ({
    crashBlockBet,
    inventory,
    setKofX,
    setOptionX,
    kofXGraph,
}) => {
    const { t } = useTranslation()

    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    const { optionsXs, kofX, animationSkins, ValueMyBet, userWinValue } =
        crashBlockBet

    const { totalSelectedPrice, lastSelectedItemId, weapons } = inventory

    const [editMode, setEditMode] = useState(false)

    const [currentOptionsWidth, setCurrentOptionsWidth] = useState(0)

    return (
        <div class='crash__your-bet crash-your-bet'>
            <div class='crash-your-bet__grid'>
                <h1 class='crash-your-bet__title'>{t("crash.Your bet")}</h1>
                <div class='crash-your-bet__items'>
                    {(totalSelectedPrice > 0 && !ValueMyBet) ||
                    !animationSkins.isEmpty() ? (
                        <WeaponItem
                            containerStyle={
                                !animationSkins.isEmpty() && !userWinValue
                                    ? {
                                          animation:
                                              "random-weapon-win-animation 0.575s linear 0s infinite",
                                      }
                                    : {
                                          animation:
                                              "random-weapon-stock 0.2s linear 0s",
                                      }
                            }
                            price={
                                animationSkins?.price ||
                                weapons[lastSelectedItemId].price
                            }
                            imgSrc={
                                animationSkins?.imgSrc ||
                                weapons[lastSelectedItemId].imgSrc
                            }
                            weaponName={
                                animationSkins?.weaponName ||
                                weapons[lastSelectedItemId].weaponName
                            }
                            rarity={
                                animationSkins?.rarity ||
                                weapons[lastSelectedItemId].rarity
                            }
                            exterior={
                                animationSkins.isEmpty()
                                    ? weapons[lastSelectedItemId].exterior
                                    : animationSkins?.exterior
                                    ? animationSkins?.exterior
                                    : ""
                            }
                            isInBet={true}
                            isClickable={false}
                        />
                    ) : (
                        <div class='crash-your-bet__empty'>
                            <div className='crash-your-bet__empty-img'>
                                <img src={knifeEmpty} alt='Empty' />
                            </div>

                            <span>
                                {t(
                                    "crash.Select items from your inventory to play"
                                )}
                            </span>
                        </div>
                    )}
                </div>
                <div class='crash-your-bet__place-bet crash-place-bet'>
                    <div class='crash-place-bet__grid'>
                        <div id='options-in-your-bet'>
                            <Options
                                setOptionX={setOptionX}
                                editMode={editMode}
                                currentOptionsWidth={currentOptionsWidth}
                                handleChange={(e) => {
                                    setKofX(e.target.value.slice(1))
                                }}
                                classAdd={["crash-place-bet__options"]}
                            >
                                {(mediaQueries.mobileS
                                    ? optionsXs.slice(0, -1)
                                    : optionsXs
                                ).map((value, i) => `x${value}`)}
                            </Options>
                        </div>

                        <BlackBtn
                            onClick={() => {
                                if (!editMode) {
                                    setCurrentOptionsWidth(
                                        document.getElementById(
                                            "options-in-your-bet"
                                        ).offsetWidth
                                    )
                                } else {
                                    localStorage.setItem(
                                        "crashYourBetOptions",
                                        JSON.stringify(optionsXs)
                                    )
                                }
                                setEditMode(!editMode)
                            }}
                            classAdd={[
                                `crash-place-bet__options-edit ${
                                    editMode && "options-edit-confirm-btn"
                                }`,
                            ]}
                        >
                            {editMode ? (
                                <>
                                    <img src={successIcn} alt='editIcn' />
                                    {mediaQueries.large && t("crash.Save")}
                                </>
                            ) : (
                                <>
                                    <img src={editIcn} alt='editIcn' />
                                    {mediaQueries.large && t("crash.Edit")}
                                </>
                            )}
                        </BlackBtn>

                        <SendInput
                            type={"number"}
                            innerInput={kofX}
                            updateNewText={(X) => setKofX(X)}
                            placeholder={"x..."}
                            classAddDiv={["crash-place-bet__input"]}
                            sendBtn={false}
                        />

                        <YellowBtn
                            disabled={
                                userWinValue ||
                                !(ValueMyBet || totalSelectedPrice != 0)
                            }
                            classAdd={["crash-place-bet__plc-bet-btn"]}
                            onClick={() => {
                                socket.emit(
                                    "ADD_TAKE_BET",
                                    weapons
                                        .filter((v) => v.isSelected)
                                        .map((v) => v.idItem),
                                    kofX
                                )
                            }}
                        >
                            {userWinValue ? (
                                <>
                                    {t("crash.You won")}
                                    <img src={bananIcn} />
                                    {Number(userWinValue).stringNice()}
                                </>
                            ) : ValueMyBet ? (
                                <>
                                    {t("crash.Take bet")}
                                    <img src={bananIcn} />
                                    {(
                                        Number(kofXGraph) * ValueMyBet
                                    ).stringNice()}
                                </>
                            ) : totalSelectedPrice > 0 ? (
                                <>
                                    {t("crash.Place bet")}
                                    <img src={bananIcn} />
                                    {totalSelectedPrice.stringNice()}
                                </>
                            ) : (
                                <span>{t("crash.Select items first")}</span>
                            )}
                        </YellowBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    crashBlockBet: state.crashBlockBet,
    kofXGraph: state.crashGraph.kofX,
    inventory: state.inventory,
})

const mapDispatchToProps = { setKofX, setOptionX }

export default connect(mapStateToProps, mapDispatchToProps)(CrashYourBet)
