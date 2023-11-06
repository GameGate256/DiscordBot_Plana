const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '도움말',
    description: '프라나의 도움말을 불러옵니다.',
    devsOnly: false,
    //testOnly: true,
    //options: Object[],
    deleted: false,

    callback: (client, interaction) => {
        const embed = new EmbedBuilder()
        .setTitle('프라나 도움말')
        .addFields(
            {
                name: '1. 프라나에 대하여',
                value: '*프라나는 다른 봇에서 쓸 수 없는 기능을 사용하기 위해 제작된 봇입니다.*',
                inline: false,
            },
            {
                name: '2. 프라나의 명령어',
                value: '*프라나는 /를 사용한 명령어와, \'ㅍ\'를 접두사로 사용하는 명령어를 같이 사용합니다.\n접두사 명령어에 관한 더 많은 정보는 \"ㅍ 도움말\"을 입력하여 불러올 수 있습니다.*',
                inline: false,
            },
        );

        interaction.reply({ embeds: [embed] });
    },
};