const { ApplicationCommandOptionType } = require('discord.js');
const guessingNumber = require('../../utils/minigames/guessingNumber');

guessingNumber.init();

module.exports = {
    name: '숫자맞추기',
    description: '프라나와 숫자맞추기 게임을 합니다.',
    devsOnly: false,
    //testOnly: Boolean,
    options: [
        {
            name: '모드',
            description: '게임 모드를 선택합니다.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: '업다운',
                    value: '업다운',
                },
                {
                    name: '배수',
                    value: '배수',
                },
                {
                    name: '일치율',
                    value: '일치율',
                },
                {
                    name: '강제종료',
                    value: '강제종료',
                },
            ],
            required: true,
        },
        {
            name: '난이도',
            description: '난이도를 선택합니다.',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: '쉬움',
                    value: '쉬움'
                },
                {
                    name: '보통',
                    value: '보통',
                },
                {
                    name: '어려움',
                    value: '어려움',
                },
                {
                    name: '하드코어',
                    value: '하드코어',
                },
                {
                    name: '익스트림',
                    value: '익스트림',
                },
            ],
            required: true,
        },
    ],
    deleted: false,

    callback: async (client, interaction) => {
        const difficulty = interaction.options.getString('난이도');
        const mode = interaction.options.getString('모드');
        let endNum, startNum;
        if (mode === '강제종료')
        {
            if (!await guessingNumber.isGuessingNum())
            {
                await interaction.reply('현재 숫자맞추기 게임이 진행중이 아닙니다.');
                return;
            }

            if (guessingNumber.getMode() === '업다운' || guessingNumber.getMode() === '배수')
                await interaction.reply(`게임을 강제종료합니다. 정답은 ${guessingNumber.getAnswer()}입니다.`);
            else if (guessingNumber.getMode() === '일치율')
                await interaction.reply(`게임을 강제종료합니다. 정답은 ${guessingNumber.getAnswer().toString().padStart(guessingNumber.getTotalLen(), '0')}입니다.`);
            await guessingNumber.init();
            return;
        }

        //difficulty에 따라 endNum 설정
        if (mode === '업다운')
        {
            if (difficulty === '쉬움')
            {
                endNum = 10;
            }
            else if (difficulty === '보통')
            {
                endNum = 1000;
            }
            else if (difficulty === '어려움')
            {
                endNum = 100000;
            }
            else if (difficulty === '하드코어')
            {
                endNum = 10000000;
            }
            else if (difficulty === '익스트림')
            {
                endNum = 10000000000;
            }
            else endNum = 0;
        }

        else if (mode === '배수')
        {
            if (difficulty === '쉬움')
            {
                endNum = 20;
            }
            else if (difficulty === '보통')
            {
                endNum = 100;
            }
            else if (difficulty === '어려움')
            {
                endNum = 320;
            }
            else if (difficulty === '하드코어')
            {
                endNum = 650;
            }
            else if (difficulty === '익스트림')
            {
                endNum = 800;
            }
            else endNum = 0;
        }

        else if (mode === '일치율')
        {
            if (difficulty === '쉬움')
            {
                endNum = 99;
            }
            else if (difficulty === '보통')
            {
                endNum = 999;
            }
            else if (difficulty === '어려움')
            {
                endNum = 99999;
            }
            else if (difficulty === '하드코어')
            {
                endNum = 9999999;
            }
            else if (difficulty === '익스트림')
            {
                endNum = 9999999999;
            }
            else endNum = 0;
        }
        

        if (await guessingNumber.isGuessingNum())
        {
            await interaction.reply('이미 숫자맞추기 게임이 진행중입니다.');
            return;
        }

        let ans = Math.floor(Math.random() * endNum) + 1;

        while (isPrime(ans) && mode === '배수')
        {
            ans = Math.floor(Math.random() * endNum) + 1;
        }

        if (mode === '일치율')
        {
            ans = Math.floor(Math.random() * (endNum + 1));
        }

        await guessingNumber.startGame(ans, mode, difficulty, endNum.toString().length);
        if (mode === '업다운')
            await interaction.reply(`1부터 ${endNum} 사이의 난수가 생성되었습니다.`);
        else if (mode === '배수')
            await interaction.reply(`1부터 ${endNum} 사이의 난수가 생성되었습니다. (소수는 제외됩니다.)`);
        else if (mode === '일치율')
            await interaction.reply(`${"0".repeat(endNum.toString().length)}부터 ${endNum} 사이의 난수가 생성되었습니다.`);
    },
};


function isPrime(num) {
    if(num === 2)
    return true;
  
    for(let i = 2; i<=num/2; i++){
      if(num % i === 0){
        return false;
      }
    }
    return true;
}