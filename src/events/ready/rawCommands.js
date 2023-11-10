const guessingNumber = require('../../utils/minigames/guessingNumber');
const { devs, devMode } = require('../../../config.json')
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = (client) => {
    
    client.on('messageCreate', (message) => {
        if (message.author.bot) return;
        
    
        if (message.content === '프라나') {
            message.reply('여기 있습니다.');
        }

        if (message.content === 'ㅍ' && !devMode) {
            message.reply('\'ㅍ\'은 프라나의 접두사입니다. 더 많은 명령어를 보시려면 \"ㅍ 도움말\"을 입력해주세요.');
        }

        const prefix = 'ㅍ';
        if (!message.content.startsWith(prefix)) return;
        
        //if not dev
        if (!devs.includes(message.author.id) && devMode) 
        {
            message.reply('현재 이 기능은 개발자만 사용할 수 있습니다.');
            return;
        }

        //args = ['명령어', '인자1', '인자2', ...]
        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');

        if (args[1] === '도움말') {
            const embed = new EmbedBuilder()
                .setTitle('프라나의 접두사 명령어 목록')
                .setDescription('프라나의 접두사 명령어 목록입니다.\n.')
                .addFields(
                    {
                        name: 'ㅍ 도움말',
                        value: '*프라나의 접두사 명령어 목록을 보여줍니다.\n.*',
                        inline: false,
                    },
                    {
                        name: 'ㅍ ㅅ [숫자]',
                        value: '*숫자맞추기 게임의 숫자를 입력합니다.\n.*',
                        inline: false,
                    },
                );

                message.reply({ embeds: [embed] });
        }

        else if (args[1] === 'ㅅ') //숫자맞추기
        {

            if (!guessingNumber.isGuessingNum())
            {
                message.reply('현재 숫자맞추기 게임이 진행중이 아닙니다.');
                return;
            }

            const mode = guessingNumber.getMode();
            
            if (args[2] === '기록')
            {
                try
                {
                    const history = historyStringMaker(mode);

                    let embed = new EmbedBuilder()
                        .setTitle('숫자맞추기 게임 기록')
                        .setDescription('현재 진행중인 숫자맞추기 게임의 기록입니다.')
                        .addFields(
                            {
                                name: '기록',
                                value: history,
                                inline: false,
                            },
                        );

                    if(mode === '일치율')
                    {
                        //set footer image
                        const attachment = new AttachmentBuilder('./src/images/numGuessingGame/gameExplanation.png', { name: 'gameExplanation.png'});
                        embed.setFooter(
                            {
                                text: '일치율은 각 자릿수의 일치율의 평균입니다.',
                            }
                        );

                        message.reply({ embeds: [embed] , files: [attachment]});
                        return;
                    }

                    message.reply({ embeds: [embed] });
                    return;
                }
                catch (err)
                {
                    message.reply('오류. 기록을 불러오는데 실패했습니다.' + err);
                    return;
                }
            }

            const num = parseInt(args[2].replace(/,/g, '').replace(/\./g, ''));

            if (num >  999999999999999 || num < 0) // 99999,99999,99999
            {
                message.reply('입력한 숫자가 범위를 초과했습니다.');
                return;
            }

            let res;
            if(mode === '업다운' || mode === '배수')
                res = guessingNumber.compareNum(num, mode);
            else if (mode === '일치율')
                res = guessingNumber.compareNum(num, mode, guessingNumber.getTotalLen());

            const isRedupe = guessingNumber.checkRedupe(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","));

            if (mode === '업다운')
            {
                if (res === 0)
                {
                    guessingNumber.GuessingCountPlus(1);
                    message.reply(`정답입니다! 게임을 종료합니다. (업다운 | 난이도: ${guessingNumber.getDifficulty()}, 시도횟수: ${guessingNumber.numGuessingCount()})`);
                    return;
                }
                else if (res === 1)
                {
                    if(isRedupe)
                    {
                        message.reply(`다운. (${args[2]}) (중복)`);
                        return;
                    }
                    message.reply(`다운. (${args[2]})`);
                    guessingNumber.GuessingCountPlus(1);
                    guessingNumber.addHistory(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","), ': 다운');
                    return;
                }
                else if (res === -1)
                {
                    if(isRedupe)
                    {
                        message.reply(`업. (${args[2]}) (중복)`);
                        return;
                    }
                    message.reply(`업. (${args[2]})`);
                    guessingNumber.GuessingCountPlus(1);
                    guessingNumber.addHistory(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","), ': 업');
                    return;
                }
                else return;
            }
            else if (mode === '배수')
            {
                if (res === 0)
                {
                    guessingNumber.GuessingCountPlus(1);
                    message.reply(`정답입니다! 게임을 종료합니다. (배수 | 난이도: ${guessingNumber.getDifficulty()}, 시도횟수: ${guessingNumber.numGuessingCount()})`);
                    return;
                }
                else if (res === 1)
                {
                    if (isRedupe)
                    {
                        message.reply(`정답 숫자는 ${args[2]}의 배수입니다. (중복)`);
                        return;
                    }
                    message.reply(`정답 숫자는 ${args[2]}의 배수입니다.`);
                    guessingNumber.GuessingCountPlus(1);
                    guessingNumber.addHistory(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","), '의 배수');
                    return;
                }
                else if (res === -1)
                {
                    if (isRedupe)
                    {
                        message.reply(`정답 숫자는 ${args[2]}의 배수가 아닙니다. (중복)`);
                        return;
                    }
                    message.reply(`정답 숫자는 ${args[2]}의 배수가 아닙니다.`);
                    guessingNumber.GuessingCountPlus(1);
                    guessingNumber.addHistory(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","), '의 배수 아님');
                    return;
                }
                else return;
            }
            else if (mode === '일치율')
            {
                if(isNaN(parseInt(args[2]))) return;

                if (res === 100)
                {
                    guessingNumber.GuessingCountPlus(1);
                    message.reply(`정답입니다! 게임을 종료합니다. (일치율 | 난이도: ${guessingNumber.getDifficulty()}, 시도횟수: ${guessingNumber.numGuessingCount()})`);
                    return;
                }
                else if (res === -1)
                {
                    message.reply('오류. 입력한 숫자의 자릿수가 정답 숫자의 자릿수를 초과합니다.');
                    return;
                }
                else
                {
                    if (isRedupe)
                    {
                        message.reply(`${args[2]}의 일치율: ${res.toFixed(2)}% (중복된 숫자)`);
                        return;
                    }
                    message.reply(`일치율: ${res.toFixed(2)}%`);
                    guessingNumber.GuessingCountPlus(1);
                    guessingNumber.addHistory(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","), `${res.toFixed(2)}`);
                    return;
                }
            
            }
        }

        else if (args[1] === 'ㅌ')
        {
            return;
            let num = parseInt(args[2].replace(/,/g, '').replace(/\./g, ''));
            num = new Number(num).toFixed();
            
            message.reply(`beforePharse: ${args[2].replace(/,/g, '').replace(/\./g, '')}, num:${num}, format:${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}, typeofnum: ${typeof(num)}`);
        }
    });
    
};

