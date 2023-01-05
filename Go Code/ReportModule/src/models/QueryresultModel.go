package models

import (
	"src/dao"

	// FileUtils "src/fileutils"
	"src/logger"
	// Excel "github.com/tealeg/xlsx"
)

func RecordGridResultOnly(page map[string]interface{}) (map[string]interface{}, bool, error, string) {
	var t map[string]interface{}
	var response map[string]interface{}
	// if mutexutility.MutexLocked(lock) == false {
	// 	lock.Lock()
	// 	defer lock.Unlock()
	// }
	// db, err := dbconfig.ConnectMySqlDb()
	// if err != nil {
	// 	logger.Log.Println("database connection failure", err)
	// 	return t, false, err, "Something Went Wrong"
	// }
	//defer db.Close()
	if db == nil {
		dbcon, err := ConnectMySqlDb()
		if err != nil {
			logger.Log.Println("Error in DBConnection")
			return t, false, err, "Something Went Wrong"
		}
		db = dbcon
	}
	dataAccess := dao.DbConn{DB: db}
	response = make(map[string]interface{}, 2)
	result, err := dataAccess.RecordGridResultOnly(page)
	if err != nil {
		return t, false, err, "Something Went Wrong"
	}

	response["result"] = result

	total, err := dataAccess.RecordGridCountOnly(page)
	if err != nil {
		return t, false, err, "Something Went Wrong"
	}
	response["total"] = total
	return response, true, nil, ""
}
