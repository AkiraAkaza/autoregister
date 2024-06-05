const mineflayer = require('mineflayer');
const fs = require('fs');

// List of bot usernames
// điền thêm thông tin tên tài khoản muốn register
// cuối mỗi dòng hãy dùng thêm dấu phẩy nhưng dòng cuối không nên thêm vào
const usernames = [
  `Gamingfro`,
  `HoiiX2`,
  `Hugahug`,
    `ImLoFiChill`,
  `MMB`,
  `KingOfHaos`,
  `OneRosay`,
  `Rupanworker`,
  `Sn1per`,
  `TrungClown`,
  `TuanDZvipProkk`,
  `YennSimpHutao`,
  `ZackDuck`,
  `_GauBeo211_`,
  `anaTrack`,
  `congswatload137`,
  `fuocprogaming`,
  `godsang234`,
  `khang123v13`,
  `kinro`,
  `lamnb999`,
  `voidgod_og`,
  `xidou`,
  `zinlintin102`
  
];

// Password for registration and login
const password = "mật_khẩu"; // viết mật khẩu muốn register vào đây

// File to store registered usernames
const registeredUserFile = 'registeredUsers.txt';

// Function to handle bot spawn event
function handleSpawn(bot) {
  bot.on('messagestr', (message) => {
    if (message.includes('/register')) {
      bot.chat(`/register ${password} ${password}`);
    } else if (message.includes('/login')) {
       bot.end();
      } 
  });
}

// Function to handle bot errors and retry login
// Function to handle bot errors and retry login
function handleError(bot, username) {
  bot.on('kicked', (reason, loggedIn) => {
    if (loggedIn) {
      if (reason.json && reason.json.text === " đăng ký tài khoản thành công!") {
        console.log(`Bot ${username} was kicked for: ${JSON.stringify(reason)}`);
        // Save username to file if registration successful
        fs.appendFile(registeredUserFile, `${username}\n`, (err) => {
          if (err) {
            console.log(`Error writing to file for bot ${username}: ${err}`);
          } else {
            console.log(`Bot ${username} đã đăng ký thành công và tên đã được lưu vào file.`);
          }
        });
        
      } else if (reason.json && reason.json.text === "/login") {
        console.log(`Bot ${username} was kicked for: ${JSON.stringify(reason)}`);
        bot.end(); // Đóng kết nối khi gặp thông báo "/login"
      } else {
        console.log(`Bot ${username} was kicked for: ${JSON.stringify(reason)}`);
        
      }
    }
  });

  bot.on('error', (err) => {
    console.log(`Bot ${username} encountered an error: ${err}`);
    retryLogin(username);
  });
}


// Function to create a bot and handle its actions
function createBot(username) {
  const bot = mineflayer.createBot({
    host: 'play.vinamc.net',
    username,
    auth: 'offline',
    port: 25565,
    version: '1.20.1',
    keepAlive: true,
    hideErrors: false,
    timeout: 30000,
    keepaliveInterval: 60000
  });

  bot.on('messagestr', (message) => {
    if (message.includes('Successfully registered')) {
      // Save username to file if registration successful
      fs.appendFile(registeredUserFile, `${username}\n`, (err) => {
        if (err) {
          console.log(`Error writing to file for bot ${username}: ${err}`);
        } else {
          console.log(`Bot ${username} đã được đăng ký thành công và tên đã được lưu vào file.`);
        }
      });
    }
  });

  bot.on('message', (message) => console.log(message.toAnsi()));

  bot.once('spawn', () => handleSpawn(bot));
  handleError(bot, username);
}

// Function to retry login
function retryLogin(username) {
  setTimeout(() => createBot(username), 10000);
}

// Create bots with delay between each login
usernames.forEach((username, index) => {
  setTimeout(() => {
    createBot(username);
  }, index * 10000); // 20000 milliseconds delay between each bot login
});
