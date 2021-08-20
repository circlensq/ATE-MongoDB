const mongoUtil = require("../src/mongoUtil");
const db = mongoUtil.getDb()
const ate_logs = db.collection("ate_logs")

exports.getAll =  async (req, res) => {
    try {
        ate_logs.findOne({}, function(err, result) {
            if (err) throw err;
            return res.status(200).send({ 'logs': result })
        });
    }
    catch (err) {
        console.log('Error get logs data: ', err);
        return res.status(400).send({ 'error': `${err}` })
    }
}
