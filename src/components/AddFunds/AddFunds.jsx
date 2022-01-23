import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import {
    setDepositOption,
    setDataDep,
    setSteamInventory,
    toggleSelectWeapon,
} from "../../redux/reducers/AddFundsReducer"
import Options from "../common/Options/Options"
import bitcoinIcon from "../../assets/image/bitcoin.svg"
import qiwiIcon from "../../assets/image/qiwi.svg"
import paypallIcon from "../../assets/image/paypall.svg"
import bananaIcn from "../../assets/image/bananaIcn.svg"
import SendInput from "../common/SendInput/SendInput"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import { newNotificationTC } from "../../redux/reducers/NotificationsReducer"
import Preloader from "../common/Preloader/Preloader"
import WeaponItem from "../Weapon-item/WeaponItem"
import socket from "../../api/api"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./AddFunds.scss"

const btnOptions = [
    { icon: bitcoinIcon, name: "bitcoin" },
    { icon: qiwiIcon, name: "qiwi" },
    { icon: paypallIcon, name: "paypall" },
    { icon: bitcoinIcon, name: "bitcoin" },
    { icon: qiwiIcon, name: "qiwi" },
    { icon: paypallIcon, name: "paypall" },
]

const AddFunds = ({
    toggleSelectWeapon,
    currentDepositOption,
    setSteamInventory,
    itemWeaponInventorySteam,
    setDepositOption,
    depositData,
    selectedDep,
    setDataDep,
    newNotificationTC,
    bonusDeposit,
}) => {
    const { t } = useTranslation()

    const depositOptions = ["All", "Crypto", "Banks", "E-Wallets", "Skins"]
    const [depositAmount, setDepositAmount] = useState("")
    const [promocode, setPromocode] = useState("")

    const [showPreloader, setShowPreloader] = useState(
        !itemWeaponInventorySteam.length ? true : false
    )
    const incrementDepositAmount = (price) => {
        setDepositAmount(Number(depositAmount) + Number(price))
    }
    const decrementDepositAmount = (price) => {
        setDepositAmount(Number(depositAmount) - Number(price))
    }

    useEffect(() => {
        if (
            currentDepositOption == "Skins" &&
            !itemWeaponInventorySteam.length
        ) {
            socket.emit("LOAD_INVENTORYSTEAM_USER")
        } else {
            socket.emit("LOAD_PAYMENTINFO")
        }
        setShowPreloader(true)
    }, [currentDepositOption, itemWeaponInventorySteam])

    useEffect(() => {
        socket.emit("LOAD_PAYMENTINFO")

        socket.on(
            "LOAD_INVENTORYSTEAM_USER",
            async ({ data, messageNum, message }) => {
                setSteamInventory(data)
                setShowPreloader(false)
                newNotificationTC(message, messageNum)
            }
        )

        socket.on("LOAD_PAYMENTINFO", (data) => {
            setShowPreloader(false)
            setDataDep(
                data.map((v) => ({
                    ...v,
                    icon: btnOptions.find((e) => v.nameMethod == e.name)
                        ? btnOptions.find((e) => v.nameMethod == e.name).icon
                        : v.icon,
                }))
            )
        })
        socket.on("ENTER_PROMOCODE", async ({ data, messageNum, message }) => {
            newNotificationTC(message, messageNum)
        })

        return () => {
            socket.off("LOAD_PAYMENTINFO")
            socket.off("ENTER_PROMOCODE")
            socket.off("LOAD_INVENTORYSTEAM_USER")
        }
    }, [])

    return (
        <div className='add-funds'>
            <div class='add-funds__container'>
                <div class='add-funds__options'>
                    <Options
                        value={currentDepositOption}
                        handleChange={(e) => {
                            setDepositOption(e.target.value)
                        }}
                    >
                        {depositOptions}
                    </Options>
                </div>

                {showPreloader ? (
                    <div class='add-funds__btns'>
                        <Preloader classes='exchange-items__preloader' />
                    </div>
                ) : (
                    <>
                        {currentDepositOption == "Skins" ? (
                            <div class='add-funds__skins'>
                                <div className='add-funds__skins-grid'>
                                    {itemWeaponInventorySteam.map(
                                        (weapon, i) => (
                                            <WeaponItem
                                                key={i + weapon.idItem}
                                                price={weapon.price}
                                                imgSrc={weapon.imgSrc}
                                                weaponName={weapon.weaponName}
                                                rarity={weapon.rarity}
                                                exterior={weapon.exterior}
                                                isSelected={weapon.isSelected}
                                                selectItem={() => {
                                                    toggleSelectWeapon(
                                                        weapon.idItem
                                                    )
                                                    incrementDepositAmount(
                                                        weapon.price
                                                    )
                                                }}
                                                cancelItem={() => {
                                                    toggleSelectWeapon(
                                                        weapon.idItem
                                                    )
                                                    decrementDepositAmount(
                                                        weapon.price
                                                    )
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div class='add-funds__btns'>
                                {depositData
                                    .filter((v) =>
                                        currentDepositOption == "All"
                                            ? true
                                            : v.method.toLowerCase() ==
                                              currentDepositOption.toLowerCase()
                                    )
                                    .map((btn) => (
                                        <button class='add-funds__btn'>
                                            <img
                                                src={btn.icon}
                                                alt={btn.nameMethod}
                                            />
                                        </button>
                                    ))}
                            </div>
                        )}
                    </>
                )}
                <div class='add-funds__deposit-amount add-funds-deposit-amount'>
                    <div class='add-funds-deposit-amount__input'>
                        <SendInput
                            classAddDiv={[
                                "add-funds-deposit-amount__input-inner",
                            ]}
                            type='number'
                            innerInput={
                                currentDepositOption == "Skins"
                                    ? ""
                                    : depositAmount
                            }
                            onChange={
                                currentDepositOption == "Skins" &&
                                setDepositAmount
                            }
                            placeholder={t("add-funds.Deposit amount")}
                            sendBtn={false}
                        />

                        <div class='add-funds-deposit-amount__input-banan'>
                            <img src={bananaIcn} />
                        </div>
                    </div>

                    <YellowBtn classAdd={["add-funds-deposit-amount__btn"]}>
                        <span>{t("profile.header.Deposit")}</span>
                    </YellowBtn>
                </div>
                <div class='add-funds__bottom'>
                    <span>
                        {t("add-funds.transactionValue")}

                        {(depositAmount * (1 - selectedDep.fee.percent / 100) -
                            selectedDep.fee.value >
                        0
                            ? depositAmount *
                                  (1 - selectedDep.fee.percent / 100) -
                              selectedDep.fee.value
                            : 0
                        ).stringNice()}

                        {bonusDeposit > 0 &&
                            t("add-funds.bonusDeposit", {
                                bonusDeposit: bonusDeposit,
                                percent: selectedDep.fee.percent,
                                value: selectedDep.fee.value,
                            })}
                    </span>
                </div>

                <div class='add-funds__promo add-funds-promo'>
                    <h1 class='add-funds-promo__title'>
                        {t("add-funds.Enter promocode")}
                    </h1>

                    <div className='add-funds-promo__bottom'>
                        <SendInput
                            innerInput={promocode}
                            onChange={setPromocode}
                            placeholder={t("add-funds.Promocode")}
                            sendBtn={false}
                        />

                        <GreyBtn
                            onClick={() => {
                                socket.emit("ENTER_PROMOCODE", promocode)
                            }}
                        >
                            {t("add-funds.Apply")}
                        </GreyBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({ ...state.AddFunds, ...state.AuthData })

export default connect(mapStateToProps, {
    setDepositOption,
    newNotificationTC,
    setDataDep,
    setSteamInventory,
    toggleSelectWeapon,
})(AddFunds)
