module.exports = {
    name: 'dev_종료',
    description: '(개발자 전용) 프라나가 자러 갑니다.',
    devsOnly: true,
    testOnly: true,
    //options: Object[],
    deleted: false,

    callback: async (client, interaction) => {
        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.channel.send(`안녕히 주무십시오. 프라나는 자러 갑니다.`);

        await process.exit();
    },
};