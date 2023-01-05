package models

import (
	"bytes"
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"iFIX/ifix/utility"
)

func UploadFile(tz *entities.FileuploadEntity, fileBytes []byte, fileName string, fileType string) (entities.FileuploadEntity, bool, error, string) {
	res := entities.FileuploadEntity{}
	logger.Log.Println("In side UploadFile")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return res, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	x, err := dataAccess.GetCredentialById(tz)
	if err != nil {
		return res, false, err, "Something Went Wrong"
	}
	u, err := utility.UploadBytesToBlob(fileBytes, x, fileName, fileType)
	if err != nil {
		logger.Log.Println("Error Uploading the File")
		logger.Log.Println(err)
		return res, false, err, "Something Went Wrong"
	}
	u.Credentialaccount = ""
	u.Credentialpassword = ""
	u.Credentialkey = ""
	return u, true, err, ""
}

func DownloadFile(tz *entities.FileuploadEntity) (bytes.Buffer, bool, error, string) {
	res := bytes.Buffer{}
	logger.Log.Println("In side DownloadFile")
	db, err := config.ConnectMySqlDb()

	if err != nil {
		logger.Log.Println("database connection failure", err)
		return res, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	x, err := dataAccess.GetCredentialById(tz)
	if err != nil {
		return res, false, err, "Something Went Wrong"
	}
	x.Filename = tz.Filename
	u, err := utility.DownloadBlobToBuffer(x)
	if err != nil {
		logger.Log.Println("Error Uploading the File")
		logger.Log.Println(err)
		return res, false, err, "Something Went Wrong"
	}
	return u, true, err, ""
}
