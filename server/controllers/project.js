const mongoUtil = require("../src/mongoUtil");
const config = require('../config/config')
const db = mongoUtil.getDb()
const ate_projects = db.collection(config.DB_PROJECT_COLLECTION)

exports.createProject = async (req, res) => {
    try {
         let new_project = {
            name: req.body.name,
            status: req.body.status,
            stage: req.body.stage,
            stations: req.body.stations,
            description: req.body.description,
            added_time: Date.now(),
            updated_time: Date.now(),
        }

        // Save a new user in database
        const result = await ate_projects.insertOne(new_project)
        console.log(`New project is created with the following id: ${result.insertedId}`)

        return res.status(200).send({ 'message': `Creating new project is successful.` })
    }
    catch (err) {
        console.log('Error create project: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}