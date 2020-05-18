import http from 'http';
import AppModule from './app.module';

const port = process.env.PORT || 3000;

const server = http.createServer(AppModule.app);
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
