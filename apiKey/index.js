const BaseServiceV2 = require('../BaseServiceV2');

class ApiKeyService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }

    generateApiKey() {
        return new Promise((resolve, reject) => {
            this.request.get(this.API_ROOT + '/generateApiKey' )
            .then((res) => {
                resolve(res.body);
            })
            .catch(err => {
                reject(err);
            })
        })
    }

}

module.exports = (API_ROOT) =>  new ApiKeyService(API_ROOT);