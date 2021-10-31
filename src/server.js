import 'dotenv/config';
import express from 'express';
import UserController from './app/controllers/UserController';
import Queue from './app/lib/Queue';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();

createBullBoard({
    queues: Queue.queues.map(queue => new BullAdapter(queue.bull)),
    serverAdapter
})

const app = express();

app.use(express.json());
app.post('/users', UserController.store);

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3333, () => {
    console.log('Server running on localhost:3333');
});