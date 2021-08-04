# C# Integration Notes

## Prepare Docker Environment
### A. MongoDB v4.4
1. Make sure that port `27017` is free by running command `docker ps -a`. If `27017` is not free, please stop the container by running command `docker stop <container-name>`

2. Run `docker-compose` from [ATE folder](./docker-compose.yml) and we will have mongodb_4.4 is running<br>
`docker-compose up -d`

### B. Server
1. Go to _server_ folder, build _dashboard-server_ image <br>
`docker build . -t dashboard-server --no-cache`

2. Then run the image, and we name it _server_<br>
`docker run -d -p 8080:8000 --name server dashboard-server` <br>
The server is running on port 8000 (as default in the code), then we map it to port 8080. So, API will be accessed from <br>
_http:<ip_address>:8080/api/_

## C# upload file and data to MongoDB and server
1. Put below variables at the top of C# program
```
#region Database
string Database_enable = "0";
string MangoDB_enable = "1";
static string IP_address = "http://192.168.100.150:8080/";
static string create_data_address = IP_address + "api/data/create/";
static string auth_token_address = IP_address + "api/accounts/login/instrument/";
string username_acc = "jzate";
string password_acc = "jzhipster";
string token_acc = "";
Dictionary<string, dynamic> dataDict = new Dictionary<string, dynamic>();
Dictionary<string, dynamic> dataDictUploadFile = new Dictionary<string, dynamic>();
```

2. Add `Credential` class
```
public class Credentials
{
    public string username;
    public string password;
}
```

3. Add `GetToken` function
```
public async Task<IRestResponse> GetToken(string username, string password, string auth_address)
{
    var client = new RestClient(auth_address);
    var requestToken = new RestRequest(Method.POST);

    var param = new Credentials { username = username, password = password };
    requestToken.AddJsonBody(param);

    var response = await client.ExecuteTaskAsync(requestToken);

    return response;
}
```

4. Add `GetId` function
<br>This function will get user ID so we know which user account that uploads the file
```
public async Task<IRestResponse> GetId(string getId_address, string token)
{
    var client = new RestClient(getId_address);
    var request = new RestRequest(Method.POST);

    request.AddHeader("Authorization", $"Token {token}");

    var response = await client.ExecuteTaskAsync(request);

    return response;
}
```

5. Add `GetProjectId` function. 
<br>This function will search and get the Project ID based on `projectNameDB` value
```
public async Task<IRestResponse> GetProjectId(string getProjectId_address)
{
    var client = new RestClient(getProjectId_address);
    var request = new RestRequest(Method.GET);

    var response = await client.ExecuteTaskAsync(request);

    return response;
}
```
6. Add `UploadSQL` function 
<br>This function will use ATE NodeJS server API to upload the .txt (Data, log, ComportText, TelnetText) to server folder
```
public async Task<IRestResponse> UploadSQL(Dictionary<string, dynamic> data, string server, string token)
{

    var client = new RestClient(server);
    var request = new RestRequest(Method.POST);
    request.AlwaysMultipartFormData = true;

    request.AddHeader("Authorization", $"Token {token}");
    request.AddHeader("Content-Type", "multipart/form-data");

    request = await OpenAddFile(data, request, "data_txt_filename", data["data_txt_path"]);
    request = await OpenAddFile(data, request, "log_txt_filename", data["log_txt_path"]);
    request = await OpenAddFile(data, request, "comport_txt_filename", data["comport_txt_path"]);
    request = await OpenAddFile(data, request, "telnet_txt_filename", data["telnet_txt_path"]);

    foreach (KeyValuePair<string, dynamic> kvp in data)
    {
        request.AddParameter(kvp.Key, kvp.Value);
    }

    var response = await client.ExecuteTaskAsync(request);
    return response;
}

```
7. Add FormatFilenameURL function 
<br>This function will change from 
`\\Data\\Dotboard\\2021_05_17\\DB1234567890_202105170917.txt`
to be
`docs/Data/Dotboard/2021_05_17/DB1234567890_202105170917.txt`

```
public string FormatFilenameURL(string url)
{
    string newURL = "docs";
    string[] urlList = url.Split('\\');
    for(int i = 1; i < urlList.Length; i++) 
    {
        if (i == 2 || i == urlList.Length - 1)
        {
            newURL += urlList[i];
        }
        else
        {
            newURL += urlList[i] + '/';
        }
    }
    
    return newURL;
}
```

