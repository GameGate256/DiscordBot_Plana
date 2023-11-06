const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try
    {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        //if testServer is not set, this will be the global application commands
        //if testServer is set, this will be the application commands for the test server

        //if testServer, delete all global commands
        //if testServer, delete all test server commands

        for (const localCommand of localCommands)
        {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

            if (existingCommand)
            {
                if (localCommand.deleted)
                {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand))
                {
                    await applicationCommands.edit(existingCommand.id, { description, options });
                    console.log(`Edited command "${name}".`);
                }
            }
            else
            {
                if(localCommand.deleted)
                {
                    console.log(`skipped command "${name}". (reason: deleted)`);
                    continue;
                }

                await applicationCommands.create({ name, description, options });

                console.log(`Registered command "${name}".`);
            }
        }
    }
    catch (error)
    {
        console.error(`There was an error: ${error}`);
    }
};