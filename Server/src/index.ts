import express from 'express'
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { resolve } from "path";
import cors from "cors";

import { routes } from './app'
import { server } from './server'

const app = express()
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' }, maxHttpBufferSize: 1e8, pingTimeout: 60000 });


app.use(cors());
app.use(express.static(resolve("./dist/honours-project")))

routes(app)
server(io)

const port_num = http.listen(process.env.PORT || 3001, () => { console.log(`listening on port ${3001}`) })
app.listen(4000)