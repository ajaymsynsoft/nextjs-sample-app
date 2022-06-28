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
    get: tokenVerify
});

async function tokenVerify(req:Request, res:Response) {
    // split out password from user details 
    const user = await usersRepo.findByToken(req.query.token);
    if (!user) throw new BadRequestError(Global.INVALID_ACCOUNT_TOKEN);  
    new SuccessResponse(Global.ACCOUNT_SUCCESS, {
    }).send(res);
}
