import cors from 'cors';
import express from 'express';
import expressWS from 'express-ws';
import { readdir } from 'fs';

const ws = expressWS(express());
const app = ws.app;
const wss = ws.getWss();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static('images'));

app.ws('/', (ws, _) => {
  ws.on('message', msg => {
    wss.clients.forEach(client => client.send(msg.toString()));
    fetch('http://localhost:4001/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: msg.toString(),
    });
  });
});

app.get('/images', (_, res) => {
  const response: { filename: string }[] = [];
  readdir('./images', (_, files) => {
    files.forEach(filename => response.push({ filename }));
    return res.json(response);
  });
});

app.get('/messages', async (_, res) => {
  const response = await fetch('http://localhost:4001/messages');
  const data = await response.json();
  return res.json(data);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
