import React from "react"
import WeaponItem from "../Weapon-item/WeaponItem"
import SwitchToggleBtn from "../common/SwitchToggleBtn/SwitchToggleBtn"
import yellowPlus from "../../assets/image/yellowPlus.svg"
import bananaIcn from "../../assets/image/bananaIcn.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import switchIcn from "../../assets/image/switchIcn.svg"
import knifeEmpty from "../../assets/image/knifeEmpty.svg"
import withdrawIcn from "../../assets/image/withdrawIcn.svg"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import socket from "../../api/api"
import ExchangeItemsContainer from "../ExchangeItems/ExchangeItemsContainer"
import WithdrawItemsContainer from "../WithdrawItems/WithdrawItemsContainer"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"
import "./Inventory.scss"

export const TotalSelectedPriceLabel = ({ totalSelectedPrice }) => {
    const { t } = useTranslation()

    return (
        <div className='inventory-bottom__selected'>
            <GreyBtn notButton={true}>
                <span>{t("inventory.Selected")}</span>
                <div class='weapon-item__price'>
                    <img src={bananaIcn} alt='bananaIcon' />
                    {totalSelectedPrice.stringNice().slice(0, -3)}
                    <span class='weapon-item__kopecki'>
                        {totalSelectedPrice.stringNice().substr(-3, 3)}
                    </span>
                </div>
            </GreyBtn>
        </div>
    )
}

const Inventory = ({
    weapons,
    weaponsAmount,
    selectedWeaponsAmount,
    selectItem,
    toggleSelectAll,
    cancelItem,
    totalSelectedPrice,
    changeTotalSelectedPrice,
    setModalChild,
    openModalWindow,
    totalPrice,

    closeInventory,
    isInventoryOpen,
}) => {
    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    const items = weapons.map((weapon) => (
        <WeaponItem
            classList={"weapon-in-inventory"}
            key={weapon.id + weapon.weaponName}
            price={weapon.price}
            imgSrc={weapon.imgSrc}
            weaponName={weapon.weaponName}
            rarity={weapon.rarity}
            exterior={weapon.exterior}
            isSelected={weapon.isSelected}
            isClickable={weapon.isClickable}
            isInBet={weapon.isInBet}
            amountOfElements={weapon.weaponsAmount}
            onlyImage={weapon.onlyImage}
            isLarge={weapon.isLarge}
            selectItem={() => {
                selectItem(weapon.id)
                changeTotalSelectedPrice()
            }}
            cancelItem={() => {
                cancelItem(weapon.id)
                changeTotalSelectedPrice()
            }}
        />
    ))

    const { t } = useTranslation()

    const inventoryHeadSubtitle =
        weaponsAmount > 0
            ? t("inventory.inventoryHeadSubtitle", {
                  returnObjects: true,
                  weaponsAmount: weaponsAmount,
                  totalPrice: totalPrice.stringNice(),
              })
            : t("inventory.No items found")

    return (
        <div class={`inventory ${isInventoryOpen ? "inventory-open" : ""}`}>
            <div class='inventory__body'>
                <div class='inventory__head inventory-head'>
                    <div class='inventory-head__row'>
                        <div className='inventory-head__info'>
                            <h2 class='inventory-head__title'>
                                {t("inventory.Your inventory")}
                            </h2>
                            <p class='inventory-head__subtitle'>
                                {inventoryHeadSubtitle}
                            </p>
                        </div>

                        <div class='inventory-head__btns'>
                            <SwitchToggleBtn
                                disabled={weaponsAmount == 0}
                                onChange={() => {
                                    toggleSelectAll()
                                    changeTotalSelectedPrice()
                                }}
                                checked={
                                    selectedWeaponsAmount
                                        ? weaponsAmount == selectedWeaponsAmount
                                        : false
                                }
                            />
                            {mediaQueries.tablet && (
                                <button
                                    onClick={closeInventory}
                                    className='inventory-head__close-btn'
                                >
                                    <img src={arrowIcn} alt='close' />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {weaponsAmount == 0 ? (
                    <div class='inventory__empty inventory-empty-body'>
                        <img
                            class='inventory-empty-body__image'
                            src={knifeEmpty}
                            alt='knifeEmpty'
                        />
                        <div class='inventory-empty-body__title'>
                            {t("inventory.Your inventory is empty")}
                        </div>
                        <div class='inventory-empty-body__subtitle'>
                            {t(
                                "inventory.Purchase some skins in shop to play and withdraw items"
                            )}
                        </div>
                    </div>
                ) : (
                    <div class='inventory__items inventory-items'>
                        <div class='inventory-items__grid'>{items}</div>
                    </div>
                )}
            </div>

            <div
                class={`inventory__bottom inventory-bottom ${
                    weaponsAmount == 0 ? "inventory-bottom-empty" : ""
                }`}
            >
                <div
                    class={`inventory-bottom__grid ${
                        weaponsAmount == 0 ? "inventory-bottom-grid-empty" : ""
                    }`}
                >
                    {selectedWeaponsAmount > 0 ? (
                        <>
                            <TotalSelectedPriceLabel
                                totalSelectedPrice={totalSelectedPrice}
                            />

                            <div className='inventory-bottom__exchange'>
                                <GreyBtn
                                    onClick={() => {
                                        console.log(
                                            t("exchangeItems.modalTitle")
                                        )
                                        setModalChild(
                                            <ExchangeItemsContainer />,
                                            t("exchangeItems.modalTitle")
                                        )
                                        openModalWindow()
                                    }}
                                    circle={true}
                                >
                                    <img src={switchIcn} alt='switchIcn' />
                                </GreyBtn>
                            </div>
                            <div class='inventory-bottom__yell-btn'>
                                <YellowBtn
                                    onClick={() => {
                                        socket.emit("WITHDRAW_ITEMS_REQUEST", {
                                            first: !socket.hasListeners(
                                                "LOAD_ALLWITHDRAW"
                                            ),
                                            weapons: weapons
                                                .filter(
                                                    (weapon) =>
                                                        weapon.isSelected
                                                )
                                                .map((v) => v.idItem),
                                        })
                                        setModalChild(
                                            <WithdrawItemsContainer />,
                                            "Withdraw items"
                                        )
                                        openModalWindow()
                                    }}
                                >
                                    <img src={withdrawIcn} alt='withdrawIcn' />
                                    {t("inventory.Withdraw")}
                                </YellowBtn>
                            </div>
                        </>
                    ) : (
                        <div
                            style={{ gridColumn: "s" }}
                            class={`inventory-bottom__yell-btn ${
                                weaponsAmount == 0 ? "yell-btn-empty" : "" // == 0
                            }`}
                        >
                            <YellowBtn
                                onClick={() => {
                                    setModalChild(
                                        <ExchangeItemsContainer />,
                                        t("exchangeItems.modalTitle")
                                    )
                                    openModalWindow()
                                }}
                            >
                                <img src={yellowPlus} alt='yellowPlus' />
                                {t("inventory.Shop new items")}
                            </YellowBtn>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Inventory
