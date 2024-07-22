import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export default function SocketHandle(io: Server) {
  io.on('connection', (socket) => {
    socket.on('creatorjoin', (token) => {
      if (!token) {
        socket.emit('code', 'UNAUTHORIZED');
      }
      try {
        jwt.verify(token, process.env.SECRET);
        socket.join('creator');
        socket.emit('code', 'SUCCESS');
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          socket.emit('code', 'NEED_REFRESH');
        } else {
          socket.emit('code', 'UNAUTHORIZED');
        }
      }
    });
    socket.on('creator message', (data, token) => {
      console.log('크리에이터로부터 받은 메시지:', data);
      if (!token) {
        socket.emit('code', 'UNAUTHORIZED');
      }
      try {
        const userdata = <any>jwt.verify(token, process.env.SECRET);
        io.emit('message', {
          id: userdata.id,
          message: data,
        });
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          socket.emit('code', 'NEED_REFRESH');
        } else {
          socket.emit('code', 'UNAUTHORIZED');
        }
      }
    });
    socket.on('user message', (user, data) => {
      console.log(user + ' 유저로부터 받은 메시지:', data);
      io.to('creator').emit('message', user, data);
    });
  });
}
