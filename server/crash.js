import redis from 'async-redis'
import { createHash } from 'crypto'
import { MongoClient, ObjectId } from 'mongodb'
import redisSocket from 'socket.io-redis'
import expess from 'express'
import http from 'http'
import * as fn from './functional.js'
import { Server } from 'socket.io'

var app = expess(),
    server = http.Server(app),
    io = new Server(server);

io.adapter(redisSocket({ host: 'localhost', port: 6379 }));
const subscriber = redis.createClient(),
    clientBot = redis.createClient(6379, 'localhost')
subscriber.on("error", function (error) {
    console.error(error);
});

//Подключение к МОНГО_ДБ (Базе данных)
const url = 'mongodb://localhost:27017',
    client = new MongoClient(url)
var bd,
    Crash = {},
    items,
    botsIds = [],
    twistKof = 0;

(async () => {
    await client.connect()
    bd = client.db('bd')


    setInterval(async () => {
        items = (await bd.collection("bdSkins").find({ priceUsd_Our: { $lte: 3, $gte: 0.1 } }).toArray()).map(v => String(v._id)).shuffle()
        
    }, 1000 * 60 * 60 * 24);
    items = (await bd.collection("bdSkins").find({ priceUsd_Our: { $lte: 3, $gte: 0.1 } }).toArray()).map(v => String(v._id)).shuffle()


   

    //Начнем игры
    start_newGame_Timer()
})()




const updateUserplayerHistory = async (comment, user) => {
    return [new Date().toJSON() + " " + comment, ...user.playerHistory.slice(0, 300)]
}
const placeBots = async () => {
    let { botsId, placeBetsWithBot } = await bd.collection("Setting").findOne({ _id: ObjectId("6124ea852bccf863f475b100") })

    botsIds = botsId

    if (!placeBetsWithBot) return

    for (let i = 0; i < await randNum(0, botsId.length); i++) {//рандмоное кол-во ботов
        let time = await randNum(300, Crash.timer * 1000)
        setTimeout(async (steamid) => {
            clientBot.publish("CRASH_bet_add_take", JSON.stringify({
                steamid,
                itemsId: items.arrayRandElement(await randNum(1, 5)),
                kofx: await randNum(1.01, 3, 2)
            }));
        }, time, botsId[await randNum(0, botsId.length - 1)]);
    }

}



