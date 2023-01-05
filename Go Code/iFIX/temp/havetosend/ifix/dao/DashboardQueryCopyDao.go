package dao

import (
	"database/sql"
	"errors"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

var insertDashboardQueryCopy = "INSERT INTO mstdashboarddtls (clientid, mstorgnhirarchyid, mstrecorddifferentiationid, mapfunctionalityid, querytype, query, queryparam, joinquery) VALUES (?,?,?,?,?,?,?,?)"
var duplicateDashboardQueryCopy = "SELECT count(id) total FROM  mstdashboarddtls WHERE clientid = ? AND mstorgnhirarchyid = ?  AND mstrecorddifferentiationid=? AND mapfunctionalityid=?  AND activeflg =1 AND deleteflg = 0 "
var getDashboardQueryCopy = "SELECT a.id as id,a.clientid as clientid,a.mstorgnhirarchyid as mstorgnhirarchyid,a.mstrecorddifferentiationid as recorddiffid,a.mapfunctionalityid as tilesid,a.querytype as querytype,a.query as query,a.queryparam as queryparam,coalesce(a.joinquery,'') as joinquery,b.name as clientname,c.name as mstorgnhirarchyname,d.name as recorddiffname,e.description as tilesname,IF(querytype=1,'Count','details') querytypename FROM mstdashboarddtls a,mstclient b,mstorgnhierarchy c,mstrecorddifferentiation d,mapfunctionality e  WHERE a.clientid = b.id AND a.mstorgnhirarchyid = c.id AND a.mstrecorddifferentiationid = d.id AND a.mapfunctionalityid = e.funcdescid AND a.activeflg = 1 AND a.deleteflg = 0 AND d.activeflg = 1 AND d.deleteflg = 0  AND e.funcid=1 AND e.clientid=1 AND e.mstorgnhirarchyid=1 AND e.activeflg = 1 AND e.deleteflg = 0 ORDER BY a.id DESC LIMIT ?,?;"
var getDashboardQueryCopycount = "SELECT count(a.id) as total FROM mstdashboarddtls a,mstclient b,mstorgnhierarchy c,mstrecorddifferentiation d,mapfunctionality e  WHERE a.clientid = b.id AND a.mstorgnhirarchyid = c.id AND a.mstrecorddifferentiationid = d.id AND a.mapfunctionalityid = e.funcdescid AND a.activeflg = 1 AND a.deleteflg = 0 AND d.activeflg = 1 AND d.deleteflg = 0  AND e.funcid=1 AND e.clientid=1 AND e.mstorgnhirarchyid=1 AND e.activeflg = 1 AND e.deleteflg = 0 ;"

var getDashboardValuesCopy = "SELECT query as Query,queryparam as QueryParam ,joinquery as JoinQuery FROM mstdashboarddtls where clientid=? AND mstorgnhirarchyid=? AND mstrecorddifferentiationid=? AND mapfunctionalityid=? AND querytype=? AND activeflg=1 AND deleteflg=0"

//var updateDashboardQueryCopy = "UPDATE mstexceltemplate SET clientid=?,mstorgnhirarchyid = ?, recorddifftypeid = ?, headername = ?, seqno = ?,templatetypeid=?,recorddiffid=? WHERE id = ? "
var deleteDashboardQueryCopy = "UPDATE mstdashboarddtls SET deleteflg ='1' WHERE id = ? "

func (dbc DbConn) CheckDuplicateDashboardQueryCopy(tz *entities.DashboardQueryCopyEntity) (entities.DashboardQueryCopyEntities, error) {
	logger.Log.Println("In side CheckDuplicateDashboardQueryCopy ")
	value := entities.DashboardQueryCopyEntities{}
	err := dbc.DB.QueryRow(duplicateDashboardQueryCopy, tz.ToClientid, tz.ToMstorgnhirarchyid, tz.ToRecordDiffid, tz.Tilesid).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("CheckDuplicateDashboardQueryCopy Get Statement Prepare Error", err)
		return value, err
	}
}

