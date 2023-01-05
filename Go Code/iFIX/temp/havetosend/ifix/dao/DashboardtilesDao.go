package dao

import (
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

var userspecifictiles = "SELECT distinct a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image FROM mapfunctionalitywithgroup a,mapfunctionality b WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid=? and a.diffid=b.funcdescid and a.userid=? and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=1 AND a.mstfunctionailyid=1"

var groupspecifictiles = "SELECT distinct a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image FROM mapfunctionalitywithgroup a,mapfunctionality b WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid=? and a.diffid=b.funcdescid and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=1 AND a.mstfunctionailyid=1"

var groupspecificbutton = "SELECT distinct a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image FROM mapfunctionalitywithgroup a,mapfunctionality b WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=? AND seqno=? AND deleteflg=0 AND activeflg=1) and a.diffid=b.funcdescid and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=3 AND a.mstfunctionailyid=3 AND (a.recorddifftypestatusid=3 OR a.recorddifftypestatusid is NULL) AND (a.recorddiffstatusid is NULL OR a.recorddiffstatusid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=3 AND seqno=? AND deleteflg=0 AND activeflg=1))"

var groupspecifictab = "SELECT distinct a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image FROM mapfunctionalitywithgroup a,mapfunctionality b WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=? AND seqno=? AND deleteflg=0 AND activeflg=1) and a.diffid=b.funcdescid and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=2 AND a.mstfunctionailyid=2 AND (a.recorddifftypestatusid=3 OR a.recorddifftypestatusid is NULL) AND (a.recorddiffstatusid is NULL OR a.recorddiffstatusid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=3 AND seqno=? AND deleteflg=0 AND activeflg=1))"

//var groupspecificcount = "SELECT distinct a.id ID,a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image FROM mapfunctionalitywithgroup a,mapfunctionality b WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=? AND seqno=? AND deleteflg=0 AND activeflg=1) and a.diffid=b.funcdescid and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=4 AND a.mstfunctionailyid=4 AND (a.recorddifftypestatusid=3 OR a.recorddifftypestatusid is NULL) AND (a.recorddiffstatusid is NULL OR a.recorddiffstatusid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=3 AND seqno=? AND deleteflg=0 AND activeflg=1))"
var groupspecificcount = "SELECT distinct a.diffid Diffid,a.clientid Clientid,a.mstorgnhirarchyid Mstorgnhirarchyid,a.mstfunctionailyid Mstfunctionailyid,b.description Description,b.seqno Seqno,COALESCE(b.colorcode,'') Colorcode,COALESCE(b.image ,'') Image,COALESCE(c.readpermission,'0') Readpermission,COALESCE(c.writepermission,'0') Writepermission FROM mapfunctionality b,mapfunctionalitywithgroup a LEFT JOIN mstsupportgrptermmap c ON c.clientid=? and c.mstorgnhirarchyid=? and c.deleteflg=0 and c.activeflg=1 and c.grpid=a.groupid WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.recorddifftypeid=? and a.recorddiffid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=? AND seqno=? AND deleteflg=0 AND activeflg=1) and a.diffid=b.funcdescid and a.groupid=? and a.deleteflg=0  and a.activeflg=1 and b.deleteflg=0 and b.activeflg=1 AND a.clientid=b.clientid AND a.mstorgnhirarchyid=b.mstorgnhirarchyid AND b.funcid=4 AND a.mstfunctionailyid=4 AND (a.recorddifftypestatusid=3 OR a.recorddifftypestatusid is NULL) AND (a.recorddiffstatusid is NULL OR a.recorddiffstatusid in (SELECT id FROM mstrecorddifferentiation WHERE clientid=? AND mstorgnhirarchyid=? AND recorddifftypeid=3 AND seqno=? AND deleteflg=0 AND activeflg=1))"

func (mdao DbConn) GetTilesnamesUserspecific(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, error) {
	logger.Log.Println("In side GetTilesnamesUserspecific")
	values := []entities.DashboardtilesresponseEntity{}
	rows, err := mdao.DB.Query(userspecifictiles, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Recorddiffid, page.UserID, page.GroupID)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetTilesnamesUserspecific Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.DashboardtilesresponseEntity{}
		err = rows.Scan(&value.Diffid, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstfunctionailyid, &value.Description, &value.Seqno, &value.Colorcode, &value.Image)
		logger.Log.Println(err)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetTilesnamesgroupspecific(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, error) {
	logger.Log.Println("In side GetTilesnamesgroupspecific")
	values := []entities.DashboardtilesresponseEntity{}
	rows, err := mdao.DB.Query(groupspecifictiles, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Recorddiffid, page.GroupID)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetTilesnamesgroupspecific Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.DashboardtilesresponseEntity{}
		err = rows.Scan(&value.Diffid, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstfunctionailyid, &value.Description, &value.Seqno, &value.Colorcode, &value.Image)
		logger.Log.Println(err)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetButtonnamesgroupspecific(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, error) {
	logger.Log.Println("In side GetTilesnamesgroupspecific")
	values := []entities.DashboardtilesresponseEntity{}
	rows, err := mdao.DB.Query(groupspecificbutton, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Recorddifftypeseq, page.GroupID, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypestatusseq)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetTilesnamesgroupspecific Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.DashboardtilesresponseEntity{}
		err = rows.Scan(&value.Diffid, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstfunctionailyid, &value.Description, &value.Seqno, &value.Colorcode, &value.Image)
		logger.Log.Println(err)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetTabnamesgroupspecific(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, error) {
	logger.Log.Println("In side GetTilesnamesgroupspecific")
	values := []entities.DashboardtilesresponseEntity{}
	rows, err := mdao.DB.Query(groupspecifictab, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Recorddifftypeseq, page.GroupID, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypestatusseq)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetTilesnamesgroupspecific Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.DashboardtilesresponseEntity{}
		err = rows.Scan(&value.Diffid, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstfunctionailyid, &value.Description, &value.Seqno, &value.Colorcode, &value.Image)
		logger.Log.Println(err)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetCountnamesgroupspecific(page *entities.DashboardtilesinputEntity) ([]entities.DashboardtilesresponseEntity, error) {
	logger.Log.Println("In side GetTilesnamesgroupspecific")
	values := []entities.DashboardtilesresponseEntity{}
	rows, err := mdao.DB.Query(groupspecificcount, page.Clientid, page.Mstorgnhirarchyid, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypeid, page.Recorddifftypeseq, page.GroupID, page.Clientid, page.Mstorgnhirarchyid, page.Recorddifftypestatusseq)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetTilesnamesgroupspecific Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.DashboardtilesresponseEntity{}
		err = rows.Scan(&value.Diffid, &value.Clientid, &value.Mstorgnhirarchyid, &value.Mstfunctionailyid, &value.Description, &value.Seqno, &value.Colorcode, &value.Image, &value.Readpermission, &value.Writepermission)
		logger.Log.Println(err)
		values = append(values, value)
	}
	return values, nil
}
