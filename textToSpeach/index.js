const superagent = require('superagent');
const fs = require('fs')

module.exports = TEXT_TO_SPEECH_SERVICE_API_ROOT => {
    function convertTextToSpeech({ speakersProfile, speakerNumber, langCode, text, outputFormat }, targetPath) {
        return new Promise((resolve, reject) => {
            superagent.post(TEXT_TO_SPEECH_SERVICE_API_ROOT, { speakersProfile, speakerNumber, langCode, text, outputFormat })
                .then((res) => {
                    fs.writeFile(targetPath, res.body, (err) => {
                        if (err) return reject(err);
                        return resolve(targetPath);
                    })
                })
                .catch(reject)
        })
    }
    
    return  {
        convertTextToSpeech
    }
}
