const BaseServiceV2 = require('../BaseServiceV2');

class UserService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }
    
    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.request.get(this.API_ROOT + '/by_email').query({ email })
            .then(res => {
                resolve(res.body)
            })
            .catch(reject);
        })
    }
}

module.exports = API_ROOT => new UserService(API_ROOT);
