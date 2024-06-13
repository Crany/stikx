declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_TOKEN: string | undefined;
            GUILD_ID: string | undefined;
        }
    }
}

export {};