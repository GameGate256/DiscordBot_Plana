const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

let CoolDownUsers = [];

module.exports = {

    /**
     * 
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */

    //deleted: true,

    callback: async (client, interaction) => {

        /*
        const targetUserRolePosition = targetUser.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= botRolePosition)
        {
            await interaction.editReply('대상 유저의 권한이 프라나의 권한보다 높거나 같습니다.');
            return;
        }
        */

        try
        {
            const target = interaction.options.get('대상').value;
            const timeoutTime = interaction.options.getInteger('타임아웃시간');
            const reason = interaction.options.getString('사유') || '사유 없음';
            
            await interaction.deferReply();
            
            const targetUser = await interaction.guild.members.fetch(target);

            if (!targetUser || targetUser === null) 
            {
                await interaction.editReply('대상 유저를 찾을 수 없습니다.');
                return;
            }

            //if target is me
            if (targetUser.id === client.user.id)
            {
                await interaction.editReply('선생님. 지금 저를 타임아웃 시키시려고 한겁니까.');
                return;
            }

            //if target is bot
            if (targetUser.user.bot)
            {
                await interaction.editReply('봇을 타임아웃 시킬 수 없습니다.');
                return;
            }

            //if target is admin
            if (targetUser.permissions.has(PermissionFlagsBits.Administrator))
            {
                await interaction.editReply('관리자를 타임아웃 시킬 수 없습니다.');
                return;
            }

            if (timeoutTime < 1 || timeoutTime > 30)
            {
                await interaction.editReply('타임아웃 시간의 범위는 1초부터 30초까지 입니다.');
                return;
            }

            //if target is already in cooldown list
            if (CoolDownUsers.includes(targetUser.id))
            {
                await interaction.editReply(`해당 유저는 타임아웃을 당한지 얼마 안되었습니다. 잠시 후 다시 시도해주세요.`);
                return;
            }

            //create timeout vote embed
            const embed = new EmbedBuilder()
                .setTitle('타임아웃 투표')
                .setDescription(`${targetUser}님을 ${timeoutTime}초 동안 타임아웃 시키겠습니까? (투표 시간: 5초)`)
                .setColor('#ff0000')
                .addFields({
                    name: '사유',
                    value: reason,
                    inline: true,
                });


            //send embed
            const message = await interaction.channel.send({ embeds: [embed] });

            //add reactions
            await message.react('✅');
            await message.react('❌');

            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
            };

            const collector = message.createReactionCollector({ filter, time: 5000 });

            collector.on('end', async (reaction, user) => {
                const yes = message.reactions.cache.get('✅').count;
                const no = message.reactions.cache.get('❌').count;

                if(yes + no <= 3)
                {
                    await interaction.editReply('투표 종료. 투표 참여 인원이 너무 적어 타임아웃을 시키지 않습니다.');
                    await message.delete();
                    return;
                }

                if (yes > no)
                {
                    //timeout target user
                    await targetUser.timeout(timeoutTime * 1000, reason);
                    await interaction.deleteReply();
                    await interaction.channel.send(`투표 종료. 과반수 찬성으로 ${targetUser}님을 ${timeoutTime}초 동안 타임아웃 시켰습니다. (사유: ${reason})`);
                    await message.delete();

                    //add  target user and time to cooldown list
                    //push user and time
                    CoolDownUsers.push(targetUser.id);
                    //remove user and time after 3 seconds
                    setTimeout(() => {
                        CoolDownUsers.splice(CoolDownUsers.indexOf(targetUser.id), 1);
                    }, 10 * 1000);

                }
                else
                {
                    await interaction.deleteReply();
                    await interaction.channel.send('투표 종료. 찬성표가 과반수에 미치지 못해 타임아웃을 시키지 않습니다.');
                    await message.delete();
                }
            });
        }
        catch (error)
        {
            console.log('타임아웃 투표 중 에러 발생: ' + error);
            await interaction.editReply('오류. 구문을 올바르게 입력했는지 확인해주세요.');
            return;
        }
    },

    deleted: false,
    devsOnly: false,
    name: '타임아웃투표',
    description: '[대상]의 [타임아웃시간]에 대한 타임아웃 투표를 시작합니다.',
    options: [
        {
            name: '대상',
            description: '타임아웃을 시킬 유저를 선택합니다.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: '타임아웃시간',
            description: '타임아웃 시간을 입력합니다. (단위: 초, 범위: 1 ~ 30)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: '사유',
            description: '타임아웃 사유를 입력합니다.',
            type: ApplicationCommandOptionType.String,
        },
    ],
}