import React, { useState } from "react"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import SendInput from "../common/SendInput/SendInput"
import krest from "../../assets/image/krest.svg"
import sendiconYellow from "../../assets/image/sendiconYellow.svg"
import close from "../../assets/image/close.svg"
import socket from "../../api/api"
import ChatMessage from "../Chat/ChatMessage/ChatMessage"
import Preloader from "../common/Preloader/Preloader"
import { useMedia } from "react-media"
import { GLOBAL_MEDIA_QUERIES } from "../../utils/mediaQueries"
import "../../utils/i18next"
import { useTranslation } from "react-i18next"
import "./Support.scss"

const Support = ({
    Support,
    steamid,
    showPreloader,
    userIdSender,
    openSupport,
    openOrClose,
}) => {
    const { t } = useTranslation()

    const [photos, setPhotos] = useState([])
    const [photoShow, setphotoShow] = useState("")
    const [textMessage, settextMessage] = useState("")

    const mediaQueries = useMedia({ queries: GLOBAL_MEDIA_QUERIES })

    const onImageChange = (event) => {
        if (photos.length == 3) {
            alert("Максимум 3 фотографии")
            return
        }
        if (event.target.files && event.target.files[0]) {
            var FR = new FileReader()

            FR.addEventListener("load", function (e) {
                if (e.total / 1024 / 1024 < 5) setPhotos([...photos, e.target.result])
                else return //Вызвать ошибку что фотография больше 5мб
            })

            FR.readAsDataURL(event.target.files[0])

            // img.convertToBase64((base64) => setPhotos([...photos, base64]));

            event.target.value = null
        }
    }

    if (showPreloader) return <Preloader />

    return (
        <div class="support">
            <h4>{t("support.title")}</h4>
            <span>{t("support.subTitle")}</span>

            {true ? ( // openOrClose == "open"
                <YellowBtn
                    onClick={() => {
                        socket.emit(
                            "CLOSE_TICKETUSER",
                            userIdSender ? userIdSender : steamid
                        )
                    }}
                    classAdd={["closeTicket"]}
                >
                    {t("support.Close ticket")}
                </YellowBtn>
            ) : (
                ""
            )}

            {userIdSender ? (
                <div class="blockAssistent">
                    <img
                        src={openSupport.find((v) => v.steamid == userIdSender)?.photo}
                    />
                    <div>
                        <span>
                            {
                                openSupport.find((v) => v.steamid == userIdSender)
                                    ?.nickSteam
                            }
                        </span>
                        <span>Who sent</span>
                    </div>
                </div>
            ) : (
                ""
            )}

            <div className="loadPhoto">
                {photos.map((v, i) => (
                    <div
                        key={i}
                        style={{
                            "background-image": `linear-gradient(247.28deg, rgba(34, 35, 40, 0.7) 0%, rgba(34, 35, 40, 0) 45.24%),url(${v})`,
                        }}
                        onClick={() => setphotoShow(v)}
                    >
                        <img
                            onClick={(e) => {
                                e.stopPropagation()
                                setPhotos(photos.filter((v, ii) => ii != i))
                            }}
                            class="deleteImg"
                            src={close}
                        />
                    </div>
                ))}
            </div>

            <div className="chatSupport" id="supportmessage">
                {Support.map((v) => (
                    <div className={v.steamid == steamid ? "myMess" : "Mess"}>
                        <ChatMessage
                            key={v.messageText + v.time}
                            steamId={v.steamid}
                            isMyMsg={v.steamid == steamid}
                            avatar={v.photoSteam}
                            name={v.name}
                            time={v.time}
                            messageText={v.messageText}
                            photo={v.photo}
                            onClick={setphotoShow}
                        />
                    </div>
                ))}
            </div>

            <div
                onClick={() => setphotoShow("")}
                class="largeImg"
                style={{
                    display: photoShow ? "flex" : "none",
                }}
            >
                <img src={photoShow} onClick={(e) => e.stopPropagation()} />
                <img
                    style={{ margin: "25px", width: "30px" }}
                    onClick={() => setphotoShow("")}
                    class="deleteImg"
                    src={close}
                />
            </div>
            <div className="support__footer">
                <label
                    htmlFor="files"
                    class="BlackBtnSup black-btn"
                    style={{ marginRight: "10px" }}
                >
                    <img src={krest} />{" "}
                    {mediaQueries.large && <span>{t("support.Attach")}</span>}
                </label>
                <input
                    type="file"
                    id="files"
                    className="BlackBtnSup black-btn"
                    style={{ display: "none" }}
                    // style={{ visibility: "hidden" }}
                    onChange={onImageChange}
                />
                <SendInput
                    innerInput={textMessage}
                    updateNewText={settextMessage}
                    placeholder={"Your message"}
                    classAddDiv={["SendInputSup"]}
                    sendBtn={false}
                ></SendInput>
                <YellowBtn
                    onClick={() => {
                        socket.emit("SEND_MESSAGE_SUPPORT", {
                            text: textMessage,
                            photo: photos,
                            senderId: userIdSender,
                        })
                        setPhotos([])
                        settextMessage("")
                    }}
                    classAdd={["YellowBtnSup"]}
                >
                    <img src={sendiconYellow} />
                    {mediaQueries.large && <span>{t("support.Send")}</span>}
                </YellowBtn>
            </div>
        </div>
    )
}

File.prototype.convertToBase64 = function () {
    return new Promise(
        function (resolve, reject) {
            var reader = new FileReader()
            reader.onloadend = function (e) {
                resolve({
                    fileName: this.name,
                    result: e.target.result,
                    error: e.target.error,
                })
            }
            reader.readAsDataURL(this)
        }.bind(this)
    )
}

export default Support
