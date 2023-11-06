module.exports = {
    name: '자기소개',
    description: '프라나가 자기소개를 합니다.',
    devsOnly: false,
    //testOnly: Boolean,
    //options: Object[],
    deleted: false,

    callback: (client, interaction) => {
        interaction.reply(`저는 싯딤의 상자 소속 AI A.R.O.N.A입니다. 프라나라고 불러주세요.`);
    },
};