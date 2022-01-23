import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import "./AdminModer.scss"
import socket from "../../api/api"
import Preloader from "../common/Preloader/Preloader"
import withToggleShowModalWindow from "../../hoc/withToggleShowModalWindow"
import YellowBtn from "../common/YellowBtn/YellowBtn"
import SendInput from "../common/SendInput/SendInput"
import sendiconYellow from "../../assets/image/sendiconYellow.svg"
import Options from "../common/Options/Options"
import WithdrawDeposit from "../common/WithdrawDeposit/WithdrawDeposit"
import sortIcn from "../../assets/image/sortIcn.svg"
import arrowIcn from "../../assets/image/arrowIcn.svg"
import Checkbox from "../common/Checkbox/Checkbox"
import WeaponItem from "../Weapon-item/WeaponItem"

const PlayerInfoModal = ({ user, toggleShowModalWindow }) => {
    return (
        <div className="userInfo">
            <img src={user.photo} />
            <span className="nick"> {user.nickSteam}</span>
            <span className="steamid">{user.steamid}</span>
            <div className="moreInfo">
                {Object.keys(user).map(v => <div className={v == "inventory" ? "blockUser invent" : "blockUser"}>

                    <SendInput
                        innerInput={v != "inventory" ? v : `Инвентарь (${user["inventory"].reduce((all, cur) => all + cur.price, 0).toFixed(2)} $) *При нажатии на предмет он удаляется у пользователя*`}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={v == "inventory" ? ["inputChangeInvent"] : ["inputChange"]}
                    />
                    {v != "inventory" && v != "playerHistory"
                        ? < SendInput
                            option={typeof user[v] == 'boolean'}
                            innerInput={typeof user[v] != 'string' && typeof user[v] != 'number' ? JSON.stringify(user[v]) : user[v]}
                            sendBtn={!~["_id", 'timecreatedSteamAcc', 'dateCreate', 'loccountrycodeSteam', 'locstatecodeSteam', 'steamid'].indexOf(v) && typeof user[v] != 'boolean'}
                            submit={(e) => {
                                socket.emit('CHANGE_USERSETTING', {
                                    changeText: e,
                                    key: v,
                                    _id: user["_id"]
                                })
                            }}
                            classAddDiv={v == "inventory" ? ["inputChangeInvent"] : ["inputChange"]}
                            disabled={~["_id", 'timecreatedSteamAcc', 'dateCreate', 'loccountrycodeSteam', 'locstatecodeSteam', 'steamid'].indexOf(v)}
                        />
                        : ""}
                    {v == "inventory" ?
                        <div class="itemInventUser">
                            {user["inventory"].map(weapon =>
                                <WeaponItem
                                    key={weapon.idItem + weapon.weaponName}
                                    price={weapon.price}
                                    imgSrc={weapon.imgSrc}
                                    weaponName={weapon.weaponName}
                                    rarity={weapon.rarity}
                                    exterior={weapon.weaponName.splitBrackets()}
                                    selectItem={() => {
                                        user["inventory"].splice(user["inventory"].findIndex(v => v.idItem == weapon.idItem), 1);
                                        socket.emit("CHANGE_USERSETTING", {
                                            changeText: user["inventory"].map(v => v.idItem).countId(),
                                            key: "inventory",
                                            _id: user["_id"],
                                            steamIdUser: user["steamid"]
                                        })
                                        toggleShowModalWindow()
                                        setTimeout(() => {
                                            toggleShowModalWindow()
                                        }, 100);

                                    }}
                                />
                            )}
                        </div>
                        : ""}
                    {v == "playerHistory" ?
                        <div class="playerHistory">
                            {user["playerHistory"].map(v => <span>{v}</span>)}
                        </div>
                        : ""}

                </div>)}
            </div>

        </div>
    )
}
const PlyerModalWithdraw = ({ data, toggleShowModalWindow, newNotificationTC }) => {
    const [dataUser, setdataUser] = useState({})
    useEffect(() => {
        socket.on("LOAD_DATAUSER", (data) => {
            setdataUser(data)
            newNotificationTC("Пользователь загружен!", 1)
        })
        socket.emit("LOAD_DATAUSER", data.idUser)
        newNotificationTC("Идет загрузка пользователя на вывод", 1)

        return () => socket.off("LOAD_DATAUSER")
    }, [])
    return (
        <div className="userInfo">
            <img src={dataUser?.Photo} />
            <span className="nick"> {dataUser?.Nick_Steam}</span>
            <span className="steamid">{data.idUser}</span>
            <div className="moreInfo">
                {Object.keys(dataUser).map((v, i) =>
                    i > 1 ?
                        <div className="blockUser">
                            <SendInput
                                innerInput={`${v}: ${dataUser[v]}`}
                                disabled={true}
                                sendBtn={false}
                                classAddDiv={["fullwidth"]}
                            />
                        </div> : "")}
            </div>

        </div>
    )
}
const Players = ({ toggleShowModalWindow, setModalChild, state }) => {
    const [showMore, setshowMore] = useState(false)
    const [search, setSearch] = useState("")
    return (
        <>
            <div className="searchUser">
                <SendInput
                    innerInput={search}
                    updateNewText={setSearch}
                    placeholder={"Введите ID64 или частички ника"}
                    classAddDiv={[""]}
                    sendBtn={false}
                ></SendInput>
                <YellowBtn
                    onClick={() => {
                        socket.emit("GET_ALLUSERS", 1, 0, search)
                    }}
                    classAdd={[""]}
                >
                    <img style={{ "margin-right": "10px" }} src={sendiconYellow} /> Найти
                </YellowBtn>
            </div>

            <div class="list">

                {state.allUsers.map((v, i) => (
                    <WithdrawDeposit
                        info={{
                            imgSrc: v.photo,
                            text: v.nickSteam,
                            summa: v.balance,
                            date: v.dateCreate,
                            howPassed: true,
                        }}
                        i={i}
                        onClick={() => {
                            toggleShowModalWindow()
                            setModalChild(
                                <PlayerInfoModal user={v} toggleShowModalWindow={toggleShowModalWindow} />,
                                `${v.nickSteam}`,
                                false,
                                () => { },
                                false
                            )
                        }}
                    />
                ))}
            </div>
            <div class="optionUsers">
                <Options
                    value={state.currentPage}
                    handleChange={(e) => {
                        socket.emit(
                            "GET_ALLUSERS",
                            e.target.value == "Конец"
                                ? state.pageAll
                                : e.target.value == "Начало"
                                    ? 1
                                    : e.target.value,
                            state.sortBalance
                        )
                    }}
                >
                    {state.listPage}
                </Options>
                <div
                    class="exchange-items-head__sort-selected optionlist"
                    onClick={() => {
                        setshowMore(!showMore)
                    }}
                >
                    <button
                        class={`exchange-items-head__sort-selected-btn ${showMore ? "open" : ""
                            }`}
                    >
                        {state.sortBalance != 0 ? (
                            <>
                                <img
                                    style={{
                                        transform: `${state.sortBalance == -1
                                            ? "rotate(180deg)"
                                            : ""
                                            }`,
                                        transition: "0.3s",
                                    }}
                                    src={sortIcn}
                                    alt="sortIcn"
                                />
                                <span>Баланс</span>
                                <img
                                    class={`exchange-items-head__sort-selected-arrow ${showMore ? "open" : ""
                                        }`}
                                    src={arrowIcn}
                                    alt="arrowIcn"
                                />
                            </>
                        ) : (
                            ""
                        )}
                        {state.sortBalance == 0 ? (
                            <>
                                <img
                                    style={{ transition: "0.3s" }}
                                    src={sortIcn}
                                    alt="sortIcn"
                                />
                                <span>От начало</span>
                                <img
                                    class={`exchange-items-head__sort-selected-arrow ${showMore ? "open" : ""
                                        }`}
                                    src={arrowIcn}
                                    alt="arrowIcn"
                                />
                            </>
                        ) : (
                            ""
                        )}
                    </button>
                    {showMore ? (
                        <div class="exchange-items-head__sort-selected-options">
                            {state.sortBalance != 0 ? (
                                <div
                                    onClick={() => {
                                        socket.emit("GET_ALLUSERS", 1, 0)
                                        setshowMore(!showMore)
                                    }}
                                    class="exchange-items-head__sort-selected-option"
                                >
                                    <img src={sortIcn} alt="sortIcn" />
                                    <span>От начала</span>
                                </div>
                            ) : (
                                ""
                            )}
                            {state.sortBalance != 1 ? (
                                <div
                                    onClick={() => {
                                        socket.emit("GET_ALLUSERS", 1, 1)
                                        setshowMore(!showMore)
                                    }}
                                    class="exchange-items-head__sort-selected-option"
                                >
                                    <img src={sortIcn} alt="sortIcn" />
                                    <span>Баланс</span>
                                </div>
                            ) : (
                                ""
                            )}
                            {state.sortBalance != -1 ? (
                                <div
                                    onClick={() => {
                                        socket.emit("GET_ALLUSERS", 1, -1)
                                        setshowMore(!showMore)
                                    }}
                                    class="exchange-items-head__sort-selected-option"
                                >
                                    <img
                                        style={{ transform: "rotate(180deg)" }}
                                        src={sortIcn}
                                        alt="sortIcn"
                                    />
                                    <span>Баланс</span>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    )
}
const ItemsWithdraw = ({ toggleShowModalWindow, setModalChild, state, newNotificationTC }) => {
    return (
        <>
            <div class="list">
                {state.itemsWithdraw.map((v, i) => (
                    <WithdrawDeposit
                        onClick={() => {
                            toggleShowModalWindow()
                            setModalChild(
                                <PlyerModalWithdraw data={v} newNotificationTC={newNotificationTC} toggleShowModalWindow={toggleShowModalWindow} />,
                                `${v.weaponName}`,
                                false,
                                () => { },
                                false
                            )
                        }}
                        info={{
                            imgSrc: v.imgSrc,
                            text: v.weaponName,
                            summa: v.price,
                            date: v.date,
                            howPassed: true,
                            statusMessage: v.statusMessage,
                            statusNumber: v.statusNumber
                        }}
                        i={i}
                    />
                ))}
            </div>

            <div class="optionUsers">
                <Options
                    value={state.currentPage}
                    handleChange={(e) => {
                        socket.emit(
                            "GET_ALLWITHDRAW",
                            e.target.value == "Конец"
                                ? state.pageAll
                                : e.target.value == "Начало"
                                    ? 1
                                    : e.target.value,
                            state.onlyOpenWidraw
                        )
                    }}
                >
                    {state.listPage}
                </Options>
                <Checkbox
                    onChange={() => {
                        socket.emit("GET_ALLWITHDRAW", 1, !state.onlyOpenWidraw)
                    }}
                    checked={state.onlyOpenWidraw}
                >
                    Только для подверждения
                </Checkbox>
            </div>
        </>
    )
}

const Settings = ({ toggleShowModalWindow, setModalChild, state, newNotificationTC }) => {
    const [kofCrash, setkofCrash] = useState("")
    const [apikey, setApikey] = useState(false)
    const [botsId, setbotsId] = useState(false)
    const [placeBetsWithBot, setplaceBetsWithBot] = useState(false)
    const [bdRefSestem, setbdRefSestem] = useState([])
    const [depositMethod, setdepositMethod] = useState([])
    const [promoCode, setpromoCode] = useState([])
    const [Access, setAccess] = useState([])
    useEffect(() => {
        socket.on("LOAD_SETTING", (data) => {
            if (data.apikeyTm) setApikey(data.apikeyTm)
            if (data.botsId) setbotsId(data.botsId)
            if (data.placeBetsWithBot) setplaceBetsWithBot(data.placeBetsWithBot)
            if (data.bdRefSestem) setbdRefSestem(data.bdRefSestem)
            if (data.depositMethod) setdepositMethod(data.depositMethod)
            if (data.promoCode) setpromoCode(data.promoCode)
            if (data.Access) setAccess(data.Access)

            newNotificationTC("Загружены все настройки!", 1)
        })
        socket.emit("LOAD_SETTING")
        newNotificationTC("Идет загрузка всех данных сайта", 1)

        return () => socket.off("LOAD_SETTING")
    }, [])

    return (
        <>
            {state.Access_setKofCrash ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={kofCrash}
                        updateNewText={setkofCrash}
                        placeholder={"Коэффицент"}
                        classAddDiv={["SendInput"]}
                        sendBtn={false}
                    ></SendInput>
                    <YellowBtn
                        onClick={() => {
                            socket.emit(
                                "SET_KOFCRASH",
                                {
                                    kof: kofCrash,
                                }
                            )
                        }}
                        classAdd={["customButton"]}
                    >
                        Установить
                    </YellowBtn>
                </div>
            ) : (
                ""
            )}
            {state.Access_changeApiKey && typeof apikey != "boolean" ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={apikey}
                        updateNewText={setApikey}
                        classAddDiv={["SendInput"]}
                        sendBtn={false}
                    ></SendInput>
                    <YellowBtn
                        onClick={() => {
                            socket.emit('CHANGE_SETTING', {
                                changeText: apikey,
                                key: "apikeyTm",
                            })
                        }}
                        classAdd={["customButton"]}
                    >
                        Обновить ApiKey TM
                    </YellowBtn>
                </div>
            ) : (
                ""
            )}
            {state.Access_changeBots && typeof botsId != "boolean" ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={botsId}
                        updateNewText={setbotsId}
                        classAddDiv={["SendInput"]}
                        sendBtn={false}
                    ></SendInput>
                    <YellowBtn
                        onClick={() => {
                            socket.emit('CHANGE_SETTING', {
                                changeText: botsId,
                                key: "botsId",
                            })
                        }}
                        classAdd={["customButton"]}
                    >
                        Измнение ботов
                    </YellowBtn>
                </div>
            ) : (
                ""
            )}
            {state.Access_changeBots ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={"Ставки ботами: "}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={["fullwidth"]}
                    />
                    <SendInput
                        option={true}
                        innerInput={placeBetsWithBot}
                        submit={(e) => {
                            socket.emit('CHANGE_SETTING', {
                                changeText: e,
                                key: "placeBetsWithBot",
                            })
                        }}
                        classAddDiv={["fullwidth"]}
                        sendBtn={false}
                    />
                </div>
            ) : (
                ""
            )}
            {state.Access_bdRefSestem ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={"Настройка реф системы (Кол. юзеров | Процент)"}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={["fullwidth"]}
                    />
                    <div className="tableref">
                        {bdRefSestem.map((v, i) => <div>
                            <SendInput
                                innerInput={v.countUsers}
                                updateNewText={(text) => {
                                    v.countUsers = text
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "countUsers" },
                                        key: "bdRefSestem",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.percent}
                                updateNewText={(text) => {
                                    v.percent = text
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "percent" },
                                        key: "bdRefSestem",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                        </div>)}

                    </div>
                </div>
            ) : (
                ""
            )}


            {state.Access_changeMethodPay ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={"Настройка методов пополнения (Метод, название, urlIcon, Коммис.)"}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={["fullwidth"]}
                    />
                    <div className="tableref">
                        {depositMethod.map((v, i) => <div>
                            <SendInput
                                innerInput={v.method}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "method" },
                                        key: "depositMethod",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.nameMethod}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "nameMethod" },
                                        key: "depositMethod",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.icon}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "icon" },
                                        key: "depositMethod",
                                    })
                                }}
                                placeholder={"URL icon"}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.fee.percent}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "fee.percent" },
                                        key: "depositMethod",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.fee.value}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "fee.value" },
                                        key: "depositMethod",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                        </div>)}
                        <YellowBtn
                            onClick={() => {
                                socket.emit('CHANGE_SETTING', {
                                    changeText: { i: -1 },
                                    key: "depositMethod",
                                })
                            }}
                            classAdd={[""]}
                        >
                            +
                        </YellowBtn>
                    </div>
                </div>
            ) : (
                ""
            )}

            {state.Access_promoCode ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={"Промокоды (name, type (addBalance, bonusDeposit), value)"}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={["fullwidth"]}
                    />
                    <div className="tableref">
                        {promoCode.map((v, i) => <div>
                            <SendInput
                                innerInput={v.name}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "name" },
                                        key: "promoCode",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.type}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "type" },
                                        key: "promoCode",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                innerInput={v.value}
                                updateNewText={(text) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: text, change: "value" },
                                        key: "promoCode",
                                    })
                                }}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                        </div>)}
                        <YellowBtn
                            onClick={() => {
                                socket.emit('CHANGE_SETTING', {
                                    changeText: { i: -1 },
                                    key: "promoCode",
                                })
                            }}
                            classAdd={[""]}
                        >
                            +
                        </YellowBtn>
                    </div>
                </div>
            ) : (
                ""
            )}

            {state.Access_changeAccess ? (
                <div className="setKofCrash">
                    <SendInput
                        innerInput={"Размерешения на изменение (moder, admin)"}
                        disabled={true}
                        sendBtn={false}
                        classAddDiv={["fullwidthAcces"]}
                    />
                    <div className="tableref">
                        {Object.keys(Access).map((v, i) => <div>
                            <SendInput
                                innerInput={v}
                                disabled={true}
                                classAddDiv={["SendInput"]}
                                sendBtn={false}
                            ></SendInput>
                            <SendInput
                                option={true}
                                innerInput={Access[v].moder}
                                submit={(e) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: v, text: e, change: "moder" },
                                        key: "Access",
                                    })
                                }}
                                classAddDiv={["fullwidth"]}
                                sendBtn={false}
                            />
                            <SendInput
                                option={true}
                                innerInput={Access[v].admin}
                                submit={(e) => {
                                    socket.emit('CHANGE_SETTING', {
                                        changeText: { i: i, text: e, change: "admin" },
                                        key: "Access",
                                    })
                                }}
                                classAddDiv={["fullwidth"]}
                                sendBtn={false}
                            />
                        </div>)}
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    )
}
const AdminModer = ({
    showPreloader,
    toggleShowModalWindow,
    setModalChild,
    state,
    newNotificationTC
}) => {

    const [option, setOption] = useState(["Настройки"])

    const [optionSelect, setOptionSelect] = useState([])

    if (state.Access_loadAllUsers && !~option.indexOf("Игроки"))
        setOption(["Игроки", ...option])
    if (
        state.Access_checkOnlinePriorityUserd &&
        !~option.indexOf("Онлайн модеров")
    )
        setOption(["Онлайн модеров", ...option])
    if (state.Access_checkDeposit && !~option.indexOf("Пополнения"))
        setOption(["Пополнения", ...option])
    if (state.Access_checkWithdraw && !~option.indexOf("Выводы"))
        setOption(["Выводы", ...option])

    return (
        <div class="panel">
            {showPreloader ? (
                <Preloader classes="exchange-items__preloader" />
            ) : (
                <>
                    <div>
                        <Options
                            value={optionSelect}
                            handleChange={(e) => {
                                switch (e.target.value) {
                                    case "Игроки":
                                        socket.emit("GET_ALLUSERS")
                                        break
                                    case "Онлайн модеров":
                                        socket.emit("GET_ALLUSERS", 1, 0, "", true)
                                        break
                                    case "Выводы":
                                        socket.emit("GET_ALLWITHDRAW")
                                        break
                                }
                                setOptionSelect(e.target.value)
                            }}
                        >
                            {option}
                        </Options>
                        <div className="optionList">
                            {optionSelect == "Игроки" ? (
                                <Players state={state} toggleShowModalWindow={toggleShowModalWindow} setModalChild={setModalChild} />
                            ) : (
                                ""
                            )}
                            {optionSelect == "Онлайн модеров" ? (
                                <Players state={state} toggleShowModalWindow={toggleShowModalWindow} setModalChild={setModalChild} />
                            ) : (
                                ""
                            )}
                            {optionSelect == "Выводы" ? (
                                <ItemsWithdraw state={state} newNotificationTC={newNotificationTC} toggleShowModalWindow={toggleShowModalWindow} setModalChild={setModalChild} />
                            ) : (
                                ""
                            )}
                            {optionSelect == "Настройки" ? (
                                <Settings newNotificationTC={newNotificationTC} state={state} toggleShowModalWindow={toggleShowModalWindow} setModalChild={setModalChild} />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    {state.Access_answerSupport ? (
                        <div class="supportAnswer">
                            <span>Открытых тикетов в саппорте:</span>
                            <YellowBtn
                                onClick={() => {
                                    toggleShowModalWindow()
                                    setModalChild(
                                        <>
                                            {state.supportMes.map((v) => (
                                                <div class="blocksupport">
                                                    <NavLink
                                                        to={`/profile/${v.steamid}`}
                                                    >
                                                        <div class="chat-message__avatar">
                                                            <img
                                                                src={v.photo}
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                    </NavLink>
                                                    <NavLink
                                                        to={`/support/${v.steamid}`}
                                                    >
                                                        <span class="nick">
                                                            {v.nickSteam}
                                                        </span>
                                                    </NavLink>
                                                    <span class="chat-message__time">
                                                        {v.time}
                                                    </span>
                                                </div>
                                            ))}
                                        </>,
                                        "Открытые тикиты",
                                        false,
                                        () => { },
                                        false
                                    )
                                }}
                            >
                                Открыть: {state.supportMes.length}
                            </YellowBtn>
                        </div>
                    ) : (
                        ""
                    )}
                </>
            )}
        </div>
    )
}

export default withToggleShowModalWindow(AdminModer)
