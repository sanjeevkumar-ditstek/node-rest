import App from './app';
const PORT = process.env.PORT || 3000;
new App(Number(PORT)).listen();
