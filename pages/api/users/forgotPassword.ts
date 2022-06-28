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
    post: forgotPassword
});

async function forgotPassword(req:Request, res:Response) {
    const user = await usersRepo.findByEmail(req.body.email);
        if (!user) {
            throw Error(Global.USER_NOT_FOUND);
        }
        if (!user.active) {
            throw Error(Global.USER_NOT_ACTIVE);
        }
        const resetPasswordTokens = await getAccountActivationToken(user);

        new SuccessResponse(Global.RESET_SUCCESS, {
            user: _.pick(user, ['_id', 'name', 'email']),
            "reset-password-url": publicRuntimeConfig.homeUrl+'/account/reset-password?token=' + resetPasswordTokens,
            "reset-password": '/account/reset-password?token=' + resetPasswordTokens
        }).send(res);
}
