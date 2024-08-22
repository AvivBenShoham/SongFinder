
export default () => ({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    database: { 
        host: process.env.HOST || 'localhost',
        port: process.env.PORT ? parseInt(process.env.PORT) : 5432,
    }
})