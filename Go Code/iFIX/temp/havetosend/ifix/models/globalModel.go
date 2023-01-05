package models

import (
	"iFIX/ifix/config"
	"iFIX/ifix/entities"
	"log"
	"iFIX/ifix/dao"
)

/**
Get zone details
*/
func Searchzone(tz *entities.ZoneEntity) ([]entities.ZoneEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.ZoneEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Searchzone(tz)
	if err1 != nil {
		log.Println("database connection failure", err)
		return t, false, err1, "Something Went Wrong"
	}
	return values, true, nil, ""
}
