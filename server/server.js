import * as fn from "./functional.js"
import cluster from "cluster"
import { Server } from "socket.io"
import expess from "express"
import http from "http"
import os from "os"
import fs from "fs"
import path from "path"
import cookie from "cookie"
import compression from "compression"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import redisSocket from "socket.io-redis"
import redis from "redis"
import passport from "passport"
import SteamStrategy from "passport-steam"
import session from "express-session"
import RedisStore from "connect-redis"

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (obj, done) {
    done(null, obj)
})

var cpuCount = os.cpus().length,
    client = redis.createClient()
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000000,
})
function isAN(value) {
    value = Number(value)
    if (value instanceof Number) value = value.valueOf() // Если это объект числа, то берём значение, которое и будет числом

    return isFinite(value) && value === parseInt(value, 10)
}

if (cluster.isMaster) {
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork()
    }

    var deleteFile = function () {
        var stats = fs.statSync("/var/log/mongodb/mongodb.log")
        var fileSizeInBytes = stats["size"]
        var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
        if (fileSizeInMegabytes > 10) {
            fs.writeFileSync("/var/log/mongodb/mongodb.log", "")
        }

        stats = fs.statSync("/var/log/mongodb/mongodb.log.1")
        fileSizeInBytes = stats["size"]
        fileSizeInMegabytes = fileSizeInBytes / 1000000.0
        if (fileSizeInMegabytes > 5) {
            fs.writeFileSync("/var/log/mongodb/mongodb.log.1", "")
        }

        fs.readdirSync("/root/.pm2/logs/").forEach((file) => {
            var stats = fs.statSync("/root/.pm2/logs/" + file)
            var fileSizeInBytes = stats["size"]
            var fileSizeInMegabytes = fileSizeInBytes / 1000000.0

            if (fileSizeInMegabytes > 50) {
                fs.writeFileSync("/root/.pm2/logs/" + file, "")
            }
        })
    }
    setInterval(() => {
        deleteFile()
    }, 1000 * 60 * 60)
    deleteFile()
}

