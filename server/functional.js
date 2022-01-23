import { MongoClient, ObjectId } from "mongodb"
import cluster from "cluster"
import Cutter from "utf8-binary-cutter"
import axios from "axios"
import randomWords from "random-words"

//Подключение к МОНГО_ДБ (Базе данных)
const url = "mongodb://localhost:27017",
    client = new MongoClient(url)
var bd, setting
;(async () => {
    await client.connect()
    bd = client.db("bd")

    await updateSetting()
})()

export const updateSetting = async () => {
    //Обновляет на сервере сеттинг и возвращает их
    setting = await bd
        .collection("Setting")
        .findOne({ _id: ObjectId("6124ea852bccf863f475b100") })
    return setting
}

var usd = 74
setInterval(async () => {
    var { data } = await axios.get(`https://www.cbr-xml-daily.ru/latest.js`)
    usd = 1 / Number(data.rates.USD) - usd < 10 ? 1 / Number(data.rates.USD) : usd
}, 1000 * 60 * 60 * 24)

// 0 - Процессинг
// 1 - успех
// 2 - Ошибка
const updateUserplayerHistory = async (comment, user) => {
    return [new Date().toJSON() + " " + comment, ...user.playerHistory.slice(0, 300)]
}
const round = (num) => Math.round(Number(num) * 100) / 100
const updateItemError = async (msg, _id, statusNumber, obj = {}) => {
    await bd.collection("Withdraw").updateOne(
        { _id: ObjectId(_id) },
        {
            $set: {
                statusMessage: msg,
                statusNumber: statusNumber,
                ...obj,
            },
        }
    )
}

const checkStatusItems = async () => {
    let info_Skins = await bd
        .collection("Withdraw")
        .find({ statusMessage: "Предмет куплен, ожидайте обмен" })
        .toArray()
    if (info_Skins.length == 0) return

    let { success, data, error } = await get(
        `https://market.csgo.com/api/v2/history?key=${setting.apikeyTm}&date=${(
            new Date().getTime() / 1000 -
            60 * 60 * 24 * 1
        ).toFixed(0)}&date_end=${(new Date().getTime() / 1000).toFixed(0)}`
    )

    for (let i = 0; i < info_Skins.length; i++) {
        var skin = data.find((v) => v.item_id == info_Skins[i].idBuyTm)

        if (skin.stage == 2) {
            await updateItemError("Successful", skin._id, 1)
            let user = await bd
                .collection("users")
                .findOne({ steamid: info_Skins.steamId })
            await bd.collection("users").updateOne(
                { steamid: info_Skins.steamId },
                {
                    $set: {
                        playerHistory: await updateUserplayerHistory(
                            `Вывод предмета (# ${info_Skins[i].idItem}) -${info_Skins[i].priceItemNow}`,
                            user
                        ),
                        totalWithdraw: info_Skins[i].priceItemNow,
                    },
                }
            )
        }
        if (skin.stage == 5)
            await updateItemError(
                "Предмет не был отправлен либо вы не приняли обмен",
                skin._id,
                2
            )
    }
}

const get = async (url) => {
    try {
        let { data } = await axios.get(url)
        return data
    } catch (error) {
        return await get(url)
    }
}

const buySkin_withTm = async (_id) => {
    let info_Skin = await bd.collection("Withdraw").findOne({ _id: ObjectId(_id) })

    if (!info_Skin) {
        await updateItemError("Внутренняя ошибка (1)", _id, 2)
        return
    }

    let info_User = await bd.collection("users").findOne({ steamid: info_Skin.steamId })

    if (!info_User) {
        await updateItemError("Внутренняя ошибка (2)", _id, 2)
        return
    }
    if (info_User.banWithdraw) {
        await updateItemError("Доступ к выводу заблокирован", _id, 2)
        return
    }
    if (!info_User.tradeUrlSteam.partner || !info_User.tradeUrlSteam.token) {
        await updateItemError("Трейд ссылка не найдена", _id, 2)
        return
    }

    let { data } = await get(
        `https://market.csgo.com/api/v2/buy-for?key=${setting.apikeyTm}&hash_name=${
            info_Skin.hash_name
        }&price=${round(info_Skin.hash_name.priceItemNow * usd) * 100}&partner=${
            info_User.tradeUrlSteam.partner
        }&token=${info_User.tradeUrlSteam.token}`
    )

    if (data.error == "Недостаточно средств на счету" || data.error == "Not money") {
        await updateItemError("Вывод временно не доступен", _id, 2)
        return
    }
    if (data.error == "No item was found at the specified price or lower.") {
        await updateItemError("Скина нет в наличии, попробуйте другой :(", _id, 2)
        await bd
            .collection("bdSkins")
            .updateOne({ hash_name: info_Skin.hash_name }, { $set: { stock: false } })
        return
    }
    if (data.error) {
        await updateItemError("Не известная ошибка!", _id, 2)
        return
    }

    if (data.success) {
        //{"success":true,"id":"1843507731","price":"50"}
        await updateItemError("Предмет куплен, ожидайте обмен", _id, 0, {
            idBuyTm: data.id,
        })
    }
}
export const LOAD_HISTORY_ALLGAMES = async (type) => {
    if (!isNaN(type)) return { message: "Ошибка", messageNum: 2 }

    let data = []
    if (type == "Crash")
        data = (
            await bd
                .collection("Crash")
                .find({}, { sort: { id: -1 }, limit: 30 })
                .toArray()
        ).map((v) => ({
            kofX: v.crashKofx,
            id: v.id,
            time: `${
                new Date(v.dateGame).getHours() < 10
                    ? `0${new Date(v.dateGame).getHours()}`
                    : new Date(v.dateGame).getHours()
            }:${
                new Date(v.dateGame).getMinutes() < 10
                    ? `0${new Date(v.dateGame).getMinutes()}`
                    : new Date(v.dateGame).getMinutes()
            }`,
            betsValue: v.allBetsValue,
            amountOfPlayers: v.allbets.length,
        }))

    return data
}
export const LOAD_HISTORY_GAME = async (id) => {
    if (isNaN(id) && id != null) return { message: "Ошибка", messageNum: 2 }

    let data = await bd.collection("Crash").findOne({ id: id })

    return {
        allBets: data.allbets,
        totalBetsSumma: data.allBetsValue,
        kofX: data.crashKofx,
        hash: data.hash,
        salt: data.salt,
        amountOfPlayers: data.allbets.length,
        weaponsValue: data.allbets.reduce((all, cur) => all + cur.items.length, 0),
    }
}

