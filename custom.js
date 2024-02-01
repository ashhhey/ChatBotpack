const logger = require('./utils/log');
const cron = require('node-cron');
const axios = require("axios");
const fs = require('fs-extra');
const path = require("path");
const request = require('request');
const moment = require('moment-timezone');
const simpleYT = require('simple-youtube-api');
const getFBInfo = require("@xaviabot/fb-downloader");
const ytdl = require('ytdl-core');

module.exports = async ({ api, event }) => {
	const minInterval = 5;
	let lastMessageTime = 0;
	let messagedThreads = new Set();

	const config = {
		autoRestart: {
			status: true,
			time: 40,
			note: 'To avoid problems, enable periodic bot restarts',
		},
		acceptPending: {
			status: false,
			time: 30,
			note: 'Approve waiting messages after a certain time',
		},
	};

	function autoRestart(config) {
		if (config.status) {
			cron.schedule(`*/${config.time} * * * *`, () => {
				logger('Start rebooting the system!', 'Auto Restart');
				process.exit(1);
			});
		}
	}

	function acceptPending(config) {
		if (config.status) {
			cron.schedule(`*/${config.time} * * * *`, async () => {
				const list = [
					...(await api.getThreadList(1, null, ['PENDING'])),
					...(await api.getThreadList(1, null, ['OTHER'])),
				];
				if (list[0]) {
					api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
				}
			});
		}
	}

	autoRestart(config.autoRestart);
	acceptPending(config.acceptPending);

	cron.schedule('*/45 * * * *', async () => {
		const currentTime = Date.now();
		if (currentTime - lastMessageTime < minInterval) {
			console.log("Skipping message due to rate limit");
			return;
		}

		lastMessageTime = currentTime;

		try {
			let response = await axios.post('https://your-shoti-api.vercel.app/api/v1/get', { apikey: "$shoti-1hg4gifgnlfdmeslom8" });
			const filePath = path.join(__dirname, "cache", "shoti.mp4");

			const targetTimeZone = 'Asia/Manila';
			const now = moment().tz(targetTimeZone);
			const currentDate = now.format('YYYY-MM-DD');
			const currentDay = now.format('dddd');
			const currentTime = now.format('HH:mm:ss');

			const userInfo = response.data.data.user;
			const videoInfo = response.data.data;
			const title = videoInfo.title;
			const durations = videoInfo.duration;
			const region = videoInfo.region;
			const username = userInfo.username;
			const nickname = userInfo.nickname;
			const avatar = userInfo.avatar;
			const tid = response.data.data.id;
			const rank = userInfo.rank;

			var file = fs.createWriteStream(filePath);
			var rqs = request(encodeURI(response.data.data.url));
			rqs.pipe(file);

			file.on('finish', async () => {
				try {
					const data = await api.getThreadList(25, null, ['INBOX']);
					let i = 0;
					let j = 0;

					while (j < 20 && i < data.length) {
						const thread = data[i];
						if (thread.isGroup && thread.name !== thread.threadID && !messagedThreads.has(thread.threadID)) {
							api.sendMessage({
								body: `𝖠𝖴𝖳𝖮 𝖲𝖤𝖭𝖣 𝖱𝖠𝖭𝖮𝖬 𝖲𝖧𝖮𝖳𝖨 𝖥𝖮𝖬 𝖳𝖨𝖪𝖳𝖮𝖪\n\n🚀 |•𝖳𝖨𝖳𝖫𝖤: ${title}\n🚀 |•𝖴𝖲𝖤𝖱𝖭𝖠𝖬𝖤: @${username}\n🚀 |•𝖭𝖨𝖢𝖪𝖭𝖠𝖬𝖤: ${nickname}\n🚀 |•𝖣𝖴𝖱𝖠𝖳𝖨𝖮𝖭 : ${durations}\n🚀 |•𝖱𝖤𝖦𝖨𝖮𝖭: ${region}\n\n𝗧𝗛𝗥𝗘𝗔𝗗: ${tid}\n𝖣𝖺𝗍𝖾 & 𝗍𝗂𝗆𝖾: ${currentDate} || ${currentTime}\nRank: ${rank}`,
								attachment: fs.createReadStream(filePath)
							}, thread.threadID, (err) => {
								if (err) {
									console.error("Error sending message:", err);
								} else {
									messagedThreads.add(thread.threadID);
									setTimeout(() => {
										messagedThreads.delete(thread.threadID);
									}, 60 * 60 * 1000);
								}
							});
							j++;
						}
						i++;
					}
				} catch (err) {
					console.error("Error [Thread List Cron]:", err);
				}
			});

			file.on('error', (err) => {
				console.error("Error downloading video:", err);
			});
		} catch (error) {
			console.error("Error retrieving Shoti video:", error);
		}
	}, {
		scheduled: true,
		timezone: "Asia/Manila"
	});

	// AUTOGREET EVERY 8 hours
	cron.schedule('*/60 * * * *', () => {
		const currentTime = Date.now();
		if (currentTime - lastMessageTime < minInterval) {
			console.log("Skipping message due to rate limit");
			return;
		}

		const randomQuotes = [
"Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.",
	"Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
	"The world's oldest known recipe is for beer.",
	"Bananas are berries, but strawberries are not.",
	"Cows have best friends and can become stressed when they are separated.",
	"The shortest war in history was between Britain and Zanzibar on August 27, 1896; Zanzibar surrendered after 38 minutes.",
	"The average person walks the equivalent of three times around the world in a lifetime.",
	"Polar bears are left-handed.",
	"The unicorn is Scotland's national animal.",
	"A group of flamingos is called a 'flamboyance'.",
	"There are more possible iterations of a game of chess than there are atoms in the known universe.",
	"The smell of freshly-cut grass is actually a plant distress call.",
	"A day on Venus is longer than its year.",
	"Honeybees can recognize human faces.",
	"Wombat poop is cube-shaped.",
	"The first oranges weren't orange.",
	"The longest time between two twins being born is 87 days.",
	"A bolt of lightning is six times hotter than the sun.",
	"A baby puffin is called a puffling.",
	"A jiffy is an actual unit of time: 1/100th of a second.",
	"The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
	"There's a species of jellyfish that is biologically immortal.",
	"The Eiffel Tower can be 6 inches taller during the summer due to the expansion of the iron.",
	"The Earth is not a perfect sphere; it's slightly flattened at the poles and bulging at the equator.",
	"A hummingbird weighs less than a penny.",
	"Koalas have fingerprints that are nearly identical to humans'.",
	"There's a town in Norway where the sun doesn't rise for several weeks in the winter, and it doesn't set for several weeks in the summer.",
	"A group of owls is called a parliament.",
	"The fingerprints of a koala are so indistinguishable from humans' that they have on occasion been confused at a crime scene.",
	"The Hawaiian alphabet has only 13 letters.",
	"The average person spends six months of their life waiting for red lights to turn green.",
	"A newborn kangaroo is about 1 inch long.",
	"The oldest known living tree is over 5,000 years old.",
	"Coca-Cola would be green if coloring wasn't added to it.",
	"A day on Mars is about 24.6 hours long.",
	"The Great Wall of China is not visible from space without aid.",
	"A group of crows is called a murder.",
	"There's a place in France where you can witness an optical illusion that makes you appear to grow and shrink as you walk down a hill.",
	"The world's largest desert is Antarctica, not the Sahara.",
	"A blue whale's heart is so big that a human could swim through its arteries.",
	"The longest word in the English language without a vowel is 'rhythms'.",
	"Polar bears' fur is not white; it's actually transparent.",
	"The electric chair was invented by a dentist.",
	"An ostrich's eye is bigger than its brain.",
	"Wombat poop is cube-shaped."
];

		const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

		api.getThreadList(25, null, ['INBOX'], async (err, data) => {
			if (err) return console.error("Error [Thread List Cron]: " + err);
			let i = 0;
			let j = 0;

			async function message(thread) {
				try {
					api.sendMessage({
						body: `❯ 𝖿𝗈𝗅𝗅𝗈𝗐 𝗆𝖾 𝗈𝗇 𝖥𝖻: https://www.facebook.com/swordigo.swordslush\n\n❯ 𝖱𝖠𝖭𝖣𝖮𝖬 𝖥𝖠𝖢𝖳:${randomQuote}`
					}, thread.threadID, (err) => {
						if (err) return;
						messagedThreads.add(thread.threadID);

					});
				} catch (error) {
					console.error("Error sending a message:", error);
				}
			}

			while (j < 20 && i < data.length) {
				if (data[i].isGroup && data[i].name != data[i].threadID && !messagedThreads.has(data[i].threadID)) {
					await message(data[i]);
					j++;
					const CuD = data[i].threadID;
					setTimeout(() => {
						messagedThreads.delete(CuD);
					}, 1000);
				}
				i++;
			}
		});
	}, {
		scheduled: true,
		timezone: "Asia/Manila"
	});
};


