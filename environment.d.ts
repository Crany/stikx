declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_TOKEN: string | undefined;
            GUILD_ID: string | undefined;
            DB_TOKEN: string | undefined;
            ENCRYPTION_KEY: string | undefined;
            BASE_URL: string | undefined;
            ENVIRONMENT: "dev" | "production" | "debug";
        }
    }
}

export {};