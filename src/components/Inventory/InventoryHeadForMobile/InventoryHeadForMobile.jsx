import React from "react"
import { TotalSelectedPriceLabel } from "../Inventory"
import bananaIcn from "../../../assets/image/bananaIcn.svg"
import arrowIcn from "../../../assets/image/arrowIcn.svg"
import { useTranslation } from "react-i18next"
import "./InventoryHeadForMobile.scss"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../../utils/mediaQueries"

const InventoryHeadForMobile = ({ openInventory, totalSelectedPrice }) => {
    const { t } = useTranslation()

    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })
    if (mediaQueries.tablet) {
        return (
            <div className={`inventory-head-for-mobile`}>
                <div className='inventory-head-for-mobile__body'>
                    <h3 className='inventory-head-for-mobile__title'>
                        {t("inventory.Your inventory")}
                    </h3>
                    <div className='inventory-head-for-mobile__row'>
                        <TotalSelectedPriceLabel
                            totalSelectedPrice={totalSelectedPrice}
                        />
                        <button
                            className='inventory-head-for-mobile__open-btn'
                            onClick={openInventory}
                        >
                            <img
                                className='inventory-head-for-mobile__open-btn-img'
                                src={arrowIcn}
                                alt='open'
                            />
                        </button>
                    </div>
                </div>
            </div>
        )
    } else return null
}

export { InventoryHeadForMobile }
