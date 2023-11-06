module.exports = async (client, guildID) => {
    let ApplicationCommands;

    if (guildID)
    {
        const guild = await client.guilds.fetch(guildID);
        ApplicationCommands = guild.commands;
    }
    else
    {
        ApplicationCommands = await client.application.commands;
    }

    await ApplicationCommands.fetch();
    return ApplicationCommands;
}