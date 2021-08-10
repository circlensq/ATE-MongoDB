const formidable = require("formidable");
const fs = require('fs')
const JSZip = require("jszip");
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const mongoUtil = require("../src/mongoUtil");
const db = mongoUtil.getDb()
const { ObjectId } = require('mongodb')
const ate_files = db.collection('ate_files')

const upload = (req, res) => {
    // formidable : to parse html form data
    const form = new formidable.IncomingForm({ multiples: true, maxFileSize: 10 * 1024 * 1024 * 1024 })
    const d = new Date();

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Error parsing the files");
            console.log(err);
            return res.status(400).json({
                message: "There was an error parsing the files",
                status: "Fail",
                error: err
            })
        }
        for (let file in files) {
            try {
                if (files[file]) {
                    let oldPath = files[file]['path']
                    let rawData = fs.readFileSync(oldPath)

                    const month = parseInt(d.getMonth() + 1) < 10 ? '0' + parseInt(d.getMonth() + 1) : parseInt(d.getMonth() + 1)
                    const date = parseInt(d.getDate()) < 10 ? '0' + parseInt(d.getDate()) : parseInt(d.getDate())

                    let today = `${d.getFullYear()}_${month}_${date}`
                    let folderPath = __basedir + `\\media\\uploads\\storage\\${today}\\`;
                    // folderPath = ..\dashboard-v2.0\server\\media\uploads\storage\\2021_06_18\\

                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, {
                            recursive: true
                        });
                    }

                    // newPath =..\dashboard-v2.0\server\\media\uploads\storage\\2021_06_18\\WIN.jpg
                    let newPath = folderPath + files[file]['name']
                    let databasePath = `storage/${today}/${files[file]['name']}`;
                    let filename =  files[file]['name'] // example_files.zip

                    if (fs.existsSync(newPath)){
                        // if file is existed then add Date.now()
                        let time =  Date.now()
                        let filenameSplit = filename.split('.')
                        
                        filename = filenameSplit[0] + '_' + time + '.' + filenameSplit[1] 
                        // filename = WIN_1626750408096.jpg

                        newPath = folderPath + filename
                        databasePath = `storage/${today}/${filename}`;
                    }
                    
                    fs.writeFile(newPath, rawData, async (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({ "err": err })
                        }

                        const userToken = jwt.verify(fields.user, config.TOKEN_SECRET)

                        const newFiles = {
                            filename: filename,
                            user_id: ObjectId(userToken.id),
                            filepath: databasePath,
                            added_time: Date.now(),
                        }

                        const result = await db.collection("ate_files").insertOne(newFiles)
                        console.log(`Created with the following id: ${result.insertedId}`)
                        console.log(`Successfull upload ${newPath}`);
                    })
                }
            } catch (err) {
                console.log(`Error: ${err}`);
                return res.status(409).send({ "error": `${err}` })
            }
        }
        
        return res.status(200).send({ "message": "Successfully uploadded the files" })
    })

}

const getAll = async (req, res) => {
    try {
        await ate_files.aggregate([
            {
                $lookup:
                {
                    from: "auth_users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ]).sort({ added_time: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'files': result })
        });
    }
    catch (err) {
        console.log('Error Find Files: ', err);
    }
}

const deleteFile = (req, res) => {
    const ids = req.body.deleteId
    ids.forEach(async id => {
        try {
            const result = await ate_files.findOne({ _id: ObjectId(id)})
            
            const directoryPath = __basedir + "media/uploads/" + result.filepath

            // delete a file
            fs.unlink(directoryPath, (err) => {
                if (err) {
                    throw err;
                }
                console.log("File is deleted.");
            })

            // delete data
            await ate_files.deleteOne(
                {
                    _id: ObjectId(id)
                }
            ).then((err) => {
                if (err) throw err;
            });
        } catch (err) {
            console.log('Error Delete File: ', err);
            return res.status(200).send({ 'error': err })
        }
    })
    return res.status(200).send({ 'message': 'Delete is succesful' })
}

const download = async (req, res) => {
    const files = req.body.files

    let zip = new JSZip();

    for (let id of files) {
        const testQuery = {
            _id: ObjectId(id),
        }

        let result = await db.collection("ate_files").findOne(testQuery)
        let directoryPath = __basedir + "media/uploads/" + result.filepath
        let singleFilename = result.filename
        // Read the file and put inside zip
        zip = await readSingleFile(directoryPath, singleFilename, zip)
    }

    const zipAsBase64 = await zip.generateAsync({ type: "base64" })

    return res.status(200).send({
        "zip64": zipAsBase64
    })
}

const readSingleFile = async (directoryPath, singleFilename, zip) => {

    const fsPromises = require('fs').promises;
    const data = await fsPromises.readFile(directoryPath)
        .catch((err) => console.error('Failed to read file', err));

    zip.file(
        singleFilename,
        data
    );
    return zip
}

module.exports = {
    upload,
    getAll,
    deleteFile,
    download
}