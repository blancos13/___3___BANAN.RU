import React, { useState, useRef } from "react"
import SendInput from "../common/SendInput/SendInput"
import WeaponItem from "../Weapon-item/WeaponItem"
import searchIcn from "../../assets/image/searchIcn.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import sortIcn from "../../assets/image/sortIcn.svg"
import Checkbox from "../common/Checkbox/Checkbox"
import bananaIcn from "../../assets/image/bananaIcn.svg"
import switchYellow from "../../assets/image/switchYellow.svg"
import socket from "../../api/api"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import Preloader from "../common/Preloader/Preloader"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./ExchangeItems.scss"

const SearchField = ({ placeholder, searchInputValue, onSearch }) => {
    return (
        <form className='exchange-items-head__search'>
            <div className='exchange-items-head__search-icon'>
                <img src={searchIcn} alt='searchIcn' />
            </div>

            <SendInput
                innerInput={searchInputValue}
                updateNewText={onSearch}
                classAddDiv={["exchange-items-head__search-input"]}
                sendBtn={false}
                placeholder={placeholder}
            />
        </form>
    )
}

const SortSelector = ({
    showMore,
    sortType,
    setShowMore,
    minPrice,
    maxPrice,
    stockOnly,
    searchInputValue,
    selectSortOption,
    priceText,
}) => {
    return (
        <div
            className='exchange-items-head__sort-selected'
            onClick={() => setShowMore(!showMore)}
        >
            <button
                className={`exchange-items-head__sort-selected-btn ${
                    showMore ? "open" : ""
                }`}
            >
                <img
                    style={{
                        transform: `${sortType == -1 ? "rotate(180deg)" : ""}`,
                        transition: "0.3s",
                    }}
                    src={sortIcn}
                    alt='sortIcn'
                />
                <span>{priceText}</span>
                <img
                    className={`exchange-items-head__sort-selected-arrow ${
                        showMore ? "open" : ""
                    }`}
                    src={arrowIcn}
                    alt='arrowIcn'
                />
            </button>
            {showMore && (
                <div className='exchange-items-head__sort-selected-options'>
                    {sortType != 1 && (
                        <div
                            className='exchange-items-head__sort-selected-option'
                            onClick={() =>
                                selectSortOption(
                                    1,
                                    minPrice,
                                    maxPrice,
                                    stockOnly,
                                    searchInputValue
                                )
                            }
                        >
                            <img src={sortIcn} alt='sortIcn' />
                            <span>{priceText}</span>
                        </div>
                    )}

                    {sortType != -1 && (
                        <div
                            className='exchange-items-head__sort-selected-option'
                            onClick={() =>
                                selectSortOption(
                                    -1,
                                    minPrice,
                                    maxPrice,
                                    stockOnly,
                                    searchInputValue
                                )
                            }
                        >
                            <img
                                style={{ transform: "rotate(180deg)" }}
                                src={sortIcn}
                                alt='sortIcn'
                            />
                            <span>{priceText}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const ExchangeItems = (props) => {
    const {
        weapons,
        totalSelectedPrice,
        totalBalance,
        updateSearchInputValue,
        searchInputValue,
        sortType,
        selectSortOption,
        minPrice,
        maxPrice,
        updateMinPrice,
        updateMaxPrice,
        toggleStockOnly,
        stockOnly,
        selectShopItem,
        cancelShopItem,
        changeTotalSelectedPriceShop,
        DisableExchangeBtn,
        setDisableExchangeBtn,
        showPreloader,
        toggleShowModalWindow,
        clearItems,
        selectItemsId,
        onExchange,
    } = props

    const { t } = useTranslation()

    const [showMore, setShowMore] = useState(false)

    let timerRef = useRef(null)

    const items = weapons.map((weapon) => (
        <li className='exchange-items__item'>
            <WeaponItem
                key={weapon.id + weapon.weaponName}
                price={weapon.price}
                imgSrc={weapon.imgSrc}
                weaponName={weapon.weaponName}
                rarity={weapon.rarity}
                exterior={weapon.exterior}
                isSelected={weapon.isSelected}
                isInBet={weapon.isInBet}
                amountOfElements={weapon.weaponsAmount}
                onlyImage={weapon.onlyImage}
                selectItem={() => {
                    selectShopItem(weapon.id)
                    changeTotalSelectedPriceShop()
                    if (
                        totalBalance <
                        Number(totalSelectedPrice) +
                            Number(
                                weapon.price.stringNice().split(" ").join("")
                            )
                    ) {
                        setDisableExchangeBtn(true)
                    }
                }}
                cancelItem={() => {
                    cancelShopItem(weapon.id)
                    changeTotalSelectedPriceShop()
                    if (
                        !(
                            totalBalance <
                            Number(totalSelectedPrice) -
                                Number(
                                    weapon.price
                                        .stringNice()
                                        .split(" ")
                                        .join("")
                                )
                        )
                    ) {
                        setDisableExchangeBtn(false)
                    }
                }}
            />
        </li>
    ))

    const onSearch = (value) => {
        updateSearchInputValue(value)
        clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => {
            selectSortOption(sortType, minPrice, maxPrice, stockOnly, value)
        }, 1000)
    }

    return (
        <div className='exchange-items'>
            <div className='exchange-items__body'>
                <header className='exchange-items__head exchange-items-head'>
                    <SearchField
                        placeholder={t("exchangeItems.search.placeholder")}
                        searchInputValue={searchInputValue}
                        onSearch={onSearch}
                    />

                    <SortSelector
                        priceText={t("exchangeItems.price")}
                        showMore={showMore}
                        sortType={sortType}
                        setShowMore={setShowMore}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        stockOnly={stockOnly}
                        searchInputValue={searchInputValue}
                        selectSortOption={selectSortOption}
                    />

                    <div className='exchange-items-head__stock'>
                        <Checkbox
                            onChange={() => {
                                toggleStockOnly()
                                selectSortOption(
                                    sortType,
                                    minPrice,
                                    maxPrice,
                                    !stockOnly,
                                    searchInputValue
                                )
                            }}
                            checked={stockOnly}
                        >
                            {t("exchangeItems.stockOnly")}
                        </Checkbox>
                    </div>

                    <SendInput
                        type='number'
                        updateNewText={(newPrice) => {
                            updateMinPrice(newPrice)
                            clearTimeout(timerRef.current)
                            timerRef.current = setTimeout(
                                selectSortOption,
                                1000,
                                sortType,
                                newPrice,
                                maxPrice,
                                stockOnly,
                                searchInputValue
                            )
                        }} //sortType, minPrice, maxPrice, stockOnly, name
                        innerInput={minPrice}
                        sendBtn={false}
                        placeholder={`${t("exchangeItems.Min")} ${t(
                            "exchangeItems.price"
                        ).toLowerCase()}`}
                    />
                    <SendInput
                        type='number'
                        updateNewText={(newPrice) => {
                            updateMaxPrice(newPrice)
                            clearTimeout(timerRef.current)
                            timerRef.current = setTimeout(() => {
                                selectSortOption(
                                    sortType,
                                    minPrice,
                                    newPrice,
                                    stockOnly,
                                    searchInputValue
                                )
                            }, 1000)
                        }}
                        innerInput={maxPrice}
                        sendBtn={false}
                        placeholder={`${t("exchangeItems.Max")} ${t(
                            "exchangeItems.price"
                        ).toLowerCase()}`}
                    />
                </header>

                <div
                    id='exchange-items-container'
                    className='exchange-items__items'
                >
                    {showPreloader ? (
                        <Preloader />
                    ) : (
                        <ul className='exchange-items__items-grid'>{items}</ul>
                    )}
                </div>

                <div className='exchange-items__footer'>
                    <div className='exchange-items__footer-left'>
                        <GreyBtn notButton={true}>
                            <span>{t("exchangeItems.Left")}</span>
                            <div className='weapon-item__price'>
                                <img src={bananaIcn} alt='bananaIcon' />
                                {totalSelectedPrice.stringNice().slice(0, -3)}
                                <span className='weapon-item__kopecki'>
                                    {totalSelectedPrice
                                        .stringNice()
                                        .substr(-3, 3)}
                                </span>
                            </div>
                            <span>/</span>
                            <div className='weapon-item__price'>
                                <img src={bananaIcn} alt='bananaIcon' />
                                {totalBalance.stringNice().slice(0, -3)}
                                <span className='weapon-item__kopecki'>
                                    {totalBalance.stringNice().substr(-3, 3)}
                                </span>
                            </div>
                        </GreyBtn>
                    </div>

                    <div className='exchange-items__footer-exchange'>
                        <YellowBtn
                            onClick={onExchange} // need test
                            disabled={DisableExchangeBtn}
                        >
                            <img src={switchYellow} alt='switchYellow' />{" "}
                            {t("exchangeItems.Exchange")}
                        </YellowBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExchangeItems
