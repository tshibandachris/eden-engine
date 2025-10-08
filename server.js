
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import matchesRouter from './routes/matches.js';
import matchRouter from './routes/matchDetails.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', matchesRouter);
app.use('/api', matchRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Eden Engine backend running on port ${PORT}`));
