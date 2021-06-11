const mongoUtil = require("../src/mongoUtil");

const db = mongoUtil.getDb()

exports.getAll = async(req, res) => {

    try {
        // Save a new user in database
        const result = await db.collection("ate_tests").find().sort({test_date: -1}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.status(200).send({ 'tests': [result] })
          });
    }
    catch (err) {
        console.log('Error registration: ', err);
    }
}