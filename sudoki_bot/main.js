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
      .setDescription('Vergibt oder entzieht eine Rolle')
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
    const role = interaction.options.getRole('role');

    // Überprüfe, ob der Benutzer die Admin-Rolle hat
    if (!interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply('Du hast keine Berechtigung, diese Aktion auszuführen.');
    }

    try {
      // Sicherstellen, dass wir ein GuildMember-Objekt haben
      const member = await interaction.guild.members.fetch(user.id);

      const hasRole = member.roles.cache.has(role.id);
      await member.roles[hasRole ? 'remove' : 'add'](role);
      await interaction.reply(`Rolle ${role.name} wurde ${hasRole ? 'entfernt' : 'hinzugefügt'}.`);
    } catch (error) {
      console.error('Fehler beim Verwalten der Rolle:', error);
      await interaction.reply('Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktiere einen Administrator.');
    }
  }
});

client.login(token);
