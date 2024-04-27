import express from 'express';
import chalk from 'chalk';
import { iniciarDB } from './db/db.js';
import { furnitureRouter } from './routers/furnitures.js';
import { customersRouter } from './routers/custormers.js';
import { transaccionRouter } from './routers/transactions.js';

// Initialize the express server
const app = express();
app.use(express.json());
app.use(furnitureRouter);
app.use(customersRouter);
app.use(transaccionRouter);
console.log(chalk.green('[server_initiation] Server started!'));
app.listen(3000);
iniciarDB();