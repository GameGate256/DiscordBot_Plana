const { devs, testServer } = require('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands');


module.exports = async (client, interaction) => {
    if(!interaction.isChatInputCommand())
    {
        return;
    }

    const localCommands = getLocalCommands();

    try
    {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if(!commandObject)
            return;

        if(commandObject.devsOnly && !devs.includes(interaction.member.id))
        {
            interaction.reply({ content: '개발자만 이 기능을 사용할 수 있습니다.', ephemeral: true });
            return;
        }

        if(commandObject.testServerOnly && interaction.guildId !== testServer)
        {
            interaction.reply({ content: '이 기능은 테스트 서버에서만 사용이 가능합니다.', ephemeral: true });
            return;
        }

        if (commandObject.permissionRequired?.length)
        {
            for (const permission of commandObject.permissionRequired)
            {
                if(!interaction.member.permissions.has(permission))
                {
                    interaction.reply({ content: `이 명령어를 사용할 권한이 부족합니다.`, ephemeral: true });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length)
        {
            for (const permission of commandObject.botPermissions)
            {
                const bot = interaction.guild.members.me;

                if(!bot.permissions.has(permission))
                {
                    interaction.reply({ content: `해당 명령을 시행하는데 필요한 권한이 없습니다.`, ephemeral: true });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    }
    catch(error)
    {
        console.log(`There was an error while executing a command: ${error}`);
    }
};