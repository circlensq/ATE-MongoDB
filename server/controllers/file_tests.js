const formidable = require('formidable')
const fs = require('fs')
const JSZip = require("jszip");
const { ObjectId } = require('mongodb');
// MongoDB Connection
const mongoUtil = require('../src/mongoUtil')
const db = mongoUtil.getDb()

const upload = (req, res, next) => {
    const form = new formidable.IncomingForm({ multiples: true })
    form.parse(req, (err, fields, files) => {

        const files_arr = ['data', 'log', 'comport', 'telnet']

        for (let i = 0; i < files_arr.length; i++) {

            let obj_files = `${files_arr[i]}` + '_txt_filename'
            let obj_fields = `${files_arr[i]}` + '_txt_path'

            try {

                if (files[obj_files]) {
                    let oldPath = files[obj_files]['path']
                    let rawData = fs.readFileSync(oldPath)

                    let split = fields[obj_fields].substring(1, fields[obj_fields].length).split('\\')
                    let folderPath = __basedir + `/media/uploads/docs/${split[2]}/${split[4]}/${split[5]}/`;
                    // folderPath = ../ATE-MongoDB/server/media/uploads/docs/Data/Dotboard/2021_006_18/

                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, {
                            recursive: true
                        });
                    }

                    // newPath =../ATE-MongoDB/server/media/uploads/docs/Data/Dotboard/DB825083y869_202106181344.txt
                    let newPath = folderPath + files[obj_files]['name']

                    fs.writeFile(newPath, rawData, (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({ "err": err })
                        }
                        console.log(`Successful upload ${newPath}`);
                    })
                }
            } catch(err) {
                console.log(`Error: ${err}`);
            }

        }

        return res.status(200).send({ "message": "Successfully uploaded the files" })
    })
}

const converter = (req, res, next) => {
    const form = new formidable.IncomingForm({ multiples: true })
    form.parse(req, (err, fields, files) => {
        console.log(files)
        console.log(fields)
        for (let file in files) {
            try {
                if (files[file]) {
                    let oldPath = files[file]['path']
                    let filename = files[file]['name']
                    let rawData = fs.readFileSync(oldPath)

                    console.log('filename', filename)
                    let filenameSplit= filename.split("_")
                    console.log('filenameSplit', filenameSplit)
                    let fileYear = filenameSplit[1].slice(0,4)
                    let fileMonth = filenameSplit[1].slice(4,6)
                    let fileDate = filenameSplit[1].slice(6,8)
                    let fileHour = filenameSplit[1].slice(8,10)
                    let fileMinute = filenameSplit[1].slice(10,12)
                    let fileSecond = filenameSplit[1].slice(12,14)
                    console.log('fileYear', fileYear)
                    console.log('fileMonth', fileMonth)
                    console.log('fileDate', fileDate)
                    let date = `${fileYear}_${fileMonth}_${fileDate}`
                    let folderPath = __basedir + `\\media\\uploads\\docs\\${date}\\`;

                    console.log('folderPath', folderPath)
                    // folderPath = ..\dashboard-v2.0\server\\media\uploads\docs\\2021_06_18\\

                    // If folder hasn't been created
                    // if (!fs.existsSync(folderPath)) {
                    //     fs.mkdirSync(folderPath, {
                    //         recursive: true
                    //     });
                    // }

                    // newPath =..\dashboard-v2.0\server\\media\uploads\storage\\2021_06_18\\WIN.jpg
                    // let newPath = folderPath + files[file]['name']
                    // let databasePath = `storage/${today}/${files[file]['name']}`;
                    // let filename =  files[file]['name'] // example_files.zip

                    // if (fs.existsSync(newPath)){
                    //     // if file is existed then add Date.now()
                    //     let time =  Date.now()
                    //     let filenameSplit = filename.split('.')
                        
                    //     filename = filenameSplit[0] + '_' + time + '.' + filenameSplit[1] 
                    //     // filename = WIN_1626750408096.jpg

                    //     newPath = folderPath + filename
                    //     databasePath = `storage/${today}/${filename}`;
                    // }
                    
                    // fs.writeFile(newPath, rawData, async (err) => {
                    //     if (err) {
                    //         console.log(err);
                    //         return res.status(400).send({ "err": err })
                    //     }

                    //     const userToken = jwt.verify(fields.user, config.TOKEN_SECRET)

                    //     const newFiles = {
                    //         filename: filename,
                    //         user_id: ObjectId(userToken.id),
                    //         filepath: databasePath,
                    //         added_time: Date.now(),
                    //     }

                    //     const result = await db.collection("ate_files").insertOne(newFiles)
                    //     console.log(`Created with the following id: ${result.insertedId}`)

                    //     console.log(`Successfull upload ${newPath}`);
                    // })
                }
            } catch (err) {
                console.log(`Error: ${err}`);
                return res.status(409).send({ "error": `${err}` })
            }
        }
    })
    return res.status(200).send({ "message": "Successfully uploaded the files" })
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

const download = async (req, res) => {
    const files = req.body.files

    const fileTypeSplit = req.path.split('/')
    const columnFile = `${fileTypeSplit[fileTypeSplit.length - 1]}_txt_filename`
    let zip = new JSZip();

    for (let id of files) {

        const testQuery = {
            _id: ObjectId(id),
        }
        let result = await db.collection("ate_tests").findOne(testQuery)
        let directoryPath = __basedir + "media/uploads/" + result[columnFile]
        let singleFilename = result[columnFile]
        // Read the file and put inside zip
        zip = await readSingleFile(directoryPath, singleFilename, zip)
    }

    const zipAsBase64 = await zip.generateAsync({ type: "base64" })

    return res.status(200).send({
        "zip64": zipAsBase64
    })
}

const downloadSingle = (req, res) => {

    // http://localhost:8000/api/file/download/docs-log-Dotboard-2021_06_21-DB1111111111_202106210830.txt
    const fileName = req.params.name;
    const newFileName = fileName.replace(/-/g, "/")

    const directoryPath = __basedir + "media/uploads/"
    const fileNameSplitLength = fileName.split("-").length
    const originalFileName = fileName.split("-")[fileNameSplitLength - 1]

    res.download(directoryPath + newFileName, originalFileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
}

module.exports = {
    upload,
    download,
    converter,
    downloadSingle,
    readSingleFile
}