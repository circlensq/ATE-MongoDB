const mongoUtil = require("../src/mongoUtil");
const config = require('../config/config')
const db = mongoUtil.getDb()
const ate_projects = db.collection(config.DB_PROJECT_COLLECTION)
const { ObjectId } = require('mongodb')

exports.createProject = async (req, res) => {
    try {
        let newProject = {
            name: req.body.name,
            status: req.body.status,
            stage: req.body.stage,
            stations: req.body.stations,
            description: req.body.description,
            added_time: Date.now(),
            updated_time: Date.now(),
        }

        // Save a new user in database
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
        // Save a new user in database
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

exports.searchProject = async(req, res) => {
    try {
        await ate_projects.findOne({
            name: req.params.name
        }, function (err, result) {
            if (err) throw err;
            else if (result === null){
                return res.status(200).send({ 'message': 'Project Name is valid'})
            } 
            else if (result){
                res.status(200).send({ 'error': 'Project name is exists. Please use other name', 'id': result._id, 'project': result})
            }
        });
    }
    catch (err) {
        console.log('Error list projects: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}