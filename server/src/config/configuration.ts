import 'dotenv/config';

export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});