//Панель

export const CHECK_IS_ADMIN = async (steamid) =>
    (await bd.collection("users").findOne({ steamid: steamid }))?.isAdmin
export const CHECK_IS_MODER = async (steamid) =>
    (await bd.collection("users").findOne({ steamid: steamid }))?.isModer
export const CHECK_HIGHSTATUS_USER = async (steamid) => {
    try {
        let user = await bd.collection("users").findOne({ steamid: steamid })
        let userStatus = ""
        if (user.isAdmin) userStatus = "admin"
        else if (user.isModer) userStatus = "moder"
        let ret = []
        if (userStatus)
            for (let method in setting.Access)
                if (setting.Access[method][userStatus]) ret.push(`Access_${method}`)
        return { user: user, allowMethod: ret }
    } catch (error) {
        return { user: {}, allowMethod: [] }
    }
}
export const DELETE_MESSAGE = async (id, steamid) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_deleteMessage")) return

    //проверка на доступ прошла
    await bd.collection("Chat").deleteOne({ _id: ObjectId(id) })

    return {
        message: "Успешно удалено",
        messageNum: 1,
        messages: (await LOAD_CHAT()).message,
    }
}
export const CHANGE_USERSETTING = async (steamid, { changeText, key, _id }) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_loadAllUsers"))
        return {
            message: "Ошибка",
            messageNum: 2,
        }

    //проверка на доступ прошла
    let json = {}
    json[key] =
        changeText == "false" || changeText == "true"
            ? JSON.parse(changeText)
            : changeText
    await bd.collection("users").updateOne({ _id: ObjectId(_id) }, { $set: json })

    return {
        message: "Успешно измнено",
        messageNum: 1,
    }
}
export const BAN_USER = async (steamidUser, steamid, comment) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_banUser")) return

    //проверка на доступ прошла
    await bd.collection("users").updateOne(
        { steamid: steamidUser },
        {
            $set: {
                playerHistory: await updateUserplayerHistory(
                    `Бан юезара, причина: ${comment}`,
                    check.user
                ),
                ban: {
                    ban: true,
                    message: comment,
                },
            },
        }
    )

    return {
        message: "Юзер забанен",
        messageNum: 1,
    }
}
export const UNPINNED_MESS = async (steamid) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_pinnedMessage")) return

    //проверка на доступ прошла
    await bd.collection("Chat").updateMany(
        {},
        {
            $set: {
                pinnedMes: false,
            },
        }
    )

    return {
        message: "Сообщение откреплено",
        messageNum: 1,
    }
}
export const CLOSE_TICKETUSER = async (steamid, idUserClose) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_answerSupport") && idUserClose != steamid)
        return

    //проверка на доступ прошла
    await bd.collection("users").updateOne(
        { steamid: idUserClose },
        {
            $set: {
                supportStatus: "close",
                supportStatusUpdateDate: new Date().toJSON(),
            },
        }
    )

    return {
        message: "Тикет закрыт",
        messageNum: 1,
    }
}
export const PINNED_MESS = async (id, steamid) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_pinnedMessage")) return

    //проверка на доступ прошла

    let mes = await bd.collection("Chat").findOneAndUpdate(
        { _id: ObjectId(id) },
        {
            $set: {
                pinnedMes: true,
            },
        }
    )

    return {
        message: "Сообщение закреплено",
        messageNum: 1,
        data: mes.value,
    }
}
export const MUTE_USER = async (steamidUser, steamid, timeMinutes) => {
    if (!timeMinutes)
        return {
            message: `Не указаан время мута`,
            messageNum: 2,
        }
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_muteUser")) return

    //проверка на доступ прошла
    await bd.collection("users").updateOne(
        { steamid: steamidUser },
        {
            $set: {
                playerHistory: await updateUserplayerHistory(
                    `Мут юзера на ${timeMinutes} минут`,
                    check.user
                ),
                unMuteDate: new Date(
                    new Date().getTime() + timeMinutes * 60 * 1000
                ).toJSON(),
            },
        }
    )

    return {
        message: `Юзер замучен на ${timeMinutes} мин.`,
        messageNum: 1,
    }
}
export const UPDATE_COUNT_MESSOPENSUPPORT = async (steamid) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_answerSupport")) return

    //проверка на доступ прошла

    return (await bd.collection("users").find({ supportStatus: "open" }).toArray()).map(
        (e) => ({
            steamid: e.steamid,
            nickSteam: e.nickSteam,
            photo: e.photo,
            time: new Date(e.supportStatusUpdateDate).toLocaleString(),
        })
    )
}
export const GET_ALLUSERS = async (steamid, pageNumber, sortBalance, search) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_loadAllUsers")) return

    let querySearch = !isNaN(search)
        ? {
              steamid: {
                  $regex: String(search).trim(),
                  $options: "i",
              },
          }
        : {
              nickSteam: {
                  $regex: String(search).trim(),
                  $options: "i",
              },
          }
    //проверка на доступ прошла
    let showUser = 3
    let users = sortBalance
        ? await bd
              .collection("users")
              .find(querySearch, {
                  limit: showUser,
                  skip: (pageNumber - 1) * 1,
                  sort: { balance: sortBalance },
              })
              .toArray()
        : await bd
              .collection("users")
              .find(querySearch, { limit: showUser, skip: (pageNumber - 1) * 1 })
              .toArray()
    let bdSkins = (
        await bd
            .collection("bdSkins")
            .find({
                _id: {
                    $in: users
                        .map((v) => v.inventory.map((e) => ObjectId(e.itemId)))
                        .flat(),
                },
            })
            .toArray()
    ).map((e) => ({
        idItem: String(e._id),
        price: e.priceUsd_Our,
        imgSrc: e.img,
        weaponName: e.hash_name,
        rarity: e.rarity,
    }))

    users = users.map((v) => ({
        ...v,
        inventory: v.inventory.reduce(
            (all, cur) =>
                all.addCount(
                    cur.count,
                    bdSkins.find((v) => v.idItem == cur.itemId)
                ),
            []
        ),
    }))
    return {
        users,
        pageAll: Math.ceil((await bd.collection("users").find({}).count()) / showUser),
        currentPage: pageNumber,
        sortBalance: sortBalance,
    }
}
export const GET_ALLWITHDRAW = async (steamid, pageNumber, onlyOpenWidraw) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_checkWithdraw")) return

    //проверка на доступ прошла
    let showItems = 30
    let items = onlyOpenWidraw
        ? await bd
              .collection("Withdraw")
              .find(
                  { statusMessage: "Processing" },
                  { limit: showItems, skip: (pageNumber - 1) * 1, sort: { date: -1 } }
              )
              .toArray()
        : await bd
              .collection("Withdraw")
              .find(
                  {},
                  { limit: showItems, skip: (pageNumber - 1) * 1, sort: { date: -1 } }
              )
              .toArray()
    let TmpItems = await bd
        .collection("bdSkins")
        .find({ _id: { $in: items.map((e) => ObjectId(e.idItem)) } })
        .toArray()

    return {
        items: items.map((e) => {
            let itemInfoWithdraw = TmpItems.find((v) => String(v._id) == e.idItem)
            return {
                idWithdraw: String(e._id),
                imgSrc: itemInfoWithdraw.img,
                weaponName: itemInfoWithdraw.hash_name,
                price: e.priceItemNow,
                date: e.date,
                idUser: e.steamId,
                statusMessage: e.statusMessage,
                messageAPI: e.messageAPI,
                statusNumber: e.statusNumber,
            }
        }),
        pageAll: Math.ceil(
            (await bd.collection("Withdraw").find({}).count()) / showItems
        ),
        currentPage: pageNumber,
        onlyOpenWidraw: onlyOpenWidraw,
    }
}
export const CHANGE_PAUSE_CHAT = async (steamid) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    if (!~check.allowMethod.indexOf("Access_pauseChat")) return

    //проверка на доступ прошла

    await bd.collection("Setting").updateOne(
        { _id: ObjectId("6124ea852bccf863f475b100") },
        {
            $set: {
                pauseChat: !setting.pauseChat,
            },
        }
    )
    await updateSetting()
    return setting.pauseChat
}
export const GET_ACCESS_METHOD = async (steamid) => {
    let { isModer, isAdmin, playerHistory } = await bd
        .collection("users")
        .findOne({ steamid: steamid })
    await bd.collection("users").updateOne(
        { steamid: steamid },
        {
            $set: {
                playerHistory: await updateUserplayerHistory(`Запрос к доступу админки`, {
                    playerHistory,
                }),
            },
        }
    )

    let ret = {}
    for (let method in setting.Access)
        ret[`Access_${method}`] = isModer
            ? setting.Access[method].moder
            : isAdmin
            ? setting.Access[method].admin
            : false
    return { data: ret, message: "Методы загружены", messageNum: 1 }
}

