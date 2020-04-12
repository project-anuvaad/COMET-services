const BaseServiceV2 = require('../BaseServiceV2');

class SocketConnectionService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }
}
module.exports = API_ROOT => new SocketConnectionService(API_ROOT);