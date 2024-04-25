import express from 'express';
import chalk from 'chalk';
import { iniciarDB } from './db/db.js';
import { userRouter } from './routers/user.js'
import { cardRouter } from './routers/card.js'

// Initialize the express server
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(cardRouter);
console.log(chalk.green('[server_initiation] Server started!'));
app.listen(3000);
iniciarDB();