module.exports = {
    DB_HOST: 'mongodb://localhost:27017',
    // DB_HOST: 'mongodb://jzate:jzhipster@192.168.100.150:27017/?authSource=admin',
    // DB_HOST: 'mongodb://jzate:jzhipster@172.105.225.25:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    DB_NAME: 'ate_mongodb',
    DB_TEST_COLLECTION: 'ate_tests',
    // DB_TEST_COLLECTION: 'dashboard_test',
    DB_PROJECT_COLLECTION: 'ate_projects',
    HOST: 'http://localhost:8080', // client URL
    // HOST: 'http://192.168.100.150:80',
    TOKEN_SECRET: 'jzhpstrcrp0222225678',
    MINUTES_LOGIN_TIME: 3,
    NORMAL_LOGIN_DAYS: 3,
    KEEP_LOGIN_DAYS: 7,
    TWO_FACTOR_AUTHENTICATION: false,
    MAX_EMAIL_EXISTS: 3
}