const computeSHA256 = async (lines) => {
    const hash = createHash('sha256');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim(); // remove leading/trailing whitespace
        if (line === '') continue; // skip empty lines
        hash.write(line); // write a single line to the buffer
    }

    return hash.digest('hex'); // returns hash as string
}
const randNum = async (min, max, fixed = 0) => Number((Math.random() * (max - min) + min).toFixed(fixed))
const randStr = async (c) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < c; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
const generateCrashKofx = async () => {
    if(twistKof) {
        let tmp = twistKof
        twistKof = 0
        return Number(tmp)
    }

    let data = (await bd.collection("Crash").find({}, { sort: { id: -1 }, limit: 15 }).toArray())
    let profitLastGames = data.reduce((all, cur) => all + (cur.VictoryValue - cur.LossValue), 0)
    let $100 = data.map(v => v.crashKofx).count("1.00")//кол-во краш на 1.00
    let rand = await randNum(1, 100)

    if (profitLastGames <= 0) {
        //профит положительный
        switch ($100) {
            case 0:
                if (rand < 60) return 1.00//60% 
                else return await randNum(1.01, 1.7, 2)//40%
            case 1:
                if (rand < 6) return await randNum(1.01, 1.12, 2)//6% 
                else if (rand >= 6 && rand < 65) return await randNum(1.12, 1.9, 2)//59%
                else if (rand >= 65 && rand < 93) return await randNum(1.9, 3, 2)//26%
                else if (rand >= 93 && rand < 100) return await randNum(3, 30, 2)//7%
                else return await randNum(30, 100, 2)//1%
            default:
                if (rand < 66) return await randNum(1.01, 1.7, 2)//66% 
                else if (rand >= 66 && rand < 96) return await randNum(1.7, 3, 2)//30%
                else if (rand >= 96 && rand < 99) return await randNum(3, 30, 2)//4%
                else return await randNum(30, 100, 2)//1%
        }
    } else {
        //Профит отрицательный (АНТИМИНУС)
        switch ($100) {
            case 0:
                if (rand < 80) return 1.00//80% 
                else return await randNum(1.01, 1.7, 2)//20%
            case 1:
                if (rand < 10) return await randNum(1.01, 1.15, 2)//10% 
                else if (rand >= 10 && rand < 70) return await randNum(1.15, 1.9, 2)//70%
                else if (rand >= 70 && rand < 90) return await randNum(1.9, 3, 2)//20%
                else if (rand >= 90 && rand < 93) return await await randNum(3, 30, 2)//3%
                else return 1.00//7% 
            default:
                if (rand < 50) return await randNum(1.15, 1.7, 2)//70% 
                else if (rand >= 50 && rand < 70) return await randNum(1.01, 1.15, 2)//27%
                else if (rand >= 70 && rand < 97) return await randNum(1.7, 3, 2)//27%
                else return await randNum(3, 30, 2)//3%
        }
    }
}
const generate_hash_crashKofx_salt = async () => {
    //Алгоритм генерации крашед коэф
    let kofX = await generateCrashKofx()
    let salt = await randStr(32)
    return {
        hash: await computeSHA256(`${kofX.toFixed(2)}+${salt}`),
        crashKofx: kofX,
        salt: salt
    }
}
const round = (num) => Math.round(Number(num) * 100) / 100
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const checkingVictory = async (kofX) => {
    let update = false
    for (let i = 0; i < Crash.allBets.length; i++) {
        if (Crash.allBets[i].kofX <= kofX && Crash.allBets[i].skinsVictory.isEmpty()) {
            await victoryUser_andTakeBets(Crash.allBets[i].steamId, Crash.allBets[i].kofX)
            update = true
        }
    }
    if (update) io.to('Crash').emit('UPDATE_bets', Crash.allBets);
}
const sendAnimationItems = async (kofX) => {
    Crash.allBets.forEach(async user => {
        if (user.skinsVictory.isEmpty()) {
            let item = await bd.collection("bdSkins").findOne({
                priceUsd_Our: { $lte: user.totalBetsSumma * Number(kofX) },
                stock: { $ne: false },
                img: { $ne: undefined },
                img: { $ne: null },
                rarity: { $ne: null },
                rarity: { $ne: '' },
            }, { sort: { priceUsd_Our: -1 } })

            io.to(user.steamId).emit('SEND_ANIMATION_WINSKINS', {
                weaponName: item.hash_name.deleteBrackets(),
                price: item.priceUsd_Our,
                rarity: item.rarity,
                imgSrc: item.img,
                exterior: item.hash_name.splitBrackets()
            });
        }
    })
}
const startGame = async () => {
    Crash.readyGame = true

    let i = 0;
    while (Crash.kofX < Crash.crashKofx) {
        //Прибавляем х
        Crash.kofX = round(Crash.kofX + 0.01 * Math.floor(Crash.kofX))

        if (Crash.kofX >= Crash.crashKofx) Crash.kofX = Crash.crashKofx

        io.to('Crash').emit('UPDATE_kofX', { kofX: Crash.kofX.toFixed(2) });

        checkingVictory(Crash.kofX)
        if (i % 5 == 0) sendAnimationItems(Crash.kofX)

        await sleep(115)
        i++;
    }

    //Игра крашнулась
    io.to('Crash').emit('CRASH_GAME', { kofX: Crash.kofX.toFixed(2) });
    //Подождем пока всем игрокам выдасться выигрышь
    await sleep(2000)

    //Подсчитаем allBetsValue skinsPlaced VictoryValue
    let allBetsValue = 0, VictoryValue = 0, skinsPlaced = 0, LossValue = 0;
    Crash.allBets.forEach(user => {
        allBetsValue += user.totalBetsSumma
        skinsPlaced += user.items.length
        if (!user.skinsVictory.isEmpty()) VictoryValue += user.betsValueWin
        else LossValue += user.totalBetsSumma
    });
    await bd.collection("Crash").insertOne({
        id: Crash.id,
        allbets: Crash.allBets,
        crashKofx: Crash.crashKofx,
        salt: Crash.salt,
        hash: Crash.hash,
        twistingGame: Crash.twistingGame,
        allBetsValue: allBetsValue,
        playerValue: Crash.allBets.length,
        VictoryValue: VictoryValue,
        LossValue: LossValue,
        skinsPlaced: skinsPlaced,
        dateGame: new Date().toJSON(),
    })

    await sleep(1000)
    start_newGame_Timer()
}
const start_newGame_Timer = async () => {
    await newGame()
    placeBots()//Ставить ставки ботами

    while (true) {
        await sleep(100)
        io.to('Crash').emit('UPDATE_time', { timer: Crash.timer.toFixed(2) });

        if (Crash.timer < 0.1) {
            startGame()
            break;
        }
        Crash.timer = round(Crash.timer - 0.1)
    }
}
const newGame = async () => {
    Crash = {
        id: await bd.collection("Crash").find({}).count() + 1,
        timer: 10,
        allBets: [],
        kofX: 1,

        twistingGame: Boolean(twistKof),
        ...await generate_hash_crashKofx_salt(),

        readyGame: false,
        crashGame: false,
    }
    io.to('Crash').emit('NEW_GAME', {
        hash: Crash.hash,
        XsHistory: (await bd.collection("Crash").find({}, { sort: { id: -1 }, limit: 6 }).toArray()).map(v => v.crashKofx.toFixed(2)),
    });
}


