require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: '자기소개',
        description: '프라나가 자기소개를 해줍니다.',
    },
    {
        name: '더하기',
        description: '두 수를 더합니다.',
        options: [
            {
                name: '첫번째수',
                description: '첫번째 수를 입력합니다.',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: '두번째수',
                description: '두번째 수를 입력합니다.',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
        
    } catch (error) {
        console.log(`Error while registering application commands: ${error}`)
    }
})();