export const LOAD_PAYMENTINFO = async () => {
    return setting.depositMethod
}
export const LOAD_INVENTORYSTEAM_USER = async (steamid) => {
    let { rgInventory, rgDescriptions, success } = await get(
        `https://steamcommunity.com/profiles/${steamid}/inventory/json/730/2`
    )
    if (!success)
        return {
            message: "Ошибка загрузки инвентаря STEAM",
            messageNum: 2,
        }
    let name_count = {}
    let arrName = []

    for (let item in rgInventory) {
        item = `${rgInventory[item].classid}_${rgInventory[item].instanceid}`
        if (!~arrName.indexOf(rgDescriptions[item].market_hash_name))
            arrName.push(rgDescriptions[item].market_hash_name)

        if (name_count[rgDescriptions[item].market_hash_name])
            name_count[rgDescriptions[item].market_hash_name]++
        else name_count[rgDescriptions[item].market_hash_name] = 1
    }

    let bdSkins = (
        await bd
            .collection("bdSkins")
            .find({ hash_name: { $in: arrName } })
            .toArray()
    )
        .map((e) => ({
            idItem: String(e._id),
            price: e.priceUsd_Our,
            imgSrc: e.img,
            weaponName: e.hash_name,
            rarity: e.rarity,
        }))
        .reduce((all, cur) => all.addCount(name_count[cur.weaponName], cur), [])

    return {
        message: "Инвентарь загружен",
        messageNum: 1,
        data: bdSkins,
    }
}
export const ENTER_PROMOCODE = async (steamid, code) => {
    code = code.trim()
    let promo = setting.promoCode.find((v) => v.name.toUpperCase() == code.toUpperCase())
    if (!promo)
        return {
            message: "Данного промокода не существует",
            messageNum: 2,
        }

    let user = await bd.collection("users").findOne({ steamid: steamid })
    if (~user.promoCodeUsed.indexOf(promo.id))
        return {
            message: "Вы уже активировали этот промокод",
            messageNum: 2,
        }

    let addBalance = 0
    let bonusDeposit = 0
    if (promo.type == "addBalance") addBalance = promo.value
    if (promo.type == "bonusDeposit") bonusDeposit = promo.value

    await bd.collection("users").updateOne(
        { steamid: steamid },
        {
            $set: {
                playerHistory: await updateUserplayerHistory(
                    `Использование промокода ${code}, ${
                        addBalance > 0
                            ? `пополнение баланса ${addBalance}`
                            : `измнение бонуса к пополнению ${bonusDeposit}%`
                    }`,
                    user
                ),
                promoCodeUsed: [...user.promoCodeUsed, promo.id],
                balance: round(user.balance + addBalance),
                bonusDeposit: round(user.bonusDeposit + bonusDeposit),
            },
        }
    )

    return {
        message: `Промокод активирован, ${
            addBalance
                ? `баланс увеличен на ${addBalance}$`
                : `бонус к пополнению ${bonusDeposit}%`
        }, общий бонус к депозиту ${round(user.bonusDeposit + bonusDeposit)}%`,
        messageNum: 1,
        // data: {
        //     balance: round(user.balance + addBalance),
        //     bonusDeposit: bonusDeposit,
        //     allBonusDeposit: round(user.bonusDeposit + bonusDeposit)
        // }
    }
}

