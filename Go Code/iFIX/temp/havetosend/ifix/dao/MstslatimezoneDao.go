package dao

import (
	"database/sql"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

var insertMstslatimezone = "INSERT INTO mstslatimezone (clientid, mstorgnhirarchyid, mstslaid, msttimezoneid) VALUES (?,?,?,?)"
var duplicateMstslatimezone = "SELECT count(id) total FROM  mstslatimezone WHERE mstorgnhirarchyid = ? AND mstslaid = ? AND msttimezoneid = ? AND deleteflg = 0"
var getMstslatimezone = "SELECT a.id as Id, a.clientid as Clientid, a.mstorgnhirarchyid as Mstorgnhirarchyid, a.mstslaid as Mstslaid, a.msttimezoneid as Msttimezoneid, a.activeflg as Activeflg,(select name from mstclient where id = a.clientid ) as Clientname,(select name from mstorgnhierarchy where id = a.mstorgnhirarchyid ) as Mstorgnhirarchyname,(select zone_name from zone where zone_id=a.msttimezoneid) as Zonename,(select slaname from mstclientsla where id=a.mstslaid and deleteflg =0 and activeflg=1) as Slaname FROM mstslatimezone a WHERE a.clientid = ? AND a.mstorgnhirarchyid = ?  AND a.deleteflg =0 and a.activeflg=1 ORDER BY a.id DESC LIMIT ?,?"
var getMstslatimezonecount = "SELECT count(a.id) total FROM  mstslatimezone a,mstclient b,mstorgnhierarchy c,zone d,mstclientsla e WHERE a.clientid = ? AND a.mstorgnhirarchyid = ? AND  a.deleteflg =0 and a.activeflg=1 and a.clientid=b.id and a.mstorgnhirarchyid =c.id and a.msttimezoneid=d.zone_id and e.id=a.mstslaid and e.deleteflg =0 and e.activeflg=1"
var updateMstslatimezone = "UPDATE mstslatimezone SET mstorgnhirarchyid = ?, mstslaid = ?, msttimezoneid = ? WHERE id = ? "
var deleteMstslatimezone = "UPDATE mstslatimezone SET deleteflg = '1' WHERE id = ? "

func (dbc DbConn) CheckDuplicateMstslatimezone(tz *entities.MstslatimezoneEntity) (entities.MstslatimezoneEntities, error) {
	logger.Log.Println("In side CheckDuplicateMstslatimezone")
	value := entities.MstslatimezoneEntities{}
	err := dbc.DB.QueryRow(duplicateMstslatimezone, tz.Mstorgnhirarchyid, tz.Mstslaid, tz.Msttimezoneid).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("CheckDuplicateMstslatimezone Get Statement Prepare Error", err)
		return value, err
	}
}

func (dbc DbConn) InsertMstslatimezone(tz *entities.MstslatimezoneEntity) (int64, error) {
	logger.Log.Println("In side InsertMstslatimezone")
	logger.Log.Println("Query -->", insertMstslatimezone)
	stmt, err := dbc.DB.Prepare(insertMstslatimezone)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("InsertMstslatimezone Prepare Statement  Error", err)
		return 0, err
	}
	logger.Log.Println("Parameter -->", tz.Clientid, tz.Mstorgnhirarchyid, tz.Mstslaid, tz.Msttimezoneid)
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Mstslaid, tz.Msttimezoneid)
	if err != nil {
		logger.Log.Println("InsertMstslatimezone Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}

func (dbc DbConn) GetAllMstslatimezone(page *entities.MstslatimezoneEntity) ([]entities.MstslatimezoneEntity, error) {
	logger.Log.Println("In side GelAllMstslatimezone")
	values := []entities.MstslatimezoneEntity{}
	rows, err := dbc.DB.Query(getMstslatimezone, page.Clientid, page.Mstorgnhirarchyid, page.Offset, page.Limit)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetAllMstslatimezone Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.MstslatimezoneEntity{}
		rows.Scan(&value.Id, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstslaid, &value.Msttimezoneid, &value.Activeflg, &value.Clientname, &value.Mstorgnhirarchyname, &value.Zonename, &value.Slaname)
		values = append(values, value)
	}
	return values, nil
}

func (dbc DbConn) UpdateMstslatimezone(tz *entities.MstslatimezoneEntity) error {
	logger.Log.Println("In side UpdateMstslatimezone")
	stmt, err := dbc.DB.Prepare(updateMstslatimezone)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("UpdateMstslatimezone Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Mstorgnhirarchyid, tz.Mstslaid, tz.Msttimezoneid, tz.Id)
	if err != nil {
		logger.Log.Println("UpdateMstslatimezone Execute Statement  Error", err)
		return err
	}
	return nil
}

func (dbc DbConn) DeleteMstslatimezone(tz *entities.MstslatimezoneEntity) error {
	logger.Log.Println("In side DeleteMstslatimezone")
	stmt, err := dbc.DB.Prepare(deleteMstslatimezone)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("DeleteMstslatimezone Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Id)
	if err != nil {
		logger.Log.Println("DeleteMstslatimezone Execute Statement  Error", err)
		return err
	}
	return nil
}

func (dbc DbConn) GetMstslatimezoneCount(tz *entities.MstslatimezoneEntity) (entities.MstslatimezoneEntities, error) {
	logger.Log.Println("In side GetMstslatimezoneCount")
	value := entities.MstslatimezoneEntities{}
	err := dbc.DB.QueryRow(getMstslatimezonecount, tz.Clientid, tz.Mstorgnhirarchyid).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("GetMstslatimezoneCount Get Statement Prepare Error", err)
		return value, err
	}
}
