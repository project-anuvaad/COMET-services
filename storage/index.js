
const superagent = require('superagent');
module.exports = (API_ROOT) => {
    function saveFile(directoryName, fileName, fileStream) {
        return new Promise((resolve, reject) => {
            superagent.post(API_ROOT)
                .field('directoryName', directoryName)
                .field('fileName', fileName)
                .attach('file', fileStream)
                .then((res) => {
                    resolve(res.body);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    function deleteFile(directoryName, fileName) {
        return new Promise((resolve, reject) => {
            let Key = fileName ? `${directoryName}/${fileName}` : directoryName;
            superagent.delete(`${API_ROOT}/${Key}`)
                .then((res) => {
                    resolve(res.body);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    function getFile(directoryName, fileName) {
        return false;
    }

    function getDirectoryFiles(directoryName) {
        return false;
    }

    return {
        getFile,
        saveFile,
        deleteFile,
        getDirectoryFiles,
    }
}