export const EXCHANGE_ITEM = async (ArrayWithdrawId, exchangeItems, steamid) => {
    if (ArrayWithdrawId.length == 0)
        return {
            message: "Вы не выбрали предметы для обмена",
            messageNum: 2,
        }

    let { balance, inventory, playerHistory } = await bd.collection("users").findOne({
        steamid: steamid,
    })

    let bdSkins = (
        await bd
            .collection("bdSkins")
            .find({
                _id: {
                    $in: [
                        ...inventory.map((v) => v.itemId),
                        ...ArrayWithdrawId,
                        ...exchangeItems,
                    ].map((e) => ObjectId(e)),
                },
            })
            .toArray()
    ).map((e) => ({
        idItem: String(e._id),
        price: e.priceUsd_Our,
        imgSrc: e.img,
        weaponName: e.hash_name,
        rarity: e.rarity,
    })) //не только виздрав id но и инвентаря

    //удаляем из инвентаря и добавляем в баланс те вещи которые он отправил на обмен
    exchangeItems.map((v) => {
        inventory.find((e) => e.itemId == v).count--
        balance += bdSkins.find((e) => e.idItem == v).price
    })
    inventory = inventory.filter((v) => v.count > 0)

    let withdrawSkin = bdSkins.reduce(
        (all, cur) =>
            ~ArrayWithdrawId.indexOf(cur.idItem) ? all + Number(cur.price) : all,
        0
    )
    if (balance < withdrawSkin)
        return { message: "Ошибка! Недостаточно средств", messageNum: 2 }

    ArrayWithdrawId.forEach((e) => {
        try {
            ++inventory.find((v) => v.itemId == e).count
        } catch {
            //если есть оишбка значит такого предмета нет добавим
            inventory.unshift({ itemId: e, count: 1 })
        }
    })

    await bd.collection("users").updateOne(
        { steamid: steamid },
        {
            $set: {
                inventory: inventory,
                balance: round(balance - withdrawSkin),
                playerHistory: await updateUserplayerHistory(
                    `Обмен предметов(магазин), обновление баланса -${withdrawSkin}, стало ${round(
                        balance - withdrawSkin
                    )}`,
                    { playerHistory }
                ),
            },
        }
    )

    return {
        message: "Успешно!",
        inventory: bdSkins.reduce(
            (all, cur) =>
                all.addCount(inventory.find((e) => e.itemId == cur.idItem)?.count, cur),
            []
        ),
        balance: round(balance - withdrawSkin),
        messageNum: 1,
    }
}

