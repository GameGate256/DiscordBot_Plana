const servermemberdataPath = './src/data/servermember.json';

module.exports = (client) => {

    const fs = require('fs');
    let servermemberdata = JSON.parse(fs.readFileSync(servermemberdataPath));

    client.on('messageCreate', (message) => {
        if (message.author.bot) return;
        if (message.channel.type === 'DM') return;

        const author = message.author;

        //find the server
        const server = message.guild;
        const serverId = server.id;

        //find the user
        const userId = author.id;

        //find the serverlist
        const serverlist = servermemberdata.serverlist.find(serverlist => serverlist.serverid === serverId);
        if (!serverlist) return;

        //find the userlist
        const userlist = serverlist.user.find(user => user.id === userId);
        if (!userlist) return;

        //check if the user has already checked today
        const lastCheckedDate = userlist.lastCheckedDate;

        //get the current date
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        //if the user has already checked today, return
        if (lastCheckedDate === `${year}-${month}-${day}`) return;

        //if the user has not checked today, add 1 to the daily count
        userlist.dailyCount += 1;

        //update the last checked date
        userlist.lastCheckedDate = `${year}-${month}-${day}`;

        //save the data
        fs.writeFileSync(servermemberdataPath, JSON.stringify(servermemberdata));

        message.reply(`반갑습니다, ${message.author} 선생님. 오늘로 ${userlist.dailyCount}번째 출석하셨습니다.`);

        //reload the data
        servermemberdata = JSON.parse(fs.readFileSync(servermemberdataPath)); 
    });
}