module.exports = {
    name: '서버등록',
    description: '(개발자 전용) 출석 체크를 위해 서버를 등록합니다.',
    devsOnly: true,
    //testOnly: true,
    //options: Object[],
    deleted: false,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        try
        {
            const dataPath = './src/data/servermember.json';
            const fs = require('fs');

            const server = await client.guilds.fetch(interaction.guildId);
            const serverId = server.id;

            //check if the server is already registered
            let data = JSON.parse(fs.readFileSync(dataPath));

            if (data.serverlist.some(serverlist => serverlist.serverid === serverId))
            { 
                //save previous serverlist data
                const previousServerlist = data.serverlist.find(serverlist => serverlist.serverid === serverId);
                //delete the previous data
                data.serverlist = data.serverlist.filter(serverlist => serverlist.serverid !== serverId);
                
                //get all members in the server
                const members = await server.members.fetch();
                const memberIds = members.map(member => member.id);

                //remove bots from the list
                const botIds = members.filter(member => member.user.bot).map(member => member.id);
                const memberIdsWithoutBots = memberIds.filter(id => !botIds.includes(id));

                const serverlist = {
                    "serverid": serverId,
                    "user": memberIdsWithoutBots.map(id => {
                        const previousUserlist = previousServerlist.user.find(user => user.id === id);
                        if (previousUserlist)
                        {
                            return {
                                "id": id,
                                "lastCheckedDate": previousUserlist.lastCheckedDate,
                                "dailyCount": previousUserlist.dailyCount
                            };
                        }
                        else
                        {
                            return {
                                "id": id,
                                "lastCheckedDate": null,
                                "dailyCount": 0
                            };
                        }
                    })
                };

                //dont delete previous data, just add the new serverlist
                data.serverlist.push(serverlist);

                fs.writeFileSync(dataPath, JSON.stringify(data));

                await interaction.editReply(`서버 갱신이 완료되었습니다. 서버 ID: ${serverId}`);
                return;
            }

            else
            {
                //get all members in the server
                const members = await server.members.fetch();
                const memberIds = members.map(member => member.id);

                //remove bots from the list
                const botIds = members.filter(member => member.user.bot).map(member => member.id);
                const memberIdsWithoutBots = memberIds.filter(id => !botIds.includes(id));

                //add serverlist data to the json file
                const serverlist = {
                    "serverid": serverId,
                    "user": memberIdsWithoutBots.map(id => {
                        return {
                            "id": id,
                            "lastCheckedDate": null,
                            "dailyCount": 0
                        };
                    })
                };

                data.serverlist.push(serverlist);

                fs.writeFileSync(dataPath, JSON.stringify(data));

                await interaction.editReply(`서버 등록이 완료되었습니다. 서버 ID: ${serverId}`);
                return;
            
            }

        }
        catch (error)
        {
            await interaction.editReply(`오류. 서버 등록에 실패했습니다: ${error}`);
            return;
        }
    },
};