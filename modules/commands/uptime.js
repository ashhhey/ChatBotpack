const os = require('os');

module.exports.config = {
 name: "uptime",
 version: "1.0.2",
 hasPermssion: 0,
 credits: "cliff",
 description: "uptime",
 commandCategory: "system",
 usePrefix: false,
 cooldowns: 5,
 dependencies: {
	"pidusage": ""
 }
};

function byte2mb(bytes) {
 const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
 let l = 0, n = parseInt(bytes, 10) || 0;
 while (n >= 1024 && ++l) n = n / 1024;
 return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

function getUptime(uptime) {
 const days = Math.floor(uptime / (3600 * 24));
 const hours = Math.floor((uptime % (3600 * 24)) / 3600);
 const mins = Math.floor((uptime % 3600) / 60);
 const seconds = Math.floor(uptime % 60);
 const cores = `Cores: ${os.cpus().length}`;

 return `Uptime: ${days} days, ${hours} hours, ${mins} minutes, and ${seconds} seconds`;
}

module.exports.languages = {
 "en": {
	"returnResult": "BOT has been working for %1 hour(s) %2 minute(s) %3 second(s).\n\n❖ Total users: %4\n❖ Total Threads: %5\n❖ Cpu usage: %6%\n❖ RAM usage: %7\n❖ Cores: 8\n❖ Ping: %8ms\n❖ Operating System Platform: %9\n❖ System CPU Architecture: %10\n\nCPU information:\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\n + Intel(R) Xeon(R) CPU @ 2.20GHz\nNull device path: /dev/null\nEndianness: LE\nFree memory: 40.95 GB/62.79 GB\nFree storage space: 22.00G/62.79G\nCurrent process priority: Not available in this context\nLoad average: 11.5, 11.37, 20.27\nMachine type: Linux\nNetwork interfaces:\n + lo: 127.0.0.1\n + eth0: 172.31.196.44\nPlatform: linux\nOS release: 6.2.0-1019-gcp\nOS type: Linux\nSystem uptime: Site24/7\nCurrent user information:\n + username: runner\n + uid: 100065005240232\n + gid: 1000\n + shell: /bin/bash\n + homedir: /home/runner/❰❮❬◦[ClIFF]◦❭❯\nNode.js version: v16.7.0"
 }
}

module.exports.run = async ({ api, event, getText }) => {
 const time = process.uptime(),
	hours = Math.floor(time / (60 * 60)),
	minutes = Math.floor((time % (60 * 60)) / 60),
	seconds = Math.floor(time % 60);

 const pidusage = await global.nodemodule["pidusage"](process.pid);

 const osInfo = {
	platform: os.platform(),
	architecture: os.arch()
 };

 const timeStart = Date.now();
 return api.sendMessage("", event.threadID, () => api.sendMessage(getText("returnResult", hours, minutes, seconds, global.data.allUserID.length, global.data.allThreadID.length, pidusage.cpu.toFixed(1), byte2mb(pidusage.memory), Date.now() - timeStart, osInfo.platform, osInfo.architecture), event.threadID, event.messageID));
}
