const logger = require("@james-bennett-295/logger");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const events = new EventEmitter();

var data = {};

function getLatest() {
    var promise = new Promise((resolve, reject) => {
        axios.get("https://xkcd.com/info.0.json")
            .then(res => {
                var postDate = new Date(parseInt(res.data.year), parseInt(res.data.month), parseInt(res.data.day));
                var obj = {
                    link: "https://xkcd.com/" + res.data.num + "/",
                    num: parseInt(res.data.num),
                    title: res.data.title,
                    safeTitle: res.data.safe_title,
                    date: postDate,
                    alt: res.data.alt,
                    imgUrl: res.data.img
                };
                resolve(obj);
            })
            .catch(err => {
                reject(err);
            });
    });
    return promise;
};

function getPost(postNum) {
    var promise = new Promise((resolve, reject) => {
        axios.get("https://xkcd.com/" + postNum + "/info.0.json")
            .then(res => {
                var postDate = new Date(parseInt(res.data.year), parseInt(res.data.month), parseInt(res.data.day));
                var obj = {
                    link: "https://xkcd.com/" + res.data.num + "/",
                    num: parseInt(res.data.num),
                    title: res.data.title,
                    safeTitle: res.data.safe_title,
                    date: postDate,
                    alt: res.data.alt,
                    imgUrl: res.data.img
                };
                resolve(obj);
            })
            .catch(err => {
                reject(err);
            });
    });
    return promise;
};

function subscribe(newPostCheckIntervalInSeconds, dataFilePath) {
    if (typeof (newPostCheckIntervalInSeconds) === "undefined") newPostCheckIntervalInSeconds = 3600;
    if (typeof (dataFilePath) === "undefined") dataFilePath = "./xkcdWrapperData.json";
    fs.stat(dataFilePath, (err, stat) => {
        if (err && err.code === "ENOENT") {
            logger.debug("[xkcd-wrapper] Data file does not exist, attempting to create...");
            fs.promises.mkdir(path.dirname(dataFilePath), { recursive: true })
                .then(() => {
                    fs.writeFile(dataFilePath, JSON.stringify(data), (err) => {
                        if (err) return logger.error("[xkcd-wrapper] " + err);
                        logger.debug("[xkcd-wrapper] Data file created");
                    });
                });
        } else {
            if (err) return logger.error("[xkcd-wrapper] " + err);
            logger.debug("[xkcd-wrapper] Data file already exists, attempting to read file...");
            fs.readFile(dataFilePath, (err, fileData) => {
                if (err) return logger.error("[xkcd-wrapper] " + err);
                logger.debug("[xkcd-wrapper] Data file has been read. Data:\t" + fileData);
                data = JSON.parse(fileData.toString());
            });
        };
    });
    setInterval(() => {
        logger.debug("[xkcd-wrapper] Checking for new post...");
        axios.get("https://xkcd.com/info.0.json")
            .then(res => {
                if (data.latestPostNum === res.data.num) return logger.debug("[xkcd-wrapper] New post check done (no new post)");
                data.latestPostNum = res.data.num;
                var postDate = new Date(parseInt(res.data.year), parseInt(res.data.month), parseInt(res.data.day));
                var obj = {
                    link: "https://xkcd.com/" + res.data.num + "/",
                    num: parseInt(res.data.num),
                    title: res.data.title,
                    safeTitle: res.data.safe_title,
                    date: postDate,
                    alt: res.data.alt,
                    imgUrl: res.data.img
                };
                events.emit("newPost", obj);
                logger.debug("[xkcd-wrapper] New post check done (new post)");
                fs.writeFile(dataFilePath, JSON.stringify(data), (err) => {
                    if (err) return logger.error("[xkcd-wrapper] " + err);
                    logger.debug("[xkcd-wrapper] Data file saved");
                });
            })
            .catch(err => {
                logger.error("[xkcd-wrapper] An error occured trying to retrieve https://xkcd.com/info.0.json: " + err);
            });
    }, newPostCheckIntervalInSeconds * 1000);
};

function msg(msg, obj) {
    var dateStr = obj.date.getDate() + "/" + (obj.date.getMonth() + 1) + "/" + obj.date.getFullYear();
    return msg
        .replaceAll("{link}", obj.link)
        .replaceAll("{num}", obj.num)
        .replaceAll("{title}", obj.title)
        .replaceAll("{safeTitle}", obj.safeTitle)
        .replaceAll("{date}", dateStr)
        .replaceAll("{alt}", obj.alt)
        .replaceAll("{imgUrl}", obj.imgUrl);
};

module.exports = { getLatest, getPost, subscribe, msg, events };