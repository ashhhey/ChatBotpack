const cron = require('node-cron');
const axios = require("axios");
const request = require('request');
const fs = require("fs");

const activeThreads = {};

module.exports.config = {
	name: "shoticron",
	version: "2.0.0",
	hasPermission: 0,
	credits: "Eugene Aguilar",//converted to mirai by Kyouya Dev
	usePrefix: false,
	description: "Automaticaly send shoti with on and off",
	commandCategory: "shoti cron",
	usages: "[on/off]",
	cooldowns: 5,
};

module.exports.run = async function({api, event, input}) {
const args = event.body.split(" ");
	const threadID = event.threadID;

	if (args[1] === "on") {
	if (!activeThreads[threadID]) {
	activeThreads[threadID] = true;
	api.sendMessage(`Automatic sending of videos is now enable.`, event.threadID, (err, info) =>
	 setTimeout(() => {
		api.unsendMessage(info.messageID) } , 20000),event.messageID);

	cron.schedule('*/1 * * * *', async () => {
		try {
		if (activeThreads[threadID]) { 
		 let response = await axios.post(
		 "https://api--v1-shoti.vercel.app/api/v1/get",
		 {
		 apikey: "$shoti-1hgmntc2565u49kdkjg",
		 },
			);
		var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
		 const userInfo = response.data.data.user;
				const username = userInfo.username;
				const nickname = userInfo.nickname;
	 const tid = event.threadID
		var rqs = request(encodeURI(response.data.data.url));
		rqs.pipe(file);
		file.on('finish', () => {
			api.sendMessage(
					 {
				 body: `Username: @${username}\nNickname: ${nickname}\nTid: ${tid}`,
			attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
			}, threadID, (error, info) => {
			if (!error) {
			fs.unlinkSync(__dirname + '/cache/shoti.mp4');
			}
			});
		});
		}
		} catch (error) {
		console.error('Error:', error);
		}
	});
	} else {
	api.sendMessage("Automatic sending of videos is already ON in this thread.", threadID);
	}
	} else if (args[1] === "off") {
	if (activeThreads[threadID]) {
	activeThreads[threadID] = false;
	api.sendMessage(`Automatic sending of videos is now disable.`, threadID);
	} else {
	api.sendMessage("Automatic sending of videos is already OFF in this thread.", threadID);
	}
	}
};