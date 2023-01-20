const fs = require('fs');


async function getFileListFromJSON(file) {
    console.log(file, "inside")
    const fileList = await fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return null;
        }
        return data;
    });
    return fileList;

}

module.exports = { getFileListFromJSON }
