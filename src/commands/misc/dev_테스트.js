const { Emoji } = require('discord.js');

module.exports = {
    name: 'dev_테스트',
    description: '(개발자 전용) 여러 기능을 테스트합니다.',
    devsOnly: true,
    //testOnly: Boolean,
    //options: Object[],
    deleted: false,

    callback: (client, interaction) => {
        interaction.deferReply();
        interaction.deleteReply();
        interaction.channel.send("<:residentsujinper:1036686506200408105>");
    },
};