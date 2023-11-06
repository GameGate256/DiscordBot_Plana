module.exports = {
    name: '핑',
    description: '프라나가 서버와의 핑을 알려줍니다.',
    devsOnly: false,
    //testOnly: true,
    //options: Object[],
    deleted: false,

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`선생님과 프라나와의 핑 차이는 ${ping}ms 입니다.`);
    },
};