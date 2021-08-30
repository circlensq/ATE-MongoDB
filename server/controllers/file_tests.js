const formidable = require('formidable');
const fs = require('fs');
const JSZip = require("jszip");
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// MongoDB Connection
const mongoUtil = require('../src/mongoUtil');
const config = require('../config/config');
const db = mongoUtil.getDb();
const ate_projects = db.collection(config.DB_PROJECT_COLLECTION);
const ate_logs = db.collection("ate_logs");


const formatText = (text) => {
    if (text === 'Data'){
        return 'data'
    }
    else if (text === 'log'){
        return 'log'
    }
    else {
        let logsName = text.split("Text")[0] // Comport
        let firstChar = logsName.substring(0, 1).toLowerCase() // c
        let restChar = logsName.substring(1, logsName.length) // omport
        let newName = firstChar + restChar // comport
        
        return newName
    }
}

const upload = (req, res, next) => {
    const form = new formidable.IncomingForm({ multiples: true })
    form.parse(req, async (err, fields, files) => {

        let default_files_arr = ['data_txt_filename', 'log_txt_filename']
        try {
            let files_arr_data = await ate_logs.findOne()
            let files_arr = default_files_arr.concat(files_arr_data.txt_filenames)
            //files_arr = 'data_txt_filename', 'log_txt_filename', 'comport_txt_filename', 'telnet_txt_filename', etc.

            for (let i = 0; i < files_arr.length; i++) {
                let obj_files = `${files_arr[i].split("_")[0]}` + '_txt_filename'
                let obj_fields = `${files_arr[i].split("_")[0]}` + '_txt_path'

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
                } catch (err) {
                    console.log(`Error: ${err}`);
                }
            }
            return res.status(200).send({ "message": "Successfully uploaded the files" })
        }
        catch (err) {
            console.log('Error get logs data: ', err);
            return res.status(400).send({ "error": "err" })
        }
    })
}

