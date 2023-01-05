package models

import (
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

func GetOpenTicket(page *entities.OpenTicketEntity) (entities.OpenTicketEntities, bool, error, string) {
	logger.Log.Println("In side Openticketmodel")

	t := entities.OpenTicketEntities{}
	lock.Lock()
	defer lock.Unlock()
	db, err := config.ConnectMySqlDbSingleton()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	// orgntype, err1 := dataAccess.GetOrgnType(page.Clientid, page.Mstorgnhirarchyid)
	// if err1 != nil {
	// 	return t, false, err1, "Something Went Wrong"
	// }

	// tz := entities.UtilityEntity{}
	// tz.Clientid = page.Clientid
	// tz.Mstorgnhirarchyid = page.Mstorgnhirarchyid
	// err2, timediff := dataAccess.Gettimediff(&tz)
	// if err2 != nil {
	// 	return t, false, err2, "Something went wrong"
	// }

	values, err1 := dataAccess.GetOpenTicket(page)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}

	/* convert */
	// for i := 0; i < len(values); i++ {
	// 	values[i].Opendate = dao.Convertdate(values[i].Starttime, timediff[0].Timediff, timediff[0].Timeformat)
	// }

	if page.Offset == 0 {
		total, err1 := dataAccess.GetOpenTicketCount(page)
		if err1 != nil {
			return t, false, err1, "Something Went Wrong"
		}
		t.Total = total.Total
		t.Values = values
	}
	t.Values = values
	return t, true, err, ""
}

func DeleteOpenTicket(tz *entities.OpenTicketEntity) (bool, error, string) {
	logger.Log.Println("In side OpenTicketmodel")
	lock.Lock()
	defer lock.Unlock()
	db, err := config.ConnectMySqlDbSingleton()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	err1 := dataAccess.DeleteOpenTicket(tz)
	if err1 != nil {
		return false, err1, "Something Went Wrong"
	}
	return true, nil, ""
}
