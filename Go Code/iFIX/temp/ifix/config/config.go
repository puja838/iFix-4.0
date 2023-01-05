package config

var SR_SEQ int64 = 2
var STASK_SEQ int64 = 3
var CR_SEQ int64 = 4
var CTASK_SEQ int64 = 5

var CANCEL_SEQ int64 = 11
var RESOLVE_SEQ int64 = 3
var CLOSE_SEQ int64 = 8

// LOCAL

var DBDRIVER = "mysql"
var DBUSER = "root"
var DBPASWORD = "admin"
var DBURL = "tcp(127.0.0.1:3306)"
var DBNAME = "iFIX"
var RECORD_URL = "http://localhost:8083/recordapi"
var EMAIL_URL="http://localhost:8089/iFIXNotification"
var TOKEN_EXPIRE_TIME = 3600
var JWT_KEY = []byte("ifix4@secret#token%^@")

// UAT
//var DBDRIVER = "mysql"
//var DBUSER = "gouser"
//var DBPASWORD = "TCSUAT@54321"
//var DBURL= "tcp(10.5.2.4:3306)"
//var DBNAME ="iFIX"
//var RECORD_URL="http://localhost:8083/recordapi"
//var EMAIL_URL="http://localhost:8089/iFIXNotification"
//var TOKEN_EXPIRE_TIME = 3600
//var JWT_KEY = []byte("ifix4@secret#token%^@")

//STAGING

//var DBDRIVER = "mysql"
//var DBUSER = "ifix"
//var DBPASWORD = "Staging@4321"
//var DBURL = "tcp(172.17.0.1:3306)"
//var DBNAME = "iFIX"
//var RECORD_URL = "http://localhost:8083/recordapi"
//var EMAIL_URL = "http://localhost:8089/iFIXNotification"
//var TOKEN_EXPIRE_TIME = 3600
//var JWT_KEY = []byte("ifix4@secret#token%^@")

// NEW STAGING

//var DBDRIVER = "mysql"
//var DBUSER = "ifix"
//var DBPASWORD = "Staging@4321"
//var DBURL= "tcp(127.0.0.1:3306)"
//var DBNAME ="iFIX"
//var RECORD_URL="http://20.204.29.18:8083/recordapi"
//var EMAIL_URL="http://20.204.29.18:8089/iFIXNotification"
//var TOKEN_EXPIRE_TIME = 3600
//var JWT_KEY = []byte("ifix4@secret#token%^@")

var LDAP_URL = "http://20.198.64.145:8084/ldapapi"