export const LOAD_SUPPORT_ALLMESSAGE = async (steamid, loadOtherUser) => {
    try {
        console.time()
        var dataSupport = await bd
            .collection("Support")
            .find({
                $or: [
                    { steamid_Reply: loadOtherUser ? loadOtherUser : steamid },
                    { steamid_Sender: loadOtherUser ? loadOtherUser : steamid },
                ],
            })
            .toArray()
        console.timeEnd()
        console.time()
        var dataUsersReply = await bd
            .collection("users")
            .find({ steamid: { $in: dataSupport.findUnicId() } })
            .toArray()
        console.timeEnd()
        console.time()
        dataSupport = dataSupport.map((v) => {
            let sendera = dataUsersReply.find((e) => e.steamid == v.steamid_Sender)

            return {
                name: sendera?.nickSteam,
                photoSteam: sendera?.photo,

                steamid: v.steamid_Sender,
                photo: v.photo,

                messageText: v.text,
                time: v.date,
            }
        })
        console.timeEnd()
        return { data: dataSupport }
    } catch (error) {
        return { message: "Ошибка", messageNum: 2 }
    }
}
export const LOAD_CHAT = async () => {
    let pinnedMes = await bd.collection("Chat").findOne({ pinnedMes: true })

    return {
        isPause: setting.pauseChat,
        message: (
            await bd
                .collection("Chat")
                .find({}, { sort: { time: -1 }, limit: 50 })
                .toArray()
        ).map((v) => ({
            id: String(v._id),
            messageText: v.messageText,
            time: `${
                new Date(v.time).getHours() < 10
                    ? `0${new Date(v.time).getHours()}`
                    : new Date(v.time).getHours()
            }:${
                new Date(v.time).getMinutes() < 10
                    ? `0${new Date(v.time).getMinutes()}`
                    : new Date(v.time).getMinutes()
            }`,
            avatar: v.avatar,
            name: v.name,
            steamid: v.steamid,
            statusUserChat: v.statusUserChat,
        })),
        pinned: pinnedMes
            ? {
                  id: String(pinnedMes._id),
                  messageText: pinnedMes.messageText,
                  time: `${
                      new Date(pinnedMes.time).getHours() < 10
                          ? `0${new Date(pinnedMes.time).getHours()}`
                          : new Date(pinnedMes.time).getHours()
                  }:${
                      new Date(pinnedMes.time).getMinutes() < 10
                          ? `0${new Date(pinnedMes.time).getMinutes()}`
                          : new Date(pinnedMes.time).getMinutes()
                  }`,
                  avatar: pinnedMes.avatar,
                  name: pinnedMes.name,
                  steamid: pinnedMes.steamid,
                  statusUserChat: pinnedMes.statusUserChat,
              }
            : undefined,
    }
}
export const SEND_CHATMES = async (messageText, steamid) => {
    //Проверка на пазуа чата
    let gitInfo = await CHECK_HIGHSTATUS_USER(steamid)
    if (setting.pauseChat && !gitInfo.userStatus) return
    if (new Date(gitInfo.user.unMuteDate) > new Date())
        return {
            message: `Вы замучены еще ${(
                Math.abs(new Date(gitInfo.user.unMuteDate) - new Date()) /
                1000 /
                60
            ).toFixed(0)} мин. :(`,
            messageNum: 2,
        }

    messageText = messageText.replace(/[^a-z0-9,.()|/?!а-яё\s]/gi, "").trim() //удаление пауков

    if (!messageText) return false

    let date = new Date().toJSON()
    var { statusUserChat, photo, nickSteam } = gitInfo.user

    let { insertedId } = await bd.collection("Chat").insertOne({
        messageText: messageText,
        time: date,
        avatar: photo,
        name: nickSteam,
        steamid: steamid,
        statusUserChat: statusUserChat,
    })

    return {
        id: String(insertedId),
        messageText: messageText,
        time: `${
            new Date(date).getHours() < 10
                ? `0${new Date(date).getHours()}`
                : new Date(date).getHours()
        }:${
            new Date(date).getMinutes() < 10
                ? `0${new Date(date).getMinutes()}`
                : new Date(date).getMinutes()
        }`,
        avatar: photo,
        name: nickSteam,
        steamid: steamid,
        statusUserChat: statusUserChat,
    }
}
export const WITHDRAW_ITEMS_REQUEST = async ({ first, weapons }, steamid) => {
    try {
        var { inventory, banWithdraw } = await bd.collection("users").findOne({
            steamid: steamid,
        })
        if (banWithdraw)
            return {
                message: "Доступ к выводу заблокирован",
                messageNum: 2,
            }

        inventory = inventory.reduce((all, cur) => {
            if (~weapons.indexOf(cur.itemId))
                cur.count = cur.count - weapons.howLenghtById(cur.itemId)
            if (cur.count > 0) return [...all, cur]
            else return all
        }, [])

        await bd.collection("users").updateOne(
            { steamid: steamid },
            {
                $set: {
                    inventory: inventory,
                },
            }
        )

        //если пользователь первый раз открыл винджров то запросим всю базу
        let allWith = []
        if (first) {
            allWith = (
                await bd
                    .collection("Withdraw")
                    .find(
                        { steamId: steamid },
                        { sort: { date: -1 }, limit: 50 - weapons.length }
                    )
                    .toArray()
            ).map((v) => v.idItem)
        }
        // allWith = (await bd.collection("Withdraw").find({ steamId: steamid }).limit(50).toArray()).map(v => ({
        //     idItem: v.idItem,
        //     price: v.priceItemNow,
        //     status: v.status,
        //     date: v.date
        // }))

        let itemsAllBd = (
            await bd
                .collection("bdSkins")
                .find({
                    _id: {
                        $in: [
                            ...weapons,
                            ...allWith,
                            ...inventory.map((v) => v.itemId),
                        ].map((e) => ObjectId(e)),
                    },
                })
                .toArray()
        ).map((e) => ({
            idItem: String(e._id),
            price: e.priceUsd_Our,
            imgSrc: e.img,
            weaponName: e.hash_name,
            rarity: e.rarity,
        }))

        //Реализация покупки
        var date = new Date().toJSON()

        await bd.collection("Withdraw").insertMany(
            weapons.map((v) => ({
                idItem: v,
                priceItemNow: itemsAllBd.find((e) => e.idItem == v).price,
                steamId: steamid,
                statusMessage: "Processing",
                statusNumber: 0,
                messageAPI: "",
                date: date,
            }))
        )
        //query добавить
        let query = { steamId: steamid }
        if (!first) query["date"] = date
        let returnDataWith = (
            await bd
                .collection("Withdraw")
                .find(query, { sort: { date: -1 }, limit: 50 })
                .toArray()
        ).map((v) => ({
            idWithdraw: String(v._id),
            idItem: v.idItem,
            price: v.priceItemNow,
            statusMessage: v.statusMessage,
            statusNumber: v.statusNumber,
            date: v.date,
        }))

        return {
            items: returnDataWith.map((e) => ({
                ...itemsAllBd.find((v) => v.idItem == e.idItem),
                ...e,
            })), //из id превращаем в объекты для читания в реакте
            inventory: itemsAllBd
                .filter((e) => ~inventory.map((v) => v.itemId).indexOf(e.idItem))
                .reduce(
                    (all, cur) =>
                        all.addCount(
                            inventory.find((e) => e.itemId == cur.idItem).count,
                            cur
                        ),
                    []
                ),
        }
    } catch (error) {
        return {
            message: "Внутрення ошибка (3)",
            messageNum: 2,
        }
    }
}
export const ADD_MESSAGE_SUPPORT = async ({ text, photo, steamid, senderId }) => {
    let check = await CHECK_HIGHSTATUS_USER(steamid)
    let getData = check.user
    if (senderId) if (!~check.allowMethod.indexOf("Access_answerSupport")) return

    try {
        text = text.replace(/[^a-z0-9(),.|/?!а-яё\s]/gi, "").trim()

        if (!text && photo.length == 0)
            return { message: "Пустые сообщения заблокированы", messageNum: 2 }
        if (photo.length > 3) return { message: "Максимум 3 фотографии", messageNum: 2 }
        if (!text && photo.length > 0) text = "Файл"

        for (let i = 0; i < photo.length; i++) {
            if (Cutter.getBinarySize(photo[i]) / 1024 / 1024 > 5)
                return {
                    message: `Файл #${
                        i + 1
                    } превышет 5МБ, разрешены к загрузке файлы до 5МБ!`,
                    messageNum: 2,
                }
            if (
                !(
                    ~photo[i].indexOf("data:image/jpeg;base64,") ||
                    ~photo[i].indexOf("data:image/png;base64,")
                )
            )
                return {
                    message: `Файл #${
                        i + 1
                    } имеет недопустимый формат (Разрешены JPEG/PNG)`,
                    messageNum: 2,
                }
        }

        await bd.collection("users").updateOne(
            { steamid: senderId ? senderId : steamid },
            {
                $set: {
                    supportStatus: "open",
                    supportStatusUpdateDate: new Date().toJSON(),
                },
            }
        )

        let date = new Date().toJSON()

        await bd.collection("Support").insertOne({
            steamid_Sender: steamid, //кто отправил
            steamid_Reply: check.userStatus ? senderId : undefined, //кому отправили (кому ответили)
            text: text,
            photo: photo,
            date: date,
        })

        return {
            data: {
                name: getData.nickSteam,
                time: date,
                messageText: text,
                avatar: getData.photo,
                steamid: steamid,
                photo: photo,
            },
        }
    } catch (error) {
        return { message: "Ошибка", messageNum: 2 }
    }
}

