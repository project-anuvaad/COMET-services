const BaseServiceV2 = require('../BaseServiceV2');

class WebsocketsService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }

    emitEvent({ email, _id, room, event, data }) {
        this.request.post(this.API_ROOT, { email, _id, room, event, data })
        .then((res) => {
            console.log(res.body);
        })
        .catch(err => {
            console.log(err);
        })
    }
}

module.exports = API_ROOT =>  new WebsocketsService(API_ROOT);