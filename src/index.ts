import Client from './client';

const validate = () => {
    let level = 0;

    console.log("Validating Enviroment Variables...");

    let incorrectClientToken = 0;
    if (!process.env.CLIENT_TOKEN) {
        console.log("> Missing 'CLIENT_TOKEN' variable.");
        level++;
    } else {
        const tokenRegex = /(mfa\.[\w-]{84}|[\w-]{24}\.[\w-]{6}\.[\w-]{27})/;
        const valid = tokenRegex.test(process.env.CLIENT_TOKEN);

        if (!valid) {
            console.log("> Variable 'CLIENT_TOKEN' is invalid.");
            level++;
            incorrectClientToken++;
        }
    }

    if (!process.env.GUILD_ID) {
        console.log("> Missing 'GUILD_ID' variable.");
        level++;
    }

    if (level == 0) return true
    else            return false
}

if (validate()) {
    console.log("> Successfully validated Enviroment Variables");

    const client = new Client()
    client.init()
}