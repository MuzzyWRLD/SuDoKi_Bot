const { SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const commandData = new SlashCommandBuilder()
        .setName('greet')
        .setDescription('Begrüßt einen Benutzer')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Der Benutzer, der begrüßt werden soll')
                .setRequired(true)
        );

    client.application.commands.create(commandData);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'greet') {
        const user = interaction.options.getUser('target');
        await interaction.reply(`Hallo, ${user}!`);
    }
});

client.login('MTI2MjQ5NTQzNjM4MDMxMTYzNQ.GKCt1h.rncoeMzoxLnn-aSq_bR0JYjrM83RECyJMDD6XQ');


//MTI2MjQ5NTQzNjM4MDMxMTYzNQ.GKCt1h.rncoeMzoxLnn-aSq_bR0JYjrM83RECyJMDD6XQ