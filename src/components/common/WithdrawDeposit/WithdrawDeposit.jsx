import React from "react"
import { ReactSVG } from "react-svg"
import "./WithdrawDeposit.scss"
import slesh from "../../../assets/image/slesh.svg"
import bananaIcon from "../../../assets/image/bananaIcn.svg"
import loadingIcon from "../../../assets/image/loadingIcon.svg"
import successIcn from "../../../assets/image/successIcn.svg"
import faildIcn from "../../../assets/image/faildIcn.svg"
const WithdrawDeposit = ({ classAdd = [], info, i, onClick = () => {} }) => {
    return (
        <div
            key={i + info.statusNumber}
            className={["WithdrawDeposit", ...classAdd].join(" ")}
            onClick={onClick}
        >
            <div
                class="img"
                style={{
                    backgroundImage: `url('${info.imgSrc}')`,
                }}
            />
            <span className="name">{info.text}</span>

            {info.statusNumber == 0 ? ( //Proccesing
                <div class="status weapon-item__loading-place">
                    <img src={loadingIcon} alt="loadingIcon" />
                    <span>{info.statusMessage} </span>
                </div>
            ) : (
                ""
            )}
            {info.statusNumber == 1 ? ( //Succes
                <div class="status weapon-item__succes-place">
                    <ReactSVG src={successIcn} />
                    <span>
                        Successful
                        {/* {info.statusMessage}  */}
                    </span>
                </div>
            ) : (
                ""
            )}
            {info.statusNumber == 2 ? ( //Error
                <div class="status weapon-item__error-place">
                    <img src={faildIcn} />
                    <span>{info.statusMessage} </span>
                </div>
            ) : (
                ""
            )}

            <img className="slesh" src={slesh} />
            <div class="summa">
                <img src={bananaIcon} alt="bananaIcon" />
                {info.summa.stringNice().slice(0, -3)}
                <span class="weapon-item__kopecki">
                    {info.summa.stringNice().substr(-3, 3)}
                </span>
            </div>
            <span className={`date ${!info?.howPassed ? "" : "adminDate"}`}>{!info?.howPassed ? info.date.howDays() : new Date(info.date).toLocaleString()}</span>
        </div>
    )
}

String.prototype.howDays = function () {
    let currentDate = Date.parse(new Date().toISOString())
    let ms = currentDate - Date.parse(this)

    if (ms < 0) return `0 sec ago`

    if (ms / 1000 < 60) return `${Math.round(ms / 1000)} sec ago`
    else if (ms / 1000 / 60 < 60) return `${Math.round(ms / 1000 / 60)} min ago`
    else if (ms / 1000 / 60 / 60 < 24)
        return `${Math.round(ms / 1000 / 60 / 60)} hour ago`
    else if (ms / 1000 / 60 / 60 / 24 < 365)
        return `${Math.round(ms / 1000 / 60 / 60 / 24)} day ago`
    else if (ms / 1000 / 60 / 60 / 24 / 365 < 12)
        return `${Math.round(ms / 1000 / 60 / 60 / 24 / 365)} month ago`;
    else return `${Math.round(ms / 1000 / 60 / 60 / 24 / 365 / 12)} year ago`;
};
// String.prototype.DateLocale = function () {
//     let d = Date.parse(this)
//     return `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
// };

export default WithdrawDeposit