func (dbc DbConn) AddDashboardQueryCopy(tz *entities.DashboardQueryCopyEntity) (int64, error) {
	logger.Log.Println("In side AddDashboardQueryCopy")
	logger.Log.Println("Query -->", insertDashboardQueryCopy)
	stmt, err := dbc.DB.Prepare(insertDashboardQueryCopy)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("AddDashboardQueryCopy Prepare Statement  Error", err)
		return 0, err
	}
	logger.Log.Println("Parameter -->", tz.ToClientid, tz.ToMstorgnhirarchyid, tz.ToRecordDiffid, tz.Tilesid, tz.QueryType) //, tz.Query.(string), tz.QueryParam.(string), tz.JoinQuery.(string))
	res, err := stmt.Exec(tz.ToClientid, tz.ToMstorgnhirarchyid, tz.ToRecordDiffid, tz.Tilesid, tz.QueryType, tz.Query, tz.QueryParam, tz.JoinQuery)
	if err != nil {
		logger.Log.Println("AddDashboardQueryCopy Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}

func (dbc DbConn) GetDashboardQueryCopy(page *entities.DashboardQueryCopyEntity) (entities.DashboardQueryCopyEntity, error) {
	logger.Log.Println("In side GetDashboardQueryCopy")
	values := entities.DashboardQueryCopyEntity{}
	err := dbc.DB.QueryRow(getDashboardValuesCopy, page.Clientid, page.Mstorgnhirarchyid, page.RecordDiffid, page.Tilesid, page.QueryType).Scan(&values.Query, &values.QueryParam, &values.JoinQuery)

	//rows, err := dbc.DB.Query(getDashboardValuesCopy, page.Clientid, page.Mstorgnhirarchyid, page.RecordDiffid, page.Tilesid, page.QueryType)
	//defer rows.Close()
	switch err {
	case sql.ErrNoRows:
		logger.Log.Println(" No Rows with this information", err)
		return values, errors.New("ERROR: No Rows With This Information")
	case nil:
		return values, nil
	default:
		logger.Log.Println("GetDashboardQueryCopy Get Statement Prepare Error", err)
		return values, err
	}

	// if err == sql.ErrNoRows {
	// 	logger.Log.Println(" No Rows with this information", err)
	// 	return values, errors.New("ERROR: No Rows With This Information")
	// }
	// if err != nil {
	// 	logger.Log.Println("GetDashboardQueryCopy Get Statement Prepare Error", err)
	// 	return values, err
	// }

	// for rows.Next() {
	// 	//value := entities.DashboardQueryCopyEntity{}
	// 	rows.Scan(&values.Query, &values.QueryParam, &values.JoinQuery)
	// 	//values = append(values, value)
	// }
	// return values, nil
}

func (dbc DbConn) GetAllDashboardQueryCopy(page *entities.DashboardQueryCopyEntity) ([]entities.DashboardQueryCopyEntity, error) {
	logger.Log.Println("In side GetAllMstExcelTemplate")
	values := []entities.DashboardQueryCopyEntity{}

	rows, err := dbc.DB.Query(getDashboardQueryCopy, page.Offset, page.Limit)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetAllMstExcelTemplate Get Statement Prepare Error", err)
		return values, err
	}

	for rows.Next() {
		value := entities.DashboardQueryCopyEntity{}
		rows.Scan(&value.Id, &value.Clientid, &value.Mstorgnhirarchyid, &value.RecordDiffid, &value.Tilesid, &value.QueryType, &value.Query, &value.QueryParam, &value.JoinQuery, &value.Clientname, &value.Mstorgnhirarchyname, &value.RecordDiffName, &value.TilesName, &value.QueryTypename)
		values = append(values, value)
	}
	return values, nil
}

// func (dbc DbConn) UpdateDashboardQueryCopy(tz *entities.DashboardQueryCopyEntity) error {
// 	logger.Log.Println("In side UpdateDashboardQueryCopy")
// 	stmt, err := dbc.DB.Prepare(updateDashboardQueryCopy)
// 	defer stmt.Close()
// 	if err != nil {
// 		logger.Log.Println("UpdateDashboardQueryCopy Prepare Statement  Error", err)
// 		return err
// 	}
// 	_, err = stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.RecordDiffTypeid, tz.HeaderName, tz.SeqNo, tz.TemplateTypeid, tz.RecordDiffid, tz.Id)
// 	if err != nil {
// 		logger.Log.Println("UpdateDashboardQueryCopy Execute Statement  Error", err)
// 		return err
// 	}
// 	return nil
// }

func (dbc DbConn) DeleteDashboardQueryCopy(tz *entities.DashboardQueryCopyEntity) error {
	logger.Log.Println("In side DeleteDashboardQueryCopy", tz)
	stmt, err := dbc.DB.Prepare(deleteDashboardQueryCopy)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("DeleteDashboardQueryCopy Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Id)
	if err != nil {
		logger.Log.Println("DeleteDashboardQueryCopy Execute Statement  Error", err)
		return err
	}
	return nil
}

func (dbc DbConn) GetDashboardQueryCopyCount(tz *entities.DashboardQueryCopyEntity) (entities.DashboardQueryCopyEntities, error) {
	logger.Log.Println("In side GetDashboardQueryCopyCount")
	value := entities.DashboardQueryCopyEntities{}
	err := dbc.DB.QueryRow(getDashboardQueryCopycount).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("GetDashboardQueryCopyCount Get Statement Prepare Error", err)
		return value, err
	}
}
