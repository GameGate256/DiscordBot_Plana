var isGuessingNum = false;
var numGuessingAnswer = -1;
var numGuessingCount = 0;
var numGuessingMode = '없음';
var GuessingHistory = [];
var totalLen = 0;
var difficulty = '없음';
module.exports = {
    startGame: (value, mode, _difficulty, _totalLen = 0) => {
        numGuessingCount = 0;
        numGuessingAnswer = value;
        GuessingHistory = [];
        isGuessingNum = true;
        numGuessingMode = mode;
        totalLen = _totalLen;
        difficulty = _difficulty;
    },

    compareNum: (value, mode, totalLen = 0) => {
        if (mode === '업다운')
        {
            if (value === numGuessingAnswer)
            {
                isGuessingNum = false;
                return 0;
            }
            else if (value > numGuessingAnswer)
            {
                return 1;
            }
            else if (value < numGuessingAnswer)
            {
                return -1;
            }
        }
        else if (mode === '배수')
        {
            if (value === numGuessingAnswer)
            {
                isGuessingNum = false;
                return 0;
            }
            else if (numGuessingAnswer % value === 0)
            {
                return 1;
            }
            else if (numGuessingAnswer % value !== 0)
            {
                return -1;
            }
        }
        else if (mode === '일치율')
        {
            let matchRate = 0;
            const numGAStr = "0".repeat(Math.abs(totalLen - numGuessingAnswer.toString().length)) + numGuessingAnswer.toString();
            const valueStr = "0".repeat(Math.abs(totalLen - value.toString().length)) + value.toString();

            if (value === numGuessingAnswer)
            {
                isGuessingNum = false;
                return 100;
            }
            
            if (valueStr.length !== numGAStr.length)
            {
                return -1;
            }

            for (let i = 0; i < numGAStr.length; i++)
            {
                matchRate += Math.abs(100 - (Math.abs((valueStr)[i] - numGAStr[i]) * 20));
            }

            return matchRate / numGAStr.length;
        }
        
    },

    isGuessingNum: () => {
        return isGuessingNum;
    },

    numGuessingCount: () => {
        return numGuessingCount;
    },

    GuessingCountPlus: (value) => {
        numGuessingCount += value;
    },

    init: () => {
        isGuessingNum = false;
        numGuessingAnswer = -1;
        numGuessingCount = 0;
        numGuessingMode = '없음';
        difficulty = '없음';
        GuessingHistory = [];
    },

    getMode: () => {
        return numGuessingMode;
    },

    getAnswer: () => {
        return numGuessingAnswer;
    },

    getTotalLen: () => {
        return totalLen;
    },

    getDifficulty: () => {
        return difficulty;
    },

    addHistory: (value, result) => {
        GuessingHistory.push({
            value: value,
            result: result,
            attempt: numGuessingCount,
        });
    },

    getHistory: () => {
        return GuessingHistory;
    },

    checkRedupe: (value) => {
        for (let i = 0; i < GuessingHistory.length; i++)
        {
            if (GuessingHistory[i].value === value)
            {
                return true;
            }
        }
        return false;
    }
};