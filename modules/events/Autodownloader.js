const fs = require('fs-extra');
const getFBInfo = require("@xaviabot/fb-downloader");
const axios = require('axios');
const ytdl = require("ytdl-core");
const youtube = require("yt-search");
const { google } = require("googleapis");
const mime = require("mime-types");
const path = require("path");
const simpleYT = require('simple-youtube-api'); // Added import for simple-youtube-api

module.exports.config = {
		name: "autodownloader",
		eventType: ['log:subscribe'],
		version: "1.0.0",
		credits: "cliff",//do not change the credits🚀
		description: "Regex link autodownloader"
};

module.exports.run = async function ({ api, event, attachments, body, isGroup, mentions, type, isUnread, threadId, senderId, messageId, input }) {
		// TikTok autodownloader
		const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
		const link = event.body;

		if (regEx_tiktok.test(link)) {
				api.setMessageReaction("📥", event.messageID, () => { }, true);

				axios.post(`https://www.tikwm.com/api/`, {
						url: link
				}).then(async response => {
						const data = response.data.data;
						const videoStream = await axios({
								method: 'get',
								url: data.play,
								responseType: 'stream'
						}).then(res => res.data);

						const fileName = `TikTok-${Date.now()}.mp4`;
						const filePath = `./${fileName}`;
						const videoFile = fs.createWriteStream(filePath);

						videoStream.pipe(videoFile);

						videoFile.on('finish', () => {
								videoFile.close(() => {
										console.log('Downloaded video file.');

										api.sendMessage({
												body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬𝘃`,
												attachment: fs.createReadStream(filePath)
										}, event.threadID, () => {
												fs.unlinkSync(filePath);
										});
								});
						});
				}).catch(error => {
						api.sendMessage(`Error when trying to download the TikTok video: ${error.message}`, event.threadID, event.messageID);
				});
		}

		// Google Drive file downloader
		if (event.body !== null) {
				(async () => {
						const apiKey = 'YOUR_GOOGLE_DRIVE_API_KEY'; // Replace with your Google Drive API key

						if (!apiKey) {
								console.error('No Google Drive API key provided.');
								return;
						}

						const drive = google.drive({ version: 'v3', auth: apiKey });
						const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive.google.com\/(?:folderview\?id=|file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;
						let match;

						const downloadDirectory = path.join(__dirname, 'downloads');

						while ((match = gdriveLinkPattern.exec(event.body)) !== null) {
								const fileId = match[1];

								try {
										const res = await drive.files.get({ fileId: fileId, fields: 'name, mimeType' });
										const fileName = res.data.name;
										const mimeType = res.data.mimeType;

										const extension = mime.extension(mimeType);
										const destFilename = `${fileName}${extension ? '.' + extension : ''}`;
										const destPath = path.join(downloadDirectory, destFilename);

										console.log(`Downloading file "${fileName}"...`);

										const dest = fs.createWriteStream(destPath);
										let progress = 0;

										const resMedia = await drive.files.get(
												{ fileId: fileId, alt: 'media' },
												{ responseType: 'stream' }
										);

										await new Promise((resolve, reject) => {
												resMedia.data
														.on('end', () => {
																console.log(`Downloaded file "${fileName}"`);
																resolve();
														})
														.on('error', (err) => {
																console.error('Error downloading file:', err);
																reject(err);
														})
														.on('data', (d) => {
																progress += d.length;
																process.stdout.write(`Downloaded ${progress} bytes\r`);
														})
														.pipe(dest);
										});

										console.log(`Sending message with file "${fileName}"...`);
										await api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖽𝗈𝗐𝗇 𝖦𝗈𝗈𝗀𝗅𝖾 𝖣𝗋𝗂𝖽𝖾 𝖫𝗂𝗇𝗄 \n\n𝙵𝙸𝙻𝙴𝙽𝙰𝙼𝙴: ${fileName}\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬𝘃`, attachment: fs.createReadStream(destPath) }, event.threadID);

										console.log(`Deleting file "${fileName}"...`);
										await fs.promises.unlink(destPath);
										console.log(`Deleted file "${fileName}"`);
								} catch (err) {
										console.error('Error processing file:', err);
								}
						}
				})();
		}

		// Mark messages as read
		if (event.body !== null) {
				api.markAsReadAll(() => { });
		}

		// YouTube video downloader
		if (event.body !== null) {
				const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
				const videoUrl = event.body;

				const youtube = new simpleYT('YOUR_YOUTUBE_API_KEY'); // Replace with your YouTube API key

				if (youtubeLinkPattern.test(videoUrl)) {
						youtube.getVideo(videoUrl)
								.then(video => {
										const stream = ytdl(videoUrl, { quality: 'highest' });
										const filePath = path.join(__dirname, `./downloads/${video.title}.mp4`);
										const file = fs.createWriteStream(filePath);

										stream.pipe(file);

										file.on('finish', () => {
												file.close(() => {
														api.sendMessage({ body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 \n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬𝘃`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
												});
										});
								})
								.catch(error => {
										console.error('Error downloading video:', error);
								});
				}
		}

		// Facebook video downloader
		if (event.body !== null) {
				const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

				const downloadAndSendFBContent = async (url) => {
						try {
								const result = await getFBInfo(url);
								const videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
								const fbvid = `./downloads/FacebookVideo-${Date.now()}.mp4`; // Added variable for fbvid
								fs.writeFileSync(fbvid, Buffer.from(videoData.data, 'utf-8'));
								return api.sendMessage({ body: "𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈\n\n𝗬𝗔𝗭𝗞𝗬 𝗕𝗢𝗧 𝟮.𝟬𝘃", attachment: fs.createReadStream(fbvid) }, event.threadID, () => fs.unlinkSync(fbvid));
						} catch (e) {
								console.error(e);
						}
				};

				if (facebookLinkRegex.test(event.body)) {
						const url = event.body;
						downloadAndSendFBContent(url);
				}
		}
};
