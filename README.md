# ATE Dashboard v2.0
ATE Dashboard v2.0 is the second generation of ATE Dashboard that is built to help ATE monitors the production test activity. 
1. The technologies used in this project are **MongoDB + Express + VueJS + NodeJS (MEVN)**. 
2. For better understanding, please read the [Architecture](#architecture) section. 
3. For the **development installation**, please refer to [Getting Started](#getting-started). 
4. For **deployment**, refer to [Deploy On Docker](#deploy-on-docker).

## Architecture
![Image of ATE Dashboard Architecture](./ATE-Dashboardv2.0-Architecture.png)

### Technology References
1. VueJS retrieves data by using RESTFUL API (NodeJS + Express)
You could check the API url in server router (_server/routers/index.js_) <br>
Note: every URL will be begun with `/api` e.g. `GET http://localhost:8000/api/tests/all`.
2. NodeJS + Express retrieves data from MongoDB using [MongoDB Node Driver](https://docs.mongodb.com/drivers/node/current/). <br> Current code uses v3.6 which is compatible with MongoDB v3.6 and v4+ (Compatibility check [here](https://docs.mongodb.com/drivers/node/master/compatibility/))
3. C# Program inserts data to MongoDB using [MongoDB C# Bson driver](https://docs.mongodb.com/drivers/csharp/)
4. **However**, C# Program uploads the .txt (Data, log, ComportText, TelnetText) to the NodeJS server using RESTFUL API.

## Getting Started

### Prerequisites
1. Install NodeJS v14.17.0 (I suggest you to use [nvm-windows](https://github.com/coreybutler/nvm-windows) or [nvm](https://github.com/nvm-sh/nvm) if you use other OS beside Windows). You also could directly download and install from official [NodeJS](https://nodejs.dev/).
2. Install [MongoDB](https://www.mongodb.com/try/download/community) v4.4.6. Follow this [instruction](https://dotblogs.com.tw/explooosion/2018/01/21/040728)

### Installation
1. Clone the repo<br>
`git clone http://gitlab.jazzhipster.com.tw:30000/team_ate/Dashboard-V2/ate.git`

2. Go to _server_ folder <br>
`cd server`

3. Install NPM packages<br>
`npm install`

4. Run the server (Backend)<br>
`npm run serve`

5. **Open new terminal** and go to _client_ folder<br>
`cd client`

6. Install NPM packages<br>
`npm install`

7. Run the client (Frontend)<br>
`npm run serve`

8. Open browser and type `localhost:8080`

### Deploy on Docker
**Notes**: Before build and running below commands, make sure you don't have any images named _dashboard-server_ and _dashboard-client_. If yes, please name your image with other name.<br>
Also ensure to free port **:8080** and **:80**

#### Build & Run MongoDB Container

1. Install MongoDB using [MongoDB Docker Official Images](https://hub.docker.com/_/mongo) [docker-compose.yml](docker-compose.yml) and run these below commands<br/>
`docker-compose up -d`

2. Install MongoDB Compass in your computer, then connect to your **admin** database with **username** and **password** in your docker-compose.yml

3. Then, Create Database named `ate_mongodb` with collection name `auth_users`, `ate_projects`, and `ate_tests`.
Configure the `DB_HOST` url in [config.js](server/config/config.js) with
```
DB_HOST: 'mongodb://<username>:<password>@<ip_address>:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'
```

#### Build & Run Server Container

1. Go to _server_ folder, build _dashboard-server_ image <br>
`docker build . -t dashboard-server --no-cache`

2. Then run the image, and we name it _server_<br>
`docker run -d -p 8080:8000 --name server dashboard-server` <br>
The server is running on port 8000 (as default in the code), then we map it to port 8080. So, API will be accessed from <br>
_http:<ip_address>:8080/api/_

#### Build & Run Client Container

1. **Open new terminal**, go to _client_ folder, then build client image <br>
`docker build . -t dashboard-client --no-cache`

2. Run _dashboard-client_ image, we name it _client_ <br>
`docker run -d -p 80:80 --name client dashboard-client`

3. Open browser, go to _http:<ip_address>_ e.g. `http://192.168.100.150`, it will redirect you to Login page

References:
- server: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
- client: https://cli.vuejs.org/guide/deployment.html#docker-nginx
