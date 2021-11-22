/* Common modules */
const fs             = require("fs");
const ip             = require("ip");
const dateFormat     = require("date-format");
const chalk          = require("chalk");
const emptyHandler   = () => { /* do nothing */ };
/* === */

/* Load configuration & DB setup*/
const config         = require("./backend.config");
const sslConfig      = {
    cert: fs.readFileSync(config.sslCertPath).toString(),
    key:  fs.readFileSync(config.sslKeyPath).toString()
}

const mysql          = require("mysql2");
const db             = mysql.createPool({
    host:               config.mysqlHost,
    user:               config.mysqlUserId,
    password:           config.mysqlUserPassword,
    database:           config.mysqlEcwsDatabase,
    waitForConnections: true,
    queueLimit:         0,
    connectionLimit:    256
}).promise();
/* === */

/* Modules - Car emergency flag query server */
const emergQryServer   = config.useSsl ? require("https").createServer(sslConfig, emptyHandler) : require("http").createServer(emptyHandler);
const emergQrySocketIO = require("socket.io")(emergQryServer);

emergQryServer.listen(config.emergFlagQueryServerPort);
/* === */

/* Modules - WebRTC signaling server */
const rtcSigServer   = config.useSsl ? require("https").createServer(sslConfig, emptyHandler) : require("http").createServer(emptyHandler);
const rtcSigSocketIO = require("socket.io")(rtcSigServer);

rtcSigServer.listen(config.rtcSignalingServerPort);
/* === */

/* Simple functions */
const isUsable       = (obj)  => (typeof(obj) !== "undefined" && obj != null);
const logInfo        = (subject, message) => console.log(chalk.magenta.bold(`[${subject.toUpperCase()}] `) + chalk.greenBright(`[I ${dateFormat.asString("yyyy/MM/dd hh:mm:ss.SSS")}]`) + ` ${message}`);
const logDebug       = (subject, message) => { if(config.enableDebugLog) console.debug(chalk.magenta.bold(`[${subject.toUpperCase()}] `) + chalk.cyanBright(`[D ${dateFormat.asString("yyyy/MM/dd hh:mm:ss.SSS")}]`) + ` ${message}`); }
const logWarn        = (subject, message) => console.warn(chalk.magenta.bold(`[${subject.toUpperCase()}] `) + chalk.redBright(`[W ${dateFormat.asString("yyyy/MM/dd hh:mm:ss.SSS")}]`) + ` ${message}`);
const logError       = (subject, message) => console.error(chalk.magenta.bold(`[${subject.toUpperCase()}] `) + chalk.red(`[E ${dateFormat.asString("yyyy/MM/dd hh:mm:ss.SSS")}]`) + ` ${message}`);
const chalkAttract   = (text) => chalk.bgWhite.gray(isUsable(text) ? text.toString() : text);

logInfo ("Startup", "← Information log");
logDebug("Startup", "← Debug log");
logWarn ("Startup", "← Warning log");
logError("Startup", "← Error log\n");
/* === */

logInfo("Startup", "Hangisool ECWS - Node.js backend is running!");
logInfo("Startup", "  → WebRTC signaling server is listening on " + chalkAttract(`${ip.address()}:${config.rtcSignalingServerPort}`) + " using Socket.IO " + (config.useSsl ? "with" : "without") + " SSL");
logInfo("Startup", "  → Car emergency query server is listening on " + chalkAttract(`${ip.address()}:${config.emergFlagQueryServerPort}`) + " using Socket.IO " + (config.useSsl ? "with" : "without") + " SSL\n");

// #region WORKAROUND for ECONNRESET
process.on("uncaughtException", (error) => {
    logError("System", `Uncaught exception found.\n${error.message}`);
});
// #endregion

// #region Car emergency flag query part
const emergQryLogSubject = "CarEmerg Query";
let   lastFlagData       = {};
let   socketClientCount  = 0;

emergQrySocketIO.sockets.on("connection", (socket) => {
    // #region Initial setup & check when new connection is incoming
    const fieldName = socket.handshake.query["field_name"];

    socketClientCount++;
    logDebug(emergQryLogSubject, `Connection incoming, now there is ${socketClientCount} client(s) connected to this flag query server`);

    if(!(isUsable(fieldName) && fieldName !== "")) {
        logWarn(emergQryLogSubject, "Client " + chalkAttract(socket.id) + " doesn't meet basic information requirements, disconnect it");
        socket.disconnect();
    } else {
        logInfo(emergQryLogSubject, "Socket.IO connection established for " + chalkAttract(socket.id) + `, field specified: ${chalkAttract(fieldName)}`);    
        logDebug(emergQryLogSubject, "Client " + chalkAttract(socket.id) + " has required basic information. Let it join a room for the field");

        socket.join(`${fieldName}`, () => {
            logDebug(emergQryLogSubject, " └ Joined");
        });
    }
    // #endregion

    socket.on("getFlagAll", async () => {
        logDebug(emergQryLogSubject, "Client " + chalkAttract(socket.id) + " requested flag informations of all of cars in the field " + `${chalkAttract(fieldName)}`);

        socket.emit("result", {
            type: "carFlagAll",
            data: await getEmergencyFlagAll(fieldName)
        });
    });

    socket.on("getFlag", async (carHash) => {
        if(!isUsable(carHash) || typeof(carHash) !== "string" || carHash.trim().replace(" ", "") == "") {
            logWarn(emergQryLogSubject, "Client " + chalkAttract(socket.id) + " requested flag informations of single car but didn't provide (or provided invalid) car hash string, ignoring");
            return;
        } else {
            carHash = carHash.trim().replace(/ /g, "");
        }

        logDebug(emergQryLogSubject, "Client " + chalkAttract(socket.id) + " requested flag informations of car " + chalkAttract(carHash) + " in the field " + `${chalkAttract(fieldName)}`);

        socket.emit("result", {
            type: "carFlag",
            data: await getEmergencyFlag(carHash, fieldName)
        });
    });

    socket.on("disconnect", () => {
        socketClientCount--;
        logDebug(emergQryLogSubject, `Disconnected, now there is only ${socketClientCount} client(s) left on this flag query server`);
    });
});

