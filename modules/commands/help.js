const fs = require("fs");
const axios = require("axios");

module.exports.config = {
	name: "help",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Beginner's Guide",
	commandCategory: "system",
	usages: "[command]",
	usePrefix: false,
	cooldowns: 0,
	envConfig: {
		autoUnsend: false,
		delayUnsend: 20
	}
};

module.exports.languages = {
	"vi": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ Cách sử dụng: %3\n❯ Nhóm lệnh: %4\n❯ Thời gian chờ: %5 giây(s)\n❯ Quyền hạn: %6\n\n» Code module by %7 «",
		"helpList": '[ Hiện tại có %1 lệnh có thể sử dụng trên bot, Sử dụng: "%2help tên_lệnh" để xem chi tiết cách sử dụng! ]',
		"user": "Người dùng",
		"adminGroup": "Quản trị viên nhóm",
		"adminBot": "Quản trị viên bot"
	},
	"en": {
		"moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Cooldown: %5 seconds(s)\n❯ Permission: %6\n\n» Code module by %7 «",
		"helpList": '[ There are %1 commands on this bot, Use: "%2help commandName" to know how to use! ]',
		"user": "Anyone",
		"adminGroup": "Admin of group",
		"adminBot": "Admin of bot"
	}
};

module.exports.handleEvent = async function({ api, event, getText }) {
	if (!(event.body.indexOf("help") === 0 || event.body.indexOf("Help") === 0)) return;
	const args = event.body.split(/\s+/);
	args.shift();

	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	if (!command) {
		const arrayInfo = [];
		const page = parseInt(args[0]) || 1;
		const numberOfOnePage = 20;
		let i = 0;
		let msg = "\n";

		for (var [name, value] of (commands)) {
			name += `  ${value.config.usages}`;
			arrayInfo.push(name);
		}
		arrayInfo.sort((a, b) => a.data - b.data);

		const startSlice = numberOfOnePage*page - numberOfOnePage;
		i = startSlice;
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

		for (let item of returnArray) msg +=`╭─❍\n➠ ${item}\n╰───────────⟡\n`;
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

		const randomTexts = [ 
"Even a small amount of alcohol poured on a scorpion will drive it crazy and sting itself to death.",
" The crocodile can't stick its tongue out.","The oldest known animal in the world is a 405-year-old male, discovered in 2007.","Sharks, like other fish, have their reproductive organs located in the ribcage.","The eyes of the octopus have no blind spots. On average, the brain of an octopus has 300 million neurons. When under extreme stress, some octopuses even eat their trunks.","An elephant's brain weighs about 6,000g, while a cat's brain weighs only approximately 30g.","Cats and dogs have the ability to hear ultrasound.","Sheep can survive up to 2 weeks in a state of being buried in snow.","The smartest pig in the world is owned by a math teacher in Madison, Wisconsin (USA). It has the ability to memorize worksheets multiplying to 12.","Statistics show that each rattlesnake's mating lasts up to ... more than 22 hours", "Studies have found that flies are deaf.","In a lack of water, kangaroos can endure longer than camels.","","Dogs have 4 toes on their hind legs and 5 toes on each of their front paws.","The average flight speed of honey bees is 24km/h. They never sleep.","Cockroaches can live up to 9 days after having their heads cut off.","If you leave a goldfish in the dark for a long time, it will eventually turn white.","The flying record for a chicken is 13 seconds.","The mosquito that causes the most deaths to humans worldwide is the mosquito.","TThe quack of a duck doesn't resonate, and no one knows why.","Sea pond has no brain. They are also among the few animals that can turn their stomachs inside out.","Termites are active 24 hours a day and they do not sleep. Studies have also found that termites gnaw wood twice as fast when listening to heavy rock music.","Baby giraffes usually fall from a height of 1.8 meters when they are born.", "A tiger not only has a striped coat, but their skin is also streaked with stripes.."," Vultures fly without flapping their wings.","Turkeys can reproduce without mating.","Penguins are the only birds that can swim, but not fly. Nor have any penguins been found in the Arctic."," The venom of the king cobra is so toxic that just one gram can kill 150 people.","The venom of a small scorpion is much more dangerous than the venom of a large scorpion.","The length of an oyster's penis can be so 'monstrous' that it is 20 times its body size!","Rat's heart beats 650 times per minute.","The flea can jump 350 times its body length. If it also possessed that ability, a human would be able to jump the length of a football field once.","The faster the kangaroo jumps, the less energy it consumes.","Elephants are among the few mammals that can't jump! It was also discovered that elephants still stand after death.","Spiders have transparent blood."," Snails breathe with their feet.","Some lions mate more than 50 times a day.","Chuột reproduce so quickly that in just 18 months, from just 2 mice, the mother can give birth to 1 million heirs.","Hedgehog floats on water.","Alex is the world's first African gray parrot to question its own existence: What color am I?.","The reason why flamingos are pink-red in color is because they can absorb pigments from the shells of shrimp and shrimp that they eat every day."," Owls and pigeons can memorize human faces", "Cows are more dangerous than sharks","The single pair of wings on the back and the rear stabilizer help the flies to fly continuously, but their lifespan is not more than 14 days.","With a pair of endlessly long legs that can be up to 1.5 m high and weigh 20-25 kg, the ostrich can run faster than a horse. In addition, male ostriches can roar like a lion.","Kangaroos use their tails for balance, so if you lift a Kangaroo's tail off the ground, it won't be able to jump and stand.","Tigers not only have stripes on their backs but also printed on their skin. Each individual tiger is born with its own unique stripe.","If you are being attacked by a crocodile, do not try to get rid of their sharp teeth by pushing them away. Just poke the crocodile in the eye, that's their weakness.","Fleas can jump up to 200 times their height. This is equivalent to a man jumping on the Empire State Building in New York.","A cat has up to 32 muscles in the ear. That makes them have superior hearing ability","Koalas have a taste that does not change throughout life, they eat almost nothing but .. leaves of the eucalyptus tree.","The beaver's teeth do not stop growing throughout its life. If you do not want the teeth to be too long and difficult to control, the beaver must eat hard foods to wear them down.","Animals living in coastal cliffs or estuaries have extremely weird abilities. Oysters can change sex to match the mating method.","Butterflies have eyes with thousands of lenses similar to those on cameras, but they can only see red, green, and yellow..","Don't try this at home, the truth is that if a snail loses an eye, it can recover.","Giraffes do not have vocal cords like other animals of the same family, their tongues are blue-black.","Dog nose prints are like human fingerprints and can be used to identify different dogs."
		];
	/*var data = ["https://i.imgur.com/XetbfAe.jpg", "https://i.imgur.com/4dwdpG9.jpg", "https://i.imgur.com/9My3K5w.jpg", "https://i.imgur.com/vK67ofl.jpg", "https://i.imgur.com/fGwlsFL.jpg"];
let link = data[Math.floor(Math.random() * data.length)];
let path = __dirname + `/cache/help.png`;
	let image = (
		await axios.get(link, {
			responseType: "arraybuffer",
		})
	).data;
	fs.writeFileSync(path, Buffer.from(image, "utf-8"));*/
		const text = `𝗧𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀:『${arrayInfo.length}』\n𝗣𝗢𝗚𝗜 𝗣𝗔 𝗞𝗜𝗦𝗦 𝗣𝗪𝗘𝗗𝗘?\n\n𝗥𝗔𝗡𝗗𝗢𝗠 𝗙𝗔𝗖𝗧: ${randomQuote}`;
		return api.sendMessage(`🔴🟡🟢\n\n░░░░█▄█ ▄▀█ ▀█ █▄▀ █▄█░░░
░░░░░█░ █▀█ █▄ █░█ ░█░░░░\n\n◦❭❯❱ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 & 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 ❰❮❬◦\n\n 𝖯𝖺𝗀𝖾 『 ${page} /${Math.ceil(arrayInfo.length/numberOfOnePage)} 』` + "\n" + msg + "\n" + text, threadID, async (error, info) => {
			if (autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, delayUnsend * 10000));
				return api.unsendMessage(info.messageID);
			} else return;
		});
	}
	return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};

module.exports.run = async function({ api, event }) {};