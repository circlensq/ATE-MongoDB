const mongoUtil = require("../src/mongoUtil");
const config = require('../config/config')
const db = mongoUtil.getDb()
const ate_projects = db.collection(config.DB_PROJECT_COLLECTION)
const ate_logs = db.collection("ate_logs")
const { ObjectId } = require('mongodb')

exports.createProject = async (req, res) => {
    try {
        let communications = req.body.communications
        let newCommunicationsForm = req.body.newCommunications
        let newCommunicationsArray = []

        newCommunicationsForm.forEach(element => {
            newCommunicationsArray.push(element.value)
        });
        
        let newProject = {
            name: req.body.name,
            status: req.body.status,
            stage: req.body.stage,
            stations: req.body.stations,
            description: req.body.description,
            ate_logs: [],
            added_time: Date.now(),
            updated_time: Date.now(),
        }

        console.log(newCommunicationsArray)
        let ateLogs = await ate_logs.findOne()
        
        let newAteLogs = ateLogs.txt_filenames
        if (newCommunicationsArray.length > 0) {
            newAteLogs = newAteLogs.concat(newCommunicationsArray) // if we add 2 new communication interfaces, then ateLogs.length = 5
            console.log('newAtelogs', newAteLogs)
            await ate_logs.updateOne({ _id: ObjectId(ateLogs._id) }, { $set: { txt_filenames: newAteLogs }})
        }

        let communicationsIndex = 0

        for (let i = 0; i < newAteLogs.length; i++) {
            if (communications){
                console.log('compare', newAteLogs[i], ' == ', communications[communicationsIndex])
                if (newAteLogs[i] === communications[communicationsIndex] || newCommunicationsArray.indexOf(newAteLogs[i]) > -1 ){
                    // put from communications (database) OR newCommunicationsArray (new communication interface)
                    newProject.ate_logs.push(1)
                    communicationsIndex += 1
                    console.log('if', newProject.ate_logs)
                }
                else{
                    newProject.ate_logs.push(0)
                    console.log('else', newProject.ate_logs)
                }
            }
            else if (newCommunicationsArray.indexOf(newAteLogs[i]) > -1){
                // if communications is undefined, then check newCommunicationsArray
                newProject.ate_logs.push(1)
                communicationsIndex += 1
            }
            else{
                newProject.ate_logs.push(0)
                console.log('else', newProject.ate_logs)
            }
            
            console.log('\n')
        }

        // Save a new project in database
        const result = await ate_projects.insertOne(newProject)
        console.log(`New project is created with the following id: ${result.insertedId}`)


        return res.status(200).send({ 'message': `Creating new project is successful.` })
    }
    catch (err) {
        console.log('Error create project: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}

exports.projectsAll = async (req, res) => {
    try {
        // Find all projects
        await ate_projects.find().sort({ test_date: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'projects': [result] })
        });
    }
    catch (err) {
        console.log('Error list projects: ', err);
        return res.status(400).send({ 'error': `${err}` })

    }
}

exports.projectData = async (req, res) => {
    try {
        await ate_projects.findOne({
            _id: ObjectId(req.params.id)
        }, function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'projects': result })
        });
    }
    catch (err) {
        console.log('Error list projects: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}

exports.editProject = async (req, res) => {

    try {
        await ate_projects.updateOne({
            _id: ObjectId(req.body.id)
        }, {
            $set: {
                name: req.body.name,
                status: req.body.status,
                stage: req.body.stage,
                stations: req.body.stations,
                description: req.body.description,
                updated_time: Date.now()
            },
        }, function (err, result) {
            if (err) throw err;
            console.log('Edit project: ' + result.nModified > 1 ? 'projects' : 'project')
            return res.status(200).send({ 'message': `Editing new project is successful.` })
        });

    }
    catch (err) {
        console.log('Error edit projects: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}

exports.searchProject = async (req, res) => {
    try {
        await ate_projects.findOne({
            name: req.params.name
        }, function (err, result) {
            if (err) throw err;
            else if (result === null) {
                return res.status(200).send({ 'message': 'Project Name is valid' })
            }
            else if (result) {
                res.status(200).send({ 'error': 'Project name is exists. Please use other name', 'id': result._id, 'project': result })
            }
        });
    }
    catch (err) {
        console.log('Error list projects: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}