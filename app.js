import express from 'express';
import cors from 'cors';


import userRouter from './routes/user.route.js';
import auth from './middle_wares/auth.mdw.js'
import authRouter from './routes/auth.route.js';

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());
app.use(cors(
    {
        origin: '*',
        methods: 'GET,PATCH,POST,DELETE'
    }
));


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})