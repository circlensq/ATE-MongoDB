# Migration v1 &#8594; v2

## Config
1. Change `config.js` inside _server/config/config.js_ with below configuration
```
module.exports = {
    DB_HOST: 'mongodb://jzate:jzhipster@172.105.225.25:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    DB_NAME: 'ate_mongodb_2',
    DB_TEST_COLLECTION: 'ate_tests',
    DB_PROJECT_COLLECTION: 'ate_projects',
    HOST: 'http://172.105.225.25:80',
    TOKEN_SECRET: 'jzhpstrcrp0222225678',
    MINUTES_LOGIN_TIME: 3,
    NORMAL_LOGIN_DAYS: 7,
    KEEP_LOGIN_DAYS: 30,
    TWO_FACTOR_AUTHENTICATION: false,
    MAX_EMAIL_EXISTS: 3
}
```

2. Change `vue.config.js` inside _client/vue.config.js_ with below configuration
```
module.exports = {
    devServer: {
      proxy: {
        '^/api': {
            target: 'http://172.105.225.25:8080',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/api'
            },
            logLevel: 'debug'
        },
      }
    }
}
```

## Data
1. Export `dashboard_test` collection from `ate_mongodb` database.
2. Download all of .txt files (with their folder) from `home/richard/dockerData/django/server-media/docs`.
<br>
![v1_Folder_structure](img/v1folder_structure.png)

3. Run docker-compose to run `client` and `server` containers.
4. Create folder `/media` inside `server` folder if you don't find any.

5. Put the .txt files (from step 2) with their folder inside `home/richard/dashboard-v2.0-data/server/media/uploads/`
So the folder structure will be:
```
├── server # 
│   └── media
|       └── uploads 
|           └── docs
|               ├── Data
|               ├── log
|               ├── ComportText
|               └── TelnetText
```

6. Open MongoDB Compass and connect with your MongoDB server database.

7. Create new collection named `ate_tests`, and import `dashboard_tests` collection exported data (from step 1)

8. Go to _http://<ip_address>/project/create_ and make project for existing project. See [create_new_project.md](./create_new_project.md) to make a new project.

9. Open MongoDB Compass and look at the `ate_projects` collection
![ate_projects](./img/ate_projects.png).

10. Copy `_id` value e.g. `ObjectId("60f796d48b19213d0ec138d5")` and we will use this id to be added on existing data.

11. Open MongoSH at bottom of MongoDB program
and run this command 

```
use ate_mongodb
db.ate_tests.updateMany({project_id: 1}, {$set: { project_id: ObjectId("60f796d48b19213d0ec138d5")}} )
```
![MongoSH update id command](./img/mongosh_update_id_command.png)

**Notes**: You could do step 10 ~ 11 to change all of `project_id`

#### IMPORTANT:
1. Make sure you've already created `/media` folder inside  `server` folder. If not, you probably will face `Error Access Permission` while uploading test files.

