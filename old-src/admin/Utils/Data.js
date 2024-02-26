/*
 * Import local dependencies
 */

import Axios from 'axios';
import { notification } from 'antd';

const apibaseUrl = `${boilerplateParams.restApiUrl}TinySolutions/boilerplate/v1/boilerplate`;

/*
 * Create a Api object with Axios and
 * configure it for the WordPRess Rest Api.
 */
const Api = Axios.create({
    baseURL: apibaseUrl,
    headers: {
        'X-WP-Nonce': boilerplateParams.rest_nonce
    }
});

export const notifications = ( isTrue, text ) => {
    const message = {
        message: text, //response.data.message,
        placement: 'topRight',
        style: {
            marginTop: '10px',
        },
    }
    if( isTrue ){
        notification.success( message );
    } else {
        notification.error(message );
    }
}

export const updateOptins = async (  prams ) => {
    const response = await Api.post(`/updateoptins`, prams );
    notifications( 200 === response.status && response.data.updated, response.data.message );
    return response;
}

export const getOptions = async () => {
    return await Api.get(`/getoptions`);
}

