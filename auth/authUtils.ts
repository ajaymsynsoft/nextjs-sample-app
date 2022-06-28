import { AuthFailureError } from '../core/ApiError';
import getConfig from 'next/config';
import { apiHandler, usersRepo } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();
import jwt from 'jsonwebtoken';
import Global from '../global';

/**
  * Objective: This function will retrive the access token from the header
  * @param authorization 
  * @returns authorization token
  */
export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError(Global.INVALID_AUTHORIZATION);
    if (!authorization.startsWith('Bearer ')) throw new AuthFailureError(Global.INVALID_AUTHORIZATION);
    return authorization.split(' ')[1];
};

/**
  * Objective: This function creates JWT token based on user information passed
  * @param user 
  * @returns accessToken
  */
export const createTokens = async (
    user: any
): Promise<any> => {
    const accessToken = await jwt.sign(user, serverRuntimeConfig.secret, {
        expiresIn: 24 * 60 * 60 //tokenInfo.accessTokenValidityDays,
    });
    user["token"]=accessToken;
    return user as any;
};

/**
  * Objective: This function generates account activation token
  * @param user 
  * @returns token
  */
export const getAccountActivationToken = async (user: any) => {
    let token = generateAccountActivationToken();
    await usersRepo.addAccountActivationToken(user.id, token);
    return token;
}

/**
  * Objective: This function returns a random token based on calculation
  * @returns token
  */
export const generateAccountActivationToken = () => {
    let d = new Date().getTime();
    let token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return token;
}
