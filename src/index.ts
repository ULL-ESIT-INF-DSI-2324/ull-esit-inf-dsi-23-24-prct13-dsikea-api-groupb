import express from 'express';
import chalk from 'chalk';
import { iniciarDB } from './db/db.js';
import { furnitureRouter } from './routers/furnitures.js';
import { customersRouter } from './routers/custormers.js';
import { providersRouter } from './routers/providers.js';
import { transaccionRouter } from './routers/transactions.js';

// Initialize the express server
export const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(furnitureRouter);
app.use(providersRouter);
app.use(customersRouter);
app.use(transaccionRouter);
console.log(chalk.green('[server_initiation] Server started!'));
app.listen(port);
iniciarDB();