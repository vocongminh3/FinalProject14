import {readFile} from 'fs/promises';
import userModel from '../models/user.model.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();


// Đăng ký tài khoản users.
router.post('/', async function (req, res)
{
    let user = req.body;

    user.password = bcrypt.hashSync(user.password, 10)

    const ret = await userModel.add(user);


    user = {
        user_id: ret[0],
        ...user
    }

    delete user.password;

    res.status(201).json(user);
});

export default router