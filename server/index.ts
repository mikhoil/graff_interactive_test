import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import { readdir } from 'fs';

interface IMessage {
  text: string;
  role: 'user' | 'manager';
  chatId: string;
}

interface INewChatMessage {
  chatId: string;
}

const wsExpress = expressWs(express());
const chats = new Map<string, IMessage[]>();
const app = wsExpress.app;
const wss = wsExpress.getWss();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

app.get('/images', (_, res) => {
  const response: { filename: string }[] = [];
  readdir('./images', (_, files) => {
    files.forEach(filename => response.push({ filename }));
    return res.json(response);
  });
});

app.ws('/', ws => {
  ws.on('message', msg => {
    const data = JSON.parse(msg.toString()) as IMessage | INewChatMessage;
    if ('text' in data) {
      chats.set(data.chatId, [...(chats.get(data.chatId) ?? []), data]);
      wss.clients.forEach(
        client =>
          ((client as any).id === data.chatId || client === ws) && client.send(msg.toString()),
      );
    } else {
      (ws as any).id = data.chatId;
      if (!chats.has(data.chatId)) {
        chats.set(data.chatId, []);
        wss.clients.forEach(client => client.send(msg.toString()));
      }
    }
  });
});

app.get('/chats', async (_, res) => {
  return res.json(Array.from(chats.keys() ?? []));
});

app.get('/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;
  return res.json(chats.has(chatId) ? chats.get(chatId) : []);
});

app.listen(port, () => console.log(`Server started on port ${port}`));

// app.ws('/:chatId', (ws, { params }) => {
//   ws.on('message', msg => {
//     const data = JSON.parse(msg.toString()) as IMessage;
//     if ('text' in data) {
//       if (chats.get(params.chaId)?.length === 0) (ws as any).id = params.chatId;
//       chats.set(params.chatId, [...(chats.get(params.chatId) ?? []), data]);
//       wss.clients.forEach(
//         client =>
//           ((client as any).id === params.chatId || client === ws) &&
//           client.send(msg.toString()),
//       );
//     }
//   });
// });

// app.ws('/chats', ws => {
//   ws.on('message', msg => {
//     const data = JSON.parse(msg.toString()) as INewChatMessage;
//     if (!chats.has(data.chatId) && !('text' in data)) {
//       chats.set(data.chatId, []);
//       wss.clients.forEach(client => client.send(msg.toString()));
//     }
//   });
// });