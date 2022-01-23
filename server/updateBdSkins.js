import { MongoClient } from "mongodb"
import ax from "axios"
import HttpsProxyAgent from "https-proxy-agent"

var httpsAgent = new HttpsProxyAgent(`http://gp397T82:9NEKn7N8@46.150.252.52:60772`)
var axios = ax.create({ httpsAgent })
//каждый день обновление базы данных, и если появился новый предмет без фотки то будет каждый раз попытка обновить фотку

//Подключение к МОНГО_ДБ (Базе данных)
const url = "mongodb://localhost:27017",
    client = new MongoClient(url)

var bd,
    scanningItemsArr = [],
    scanning = false
;(async () => {
    await client.connect()
    bd = client.db("bd")
})()

var usd = 74
var update = async () => {
    var { data } = await axios.get(`https://www.cbr-xml-daily.ru/latest.js`)
    usd = 1 / Number(data.rates.USD) - usd < 10 ? 1 / Number(data.rates.USD) : usd

    var { data } = await axios.get(`https://market.csgo.com/api/v2/prices/RUB.json`)

    for (let i = 0; i < data.items.length; i++) {
        let e = data.items[i]

        var getitems = await bd.collection("bdSkins").findOneAndUpdate(
            {
                hash_name: e.market_hash_name,
            },
            {
                $set: {
                    priceUsd_Tm: round(Number(e.price) / usd),
                    priceUsd_Our: round((125 * (Number(e.price) / usd)) / 100), //прибавка 25% к стоимости скина на тм}})
                    dateLastUpdate: new Date().toJSON(),
                    stock: true,
                },
            },
            {
                upsert: true,
            }
        )
        if (
            getitems.value &&
            (!getitems.value?.img || !getitems.value?.rarity) &&
            !~scanningItemsArr.indexOf(getitems.value.hash_name)
        )
            scanningItemsArr.push(getitems.value.hash_name)
    }
}

const round = (num) => Math.round(Number(num) * 100) / 100
const updateScan = async () => {
    if (scanning) return

    scanning = true

    for (let i = 0; i < scanningItemsArr.length; i++) {
        try {
            let { data } = await axios.get(
                `https://steamcommunity.com/market/listings/730/${encodeURI(
                    scanningItemsArr[i]
                )}`
            )
            let src = await data.substring(
                data.indexOf(`<link rel="image_src" href="`) +
                    '`<link rel="image_src" href="`'.length -
                    2,
                data.indexOf(`360fx360f">`, data.indexOf(`">`))
            ) //фотка скина
            let rar = await data
                .substring(
                    data.indexOf(`"name_color\":\"`) + `"name_color\":\"`.length - 2,
                    data.indexOf(`",\"market_name\"`)
                )
                .split('"')
                .last()
                .split(" ")[0] //раритеность скина

            if (~rar.indexOf("StatTrak"))
                rar = await data
                    .substring(
                        data.indexOf(`"name_color\":\"`) + `"name_color\":\"`.length - 2,
                        data.indexOf(`",\"market_name\"`)
                    )
                    .split('"')
                    .last()
                    .split(" ")[1] //раритеность скина
            if (~rar.indexOf("<!DOCTYPE")) continue //скорее всгео не была загружена страница

            await bd
                .collection("bdSkins")
                .updateOne(
                    { hash_name: scanningItemsArr[i] },
                    { $set: { img: src, rarity: rar } }
                )
        } catch {}

        scanningItemsArr.splice(i, 1)
    }

    scanning = false
}

update()
setInterval(() => {
    if (new Date().getHours == 2) update() // в два часа ночи обновить
}, 1000 * 60 * 60 + 1) //день
setInterval(() => {
    updateScan()
}, 1000 * 30) //день

Array.prototype.last = function () {
    return this[this.length - 1]
}