if (cluster.isWorker) {
    var worker_id = cluster.worker.id

    var app = expess(),
        server = http.Server(app),
        io = new Server(server)

    let RedisStoree = RedisStore(session)
    var sessionMiddleware = session({
        secret: "serversecrtKek",
        name: "passport-session",
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 86400000 },
        store: new RedisStoree({
            host: "localhost",
            port: 6379,
            client: redis.createClient(),
        }),
    })

    io.adapter(redisSocket({ host: "localhost", port: 6379 }))
    io.use((socket, next) => sessionMiddleware(socket.request, {}, next))
    io.on("connection", async function (socket) {
        var steamid = socket.request?.session?.passport?.user?._json?.steamid
        // var avatar = socket.request?.session?.passport?.user?._json?.avatarmedium
        // var nick = socket.request?.session?.passport?.user?.displayName
        steamid = "76561198843892075" //убрать
        if (steamid) socket.join(steamid)

        //если пришел сокет что юзер забанен то просто удаляем из пасспорта сессию его

        setInterval(() => {
            socket.emit("ONLINE_USER", io.sockets.sockets.size)
        }, 3000)

        socket.on("JOIN_CRASH", async () => {
            socket.join("Crash")
            client.publish(
                "CRASH_loadgame",
                JSON.stringify({ steamid: steamid ? steamid : socket.id })
            )
        })

        if (steamid) {
            socket.emit("LOAD_INVENTORY", { inventory: await fn.LOAD_INVENTORY(steamid) })
            socket.emit("LOAD_USER_INFO", await fn.LOAD_USER_INFO(steamid))
            socket.emit("LOAD_CHAT", await fn.LOAD_CHAT())

            socket.on("GET_ACCESS_METHOD", async (login, password) => {
                let getAuthDate = (await fn.updateSetting())?.authDate
                if (!(getAuthDate.login == login && getAuthDate.password == password)) {
                    socket.emit("MESSAGE", { reloadUrl: "/" })
                    return
                }

                let data = await fn.GET_ACCESS_METHOD(steamid)
                socket.emit("GET_ACCESS_METHOD", data)
                if (data.data["Access_answerSupport"])
                    socket.emit(
                        "UPDATE_COUNT_MESSOPENSUPPORT",
                        await fn.UPDATE_COUNT_MESSOPENSUPPORT(steamid)
                    )
            })
            socket.on(
                "GET_ALLUSERS",
                async (pageNumber = 1, sortBalance = 0, search = "") => {
                    socket.emit(
                        "GET_ALLUSERS",
                        await fn.GET_ALLUSERS(steamid, pageNumber, sortBalance, search)
                    )
                }
            )
            socket.on(
                "GET_ALLWITHDRAW",
                async (pageNumber = 1, onlyOpenWidraw = true) => {
                    socket.emit(
                        "GET_ALLWITHDRAW",
                        await fn.GET_ALLWITHDRAW(steamid, pageNumber, onlyOpenWidraw)
                    )
                }
            )
            socket.on("CHANGE_USERSETTING", async (data) => {
                socket.emit("MESSAGE", await fn.CHANGE_USERSETTING(steamid, data))
                io.to(data.steamIdUser).emit("LOAD_INVENTORY", {
                    inventory: await fn.LOAD_INVENTORY(steamid),
                })
            })
            socket.on("SET_KOFCRASH", async ({ kof }) => {
                if (
                    (await fn.GET_ACCESS_METHOD(steamid)).data.Access_setKofCrash &&
                    isAN(kof) &&
                    kof >= 1
                ) {
                    client.publish("CRASH_twistNextGame", JSON.stringify({ kof }))
                    socket.emit("MESSAGE", { message: "Подкручено", messageNum: 1 })
                } else
                    socket.emit("MESSAGE", { message: "Ошибка подкрутки", messageNum: 2 })
            })

            socket.on("DELETE_MESSAGE", async (id) => {
                let data = await fn.DELETE_MESSAGE(id, steamid)
                io.emit("LOAD_CHAT", { message: data.messages })
                delete data["messages"]
                socket.emit("MESSAGE", data)
            })
            socket.on("MUTE_USER", async (steamidUser, timeMinutes) => {
                socket.emit(
                    "MESSAGE",
                    await fn.MUTE_USER(steamidUser, steamid, timeMinutes)
                )
                io.to(steamidUser).emit("MESSAGE", {
                    message: `Вы замучены на ${timeMinutes} мин.`,
                    messageNum: 1,
                })
            })
            socket.on("BAN_USER", async (steamidUser, comment) => {
                socket.emit("MESSAGE", await fn.BAN_USER(steamidUser, steamid, comment))
            })
            socket.on("PINNED_MESS", async (id) => {
                let data = await fn.PINNED_MESS(id, steamid)
                socket.emit("MESSAGE", {
                    message: data.message,
                    messageNum: data.messageNum,
                })
                io.emit("PINNED_MESS", {
                    id: String(data.data._id),
                    messageText: data.data.messageText,
                    time: `${
                        new Date(data.data.time).getHours() < 10
                            ? `0${new Date(data.data.time).getHours()}`
                            : new Date(data.data.time).getHours()
                    }:${
                        new Date(data.data.time).getMinutes() < 10
                            ? `0${new Date(data.data.time).getMinutes()}`
                            : new Date(data.data.time).getMinutes()
                    }`,
                    avatar: data.data.avatar,
                    name: data.data.name,
                    steamid: data.data.steamid,
                    statusUserChat: data.data.statusUserChat,
                })
            })
            socket.on("UNPINNED_MESS", async () => {
                socket.emit("MESSAGE", await fn.UNPINNED_MESS(steamid))
                io.emit("PINNED_MESS", {})
            })

            socket.on("CHANGE_PAUSE_CHAT", async () => {
                io.emit("CHAT_PAUSEDCHANGES", await fn.CHANGE_PAUSE_CHAT(steamid))
            })

            socket.on("SEND_CHATMES", async (text) => {
                let data = await fn.SEND_CHATMES(text, steamid)
                if (data?.name) io.emit("NEW_MESSAGE", data)
                if (data?.message) socket.emit("MESSAGE", data)
            })

            socket.on("LOAD_PAYMENTINFO", async () => {
                socket.emit("LOAD_PAYMENTINFO", await fn.LOAD_PAYMENTINFO())
            })
            socket.on("ENTER_PROMOCODE", async (code) => {
                let data = await fn.ENTER_PROMOCODE(steamid, code)
                socket.emit("LOAD_USER_INFO", {
                    ...(await fn.LOAD_USER_INFO(steamid)),
                    ...data,
                })
                //socket.emit('ENTER_PROMOCODE', data)
            })
            socket.on("PAYMENT", async (data) => {
                socket.emit("PAYMENT", await fn.PAYMENT(data))
            })
            socket.on("LOAD_INVENTORYSTEAM_USER", async () => {
                socket.emit(
                    "LOAD_INVENTORYSTEAM_USER",
                    await fn.LOAD_INVENTORYSTEAM_USER(steamid)
                )
            })

            socket.on("ADD_TAKE_BET", async (itemsId, kofx) => {
                if (kofx < 1 || !kofx) kofx = 99999999
                client.publish(
                    "CRASH_bet_add_take",
                    JSON.stringify({ steamid, itemsId, kofx })
                )
            })

            socket.on("LOAD_HISTORY_ALLGAMES", async (type) => {
                socket.emit("LOAD_HISTORY_ALLGAMES", await fn.LOAD_HISTORY_ALLGAMES(type))
            })
            socket.on("LOAD_HISTORY_GAME", async (id) => {
                socket.emit("LOAD_HISTORY_GAME", await fn.LOAD_HISTORY_GAME(id))
            })
            socket.on("CLOSE_TICKETUSER", async (idUserClose) => {
                socket.emit("MESSAGE", await fn.CLOSE_TICKETUSER(steamid, idUserClose))
            })

            socket.on("EXCHANGE_ITEM", async (ArrayWithdrawId, exchangeItems) => {
                socket.emit(
                    "EXCHANGE_ITEM",
                    await fn.EXCHANGE_ITEM(ArrayWithdrawId, exchangeItems, steamid)
                )
            })
            socket.on("WITHDRAW_ITEMS_REQUEST", async (data) => {
                socket.emit(
                    "ADD_WITHDRAW",
                    await fn.WITHDRAW_ITEMS_REQUEST(data, steamid)
                )
            })
            socket.on("LOAD_ALLSKINS", async (data) => {
                socket.emit("LOAD_ALLSKINS", await fn.LOAD_ALLSKINS(data))
            })
            socket.on("LOAD_SUPPORT_ALLMESSAGE", async (loadOtherUser) => {
                socket.emit(
                    "LOAD_SUPPORT_ALLMESSAGE",
                    await fn.LOAD_SUPPORT_ALLMESSAGE(steamid, loadOtherUser)
                )
            })
            socket.on("SEND_MESSAGE_SUPPORT", async (data) => {
                socket.emit(
                    "NEW_MESSAGE_SUPPORT",
                    await fn.ADD_MESSAGE_SUPPORT({ ...data, steamid })
                )
            })

            socket.on("UPDATE_TRADEURL", async (url) => {
                socket.emit("UPDATE_TRADEURL", await fn.UPDATE_TRADEURL(url, steamid))
            })
            socket.on("UPDATE_REFCODE", async (code) => {
                socket.emit("UPDATE_REFCODE", await fn.UPDATE_REFCODE(code, steamid))
            })

            socket.on("LOAD_USER_INFO_FULL", async ({ witdrawLoad, steamId }) => {
                socket.emit(
                    "LOAD_USER_INFO_FULL",
                    await fn.LOAD_USER_INFO_FULL(steamid, witdrawLoad, steamId)
                )
            })
        } else {
            socket.emit("LOAD_INVENTORY", { code: "no_auth" })
            socket.emit("LOAD_USER_INFO", { code: "no_auth" })
            socket.emit("LOAD_CHAT", { code: "no_auth" })
        }
    })

    app.use(apiLimiter)
    app.use("/", expess.static("../build"))
    app.use(compression())
    app.use(expess.json())
    app.use(expess.urlencoded({ extended: true }))
    app.use(sessionMiddleware)
    app.use(helmet())
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["*", "data:"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                frameSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["*", "data:"],
                fontSrc: ["*", "data:"],
            },
        })
    )
    app.use(function (req, res, next) {
        res.setHeader("Cache-Control", "must-revalidate, max-age: 86400")
        next()
    })
    passport.use(
        new SteamStrategy(
            {
                returnURL: "http://185.233.80.116/auth/steam",
                realm: "http://185.233.80.116/",
                apiKey: "26AE6895115CDDA22905B66F3A7E37AD",
            },
            function (identifier, profile, done) {
                process.nextTick(function () {
                    profile.identifier = identifier
                    return done(null, profile)
                })
            }
        )
    )

    app.get("*", async (req, res, next) => {
        if (~req.path.indexOf("auth") || ~req.path.indexOf("logout")) next()
        else {
            if (~req.path.indexOf("panel"))
                if (
                    !(await fn.CHECK_IS_ADMIN(req?.user?.id)) &&
                    !(await fn.CHECK_IS_MODER(req?.user?.id))
                )
                    res.redirect("/")

            res.sendFile(path.resolve("../build/index.html"), function (err) {
                if (err) {
                }
            })
        }
    })

    //заход через стим
    app.get(
        "/auth/steam",
        passport.authenticate("steam", { failureRedirect: "/" }),
        async (req, res) => {
            let { login, text, isAdmin, isModer } = await fn.loginUserSteam(
                { ...req.user, ip: req.headers["cf-connecting-ip"] },
                req.headers.cookie ? cookie.parse(req.headers.cookie)?.refCode : ""
            )

            if (!login) res.status(401).send(text)
            else if (isAdmin || isModer) res.redirect("/panel")
            else res.redirect("/")
        }
    )
    app.get("/logout", async (req, res) => {
        req.logout()
        res.redirect("/")
    })

    server.listen(3000 + worker_id)
}