const placebets = async ({ steamid, itemsId, kofx }) => {
    let index = Crash.allBets.findIndex(v => v.steamId == steamid)
    if (~index) {
        //Добавим в инвентарь все поставленные айтемы
        if (!~botsIds.indexOf(steamid)) {//для бота не проверяем инвентарь
            let { inventory } = await bd.collection("users").findOne({ steamid: steamid })
            Crash.allBets[index].items.forEach(e => {
                try {
                    ++inventory.find(v => v.itemId == e.idItem).count
                } catch {
                    //если есть ошибка значит такого предмета нет добавим
                    inventory.unshift({ itemId: e.idItem, count: 1 })
                }
            });

            await bd.collection("users").updateOne({ steamid: steamid }, { $set: { inventory: inventory, } })
        }

        Crash.allBets.splice(index, 1);

        io.to(steamid).emit('ADD_TAKE_BET', { message: "Ставка забрана", messageNum: 1, inventory: await fn.LOAD_INVENTORY(steamid) });

    } else {
        if (itemsId.length == 0) {
            io.to(steamid).emit('ADD_TAKE_BET', { message: "Ошибка, вы не выбрали ни один предмет", messageNum: 2 });
            return true
        }
        if (kofx <= 1) {
            io.to(steamid).emit('ADD_TAKE_BET', { message: "Ошибка, коэффицент должен быть больше 1.00", messageNum: 2 });
            return true
        }

        
        let { photo, inventory, playerHistory, totalBetsValueAfterDeposits, totalBetsValue } = await bd.collection("users").findOne({ steamid: steamid })

        //Обновление инвентаря пользователя

        if (!~botsIds.indexOf(steamid)) {//для бота не проверяем инвентарь
            let tmp = inventory.reduce((all, cur) => {
                
                if (all.count(cur.itemId) > 0) {
                    cur.count -= all.count(cur.itemId)
                    all = all.filter(v => v != cur.itemId)
                }
                return all
            }, itemsId)
            inventory = inventory.filter(v => v.count > 0)

            if (tmp.length != 0) {
                io.to(steamid).emit('ADD_TAKE_BET', { message: "Ошибка, у вас нет одного или более скинов в инвентаре!", messageNum: 2 });
                return true
            }
            
            inventory = inventory.filter(v => v.count > 0)


            // let user = await bd.collection("users").findOne({ steamid: info_Skins.steamId })
            // await bd.collection("users").updateOne({ steamid: info_Skins.steamId }, {
            //     $set: {
            //         playerHistory: await updateUserplayerHistory(`Вывод предмета (# ${info_Skins[i].idItem}) -${info_Skins[i].priceItemNow}`, user),
            //         totalWithdraw: info_Skins[i].priceItemNow
            //     }
            // })

        }


        //Подгрузим цены и фотки скинов и посчитаем общаю сумму
        let totalBetsSumma = 0
        let placeBetsSkins = (await bd.collection("bdSkins").find({ '_id': { $in: itemsId.map(e => ObjectId(e)) } }).toArray()).map(v => ({
            idItem: String(v._id),
            weaponName: v.hash_name,
            rarity: v.rarity,
            price: v.priceUsd_Our,
            imgSrc: v.img
        }))
       
        placeBetsSkins = placeBetsSkins.reduce((all, cur) => {
            let count = itemsId.count(cur.idItem)
            totalBetsSumma += cur.price * count
            return all.addCount(count, cur)
        }, [])

        if (!~botsIds.indexOf(steamid)) await bd.collection("users").updateOne({ steamid: steamid }, {
            $set: {
                playerHistory: await updateUserplayerHistory(`Ставка Crash (#${Crash.id}), предметы для ставки - ${placeBetsSkins.map(v => v.idItem).join(" ")}, -${totalBetsSumma}`, { playerHistory }),
                inventory: inventory,
                totalBetsValue: totalBetsSumma + totalBetsValue,
                totalBetsValueAfterDeposits: totalBetsValueAfterDeposits + totalBetsSumma
            }
        })

        Crash.allBets.push({
            avatar: photo,
            items: placeBetsSkins,
            skinsVictory: {},
            totalBetsSumma: round(totalBetsSumma),
            kofX: round(kofx),
            steamId: steamid,
            betsValueWin: 0
        })

        Crash.allBets.sort((a, b) => a.totalBetsSumma > b.totalBetsSumma ? -1 : 1);

        io.to(steamid).emit('LOAD_INVENTORY', { inventory: await fn.LOAD_INVENTORY(steamid) });
    }
}
const victoryUser_andTakeBets = async (steamid, kofX) => {
    //Проверим что пользователь еще не выиграл никакой скин
    let index = Crash.allBets.findIndex(v => v.steamId == steamid)
    if (!~index) {
        io.to(steamid).emit('ADD_TAKE_BET', { message: "Игра уже началась", messageNum: 2 });
        return true
    }
    if (!Crash.allBets[index].skinsVictory.isEmpty()) return true

    //Обновим что пользвоатль выиграл скин
    let winSumma = round(Crash.allBets[index].totalBetsSumma * kofX)
    
    let skinsVictory = await bd.collection("bdSkins").findOne({ priceUsd_Our: { $lte: winSumma } }, { sort: { priceUsd_Our: -1 } })
    Crash.allBets[index].skinsVictory = {
        idItem: String(skinsVictory._id),
        weaponName: skinsVictory.hash_name,
        price: skinsVictory.priceUsd_Our,
        imgSrc: skinsVictory.img,
        rarity: skinsVictory.rarity,
    }
    Crash.allBets[index].kofX = round(kofX)
    Crash.allBets[index].betsValueWin = winSumma
    
    //Обновим инвентарь с выигрышным скином и добавим к балансу если не хватидл

    if (!~botsIds.indexOf(steamid)) {//для ботов не обновим инвент
        let { inventory, balance, playerHistory } = await bd.collection("users").findOne({ steamid: steamid })
        try {
            ++inventory.find(v => v.itemId == String(skinsVictory._id)).count
        } catch {
            //если есть ошибка значит такого предмета нет добавим
            inventory.unshift({ itemId: String(skinsVictory._id), count: 1 })
        }

        if (winSumma - skinsVictory.priceUsd_Our <= 0)
            await bd.collection("users").updateOne({ steamid: steamid }, { $set: { inventory: inventory, } })
        else
            await bd.collection("users").updateOne({ steamid: steamid }, {
                $set: {
                    inventory: inventory,
                    balance: round(winSumma - skinsVictory.priceUsd_Our + balance),
                    playerHistory: await updateUserplayerHistory(`Выигрышь в ставке Crash (#${Crash.id}), +${round(winSumma - skinsVictory.priceUsd_Our)}, баланс стал ${round(winSumma - skinsVictory.priceUsd_Our + balance)}`, { playerHistory }),
                }
            })

    }
    io.to(steamid).emit('SEND_ANIMATION_WINSKINS', {
        weaponName: skinsVictory.hash_name.deleteBrackets(),
        price: skinsVictory.priceUsd_Our,
        rarity: skinsVictory.rarity,
        imgSrc: skinsVictory.img,
        exterior: skinsVictory.hash_name.splitBrackets()
    });
    io.to(steamid).emit('LOAD_INVENTORY', { inventory: await fn.LOAD_INVENTORY(steamid) });
}



