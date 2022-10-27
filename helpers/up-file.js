const path = require('path')
const { v4: uuidv4 } = require('uuid');

const upFile = (files, validExt = ['png', 'jpg', 'jpeg', 'gif'], subCarpet = '') => {

    return new Promise((resolve, reject) => {

        const { archive } = files;


        const cutName = archive.name.split('.')
        const ext = cutName[cutName.length - 1]

        if (!validExt.includes(ext)) {
            return reject(`La extension ${ext} no es permitida, ${validExt} solo son validos.`)
        }

        const temporalName = uuidv4() + '.' + ext

        const uploadPath = path.join(__dirname, '../uploads/', subCarpet, temporalName);

        archive.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve(temporalName)
        });

    })

}

module.exports = {
    upFile
}