async function getEmergencyFlagAll(fieldName) {
    logDebug(emergQryLogSubject, "getEmergencyFlagAll(): called");

    let rows = undefined;

    try {
        [ rows ] = await db.query("SELECT `hash`, `flag_emergency`, `flag_calling` FROM `cars` WHERE `field_name`=?", [fieldName]);
    } catch(err) {
        logError(emergQryLogSubject, "getEmergencyFlagAll(): cought error while querying DB");
        logError(emergQryLogSubject, err.toString());
    }

    if(isUsable(rows)) {
        logDebug(emergQryLogSubject, "getEmergencyFlagAll(): DB query executed");
        let data = {};
    
        for(let i = 0, l = rows.length; i < l; i++) {
            data[rows[i].hash] = {                   // { hash: { emergency: 0/1, calling: 0/1 }, ... }
                emergency: rows[i].flag_emergency,
                calling:   rows[i].flag_calling
            };
            updateLastFlagDataForOne(rows[i].hash, rows[i].flag_emergency, rows[i].flag_calling);
        }

        if(isUsable(data)) {
            logDebug(emergQryLogSubject, "getEmergencyFlagAll(): built data looks good, returning it");
            notifyFlagDataForField(fieldName, data);
            return data;
        }
    }
}

async function getEmergencyFlag(carHash, fieldName) {
    logDebug(emergQryLogSubject, "getEmergencyFlag(): called");

    let row = undefined;
    
    try {
        [ row ] = await db.query("SELECT `flag_emergency`, `flag_calling` FROM `cars` WHERE `hash`=? AND `field_name`=?", [carHash, fieldName]);
    } catch(err) {
        logError(emergQryLogSubject, "getEmergencyFlag(): cought error while querying DB");
        logError(emergQryLogSubject, err.toString());
    }

    if(isUsable(row)) {
        logDebug(emergQryLogSubject, "getEmergencyFlag(): DB query executed");

        if(row.length !== 1) {
            logWarn(emergQryLogSubject, "getEmergencyFlag(): there is empty or multiple rows in the DB query result, which should have only single row data. returning null");
            return null;
        }

        if(!(isUsable(row[0].flag_emergency) && typeof(row[0].flag_emergency) === "number" &&
             isUsable(row[0].flag_calling)   && typeof(row[0].flag_calling) === "number")) {
            logWarn(emergQryLogSubject, "getEmergencyFlag(): invalid flag data detected. returning null");
            return null;
        }

        logDebug(emergQryLogSubject, "getEmergencyFlag(): returning car flag data");

        let data = new Object();
        data[carHash] = {
            emergency: row[0].flag_emergency,
            calling:   row[0].flag_calling
        };
        updateLastFlagDataForOne(carHash, row[0].flag_emergency, row[0].flag_calling);
        notifyFlagDataForField(fieldName, data);
        return data;
    }
}

