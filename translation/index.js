const superagent = require('superagent');

module.exports = TRANSLATION_SERVICE_API_ROOT => {
    function translateText(text, targetLang) {
        return new Promise((resolve, reject) => {
            superagent.post(TRANSLATION_SERVICE_API_ROOT, { text, to: targetLang })
                .then((res) => {
                    resolve(res.body.translatedText);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    return {
        translateText,
    }
}
