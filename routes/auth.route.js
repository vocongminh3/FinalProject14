import {readFile} from 'fs/promises';
import express from 'express';
import jwt from 'jsonwebtoken'
import randomstring from 'randomstring';

import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';


const router = express.Router();


// Đăng nhập vào hệ thống và nhận lại accesstoken và refreshtoken
router.post('/',  async function (req, res)
{
    const user = await userModel.findByUsername(req.body.username);

    if (user == null)
    {
        return res.status(401).json({
            authenticated : false
        });
    }

    if (bcrypt.compareSync(req.body.password, user.password) == false){
        return res.status(401).json({
            authenticated : false
        });
    }


    const payload = {
        userId : user.user_id,
        roleId : user.role_id,
    }

    const opts = {
        expiresIn: 10 * 60
    }

    const accessToken = jwt.sign(payload, 'SECRET_KEY', opts);


    const refreshToken = randomstring.generate(80);

    await userModel.patch(user.user_id, {
        rftoken: refreshToken
    });

    res.json({
        authenticated : true,
        accessToken,
        refreshToken
    })

});



// Refresh lại accesstoken
router.post('/refresh', async function (req, res)
{
    const { accessToken, refreshToken } = req.body;
    
    
    try {

        const opts = {
            ignoreExpiration: true
        };

        const {userId, roleId} = jwt.verify(accessToken, 'SECRET_KEY', opts);


        const ret = await userModel.isValidRefreshToken(userId, refreshToken);

        console.log('refreshToken: ' + ret);
        
        if (ret === true){
            const newAccessToken = jwt.sign({userId, roleId}, 'SECRET_KEY', {expiresIn: 600});
            return res.status(200).json({
                accessToken: newAccessToken
            })
        }


        return res.status(401).json({
            message: 'RefreshToken is revoked.'
        })

    } catch(err){
        console.error(err);
        return res.status(401).json({
            message: 'Invalid accessToken.'
        })
    }
});

export default router