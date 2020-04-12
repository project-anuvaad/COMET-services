const superagent = require('superagent');

module.exports = (API_ROOT) =>  {
    function send(content, callback) {
        superagent.post(API_ROOT, content)
            .then((res) => {
                callback(null, res.body)
            })
            .catch(err => {
                callback(err);
            })
    }

    return {
        send,
    }
}