const websockets = require('../websockets')

const BaseServiceV2 = require('../BaseServiceV2');

class NotificationService extends BaseServiceV2 {
    constructor({ API_ROOT, WEBSOCKETS_API_ROOT }) {
        super(API_ROOT);
        if (WEBSOCKETS_API_ROOT) {
            this.websockets = websockets(WEBSOCKETS_API_ROOT);
        }
    }

    notifyUser({ email, _id, organization }, data) {
        return new Promise((resolve, reject) => {
            let notificationDoc;
            this.create(data)
                .then((n) => {
                    notificationDoc = n.toObject();
                    if (email) {
                        this.websockets.emitEvent({ email, event: 'NEW_NOTIFICATION', data: { notification: notificationDoc } })
                    } else if (_id) {
                        this.websockets.emitEvent({ _id, event: 'NEW_NOTIFICATION', data: { notification: notificationDoc } })
                    }
                    resolve(notificationDoc);
                })
                .catch(reject);
        })
    }
}


module.exports = ({ API_ROOT, WEBSOCKETS_API_ROOT }) => new NotificationService({ API_ROOT, WEBSOCKETS_API_ROOT });