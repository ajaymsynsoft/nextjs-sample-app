import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/preferances`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const preferanceService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },  
    preferancesList,

};



function preferancesList() {
    return fetchWrapper.get(`${baseUrl}`);
}