const converter = (req, res, next) => {
    const form = new formidable.IncomingForm({ multiples: true })
    form.parse(req, async (err, fields, files) => {
        const project = await ate_projects.findOne({ name: fields.project })

        let mandatoryFields = []
        if (fields.project === "null") {
            mandatoryFields.push("'Project'")
        }
        if (fields.station === "null") {
            mandatoryFields.push("'Station'")
        }
        if (fields.test === "null") {
            mandatoryFields.push("'Test'")
        }

        if (mandatoryFields.length > 0) {
            let mandatoryMsg = ""
            for (let i = 0; i < mandatoryFields.length; i++) {
                if (i === mandatoryFields.length - 2) {
                    mandatoryMsg += mandatoryFields[i] + ", and "
                }
                else {
                    if (mandatoryFields.length === 1)
                        mandatoryMsg += mandatoryFields[i]
                    else
                        mandatoryMsg += mandatoryFields[i] + ", "
                }
            }
            return res.status(400).send({ "error": `Please choose ${mandatoryMsg} select option` })
        }
        else {
            for (let file in files) {
                try {
                    if (files[file]) {
                        let oldPath = files[file]['path']
                        let rawData = fs.readFileSync(oldPath)

                        let filename = files[file]['name']
                        let resultTest = ""
                        let testTimeMinutes = 0.00
                        let errorCode = ""

                        if (fields.test === 'Data') {
                            fs.readFile(oldPath, 'utf8', (err, data) => {
                                if (err) return console.log(err)
                                let dataSplit = data.split("\n")
                                testTimeMinutes = parseFloat(dataSplit[1].split(",")[1].replace("m", ""))
                                resultTest = dataSplit[1].split(",")[3]
                                errorCode = dataSplit[1].split(",")[4]
                            })
                        }

                        let filenameSplit = filename.split("_")

                        // Regular expression
                        const numberRegex = /\d/; //regex to check that number exists
                        let serialNumber = ""
                        let macAddress = ""

                        if (numberRegex.test(filenameSplit[0].slice(0, 2))) {
                            if (filenameSplit.length == 3) {
                                // CB1234567890_B123456789_20210809103401.txt
                                macAddress = filenameSplit[1]
                            } else {
                                // B123456789_20210809103401.txt
                                macAddress = filenameSplit[0]
                            }
                        }
                        else {
                            serialNumber = filenameSplit[0]
                        }

                        let fileYear = filenameSplit[1].slice(0, 4)
                        let fileMonth = filenameSplit[1].slice(4, 6)
                        let fileDate = filenameSplit[1].slice(6, 8)
                        let fileHour = filenameSplit[1].slice(8, 10)
                        let fileMinute = filenameSplit[1].slice(10, 12)
                        let fileSecond = filenameSplit[1].slice(12, 14)
                        let testDate = `${fileYear}-${fileMonth}-${fileDate}T${fileHour}:${fileMinute}:${fileSecond}`

                        let date = `${fileYear}_${fileMonth}_${fileDate}`

                        // folderPath = ..\dashboard-v2.0\server/media/uploads/docs/log/Product_WIFI_2G/2021_06_18/
                        let folderPath = __basedir + `/media/uploads/docs/${fields.test}/${fields.station}/${date}/`;

                        // If folder hasn't been created
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath, {
                                recursive: true
                            });
                        }

                        // newPath = ..\dashboard-v2.0\server/media/uploads/docs/log/Product_WIFI_2G/2021_06_18/CB0123456781_20210604165222.txt
                        let newPath = folderPath + files[file]['name']

                        let oriFilename = files[file]['name'].replace(".txt", "") // CB0123456781_20210604165222.txt
                        let databasePath = `docs/${fields.test}/${fields.station}/${date}/${files[file]['name']}`;

                        if (fs.existsSync(newPath)) {
                            // if file is existed then add Date.now()
                            let time = Date.now()

                            let tempFilenameSplit = files[file]['name'].split(".")
                            filename = tempFilenameSplit[0] + '_' + time + '.' + tempFilenameSplit[1]
                            // filename = CB0123456781_20210604165222_1626750408096.txt

                            //change newPath if file exists
                            newPath = folderPath + filename
                            databasePath = `docs/${fields.test}/${fields.station}/${date}/${filename}`;
                        }

                        fs.writeFile(newPath, rawData, async (err) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).send({ "err": err })
                            }

                            const userToken = jwt.verify(fields.user, config.TOKEN_SECRET)
                            const queryExisted = {
                                project_id: ObjectId(project._id),
                                test_station: fields.station,
                                serial_number: serialNumber,
                                mac_address: macAddress,
                                $or: [
                                    { data_txt_filename: { $regex: `${oriFilename}`, $options: 'i' } },
                                    { log_txt_filename: { $regex: `${oriFilename}`, $options: 'i' } },
                                    { comport_txt_filename: { $regex: `${oriFilename}`, $options: 'i' } },
                                    { telnet_txt_filename: { $regex: `${oriFilename}`, $options: 'i' } },
                                ]
                            }

                            let existedData = await db.collection("ate_tests").findOne(queryExisted)

                            if (existedData != null) {
                                if (existedData._id) {
                                    const updateFile = {
                                        test_date: new Date(new Date(Date.parse(testDate)).toISOString()),
                                        added_time: new Date(new Date(Date.now()).toISOString()),
                                    }

                                    updateFile[`${formatText(fields.test)}_txt_filename`] = databasePath
                                    if (resultTest != "")
                                        updateFile['result'] = resultTest
                                    if (errorCode != "")
                                        updateFile['error_code'] = errorCode
                                    if (testTimeMinutes > 0)
                                        updateFile['test_time_minutes'] = testTimeMinutes


                                    db.collection("ate_tests").updateOne({
                                        _id: ObjectId(existedData._id)
                                    }, {
                                        $set: updateFile
                                    }, function (err, result) {
                                        if (err) throw err;
                                        console.log(`Successfull upload ${newPath}`);
                                        console.log(`Edit project: ${result.modifiedCount}`, result.modifiedCount > 1 ? 'projects' : 'project')
                                    });
                                }
                            }
                            else {
                                const newFiles = {
                                    project_id: ObjectId(project._id),
                                    test_station: fields.station,
                                    user_id: ObjectId(userToken.id),
                                    serial_number: serialNumber,
                                    mac_address: macAddress,
                                    result: resultTest,
                                    error_code: errorCode,
                                    test_time_minutes: testTimeMinutes,
                                    test_date: new Date(new Date(Date.parse(testDate)).toISOString()),
                                    added_time: new Date(new Date(Date.now()).toISOString()),
                                }

                                newFiles[`${formatText(fields.test)}_txt_filename`] = databasePath

                                const result = await db.collection("ate_tests").insertOne(newFiles)
                                console.log(`Created with the following id: ${result.insertedId}`)
                                console.log(`Successfull upload ${newPath}`);
                            }
                        })
                    }
                } catch (err) {
                    console.log(`Error: ${err}`);
                    return res.status(409).send({ "error": `${err}` })
                }
            }
            return res.status(200).send({ "message": "Successfully uploaded the files" })
        }
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

    let fileType = fileTypeSplit[fileTypeSplit.length - 1] // * Data, log, ComportText, TelnetText, etc.
    const columnFile = `${formatText(fileType)}_txt_filename`

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