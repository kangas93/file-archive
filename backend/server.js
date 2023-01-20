const { getFileListFromJSON } = require('./utils');
const fs = require('fs');
const express = require('express')
const path = require('path')
const multer = require('multer')
const cors = require('cors');
const fileUpload = require('express-fileupload')

const server = express()
const port = 8000

server.use(cors())
server.use(
    fileUpload({
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        tempFileDir: `${__dirname}/../public/files/temp`
    })
);



server.get('/getFiles', (req, res) => {
    const filePath = path.resolve("./backend/data.json")
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.json([])
        }
        res.json(JSON.parse(data))
    });
});



server.post('/upload', (req, res) => {
    const author = `${req.body.author}`
    const description = `${req.body.description}`
    const uploadFile = req.files.file;

    const name = uploadFile.name;
    const saveAs = `${uploadFile.md5}_${name}`;
    uploadFile.mv(`${__dirname}/../public/files/${saveAs}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
    });

    let fileObject = { id: saveAs, author: author, description: description, date: Date() }
    const filePath = path.resolve("./backend/data.json")
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            fs.writeFile('data.json', JSON.stringify([fileObject]), 'utf-8', function (error) {
                if (error) throw error;
                console.log('Created new file');
                return res.status(200).json({ status: 'uploaded', name, saveAs });
            });
        }
        else {
            jsonData = JSON.parse(data);
            jsonData.push(fileObject);
            fs.writeFile('data.json', JSON.stringify(jsonData), 'utf-8', function (error) {
                if (error) throw error;
                console.log('Appended file list');
                return res.status(200).json({ status: 'uploaded', name, saveAs });
            });
        }
    });

})


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

