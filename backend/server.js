const fs = require('fs');
const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload')

const server = express()
const port = 8000

const fileListPath = `${__dirname}/files/data.json`

server.use(cors())
server.use(
    fileUpload({
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
        tempFileDir: `${__dirname}/files/temp`
    })
);



server.get('/getFiles', (req, res) => {
    fs.readFile(fileListPath, 'utf8', (err, data) => {
        if (err) {
            return res.json([])
        }
        return res.json(JSON.parse(data))
    });
});

server.get('/file/:id', (req, res) => {
    const id = req.params.id

    fs.readFile(fileListPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ status: 'fileNotFound' });
        }
        file = JSON.parse(data).find((file) => {
            return file.id === id
        })
        if (file) {
            return res.download(`${__dirname}/files/${id}`, file.name, (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error' });
                }
            })
        }
        return res.status(404).json({ status: 'fileNotFound' });
    });
})

server.delete('/delete/:id', (req, res) => {
    const id = req.params.id

    fs.readFile(fileListPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ status: 'fileNotFound' });
        }
        file = JSON.parse(data).find((file) => {
            return file.id === id
        })
        if (file) {
            fs.unlink(`${__dirname}/files/${id}`, function (err) {
                if (err) return res.status(500).json({ status: "error", id });;
                newFileList = JSON.parse(data).filter((file) => {
                    return file.id !== id
                });

                fs.writeFile(fileListPath, JSON.stringify(newFileList), 'utf-8', function (error) {
                    if (error) throw error;
                    return res.status(200).json({ status: "deleted", id });
                });
            });
        }
    });
})



server.post('/upload', (req, res) => {

    const author = `${req.body.author}`
    const description = `${req.body.description}`
    const fileType = `${req.body.fileType}`
    const newName = req.body?.newName ? `${req.body?.newName}` : null;
    const uploadFile = req.files.file;
    const name = newName ? newName + '.' + fileType : uploadFile.name;
    const saveAs = `${uploadFile.md5}_${name}`;
    uploadFile.mv(`${__dirname}/files/${saveAs}`, function (err) {
        if (err) {
            return res.status(500).json({ status: 'error', name, id: saveAs });
        }
    });

    let fileObject = { id: saveAs, fileType: fileType, name: name, author: author, description: description, date: (new Date()).toLocaleDateString() }

    fs.readFile(fileListPath, 'utf8', (err, data) => {
        if (err) {
            fs.writeFile(fileListPath, JSON.stringify([fileObject]), 'utf-8', function (error) {
                if (error) res.status(500).json({ status: 'error', name, id: saveAs });
                return res.status(200).json({ status: 'uploaded', name, id: saveAs });
            });
        }
        else {
            fileList = JSON.parse(data);
            duplicateFile = fileList.find((file) => {
                return file.id === fileObject.id
            })
            if (duplicateFile === undefined || duplicateFile === null) {
                fileList.push(fileObject);
                fs.writeFile(fileListPath, JSON.stringify(fileList), 'utf-8', function (error) {
                    if (error) res.status(500).json({ status: 'error', name, id: saveAs });
                    return res.status(200).json({ status: 'uploaded', name, id: saveAs });
                });
            }
            else {
                return res.status(200).json({ status: 'duplicate', name, id: saveAs });
            }

        }
    });

})


server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

