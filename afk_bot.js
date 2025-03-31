const mineflayer = require('mineflayer');
const { Authflow } = require('prismarine-auth');
const readline = require('readline');

const USERNAME = 'example@gmail.com'; // Your Microsoft email
const SERVER_IP = 'nitrosmp.net'; // Server IP
const SERVER_PORT = 25565; // Port

async function createBot() {
    const authflow = new Authflow(USERNAME, './');
    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: SERVER_PORT,
        auth: 'microsoft',
        username: USERNAME,
        authflow: authflow
    });

    bot.on('login', () => {
        console.log(`🟢 Logged in as ${bot.username}`);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return; // Ignore own messages

        if (message.startsWith('!')) { // Commands start with "!"
            const command = message.substring(1);
            bot.chat(command);
            console.log(`📢 Executed: ${command}`);
        }
    });

    bot.on('end', (reason) => {
        console.log(`🔴 Disconnected: ${reason}. Restarting...`);
        setTimeout(createBot, 5000);
    });

    bot.on('error', (err) => console.log(`⚠️ Error: ${err}`));

    // Enable console input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (input) => {
        bot.chat(input);
        console.log(`📤 Sent: ${input}`);
    });
}

createBot();