function historyStringMaker(mode)
{
    let str = '';

    
    const history = guessingNumber.getHistory();
    const len = history.length;

    if (len === 0)
    {
        return '기록이 없습니다.';
    }

    if (mode === '업다운')
    {
        //guessingNumber.numGuessingAnswer() 와 가장 가까운 숫자를 찾는다. (위로 한개, 아래로 한개)
        let up = -1;
        let down = -1;

        //sort history
        history.sort((a, b) => {
            return parseInt(a.value.replace(/,/g, '').replace(/\./g, '')) - parseInt(b.value.replace(/,/g, '').replace(/\./g, ''));
        });

        for (let i = 0; i < len; i++)
        {
            if (history[i].result.includes('다운'))
            {
                down = i;
                break;
            }
        }

        for (let i = len - 1; i >= 0; i--)
        {
            if (history[i].result.includes('업'))
            {
                up = i;
                break;
            }
        }

        //format
        //가장 가까운 업: 1234 (n번째 시도)
        //가장 가까운 다운: 1234 (n번째 시도)

        if (down !== -1) str += `가장 가까운 다운: \`${history[down].value}\` (${history[down].attempt}번째 시도)\n`;
        else str += `가장 가까운 다운: \`없음\`\n`;

        if (up !== -1) str += `가장 가까운 업: \`${history[up].value}\` (${history[up].attempt}번째 시도)\n`;
        else str += `가장 가까운 업: \`없음\`\n`;

        return str;
    }
    else if (mode === '배수')
    {
        let multiple = [];
        let notMultiple = [];
        for(let i = 0; i < len; i++)
        {
            if(history[i].result.includes('아님'))
            {
                notMultiple.push(history[i]);
            }
            else
            {
                multiple.push(history[i]);
            }
        }

        //sort
        multiple.sort((a, b) => {
            return a.value - b.value;
        });

        notMultiple.sort((a, b) => {
            return a.value - b.value;
        });

        //format
        //정답은 다음 수들의 배수입니다: 1,3,5,6
        //정답은 다음 수들의 배수가 아닙니다: 2,4,7,8

        str += '정답은 다음 수들의 배수입니다: ';
        if (multiple.length === 0) str += '\`없음\`';
        else
        {
            for(let i = 0; i < multiple.length; i++)
            {
                str += `\`${multiple[i].value}\`, `;
            }
            str = str.substring(0, str.length - 2);
            str += '\n';
        }

        str += '정답은 다음 수들의 배수가 아닙니다: ';
        if (notMultiple.length === 0) str += '\`없음\`';
        else
        {
            for(let i = 0; i < notMultiple.length; i++)
            {
                str += `\`${notMultiple[i].value}\`, `;
            }
            str = str.substring(0, str.length - 2);
            str += '\n';
        }

        return str;
    }
    else if (mode === '일치율')
    {
        str += '상위 5개의 일치율: \n';

        //sort
        history.sort((a, b) => {
            return b.result - a.result;
        });

        //format
        //1. 1234: 100% (n번째 시도)

        for(let i = 0; i < 5; i++)
        {
            if (history[i] === undefined) break;    
            str += `${i + 1}. \`${history[i].value.toString().padStart(guessingNumber.getTotalLen(), '0')}\`
            : \`${history[i].result}%\` (${history[i].attempt}번째 시도)\n`;
        }

        return str;
    }
    else
    {
        return "실패.";
    }
}