async function fetchCarFlagChangesAndNotify() {
    logDebug(emergQryLogSubject, "fetchCarFlagChanges(): called");

    let rows = undefined;
    
    try {
        [ rows ] = await db.query("SELECT `hash`, `field_name`, `flag_emergency`, `flag_calling` FROM `cars`");
    } catch(err) {
        logError(emergQryLogSubject, "fetchCarFlagChanges(): cought error while querying DB");
        logError(emergQryLogSubject, err.toString());
    }

    if(isUsable(rows)) {
        logDebug(emergQryLogSubject, "fetchCarFlagChanges(): DB query executed");

        let changedFlags = {};

        try {
            for(let i = 0, l = rows.length; i < l; i++) {
                if(typeof(changedFlags[rows[i].field_name]) === "undefined") {
                    changedFlags[rows[i].field_name] = {};
                }
    
                if(Object.keys(lastFlagData).indexOf(rows[i].hash) >= 0) {
                    if((lastFlagData[rows[i].hash].emergency != rows[i].flag_emergency) ||
                       (lastFlagData[rows[i].hash].calling != rows[i].flag_calling)) {
                        changedFlags[rows[i].field_name][rows[i].hash] = {};
    
                        if(lastFlagData[rows[i].hash].emergency != rows[i].flag_emergency) {
                            changedFlags[rows[i].field_name][rows[i].hash].emergency = rows[i].flag_emergency;
                        }
        
                        if(lastFlagData[rows[i].hash].calling != rows[i].flag_calling) {
                            changedFlags[rows[i].field_name][rows[i].hash].calling = rows[i].flag_calling;
                        }
                    }
                }
    
                updateLastFlagDataForOne(rows[i].hash, rows[i].flag_emergency, rows[i].flag_calling);
            }
        } catch(err) {
            logError(emergQryLogSubject, "fetchCarFlagChanges(): cought error while processing data");
            logError(emergQryLogSubject, err.toString());
        }

        for(let index in Object.keys(changedFlags)) {
            if(Object.keys(changedFlags[Object.keys(changedFlags)[index]]).length > 0) {
                notifyFlagDataForField(Object.keys(changedFlags)[index], changedFlags[Object.keys(changedFlags)[index]]);
            }
        }
    }
} setInterval(async () => { if(socketClientCount > 0) await fetchCarFlagChangesAndNotify(); }, config.emergFlagQueryInterval);

function updateLastFlagDataForOne(hash, emergencyFlag, callingFlag) {
    if(!isUsable(lastFlagData[hash])) {
        lastFlagData[hash] = {};
    }

    lastFlagData[hash] = {
        emergency: emergencyFlag,
        calling:   callingFlag
    };
}

function notifyFlagDataForField(fieldName, flagData) {
    logDebug(emergQryLogSubject, "notifyFlagDataForField(): emitting `flagData` event with flag data to whole clients in " + chalkAttract(fieldName));
    emergQrySocketIO.sockets.in(fieldName).emit("flagData", flagData);
}
// #endregion

// #region WebRTC signaling
const rtcSigLogSubject = "WebRTC Signl";

rtcSigSocketIO.sockets.on("connection", (socket) => {
    logInfo(rtcSigLogSubject, "Socket.IO connection is established for " + chalkAttract(socket.id));

    socket.on("roomMessage", (roomName, message) => {
        const logRoomMessage = (messageType) => logDebug(rtcSigLogSubject, "Relaying roomMessage: " + messageType + " from " + chalkAttract(socket.id) + " to whole members in " + chalkAttract(roomName));

        if(message.type == "candidate")       logRoomMessage(chalk.bgGreen.white("RTC Message") + " " + chalk.bgGreen.blueBright("CANDIDATE"));
        else if(message.type == "offer")      logRoomMessage(chalk.bgGreen.white("RTC Message") + " " + chalk.bgGreen.blueBright("OFFER") + "    ");
        else if(message.type == "answer")     logRoomMessage(chalk.bgGreen.white("RTC Message") + " " + chalk.bgGreen.blueBright("ANSWER") + "   ");
        else if(typeof(message) === "string") logRoomMessage("(plain string text)  ");
        else if(typeof(message) === "object") logRoomMessage("(object              ");
        else                                  logRoomMessage("(unknown content)    ");

        rtcSigSocketIO.sockets.in(roomName).emit("roomMessageRelayed", socket.id, message);
    });

    socket.on("join", (roomName) => {
        logInfo(rtcSigLogSubject, "Client " + chalkAttract(socket.id) + " is joining room (create if not exist) : " + chalkAttract(roomName));

        let clientsInRoom = rtcSigSocketIO.sockets.adapter.rooms[roomName];
        let clientsNum = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

        logDebug(rtcSigLogSubject, " └ Currently there is(are) " + chalkAttract(clientsNum + " client(s)") + " connected to room " + chalkAttract(roomName));

        if(clientsNum === 0) {
            socket.join(roomName);
            logInfo(rtcSigLogSubject, " └ Created room");
            socket.emit("roomCreated");
        } else if(clientsNum === 1) {
            socket.join(roomName);
            rtcSigSocketIO.sockets.in(roomName).emit("roomSomeoneJoined", socket.id);
            logInfo(rtcSigLogSubject, " └ Joined to this room");
            socket.emit("roomJoined");
            rtcSigSocketIO.sockets.in(roomName).emit("roomReady");
        } else {
            socket.emit("roomFull");
            logWarn(rtcSigLogSubject, " └ Room is full already, rejecting");
        }
    });

    socket.on("leave", (roomName) => {
        logInfo(rtcSigLogSubject, "Client " + chalkAttract(socket.id) + " is leaving room : " + chalkAttract(roomName));
        socket.leave(roomName);
        
        let clientsInRoom = rtcSigSocketIO.sockets.adapter.rooms[roomName];
        let clientsNum = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

        logDebug(rtcSigLogSubject, " └ Left, now there is(are) only " + chalkAttract(clientsNum + " client(s)") + " left.");
        rtcSigSocketIO.sockets.in(roomName).emit("roomSomeoneLeft", socket.id);
        socket.emit("roomLeft");
    });
});
// #endregion