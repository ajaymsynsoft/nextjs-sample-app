import _ from 'lodash';
import { apiHandler, usersRepo } from 'helpers/api';
import { createTokens, getAccountActivationToken } from '../../../auth/authUtils';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { Response,Request } from 'express';
import Global from '../../../global';
import getConfig from 'next/config';
import bcrypt from 'bcryptjs';


export default apiHandler({
    post: accountActivation
});

async function accountActivation(req:Request, res:Response) {
    // split out password from user details 
    const user = await usersRepo.findByToken(req.body.token);
    if (!user) throw new BadRequestError(Global.INVALID_ACCOUNT_TOKEN);
    let salt = bcrypt.genSaltSync(10);
    let password = bcrypt.hashSync(req.body.password, salt);
    await usersRepo.activateAccount(user, password);
    new SuccessResponse(Global.ACCOUNT_SUCCESS, {
    }).send(res);
}
