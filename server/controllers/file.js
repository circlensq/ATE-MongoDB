const formidable = require('formidable')
const fs = require('fs')

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

module.exports = {
    upload,
}