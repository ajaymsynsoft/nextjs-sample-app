import _ from 'lodash';
import { apiHandler, usersRepo } from 'helpers/api';
import { createTokens, getAccountActivationToken } from '../../../auth/authUtils';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { Response,Request } from 'express';
import Global from '../../../global';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default apiHandler({
    post: register
});

async function register(req:Request, res:Response) {
    // split out password from user details 
    let { ...user } = req.body;
    const userData=await usersRepo.findByEmail(user.email);
    // validate
    if (userData) throw new BadRequestError(Global.USER_ALREADY_REGISTERED);
    if(user.dob==""){
        user.dob=null;
    }else{
        user.dob= new Date(user.dob);
    }

    const createdUser = await  usersRepo.create(user);

    const tokens = await createTokens(createdUser);
    const accountActivationTokens = await getAccountActivationToken(createdUser);


    new SuccessResponse(Global.SIGNUP_SUCCESS, {
        user: _.pick(createdUser, ['_id', 'name', 'email']),
        tokens: tokens,
        "account-actiation-url":publicRuntimeConfig.homeUrl+'/account/account-activation?token=' + accountActivationTokens,
        "account-actiation":'/account/account-activation?token=' + accountActivationTokens
    }).send(res);
}
