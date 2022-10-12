import 'dotenv/config';

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

export const env = { token, clientId, guildId };