subscriber.on("pmessage", async (pattern, channel, data) => {
    data = JSON.parse(data)
    try {
        switch (channel) {
            case "CRASH_bet_add_take":
                if (Crash.crashGame) {
                    io.to(steamid).emit('ADD_TAKE_BET', { message: "Ошибка, игра еще не началась!", messageNum: 2 });
                    break;
                }

                if (Crash.readyGame) {
                    if (await victoryUser_andTakeBets(data.steamid, Crash.kofX)) break
                } else {
                    if (await placebets(data)) break
                }

                io.to('Crash').emit('UPDATE_bets', Crash.allBets);
                break;
            case "CRASH_loadgame":
                io.to(data.steamid).emit('LOAD_GAME', {
                    XsHistory: (await bd.collection("Crash").find({}, { sort: { id: -1 }, limit: 6 }).toArray()).map(v => v.crashKofx.toFixed(2)),
                    hash: Crash.hash,
                    allBets: Crash.allBets
                });
                break;
            case "CRASH_twistNextGame":
                
                twistKof = data.kof
                break;
            default:
                break;
        }
    } catch (error) {
        
        io.to(data.steamid).emit('ADD_TAKE_BET', { message: "Внутренняя ошибка", messageNum: 2 });
    }
});






subscriber.psubscribe("CRASH_*");

Array.prototype.count = function (name) {
    let counter = 0
    for (let elem of this) {
        if (elem == name) {
            counter++;
        }
    }
    return counter
}
Array.prototype.addCount = function (count, obj) {
    let array = this;
    for (let i = 0; i < count; i++) array.push(obj)
    return array
}

Object.prototype.isEmpty = function () {
    return Object.keys(this).length == 0
}
String.prototype.splitBrackets = function () {
    var regExp = /\(([^)]+)\)/;
    var res = regExp.exec(this);
    return res ? res[1] : "";
};
String.prototype.deleteBrackets = function () {
    var regExp = /\(([^)]+)\)/;
    var res = regExp.exec(this);
    res = res ? res[1] : "";
    return this.replace(`(${res})`, "").trim();
};
Array.prototype.shuffle = function () {
    return this.sort(() => Math.random() - 0.5);
};
Array.prototype.arrayRandElement = function (len = 1) {
    let all = []
    for (let i = 0; i < len; i++) {
        all.push(this[Math.floor(Math.random() * this.length)])
    }
    return all
}