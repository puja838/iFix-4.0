package models

import (
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"log"
)

func GetUserActionname(tz *entities.UserroleactionnameEntity) ([]int64, bool, error, string) {
	logger.Log.Println("In side model")
	db, err := config.ConnectMySqlDb()
	var ids []int64
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return ids, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	ids, err1 := dataAccess.GetUserRolewiseActionname(tz)
	if err1 != nil {
		return ids, false, err1, "Something Went Wrong"
	}
	if len(ids) > 0 {
		return ids, true, nil, ""
	} else {
		ids, err1 := dataAccess.GetRolewiseActionname(tz)
		if err1 != nil {
			return ids, false, err1, "Something Went Wrong"
		}
		return ids, true, nil, ""
	}
}
