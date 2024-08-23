import 'dotenv/config';

console.log(process.env.PORT);

export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});