8. After C# running test, put below code to upload file and save to MongoDB
```
if (MangoDB_enable == "1")
{
    try
    {
        MongoClient client = new MongoClient("mongodb://jzate:jzhipster@192.168.100.150:27017/?authSource=admin");
        collection_name = "ate_tests";
        
        var db = client.GetDatabase(Mongodb_database_name);
        var collection = db.GetCollection<BsonDocument>(collection_name);

        int fail = 0;
        string[] columnNames = Regex.Split(s_SaveDataTitle, ",");
        string[] cols = Regex.Split(s_SaveData, ",");
        int i_name = 0;
        string add_test_item = "";

        BsonDocument book = new BsonDocument();
        book.AllowDuplicateNames = true;

        IRestResponse tokenResponse = await GetToken(username_acc, password_acc, auth_token_address);
        JObject jsonToken = JObject.Parse(tokenResponse.Content);

        try
        {
            token_acc = jsonToken.GetValue("token").ToString();
            

            if (token_acc != null)
            {
                try
                {
                    var upload_file_api = IP_address + "api/file/upload";

                    /* Upload File Data to NodeJS Server Start */

                    dataDictUploadFile = new Dictionary<string, dynamic>();

                    dataDictUploadFile.Add("data_txt_path", PCDataFolder);
                    dataDictUploadFile.Add("log_txt_path", PCLogFolder);
                    dataDictUploadFile.Add("comport_txt_path", COMPORT_TEXT_Path_Folder);
                    dataDictUploadFile.Add("telnet_txt_path", Telnet_TEXT_Path_Folder);

                    // Upload File to NodeJS Execution
                    IRestResponse restDataResponse = await UploadSQL(dataDictUploadFile, upload_file_api, token_acc);
                    MessageBox.Show("File is uploaded: " + restDataResponse.StatusCode.ToString());
                    
                    /* Upload File Data to NodeJS Server End */
                }
                catch (Exception ex)
                {
                    MessageBox.Show(null, "Error :" + ex, "File IS NOT uploaded!");
                }

                // Get User ID through API
                var getUserIdAPIAddress = IP_address + "api/accounts/getId";
                IRestResponse idResponse = await GetId(getUserIdAPIAddress, token_acc);
                JObject jsonId = JObject.Parse(idResponse.Content);
                var userId = jsonId.GetValue("id").ToString();
                
                // Get Project ID through API
                var projectNameDB = "MS1830_S2S";
                var getProjectIdAPIAddress = IP_address + "api/project/search/" + projectNameDB;
                IRestResponse projectIdResponse = await GetProjectId(getProjectIdAPIAddress);

                JObject jsonProjectId = JObject.Parse(projectIdResponse.Content);
                var projectId = jsonProjectId.GetValue("id").ToString();

                dataDict = new Dictionary<string, dynamic>();

                // Upload Test Data to MongoDB Start
                dataDict.Add("project_id", new ObjectId(projectId));
                dataDict.Add("test_station", configfileName);
                dataDict.Add("user_id", new ObjectId(userId)); // admin
                dataDict.Add("serial_number", SN_number);
                dataDict.Add("mac_address", MAC_number);
                dataDict.Add("result", PF);

                dataDict.Add("error_code", s_ErrorCode);
                dataDict.Add("test_time_minutes", Convert.ToDouble(testTime_Save));

                if (File.Exists(PCDataFolder))
                {
                    //newPCDataFolder format = docs/Data/Dotboard/2021_05_17/DB1234567890_202105170917.txt
                    string newPCDataFolder = FormatFilenameURL(PCDataFolder);
                    dataDict.Add("data_txt_filename", newPCDataFolder);
                }

                if (File.Exists(PCLogFolder))
                {
                    string newLogFolder = FormatFilenameURL(PCLogFolder);
                    dataDict.Add("log_txt_filename", newLogFolder);
                }


                if (File.Exists(COMPORT_TEXT_Path_Folder))
                {
                    string newComportFolder = FormatFilenameURL(COMPORT_TEXT_Path_Folder);
                    dataDict.Add("comport_txt_filename", newComportFolder);
                }

                if (File.Exists(Telnet_TEXT_Path_Folder))
                {
                    string newTelnetFolder = FormatFilenameURL(Telnet_TEXT_Path_Folder);
                    dataDict.Add("telnet_txt_filename", newTelnetFolder);
                }

                dataDict.Add("test_date", Convert.ToDateTime(Database_time));
                dataDict.Add("added_time", Convert.ToDateTime(Database_time));

                book.AddRange(dataDict);

                BsonDocument test_items = new BsonDocument();

                for (int i = 0; i < columnNames.Length; i++)
                {
                    i_name = 0;
                    fail = i;
                    if (columnNames[i] != "")
                    {
                        add_test_item = columnNames[i];
                        for (int j = i - 1; j > 0; j--)
                        {
                            if (columnNames[i] == columnNames[j])
                            {
                                //change name
                                //b_add = true;
                                i_name++;
                                columnNames[i] = add_test_item + i_name.ToString();
                                j = i;
                            }
                        }
                        test_items.Add(columnNames[i], cols[i]);
                    }
                }
                dataDict.Add("test_items", test_items);
                book.AddRange(dataDict);
                collection.InsertOne(book); // Execute MongoDB
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show("Error: " + ex);
        }
    }
    catch (Exception ex)
    {
        MessageBox.Show("Error: " + ex.ToString());
        MessageBox.Show("MangoDB error!! Please find the problem first !!");
    }
}
```
