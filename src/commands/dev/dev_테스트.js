const { Emoji, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'dev_테스트',
    description: '(개발자 전용) 여러 기능을 테스트합니다.',
    devsOnly: true,
    //testOnly: Boolean,
    options: [
        {
            name: '테스트',
            description: '테스트',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    deleted: false,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.channel.send('프');
        await interaction.channel.send('라');
        await interaction.channel.send('나');
    },
};