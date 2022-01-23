import React from "react"
import WeaponItem from "../Weapon-item/WeaponItem"
import "./WithdrawItems.scss"

const WithdrawItems = ({ weapons, newNotification }) => {
    const items = weapons.map((weapon) => {
        return (
            <WeaponItem
                key={weapon.id}
                newNotification={newNotification}
                id={weapon.id}
                price={weapon.price}
                imgSrc={weapon.imgSrc}
                weaponName={weapon.weaponName.deleteBrackets()}
                rarity={weapon.rarity}
                exterior={weapon.exterior}
                isClickable={false}
                isLarge={true}
                statusMessage={weapon.statusMessage}
                statusNumber={weapon.statusNumber}
                date={weapon.date}
            />
        )
    })
    return (
        <div class="withdraw-items">
            <div class="withdraw-items__body">{items}</div>
        </div>
    )
}

export default WithdrawItems
