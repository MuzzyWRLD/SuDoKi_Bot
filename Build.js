const { Client, GatewayIntentBits, SlashCommandBuilder, Permissions } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Ersetze mit deinem Bot-Token und der tatsächlichen Rollen-ID
const token = "MTI2MjQ5NTQzNjM4MDMxMTYzNQ.GKCt1h.rncoeMzoxLnn-aSq_bR0JYjrM83RECyJMDD6XQ";
const adminRoleId = "1247589119375183912";

client.on('ready', () => {
    console.log(`Eingeloggt als ${client.user.tag}!`);

    // Slash-Commands erstellen
    const commands = [
        new SlashCommandBuilder()
            .setName('role')
            .setDescription('Verwaltet Rollen')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('Der Benutzer, dem die Rolle zugewiesen werden soll')
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('Die Rolle, die zugewiesen oder entzogen werden soll')
                    .setRequired(true)
            )
    ];

    client.application.commands.set(commands);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'role') {
        const user = interaction.options.getUser('user');
        const roleNameOrId = interaction.options.getRole('role')?.name || interaction.options.getRole('role')?.id;

        async function getRole(guild, roleNameOrId) {
            // Zuerst nach der ID suchen
            const roleById = guild.roles.cache.get(roleNameOrId);
            if (roleById) return roleById;

            // Wenn keine ID gefunden wurde, nach dem Namen suchen
            const roleByName = guild.roles.cache.find(role => role.name === roleNameOrId);
            return roleByName;
        }

        const role = await getRole(interaction.guild, roleNameOrId);

        if (!role) {
            return interaction.reply('Die angegebene Rolle konnte nicht gefunden werden.');
        }

        // Überprüfe, ob der Benutzer die Admin-Rolle hat
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply('Du hast keine Berechtigung, diese Aktion auszuführen.');
        }

        try {
            // Zusätzliche Überprüfung, um sicherzustellen, dass role.id definiert ist
            if (!role.id) {
                console.error('Fehler: Die Rolle hat keine gültige ID.');
                return interaction.reply('Ein Fehler ist aufgetreten. Bitte versuche es später noch einmal.');
            }

            // Rollenverwaltung mit Fehlerbehandlung und klarer Nachricht
            const hasRole = user.roles.cache.has(role.id);
            await user.roles[hasRole ? 'remove' : 'add'](role);
            await interaction.reply(`Rolle ${role.name} wurde ${hasRole ? 'entfernt' : 'hinzugefügt'}.`);
        } catch (error) {
            console.error('Fehler beim Verwalten der Rolle:', error);
            await interaction.reply('Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktiere einen Administrator.');
        }
    }
});

client.login(token);
