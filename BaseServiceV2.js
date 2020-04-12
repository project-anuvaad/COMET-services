
// const { sanitizeValues, wrapResponse } = require('../utils/helpers')
const superagent = require('superagent');
function wrapResponse(req){
    return new Promise((resolve, reject) => {
        req
            .set('Content-Type', 'application/json')
            .then(res => {
                let response = {}
                if (Array.isArray(res.body) && res.body.length > 0) {
                    response = res.body;
                    response.forEach(item => {
                        item.toObject = function () {
                            return item;
                        }
                    })
                    resolve(response)
                } else if (typeof res.body === 'object') {
                    response = res.body || {};
                    response.toObject = function () {
                        return response;
                    }
                    resolve(response)
                } else {
                    resolve(res.body)
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

function sanitizeValues(values) {
    Object.keys(values).forEach(key => {
        if (!Array.isArray(values[key]) && typeof values[key] === 'object' && values[key]._bsontype && values[key].toString && values[key].toString()) {
            values[key] = values[key].toString();
        }
    });

    return values;
}

class BaseServiceV2 {
    constructor(API_ROOT) {
        this.API_ROOT = API_ROOT;
        this.request = superagent;
    }
    
    find(conditions) {
        if (!conditions) {
            conditions = {};
        }
        const req = superagent.get(this.API_ROOT).query(sanitizeValues(conditions))
        return wrapResponse(req)
    }

    findById(id) {
        const req = superagent.get(this.API_ROOT + '/' + id)
        return wrapResponse(req);
    }

    findOne(query) {
        const req = superagent.get(this.API_ROOT).query({ ...sanitizeValues(query), one: true })
        return wrapResponse(req);
    }

    create(values) {
        const req = superagent.post(this.API_ROOT, sanitizeValues(values))
        return wrapResponse(req);
    }

    update(conditions, keyValMap, options = {}) {

        const req = superagent.patch(this.API_ROOT, {
            conditions: sanitizeValues(conditions),
            values: sanitizeValues(keyValMap),
            options: sanitizeValues(options)
        })
        return wrapResponse(req);
    }
    
    updateMany(conditions, keyValMap, options = {}) {
        return this.update(conditions, keyValMap, { ...options, multi: true });
    }

    updateById(id, keyValMap) {
        return this.update({ _id: id }, keyValMap)
    }

    findByIdAndUpdate(id, keyValMap) {
        return this.updateById(id, keyValMap);
    }


    updateOne(conditions, update) {
        return this.update(conditions, update);
    }

    remove(conditions) {
        const req = superagent.delete(this.API_ROOT, { ...sanitizeValues(conditions) })
        return wrapResponse(req);
    }

    count(conditions) {
        const req = superagent.get(this.API_ROOT + '/count').query({ ...sanitizeValues(conditions) })
        return wrapResponse(req);
    }
}

module.exports = BaseServiceV2;