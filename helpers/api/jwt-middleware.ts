var { expressjwt: jwt } = require("express-jwt");
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/register',
            '/api/users/authenticate',
            '/api/users/tokenVerify',
            '/api/users/accountActivation',
            '/api/users/forgotPassword',
            '/api/users/resetPassword',
            '/api/users/preferances',
            
        ]
    });

    return util.promisify(middleware)(req, res);
}