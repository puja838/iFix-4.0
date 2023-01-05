package models

import (
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

func GetTilesnames(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, bool, error, string) {
	logger.Log.Println("In side GetTilesnames")
	t := []entities.DashboardtilesresponseEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.GetTilesnamesUserspecific(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}

	if len(values) > 0 {
		return values, true, err, ""
	} else {
		vales, err1 := dataAccess.GetTilesnamesgroupspecific(page)
		if err1 != nil {
			return t, false, err1, "Something Went Wrong"
		}
		return vales, true, err, ""
	}

}

func GetTabsButtonnames(page *entities.DashboardtilesinputEntity) (entities.Dashboardbuttontab, bool, error, string) {
	logger.Log.Println("In side GetTilesnames")
	t := entities.Dashboardbuttontab{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}

	tabvalues, err1 := dataAccess.GetTabnamesgroupspecific(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	buttonvalues, err1 := dataAccess.GetButtonnamesgroupspecific(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	countvalues, err1 := dataAccess.GetCountnamesgroupspecific(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	t.Buttons = buttonvalues
	t.Tabs = tabvalues
	t.Count = countvalues
	return t, true, err, ""

}
