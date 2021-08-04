const mongoUtil = require("../src/mongoUtil");
const config = require('../config/config')
const db = mongoUtil.getDb()
const ate_tests = db.collection(config.DB_TEST_COLLECTION)
const { ObjectId } = require('mongodb');

exports.getAll = async (req, res) => {
    try {
        // Save a new user in database
        await ate_tests.aggregate([
            {
                $lookup:
                {
                    from: "ate_projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            }]).sort({ test_date: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'tests': [result] })
        });
    }
    catch (err) {
        console.log('Error Find Test: ', err);
    }
}

exports.getUpdateData = async (req, res) => {

    changeStream = ate_tests.watch();
    changeStream.on("change", next => {
        // process any change event
        console.log("received a change to the collection: \t", next);
    });
}
exports.getById = async (req, res) => {
    const projectId = req.params.id;
    let query = { project_id: ObjectId(projectId) };
    try {
        await ate_tests.find(query).sort({test_date: -1}).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'tests': [result] })
        });
    } 
    catch (err) {
        console.log('Error Find Test by Id: ', err);
    }
}

exports.searchTest = async (req, res) => {
    const querySearch = req.params.query;
    let query = { $or: [{ serial_number: { $regex: ".*" + querySearch + ".*" } }, { mac_address: { $regex: ".*" + querySearch + ".*" } }, { test_station: { $regex: ".*" + querySearch + ".*" } }, { result: { $regex: ".*" + querySearch.toUpperCase() + ".*" } }] };
    try {
        await ate_tests.find(query).sort({ test_date: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).send({ 'tests': [result] })
        });
    }
    catch (err) {
        console.log('Error Find Test: ', err);
    }
}

exports.passedPercentages = async (req, res) => {
    const project_id = req.params.project_id.toString();
    const test_station = req.params.test_station;

    let queryPassed = { project_id: ObjectId(project_id), test_station: test_station, result: 'PASS' }
    let queryCount = { project_id: ObjectId(project_id), test_station: test_station }
    var passed_tests = 0
    var total_tests = 0
    try {
        passed_tests = await ate_tests.countDocuments(queryPassed)
        total_tests = await ate_tests.countDocuments(queryCount)

        let passed_percentages = passed_tests / total_tests * 100
        res.status(200).send({ 'passed_percentages': passed_percentages })
    }
    catch (err) {
        console.log('Error Find Test: ', err);
    }
}