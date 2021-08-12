# ATE - Dashboard

## Client

### Folder structure
The following shows basic `client` folder structure.
```
├── public # config.json folder
│   └── index.html 
│   
├── src
│   ├── assets # images and assets to be saved here (not used for now)
│   ├── components # public components (not used for now)
|   ├── layout
│   |   ├── footer
│   |   ├── navbar 
|   |   ├── sidebar
|   |   └── BaseLayout.vue  # initial vue page of layout
|   ├── mixins (not used for now)
|   ├── router
|   |   └── index.js # router setting page, used to define the page url
|   |
|   ├── services
|   |   └── UserService.js # consists of function to inject token inside HTTP headers
|   |
|   ├── store
|   |   ├── modules # store vuex state modules 
|   |   |   ├── analysis.js # store vuex state for graph chart analysis
|   |   |   ├── notification.js # state for FAIL notification
|   |   |   ├── security.js # state for CSRF form protection   
|   |   |   └── user.js # state for user 
|   |   └── index.js # vuex initial setting file
|   |
|   ├── views # Generally, all the pages from sidebar menu is defined here 
|   |   ├── dashboard # Dashboard 'List' page
|   |   ├── project # Project 'List', 'Analysis', 'Create New' page 
|   |   ├── upload # Upload 'Files' and 'Test' page 
|   |   └── user # Login, Register, Confirmation Page, Forgot Password page
|   | 
|   ├── vuex # Generally, all the pages from sidebar menu is defined here
|   └── App.vue # initial rendering page file
|
├── nginx.conf # setting nginx when deploy to Docker, maximum File Uploading size is set to be 1GB.  
├── vue.config.js # proxy server is setting here, please change target IP
└── ... # other common files
```

## Server

### Folder structure
The following shows basic `server` folder structure.
```
├── config # 
│   └── config.js # define the client HOST_IP, Database name, etc. 
│   
├── controllers
│   ├── file_tests.js # uploading test file functions
│   ├── file_universal.js # uploading file functions
│   ├── nodeoutlook.js # for future used (email confirmation account)
│   ├── project.js # project list, create, edit functions
│   ├── test.js # test list, get passed percentages, search testId, etc. functions
│   └── user.js # login, register, getId, etc. functions
|   
|   ├── media # store the uploaded test files, and files
|   |
|   ├── router
|   |   └── index.js # router setting page, used to define the page url
|   |
|   ├── services
|   |   └── UserService.js # consists of function to inject token inside HTTP headers
|   |
|   ├── store
|   |   ├── modules # store vuex state modules 
|   |   |   ├── analysis.js # store vuex state for graph chart analysis
|   |   |   ├── notification.js # state for FAIL notification
|   |   |   ├── security.js # state for CSRF form protection   
|   |   |   └── user.js # state for user 
|   |   └── index.js # vuex initial setting file
|   |
|   ├── views # Generally, all the pages from sidebar menu is defined here 
|   |   ├── dashboard # Dashboard 'List' page
|   |   ├── project # Project 'List', 'Analysis', 'Create New' page 
|   |   ├── upload # Upload 'Files' and 'Test' page 
|   |   └── user # Login, Register, Confirmation Page, Forgot Password page
|   | 
|   ├── vuex # Generally, all the pages from sidebar menu is defined here
|   └── App.vue # initial rendering page file
|
├── nginx.conf # setting nginx when deploy to Docker, maximum File Uploading size is set to be 1GB.  
├── vue.config.js # proxy server is setting here, please change target IP
└── ... # other common files
```