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

            if (files[obj_files]) {
                let oldPath = files[obj_files]['path']
                let rawData = fs.readFileSync(oldPath)
                let split = fields[obj_fields].substring(1, fields[obj_fields].length).split('\\')
                let folderPath = __basedir + "\\media\\uploads\\docs\\" + split.slice(0, split.length - 1).join("\\") + "\\";
                // folderPath = ..\ATE-MongoDB\server\\media\uploads\docs\\Data\\Dotboard\\2021_006_18\\

                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, {
                        recursive: true
                    });
                }

                // newPath =..\ATE-MongoDB\server\\media\uploads\docs\\\Data\\Dotboard\DB825083y869_202106181344.txt
                let newPath = folderPath + files[obj_files]['name']

                fs.writeFile(newPath, rawData, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ "err": err })
                    }
                    console.log(`Successfull upload ${newPath}`);
                })
            }
        }

        return res.status(200).send({ "message": "Successfully uploadded the files" })
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
        let directoryPath = __basedir + "media/uploads/docs/" + result[columnFile]
        let singleFilename = result[columnFile].replace(".\\", "").replace("\\", "").replace("\\", "")
        
        // Read the file and put inside zip
        zip = await readSingleFile(directoryPath, singleFilename, zip)
    }

    const zipAsBase64 = await zip.generateAsync({ type: "base64" })

    return res.status(200).send({
        "zip64": zipAsBase64
    })
}

const downloadSingle = (req, res) => {
    
    // http://localhost:8000/api/file/download/log-Dotboard-2021_06_21-DB1111111111_202106210830.txt
    const fileName = req.params.name;
    const newFileName = fileName.replace(/-/g, "/")

    const directoryPath = __basedir + "media/uploads/docs/"
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
    downloadSingle,
    readSingleFile
}