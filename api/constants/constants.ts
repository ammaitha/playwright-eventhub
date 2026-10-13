declare const process: {
    env: Record<string, string | undefined>;
};

function requiredEnvironmentVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const CONSTANTS = {
    API_BASE_URL: "https://api.eventhub.rahulshettyacademy.com/api/",
    WEB_BASE_URL: "https://eventhub.rahulshettyacademy.com",
    LOGIN_URL: "https://eventhub.rahulshettyacademy.com/login",
    AUTH_STORAGE_KEY: "eventhub_token",
    get EMAIL(): string {
        return requiredEnvironmentVariable("EVENTHUB_EMAIL");
    },
    get PASSWORD(): string {
        return requiredEnvironmentVariable("EVENTHUB_PASSWORD");
    },
}