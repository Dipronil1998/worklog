import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToMongoDB from './db/connectToMongoDB';
import { pageNotFound } from './utils/pageNotFound';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/project.routes'
import worklogRoutes from './routes/worklog.routes'
import taskRoutes from './routes/task.routes'
import path from 'path';
const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
dotenv.config()
const port = process.env.PORT || 3000;
app.use(cookieParser());

const uploadDirectory = path.join(__dirname, "..",'uploads');
app.use('/uploads', express.static(uploadDirectory));

app.get('/', (req:Request, res:Response)=>{
  res.send('index1')
})

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/worklog", worklogRoutes);
app.use("/api/task", taskRoutes);
app.use(pageNotFound);
app.use(errorHandler);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running at http://localhost:${port}`);
});
