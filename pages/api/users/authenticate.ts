import _ from 'lodash';
import { apiHandler, usersRepo } from 'helpers/api';
import { Response,Request } from 'express';
import Global from '../../../global';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { createTokens, getAccountActivationToken } from '../../../auth/authUtils';
import bcrypt from 'bcryptjs';

export default apiHandler({
    post: authenticate
});

async function authenticate(req:Request, res:Response) {
    const { username, password } = req.body;
    const user = await usersRepo.findByEmail(username);
    if (!user) {
        throw  new BadRequestError(Global.USER_NOT_REGISTERED);
    }
       // validate
    if (user && !user.active) {
        throw  new BadRequestError(Global.USER_NOT_ACTIVE);
    }

    // validate
    if (!(user && bcrypt.compareSync(password, user.password))) {
        throw  new BadRequestError(Global.AUTH_FAILURE);
    }

  
    await createTokens(user);   
    
    new SuccessResponse(Global.LOGIN_SUCCESS, {
        user: _.pick(user, ['id', 'name', 'email',"token","dob"]),
     
    }).send(res);
}
