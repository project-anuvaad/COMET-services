const BaseServiceV2 = require('../BaseServiceV2');

class AuthService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }
    
    encryptPassword(passwordText) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + '/encryptPassword', { password: passwordText })
            .then((res) => {
                resolve(res.body);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    generateLoginToken(userId, temp) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + '/generateLoginToken', {userId, temp})
            .then((res) => {
                resolve(res.body);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    refreshToken(token) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + '/refreshToken', { token })
            .then((res) => {
                resolve(res.body);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    decodeToken(token) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + '/decodeToken', { token })
            .then((res) => {
                resolve(res.body);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

}

module.exports = API_ROOT => new AuthService(API_ROOT);
