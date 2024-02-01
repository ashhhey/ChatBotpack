module.exports.config = {
	name: "tikdl",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝙰𝚒𝚗𝚣",
	description: "Tiktok downloader",
	usePrefix: false,
	commandCategory: "random",
	usages: "[tiktoklink]",
	cooldowns: 1,
};

module.exports.run = async ({ api, event, args, Users }) => {
	const axios = require("axios");
	const request = require("request");
	const fs = require("fs");
	let link = args[0];
	if (!args[0])
		return api.sendMessage(
			"[!] Need a tiktok link to proceed.\nUse " +
				global.config.PREFIX +
				this.config.name +
				" [tiktok link]",
			event.threadID,
			event.messageID
		);

	// Fetch user data to get the user's name
	const senderInfo = await Users.getData(event.senderID);
	const senderName = senderInfo.name;

	// Send initial message
	api.sendMessage(
		`🕟 | 𝙷𝚎𝚢 @${senderName}, 𝚈𝚘𝚞𝚛 𝚟𝚒𝚍𝚎𝚘 𝚒𝚜 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝. . .`,
		event.threadID,
		event.messageID
	);

	axios.get(`http://eu4.diresnode.com:3325/ainz/tikdl?url=${link}`)
		.then((res) => {
			let callback = function () {
				api.sendMessage(
					`🟠 | 𝚅𝚒𝚍𝚎𝚘 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍!, 𝚃𝚑𝚎 𝚟𝚒𝚍𝚎𝚘 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚜𝚎𝚗𝚝 𝚒𝚗 𝚊 𝚏𝚎𝚠 𝚖𝚒𝚗𝚞𝚝𝚎𝚜, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚏𝚘𝚛 𝚊 𝚖𝚘𝚖𝚎𝚗𝚝 ${senderName}!`,
					event.threadID
				);

				const a = res.data;
				const b = a.user.nickname;
				const c = a.user.unique_id;
				const d = a.duration;
				const e = a.all.region;
				const f = a.all.title;
				const g = a.all.play_count;
				const h = a.all.digg_count;
				const i = a.all.comment_count;
				const j = a.all.share_count;

				api.sendMessage(
					{
						body: `🟢 | 𝙷𝚎𝚛𝚎\'𝚜 𝚢𝚘𝚞𝚛 𝚝𝚒𝚔𝚝𝚘𝚔 𝚟𝚒𝚍𝚎𝚘!\n\n𝚃𝚑𝚒𝚜 𝚒𝚜 𝚝𝚑𝚎 𝚕𝚒𝚝𝚝𝚕𝚎 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗 𝚊𝚋𝚘𝚞𝚝 𝚝𝚑𝚎 𝚟𝚒𝚍𝚎𝚘:\n𝙽𝚒𝚌𝚔𝚗𝚊𝚖𝚎: ${b}\n𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${c}\n𝚅𝚒𝚎𝚠𝚜(𝙲𝚘𝚞𝚗𝚝𝚜): ${g}\n𝙻𝚒𝚔𝚎𝚜(𝙲𝚘𝚞𝚗𝚝𝚜): ${h}\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝(𝙲𝚘𝚞𝚗𝚝𝚜): ${i}\n𝚂𝚑𝚊𝚛𝚎(𝙲𝚘𝚞𝚗𝚝𝚜): ${j}\n𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗(𝙲𝚘𝚞𝚗𝚝𝚜): ${d}𝚜𝚎𝚌𝚘𝚗𝚍𝚜\n𝚁𝚎𝚐𝚒𝚘𝚗: ${e}\n𝚃𝚒𝚝𝚕𝚎: ${f}`,
						attachment: fs.createReadStream(__dirname + `/cache/tikdl.mp4`),
					},
					event.threadID,
					() => fs.unlinkSync(__dirname + `/cache/tikdl.mp4`)
				);
			};
			request(res.data.url)
				.pipe(fs.createWriteStream(__dirname + `/cache/tikdl.mp4`))
				.on("close", callback);
		});
};