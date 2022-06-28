import _ from 'lodash';
import { apiHandler, usersRepo ,PreferenceRepo} from 'helpers/api';
import { createTokens, getAccountActivationToken } from '../../../auth/authUtils';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { Response,Request } from 'express';
import Global from '../../../global';
import getConfig from 'next/config';


const { publicRuntimeConfig } = getConfig();

export default apiHandler({
    get: preferances,
});

async function preferances(req:Request, res:Response) {
    const prefernces = await PreferenceRepo.getAllPreferences();
        new SuccessResponse(Global.PREFERENCE_LIST,prefernces).send(res);
}