export const LOAD_ALLSKINS = async ({
    skip,
    sort,
    minPrice,
    maxPrice,
    stockOnly = true,
    name = "",
}) => {
    if (name.length > 150) name = ""

    var query = {
        hash_name: {
            $regex: String(name)
                .trim()
                .replace(/["'\\)]/g, "\\)")
                .replace(/["'\(]/g, "\\(")
                .replace(/["'\\|]/g, "\\|"),
            $options: "i",
        },
    } // 1- замена скобки ")" 2- замена скобки "(" 3- замена "|"

    if (Boolean(stockOnly)) query["stock"] = true

    if (
        !isNaN(minPrice) &&
        !isNaN(maxPrice) &&
        minPrice != null &&
        maxPrice != null &&
        minPrice <= maxPrice &&
        Boolean(maxPrice) &&
        Boolean(minPrice)
    )
        query = { priceUsd_Our: { $gte: minPrice, $lte: maxPrice } }
    else if (!isNaN(minPrice) && minPrice != null && Boolean(minPrice))
        query = { priceUsd_Our: { $gte: minPrice } }
    else if (!isNaN(maxPrice) && maxPrice != null && Boolean(maxPrice))
        query = { priceUsd_Our: { $lte: maxPrice } }

    var option = {
        sort: { priceUsd_Our: sort == 1 || sort == -1 ? sort : 1 },
        limit: 60,
        skip: !isNaN(skip) && skip >= 0 ? Number(skip) : 0,
    }

    return (await bd.collection("bdSkins").find(query, option).toArray()).map((e) => ({
        idItem: String(e._id),
        price: e.priceUsd_Our,
        imgSrc: e.img,
        weaponName: e.hash_name,
        rarity: e.rarity,
    }))
}
export const LOAD_USER_INFO_FULL = async (steamid, witdrawLoad, steamId) => {
    if (!isNaN(steamId) && steamId != null && steamId != steamid && steamId) {
        //чужой профиль
        let getData = await bd.collection("users").findOne({ steamid: steamId })
        let CrashBets = await bd
            .collection("Crash")
            .find(
                { allbets: { $elemMatch: { steamId: steamId } } },
                { sort: { id: -1 }, limit: 30 }
            )
            .toArray()

        let topRatio = 0,
            winGamesCount = 0,
            countGames = 0
        ;(
            await bd
                .collection("Crash")
                .find({ allbets: { $elemMatch: { steamId: steamId } } })
                .toArray()
        ).forEach((game) => {
            let userBet = game.allbets.find((v) => v.steamId == steamId)
            if (topRatio < userBet.kofX && userBet.betsValueWin > 0)
                topRatio = userBet.kofX
            if (userBet.betsValueWin > 0) winGamesCount++
            countGames++
        })

        return {
            code: "succes",
            profile: {
                isMyProfile: false,
                nickSteam: getData.nickSteam,
                photo: getData.photo,
                gamesPlayed: countGames,
                topRatio: topRatio,
                winRate:
                    countGames > 0 ? ((winGamesCount / countGames) * 100).toFixed(2) : 0,
                CrashBets: CrashBets.map((data) => {
                    let userbet = data.allbets.find((v) => v.steamId == steamId)
                    return {
                        allPlayers: data.allbets.length,
                        items: userbet.items,
                        kofX: data.crashKofx,
                        totalBetsValue: userbet.totalBetsSumma,
                        kofxVictory: userbet.betsValueWin ? userbet.kofX : false,
                        betsValueWin: userbet.betsValueWin,
                        gameId: data.id,
                        time: `${
                            new Date(data.dateGame).getHours() < 10
                                ? `0${new Date(data.dateGame).getHours()}`
                                : new Date(data.dateGame).getHours()
                        }:${
                            new Date(data.dateGame).getMinutes() < 10
                                ? `0${new Date(data.dateGame).getMinutes()}`
                                : new Date(data.dateGame).getMinutes()
                        }`,
                        skinsVictory: userbet.skinsVictory,
                    }
                }),
            },
        }
    } else {
        //мой профиль
        console.time("getData")
        let getData = await bd.collection("users").findOne({ steamid: steamid })
        console.timeEnd("getData")
        console.time("witdrawLoad")
        if (witdrawLoad) {
            var allWith = (
                await bd
                    .collection("Withdraw")
                    .find({ steamId: steamid }, { sort: { date: -1 }, limit: 50 })
                    .toArray()
            ).map((v) => ({
                idItem: v.idItem,
                price: v.priceItemNow,
                statusMessage: v.statusMessage,
                statusNumber: v.statusNumber,
                date: v.date,
            }))
            var bdWith = await bd
                .collection("bdSkins")
                .find({ _id: { $in: allWith.map((v) => ObjectId(v.idItem)) } })
                .toArray()

            allWith = allWith.map((e) => {
                let bd = bdWith.find((v) => String(v._id) == e.idItem)
                return {
                    ...e,
                    imgSrc: bd.img,
                    weaponName: bd.hash_name,
                    rarity: bd.rarity,
                }
            })
        }
        console.timeEnd("witdrawLoad")
        console.time("CrashBets")
        let CrashBets = await bd
            .collection("Crash")
            .find(
                { allbets: { $elemMatch: { steamId: steamid } } },
                { sort: { id: -1 }, limit: 30 }
            )
            .toArray()
        console.timeEnd("CrashBets")
        console.time("topRatio")
        let topRatio = 0,
            winGamesCount = 0,
            countGames = 0
        ;(
            await bd
                .collection("Crash")
                .find({ allbets: { $elemMatch: { steamId: steamid } } })
                .toArray()
        ).forEach((game) => {
            let userBet = game.allbets.find((v) => v.steamId == steamid)
            if (topRatio < userBet.kofX && userBet.betsValueWin > 0)
                topRatio = userBet.kofX
            if (userBet.betsValueWin > 0) winGamesCount++
            countGames++
        })
        console.timeEnd("topRatio")
        console.time("indexRef")
        let indexRef = setting.bdRefSestem.findIndex(
            (v) => v.countUsers >= getData.myRefferals.length
        )
        console.timeEnd("indexRef")
        console.time("return")
        let tmp = {
            code: "succes",
            profile: {
                isMyProfile: true,
                level: getData.levelRef,
                received: getData.received,
                percent: setting.bdRefSestem[getData.levelRef - 1].percent,
                howInvitedNextLevel:
                    setting.bdRefSestem[indexRef + 1]?.countUsers -
                    getData.myRefferals.length,
                refCode: getData.myRefferCode,
                invited: getData.myRefferals.length,
                balance: getData.balance,
                nickSteam: getData.nickSteam,
                photo: getData.photo,
                gamesPlayed: countGames,
                topRatio: topRatio,
                winRate:
                    countGames > 0 ? ((winGamesCount / countGames) * 100).toFixed(2) : 0,
                tradeUrl:
                    getData.tradeUrlSteam.partner && getData.tradeUrlSteam.token
                        ? `https://steamcommunity.com/tradeoffer/new/?partner=${getData.tradeUrlSteam.partner}&token=${getData.tradeUrlSteam.token}`
                        : "",
                allDeposit: (
                    await bd.collection("Deposit").find({ steamid: steamid }).toArray()
                ).map(({ status, type, amount, dataDeposit }) => ({
                    status,
                    type,
                    amount,
                    dataDeposit,
                })),
                allWithdraw: witdrawLoad ? allWith : [],
                CrashBets: CrashBets.map((data) => {
                    let userbet = data.allbets.find((v) => v.steamId == steamid)
                    return {
                        allPlayers: data.allbets.length,
                        items: userbet.items,
                        kofX: data.crashKofx,
                        totalBetsValue: userbet.totalBetsSumma,
                        kofxVictory: userbet.betsValueWin ? userbet.kofX : false,
                        betsValueWin: userbet.betsValueWin,
                        gameId: data.id,
                        time: `${
                            new Date(data.dateGame).getHours() < 10
                                ? `0${new Date(data.dateGame).getHours()}`
                                : new Date(data.dateGame).getHours()
                        }:${
                            new Date(data.dateGame).getMinutes() < 10
                                ? `0${new Date(data.dateGame).getMinutes()}`
                                : new Date(data.dateGame).getMinutes()
                        }`,
                        skinsVictory: userbet.skinsVictory,
                    }
                }),
            },
        }
        console.timeEnd("return")
        return tmp
    }
}
export const LOAD_INVENTORY = async (steamid) => {
    let getData = await bd.collection("users").findOne({ steamid: steamid })
    return (
        await bd
            .collection("bdSkins")
            .find({ _id: { $in: getData.inventory.map((e) => ObjectId(e.itemId)) } })
            .toArray()
    )
        .map((e) => ({
            idItem: String(e._id),
            price: e.priceUsd_Our,
            imgSrc: e.img,
            weaponName: e.hash_name,
            rarity: e.rarity,
        }))
        .reduce(
            (all, cur) =>
                all.addCount(
                    getData.inventory.find((e) => e.itemId == cur.idItem).count,
                    cur
                ),
            []
        )
}
export const LOAD_USER_INFO = async (steamid) => {
    let getData = await bd.collection("users").findOne({ steamid: steamid })
    return {
        balance: getData.balance,
        photo: getData.photo,
        bonusDeposit: getData.bonusDeposit,
        steamid: getData.steamid,
        openOrClose: getData.supportStatus,
        code: "succes",
    }
}
export const PAYMENT = async (data) => {}
export const UPDATE_REFCODE = async (code, steamid) => {
    try {
        if (await bd.collection("users").findOne({ myRefferCode: code }))
            return { message: "Ошибка, такой код уже существует", messageNum: 2 }

        await bd
            .collection("users")
            .updateOne({ steamid: steamid }, { $set: { myRefferCode: code } })
        return {
            message: "Код обновлен",
            messageNum: 1,
        }
    } catch (error) {
        return {
            message: "Ошибка сервера (5)",
            messageNum: 2,
        }
    }
}
export const UPDATE_TRADEURL = async (url, steamid) => {
    try {
        let partner = url.paramsGet("partner").trim()
        let token = url.paramsGet("token").trim()

        if (!partner || !token)
            return {
                message: "partner или token пустые",
                messageNum: 2,
            }
        if (new SteamID(steamid).accountid != partner)
            return {
                message: "Введите ссылку от вашего аккаунта",
                messageNum: 2,
            }

        await bd
            .collection("users")
            .updateOne(
                { steamid: steamid },
                { $set: { tradeUrlSteam: { partner: partner, token: token } } }
            )

        return {
            message: "Успешно обновлено",
            messageNum: 1,
            url: url,
        }
    } catch (error) {
        return {
            message: "Ошибка",
            messageNum: 2,
        }
    }
}
export const loginUserSteam = async ({ _json, displayName, ip }, refCode) => {
    let whoInvited = refCode
        ? await bd.collection("users").findOne({ myRefferCode: refCode })
        : ""
    var findUser = await bd.collection("users").findOne({ steamid: _json.steamid })

    let isAdmin = findUser ? findUser.isAdmin : false
    let isModer = findUser ? findUser.isModer : false

    if (!findUser) {
        if (whoInvited) {
            let level = 0
            for (let i = 0; i < setting.bdRefSestem.length; i++) {
                if (
                    [...whoInvited.myRefferals, _json.steamid].length >=
                        setting.bdRefSestem[i].countUsers &&
                    [...whoInvited.myRefferals, _json.steamid].length <
                        setting.bdRefSestem[i + 1]?.countUsers
                )
                    level = i + 1
            }
            await bd.collection("users").updateOne(
                { steamid: whoInvited.steamid },
                {
                    $set: {
                        myRefferals: [...whoInvited.myRefferals, _json.steamid],
                        levelRef: level,
                    },
                }
            )
        }

        await bd.collection("users").insertOne({
            nickSteam: displayName.replaceUrl(),
            nickRealSteam: displayName,
            steamid: _json.steamid,
            photo: _json.avatarmedium,
            timeCreatedSteamAcc: Number(_json.timecreated) * 1000,
            loccountrycodeSteam: _json.loccountrycode,
            locstatecodeSteam: _json.locstatecode,
            dateCreate: new Date().toJSON(),
            isAdmin: true, //убрать
            isModer: false,
            playerHistory: [],
            balance: 9999990.0, //убрать на whoInvited && setting.refBonus.type == "addBalance" ? setting.refBonus.summa : 0.0
            bonusDeposit:
                whoInvited?.steamid && setting.refBonus.type == "bonusDeposit"
                    ? setting.refBonus.bonusDeposit
                    : 0.0, //в процентах
            inventory: [],
            ipLogin: [ip],
            ban: { ban: false, message: "" },
            banWithdraw: false,
            unMuteDate: "",
            tradeUrlSteam: { partner: "", token: "" },
            totalDeposit: 0.0,
            totalWithdraw: 0.0,
            totalBetsValue: 0.0,
            totalBetsValueAfterDeposits: 0.0,
            statusUserChat: "",
            supportStatus: "close",

            myRefferals: [],
            whoInvited: whoInvited?.steamid,
            myRefferCode: _json.steamid,
            levelRef: 1,
            received: 0,

            promoCodeUsed: [],
        })
    } else {
        if (findUser.ban.ban) return { login: false, text: findUser.ban.message }
        if (!~findUser.ipLogin.indexOf(ip) && ip) findUser.ipLogin.push(ip)
        if (whoInvited?.steamid && findUser.whoInvited == "") {
            let level = 0
            for (let i = 0; i < setting.bdRefSestem.length; i++) {
                if (
                    [...whoInvited.myRefferals, _json.steamid].length >=
                        setting.bdRefSestem[i].countUsers &&
                    [...whoInvited.myRefferals, _json.steamid].length <
                        setting.bdRefSestem[i + 1]?.countUsers
                )
                    level = i + 1
            }

            await bd.collection("users").updateOne(
                { steamid: whoInvited.steamid },
                {
                    $set: {
                        myRefferals: [...whoInvited.myRefferals, _json.steamid],
                        levelRef: level,
                    },
                }
            )
        }

        await bd.collection("users").updateOne(
            { steamid: _json.steamid },
            {
                $set: {
                    nickSteam: displayName.replaceUrl(),
                    ipLogin: findUser.ipLogin,
                    photo: _json.avatarmedium,
                    bonusDeposit:
                        whoInvited?.steamid &&
                        setting.refBonus.type == "bonusDeposit" &&
                        findUser.whoInvited == ""
                            ? setting.refBonus.bonusDeposit
                            : 0.0,
                },
            }
        )
    }

    return { login: true, text: "", isAdmin, isModer }
}
const randStr = async (c) => {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < c; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}
const randNum = async (min, max, fixed = 0) =>
    (Math.random() * (max - min) + min).toFixed(fixed)

//расскоментить когда будет сделан вывод и апикей создан
// setInterval(() => {
//     checkStatusItems()
// }, 1000 * 60 * 2);

String.prototype.paramsGet = function (name) {
    if ((name = new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(this)))
        return decodeURIComponent(name[1])
}
String.prototype.replaceUrl = function () {
    var urlRegex = /(https?:\/\/[^\s]+)/g
    return this.replace(urlRegex, function () {
        return randomWords()
    })
}

Number.prototype.stringNice = function () {
    var parts = Number(this).toFixed(2).split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    return parts.join(".")
}

Array.prototype.addCount = function (count, obj) {
    if (!count) return this
    for (let i = 0; i < count; i++) this.push(obj)
    return this
}

Array.prototype.findUnicId = function () {
    return this.reduce((all, cur) => {
        if (!~all.indexOf(cur.steamid_Sender) && cur.steamid_Sender)
            all.push(cur.steamid_Sender)
        if (!~all.indexOf(cur.steamid_Reply) && cur.steamid_Reply)
            all.push(cur.steamid_Reply)
        return all
    }, [])
}
Array.prototype.howLenghtById = function (idItem) {
    return this.filter((item) => item == idItem).length
}
Array.prototype.count = function (name) {
    let counter = 0
    for (let elem of this) {
        if (elem == name) {
            counter++
        }
    }
    return counter
}
// Array.prototype.howLenghtByName = function (name) {
//     return this.filter((item) => item == idItem).length;
// };
