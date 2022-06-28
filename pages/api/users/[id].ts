const bcrypt = require('bcryptjs');

import { apiHandler } from 'helpers/api';
import { usersRepo, omit , PreferenceRepo} from 'helpers/api';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { Response,Request } from 'express';
import Global from '../../../global';
import _ from "lodash";

export default apiHandler({
    get: getById,
    put: update,   
});

async function getById(req:Request, res:Response) {
    console.log(req.path);
    const user = await usersRepo.getUserProfile(req.query.id);

    if (!user) throw new BadRequestError(Global.USER_NOT_FOUND);  

    return res.status(200).json(omit(user, 'password'));

}

async function update(req:Request, res:Response) {
    const user = await usersRepo.getUserProfile(req.query.id);

    if (!user)throw new BadRequestError(Global.USER_NOT_FOUND);  

    // split out password from user details 
    const { password, ...params } = req.body;

    // validate
    if (user.email !== params.email && await usersRepo.findByEmail(params.email))
        throw `User with the email "${params.email}" already exists`;

    // only update hashed password if entered
    if (password) {
        user.hash = bcrypt.hashSync(password, 10);
    }

   const paramsUser=_.clone(params); 
   delete paramsUser.preferences;
   await usersRepo.update(req.query.id, paramsUser);

   await PreferenceRepo.updateUserPreferences(params.preferences,req.query.id)

    return res.status(200).json(user);
}