//DO NOT DELETE THIS AND DO NOT ADD OR MODIFY MASISISRA YANG FILES MO//
const resetJsonFile = (filePath) => {
	fs.writeFileSync(filePath, '{}');
};

const threadsDataPath = 'includes/database/data/threadsData.json';
const usersDataPath = 'includes/database/data/usersData.json';
const getThreadInfoPath = 'includes/login/src/data/getThreadInfo.json';

resetJsonFile(threadsDataPath);
resetJsonFile(usersDataPath);
resetJsonFile(getThreadInfoPath);

cron.schedule('*/60 * * * *', () => {
	const currentTime = Date.now();
	if (currentTime - lastMessageTime < minInterval) {
		console.log("Skipping message due to rate limit");
		return;
	}
	api.getThreadList(25, null, ['INBOX'], async (err, data) => {
		if (err) return console.error("Error [Thread List Cron]: " + err);
		let i = 0;
		let j = 0;

		async function message(thread) {
			try {
				api.sendMessage({
					body: `Hey There! How are you? ヾ(＾-＾)ノ`
				}, thread.threadID, (err) => {
					if (err) return;
					messagedThreads.add(thread.threadID);
				});
			} catch (error) {
				console.error("Error sending a message:", error);
			}
		}

		while (j < 20 && i < data.length) {
			if (data[i].isGroup && data[i].name != data[i].threadID && !messagedThreads.has(data[i].threadID)) {
				await message(data[i]);
				j++;
				const CuD = data[i].threadID;
				setTimeout(() => {
					messagedThreads.delete(CuD);
				}, 1000);
			}
			i++;
		}
	});
}, {
	scheduled: false, //PAALALA WAG MO ITRUE TO MASISIRA YANG BUONG FILES MO
	timezone: "Asia/Manila"
});