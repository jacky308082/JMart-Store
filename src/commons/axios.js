import _axios from 'axios'

const axios = baseURL => {
    
    const url = (process.env.NODE_ENV === 'development') 
    ? 'http://localhost:3003'
    : 'https://react-store-api-l13ugzw41.now.sh';

    const instance = _axios.create({
        baseURL: 
            baseURL || url || 'http://localhost:3003',
        timeout:1000
    });

    instance.interceptors.request.use(
        config => {
            const jwToken = global.auth.getToken();
            config.headers['Authorization'] = 'Bearer ' + jwToken
            // Do something before request is sent
            return config;
    }, (error) => {
        return Promise.reject(error) 
    })  

    return instance;
}

export {axios}
export default axios();