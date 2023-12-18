export const config = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenLife: process.env.ACCESS_TOKEN_LIFE as string,
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE as string,
    postgresUser: process.env.DB_USER as string,
    postgresPassword: process.env.DB_PASSWORD as string,
    postgresDB: process.env.DB_NAME as string,
    postgresHost: process.env.DB_HOST as string,
    postgresPort: parseInt(process.env.POSTGRES_PORT as string,10),

    // ... other configurations ...
};
