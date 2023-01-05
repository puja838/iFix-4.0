package models

import (
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

func InsertMstslafullfillmentcriteria(tz *entities.MstslafullfillmentcriteriaEntity) (int64, bool, error, string) {
	logger.Log.Println("In side Mstslafullfillmentcriteriamodel")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	if tz.Mstrecorddifferentiationworkingcatid == 0 {
		count, err := dataAccess.CheckDuplicateMstslafullfillmentcriteriawithoutcat(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		if count.Total == 0 {
			id, err := dataAccess.InsertMstslafullfillmentcriteria(tz)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			return id, true, err, ""
		} else {
			return 0, false, nil, "Data Already Exist."
		}
	} else {
		count, err := dataAccess.CheckDuplicateMstslafullfillmentcriteria(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		if count.Total == 0 {
			id, err := dataAccess.InsertMstslafullfillmentcriteria(tz)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			return id, true, err, ""
		} else {
			return 0, false, nil, "Data Already Exist."
		}
	}
}

func GetAllMstslafullfillmentcriteria(page *entities.MstslafullfillmentcriteriaEntity) (entities.MstslafullfillmentcriteriaEntities, bool, error, string) {
	logger.Log.Println("In side Mstslafullfillmentcriteriamodel")
	t := entities.MstslafullfillmentcriteriaEntities{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.GetAllMstslafullfillmentcriteria(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	if page.Offset == 0 {
		total, err1 := dataAccess.GetMstslafullfillmentcriteriaCount(page)
		if err1 != nil {
			return t, false, err1, "Something Went Wrong"
		}
		t.Total = total.Total
		t.Values = values
	}
	t.Values = values
	return t, true, err, ""
}

func DeleteMstslafullfillmentcriteria(tz *entities.MstslafullfillmentcriteriaEntity) (bool, error, string) {
	logger.Log.Println("In side Mstslafullfillmentcriteriamodel")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	err1 := dataAccess.DeleteMstslafullfillmentcriteria(tz)
	if err1 != nil {
		return false, err1, "Something Went Wrong"
	}
	return true, nil, ""
}

func UpdateMstslafullfillmentcriteria(tz *entities.MstslafullfillmentcriteriaEntity) (bool, error, string) {
	logger.Log.Println("In side Mstslafullfillmentcriteriamodel")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}

	if tz.Mstrecorddifferentiationworkingcatid == 0 {
		count, err := dataAccess.CheckDuplicateMstslafullfillmentcriteriawithoutcat(tz)
		if err != nil {
			return false, err, "Something Went Wrong"
		}
		if count.Total == 0 {
			err := dataAccess.UpdateMstslafullfillmentcriteria(tz)
			if err != nil {
				return false, err, "Something Went Wrong"
			}
			return true, err, ""
		} else {
			return false, nil, "Data Already Exist."
		}
	} else {
		count, err := dataAccess.CheckDuplicateMstslafullfillmentcriteria(tz)
		if err != nil {
			return false, err, "Something Went Wrong"
		}
		if count.Total == 0 {
			err := dataAccess.UpdateMstslafullfillmentcriteria(tz)
			if err != nil {
				return false, err, "Something Went Wrong"
			}
			return true, err, ""
		} else {
			return false, nil, "Data Already Exist."
		}
	}

}
