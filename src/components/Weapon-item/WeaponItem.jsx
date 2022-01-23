import React, { useState, useEffect } from "react"
import bananaIcon from "../../assets/image/bananaIcn.svg"
import loadingIcon from "../../assets/image/loadingIcon.svg"
import selectedIcn from "../../assets/image/selectedIcn.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import GreyBtn from "../common/GreyBtn/GreyBtn"
import successIcn from "../../assets/image/successIcn.svg"
import faildIcn from "../../assets/image/faildIcn.svg"
import classNames from "classnames"
import Preloader from "../common/Preloader/Preloader"
import "./WeaponItem.scss"

const WeaponItem = ({
    classList = "",
    containerStyle = null,
    imgSrc = "",
    weaponName = "",
    rarity = "",
    exterior = "",
    isLarge = false,
    isInBet = false,
    amountOfElements = 0,
    onlyImage = false,
    isSelected = false,
    isClickable = true,
    statusMessage = "",
    statusNumber = 0,
    date,
    id,
    selectItem = () => {},
    cancelItem = () => {},
    newNotification,
    ...props
}) => {
    const styles = classNames(classList, {
        "weapon-item": true,
        "weapon-withdraw-faild": statusNumber == 2 && isLarge,
        "only-image-weapon": onlyImage,
        "large-weapon": isLarge && !isInBet,
        "in-bet-weapon": isInBet && !isLarge,
        "selected-weapon": isClickable && isSelected,
        "not-selected-weapon": isClickable && !isSelected,
    })

    // `weapon-item ${statusNumber == 2 && isLarge ? "weapon-withdraw-faild" : ""}
    // ${onlyImage && "only-image-weapon"}
    // ${isLarge && !isInBet ? "large-weapon" : isInBet ? "in-bet-weapon" : ""}
    // ${isClickable && (isSelected ? "selected-weapon" : "not-selected-weapon")}
    // ${classList}`

    const price = Number(props.price).stringNice()

    useEffect(() => {
        if (isLarge) {
            if (statusNumber == 1) {
                newNotification(
                    weaponName.deleteBrackets() + " withdrawed!",
                    statusNumber
                ) //(content, notifType, id)
            } else if (statusNumber == 2) {
                newNotification(
                    weaponName.deleteBrackets() + " withdraw failed!",
                    statusNumber
                ) //(content, notifType, id)
            }
        }
    }, [statusNumber]) //[]

    const chooseColor = (rarity) => {
        if (!rarity) return "#C5D8EB"

        switch (rarity.toLowerCase()) {
            case "consumer":
            case "base":
                return "#C5D8EB" //серый

            case "industrial":
                return "#32C1FF" //голубой

            case "mil-spec":
            case "distinguished":
            case "high":
                return "#3278FF" //синий

            case "restricted":
            case "exceptional":
            case "remarkable":
                return "#8C32FF" //Фиолетовый

            case "\\u2605":
                return "rgb(134, 80, 172)" //Фиолетовый-черный

            case "classified":
            case "superior":
            case "exotic":
                return "#FF32AD" //Розовый

            case "covert":
            case "master":
            case "extraordinary":
                return "#FF4B32" //Красный

            case "contraband":
            case "souvenir":
            case "contraband":
            case "souvenir":
                return "#FFD232" //Желтый

            default:
                return "#C5D8EB"
        }
    }

    const [isHovered, setIsHovered] = useState(false)

    const [isImgLoad, setImgLoad] = useState(false)

    const onLoad = () => {
        setTimeout(() => {
            setImgLoad(true)
        }, 500)
    }

    const FirstLetersOfWords = (sentence, separator) =>
        sentence
            .split(separator)
            .map((word) => (word[0] ? word[0].toUpperCase() : ""))
            .join("")

    const weaponMainColor =
        !isLarge && isHovered ? (isSelected ? "#FFFFFF" : "#ffc632") : chooseColor(rarity)
    return (
        <div
            className={styles}
            onMouseEnter={() => isClickable && setIsHovered(true)}
            onMouseLeave={() => isClickable && setIsHovered(false)}
            // className={`weapon-item ${
            //     statusNumber == 2 && isLarge ? "weapon-withdraw-faild" : ""
            // } ${onlyImage ? "only-image-weapon" : ""}
            // ${isLarge && !isInBet ? "large-weapon" : isInBet ? "in-bet-weapon" : ""}
            // ${
            //     isClickable
            //         ? isSelected
            //             ? "selected-weapon"
            //             : "not-selected-weapon"
            //         : ""
            // } ${classList}`}
        >
            <div style={containerStyle} className="weapon-item__container">
                <div
                    className="weapon-item__wall-color"
                    style={{
                        backgroundColor: `${
                            isSelected && !isLarge ? "#FFFFFF" : weaponMainColor
                        }`,
                    }}
                />
                <div className="weapon-item__body">
                    {!onlyImage ? (
                        <div className="weapon-item__grid">
                            <div className="weapon-item__price">
                                <img src={bananaIcon} alt="bananaIcon" />
                                {price.toString().length > 3 ? (
                                    <>
                                        {price.toString().slice(0, -3)}
                                        <span className="weapon-item__kopecki">
                                            {price.toString().substr(-3, 3)}
                                        </span>
                                    </>
                                ) : (
                                    price.toString()
                                )}
                            </div>

                            <div
                                className={`weapon-item__image ${
                                    !isImgLoad && "weapon-image-loading"
                                }`}
                            >
                                <img
                                    id="weapon-image"
                                    onLoad={onLoad}
                                    src={imgSrc + "112fx81f"}
                                    alt="weapon-item__image "
                                />
                                {!isImgLoad && <Preloader circleWidth={"25px"} />}
                            </div>

                            <div
                                style={{
                                    color: `${
                                        isSelected && !isLarge
                                            ? "#FFFFFF"
                                            : weaponMainColor
                                    }`,
                                }}
                                className="weapon-item__weapon-name"
                            >
                                {isLarge && !isInBet
                                    ? weaponName
                                    : !isInBet
                                    ? weaponName.slice(weaponName.indexOf("|") + 2)
                                    : weaponName.slice(weaponName.indexOf("|") + 2)}
                            </div>

                            <div className="weapon-item__exterior">
                                {isLarge && !isInBet
                                    ? exterior
                                    : exterior.indexOf("-") === -1
                                    ? FirstLetersOfWords(exterior, " ")
                                    : FirstLetersOfWords(exterior, "-")}
                            </div>

                            {isLarge &&
                                !isInBet &&
                                (statusNumber == 0 ? ( //Proccesing
                                    <div className="weapon-item__loading-place">
                                        <img src={loadingIcon} alt="loadingIcon" />
                                        <span>{statusMessage} </span>
                                    </div>
                                ) : statusNumber == 1 ? ( //Succes
                                    <div className="weapon-item__succes-place">
                                        <img src={successIcn} />
                                        <span>{statusMessage}</span>
                                    </div>
                                ) : statusNumber == 2 ? ( //Faild
                                    <div className="weapon-item__error-place">
                                        <img src={faildIcn} />
                                        <span>{statusMessage} </span>
                                    </div>
                                ) : (
                                    ""
                                ))}
                            {isInBet && amountOfElements > 1 && (
                                <div className="weapon-item__arrows">
                                    <div className="weapon-item__arrow">
                                        <GreyBtn circle={true}>
                                            <img src={arrowIcn} alt="arrowIcn" />
                                        </GreyBtn>
                                    </div>
                                    <div className="weapon-item__arrow">
                                        <GreyBtn circle={true}>
                                            <img src={arrowIcn} alt="arrowIcn" />
                                        </GreyBtn>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="weapon-item__image">
                            <img
                                onLoad={onLoad}
                                key={imgSrc + "112fx81f"}
                                src={imgSrc + "112fx81f"}
                                alt="weapon-item__image"
                            />
                            {!isImgLoad && <Preloader circleWidth={"20px"} />}
                        </div>
                    )}

                    {isClickable && (
                        <div
                            className="weapon-item__select-layer weapon-select-layer"
                            onClick={
                                isClickable && (isSelected ? cancelItem : selectItem)
                            }
                        >
                            <button className="weapon-select-layer__btn">
                                <div className="weapon-select-layer__btn-inner">
                                    {isSelected && (
                                        <img src={selectedIcn} alt="selectedIcn" />
                                    )}
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WeaponItem
