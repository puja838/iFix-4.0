//***************************//
// Package dao
// Date Of Creation: 11/01/2021
// Authour Name: Subham Chatterjee
// History: N/A
// Synopsis: This file is used for workflow related work. It is used as DAO. All DB operation is defiend here.
// Functions: InsertMstCountry,GetMstCountryByID,GetMstCountryAll,DelMstCountryByID, UpdateMstCountryByID
// InsertMstCountry() Parameter:  (<*entities.MstCountry>)
// GetMstCountryByID() Parameter:  (<*entities.MstCountry>)
// GetMstCountryAll() Parameter:  (<*entities.MstCountry>)
// DelMstCountryByID() Parameter:  (<*entities.MstCountry>)
// UpdateMstCountryByID() Parameter:  (<*entities.MstCountry>)
// Global Variable: N/A
// Version: 1.0.0
//***************************//

package dao

import (
	"iFIX/ifix/entities"
	"database/sql"
	"iFIX/ifix/logger"
	"log"
	"time"
)

var inserttransitiongroupquery = "INSERT INTO maprecorddifferentiongroup (clientid, mstorgnhirarchyid, processid,recorddifftypeid,recorddiffid,mstgroupid,mstuserid,transitionid) VALUES (?,?,?,?,?,?,?,?)"
var inserttransitionquery = "INSERT INTO msttransition (clientid, mstorgnhirarchyid, processid,currentstateid,previousstateid) VALUES (?,?,?,?,?)"
var createworkflowquery = "INSERT INTO mstprocess (clientid, mstorgnhirarchyid, processname) VALUES (?,?,?)"
var mapcategoryprocessquery = "INSERT INTO mstprocessrecordmap (clientid, mstorgnhirarchyid, recorddifftypeid,recorddiffid,mstprocessid) VALUES (?,?,?,?,?)"
var insertdelegate = "INSERT INTO mapprocesswithdelegateuser (clientid, mstorgnhirarchyid, processid,transitionid,groupid,userid,starttime,endtime) VALUES (?,?,?,?,?,?,?,?)"
var getProcessByCategory = "SELECT mstprocessid as Processid from mstprocessrecordmap where clientid=? and mstorgnhirarchyid=? and recorddifftypeid = ? and recorddiffid =? and deleteflg=0 and activeflg=1"
var getTableByProcess = "SELECT a.tablename as Tablename from mstdatadictionarytable a,mstdatadictionaryfield b,mapprocesstoentity c where c.clientid=? and c.mstorgnhirarchyid=? and c.mstprocessid=? and  c.mstdatadictionaryfieldid=b.id and b.tableid=a.id and c.activeflg=1 and c.deleteflg=0;"
var getTransitionState = "SELECT id as Transitionid from msttransition where clientid=? and mstorgnhirarchyid = ? and processid = ? and previousstateid=? and currentstateid=? and activeflg=1  and deleteflg=0"
var getDelegateUserbyTransition = "SELECT groupid as Mstgroupid,userid as Mstuserid from mapprocesswithdelegateuser where processid=? and transitionid=? and starttime >= ? and endtime < ?"
var getStateUser = "SELECT mstgroupid as Mstgroupid,mstuserid as Mstuserid from maprecorddifferentiongroup where processid=? and transitionid=? and activeflg=1 and deleteflg=0"
var getLatestStageDetails = "SELECT id as Recordstageid from trnrecordstage where recordid=? and deleteflg=0 and activeflg=1 ORDER BY id DESC LIMIT 1"
var getRequestIdByStageId = "SELECT mstrequestid as Requestid from maprequestorecord where recordid=? and deleteflg=0 and activeflg=1 "
var getIdByStageId = "SELECT id from maprequestorecord where recordid=? and recordstageid=? and deleteflg=0 and activeflg=1 "
var insertRequest = "INSERT INTO mstrequest (clientid, mstorgnhirarchyid, processid,title,daterequested,userid,currentstateid,transitionid,mstgroupid,mstuserid) VALUES (?,?,?,?,?,?,?,?,?,?)"
var updateRequest = "UPDATE mstrequest set processid=?,daterequested=?,userid=?,currentstateid=?,transitionid=?,mstgroupid=?,mstuserid=? where id=?"
var insertRequestHistory = "INSERT INTO mstrequesthistory (clientid, mstorgnhirarchyid, processid,mainrequestid,title,userid,daterequested,currentstateid,transitionid,dateoftransition,manualstateselection,mstgroupid,mstuserid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
var insertRequestStage = "INSERT INTO maprequestorecord (clientid, mstorgnhirarchyid, recordid,recordstageid,mstrequestid,dateofrecordchange) VALUES (?,?,?,?,?,?)"
var mapProcessToEntity = "INSERT INTO mapprocesstoentity (clientid, mstorgnhirarchyid, mstprocessid,mstdatadictionaryfieldid) VALUES (?,?,?,?)"
var duplicatetransition = "SELECT id  FROM  msttransition WHERE clientid = ? AND mstorgnhirarchyid = ? AND processid=? AND currentstateid = ? AND previousstateid=? AND activeflg=1 AND deleteflg = 0"
var updateprocessdetails = "UPDATE mstprocessdetails set details=?,detailsjson=?,iscomplete=? where id=?"
var insertprocess = "INSERT into mstprocessdetails(clientid,mstorgnhirarchyid,processid,details,detailsjson,iscomplete) values(?,?,?,?,?,?)"
var getprocess = "SELECT id, details,detailsjson from mstprocessdetails where clientid=? and mstorgnhirarchyid=? and processid=? and activeflg=1 and deleteflg=0"
var transitionbystate = "SELECT id from msttransition where clientid=? and mstorgnhirarchyid =? and currentstateid=? and activeflg=1 and deleteflg=0"
var tstatedetails = "SELECT a.mstgroupid,a.mstuserid FROM maprecorddifferentiongroup a where a.transitionid=? and a.activeflg=1 and a.deleteflg=0"
var transitionuser = "SELECT loginname from mstclientuser WHERE id=? and activeflag=1 and deleteflag=0"

var transitiongroup = "SELECT COALESCE(a.id,0) as Mstgroupid,COALESCE(a.name,'') as groupname,COALESCE(b.id,0) as Mstuserid,COALESCE(b.loginname,'') loginname from maprecorddifferentiongroup c left join mstclientuser b on c.mstuserid=b.id and b.activeflag=1 and b.deleteflag=0 left join mstsupportgrp a on a.id=c.mstgroupid  and a.activeflg=1 and a.deleteflg=0  where  c.clientid=? and c.mstorgnhirarchyid=? and c.transitionid=?  and c.activeflg=1 and c.deleteflg=0"
var checkprocessdelete = "SELECT id from mstrequesthistory where clientid=? and mstorgnhirarchyid=? and processid=? and activeflg=1 and deleteflg=0"
var duplicatetransitiondetails = "SELECT id from maprecorddifferentiongroup where transitionid=? and activeflg=1 and deleteflg=0"
var updatetdetais = "UPDATE maprecorddifferentiongroup set recorddifftypeid=?,recorddiffid=?,mstgroupid=?,mstuserid=? where clientid=? and mstorgnhirarchyid=?  and transitionid =?"
var alltstatedetails = "SELECT a.recorddifftypeid,a.recorddiffid,a.mstgroupid,a.mstuserid FROM maprecorddifferentiongroup a where a.transitionid=? and a.activeflg=1 and a.deleteflg=0"
var getcurrentstateid = "SELECT currentstateid  from msttransition where clientid=? and mstorgnhirarchyid = ? and processid = ? and previousstateid=?  and activeflg=1  and deleteflg=0"
var statedetails = "SELECT a.currentstateid,a.transitionid,a.mstgroupid,a.mstuserid,b.statename,h.name supportgroupname,c.supportgrouplevelid grplevel,f.name status,f.seqno,COALESCE(g.name,'') username,f.id recorddiffid,f.recorddifftypeid recorddifftypeid from maprequestorecord d,mstrequest a left join mstclientuser g on a.mstuserid=g.id and g.activeflag=1 and g.deleteflag=0,mststate b,mstclientsupportgroup c,maprecordstatetodifferentiation e,mstrecorddifferentiation f,mstsupportgrp h where  d.clientid=? and d.mstorgnhirarchyid = ? and d.recordid=? and d.recordstageid=? and d.mstrequestid=a.id and d.activeflg=1  and d.deleteflg=0 and a.currentstateid=b.id and a.mstgroupid=c.grpid and a.currentstateid=e.mststateid  and a.activeflg=1  and a.deleteflg=0 and b.activeflg=1  and b.deleteflg=0 AND c.grpid= h.id AND c.clientid=? AND c.mstorgnhirarchyid=? and c.activeflg=1  and c.deleteflg=0 and e.recorddiffid=f.id and e.activeflg=1  and e.deleteflg=0 and f.activeflg=1  and f.deleteflg=0 AND h.activeflg = 1 AND h.deleteflg = 0"

//var nextstatedetails = "select a.currentstateid,b.statename,c.recorddifftypeid,c.recorddiffid,d.seqno from msttransition a,mststate b,maprecordstatetodifferentiation c,mstrecorddifferentiation d where a.processid=? and a.previousstateid=? and a.currentstateid=b.id and a.currentstateid=c.mststateid and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0 and c.recorddiffid=d.id and c.activeflg=1 and c.deleteflg=0 and d.activeflg=1 and d.deleteflg=0"
var checkprocesscomplete = "select iscomplete from mstprocessdetails where clientid=? and mstorgnhirarchyid=? and processid=? and activeflg=1 and deleteflg=0"
var updaterequestgroup = "UPDATE mstrequest set mstgroupid=?,mstuserid=? where id=?"
var getlatesthistory = "SELECT  a.clientid ,a.mstorgnhirarchyid,a.processid,a.userid,a.currentstateid,a.transitionid,a.manualstateselection,COALESCE(b.loginname,'') loginname,c.name groupname from mstrequesthistory a left join mstclientuser b on a.mstuserid=b.id and b.activeflag=1 and b.deleteflag=0,mstsupportgrp c  where a.mainrequestid=? and a.activeflg=1 and a.deleteflg=0 and  a.mstgroupid=c.id and c.activeflg=1 and c.deleteflg=0 order by a.id desc limit 1"
var lastaction = "select COALESCE(a.name,'') Lastusername,b.name as Lastgroupname from mstrequesthistory c left join mstclientuser a on c.mstuserid=a.id and a.activeflag=1 and a.deleteflag=0,mstsupportgrp b where c.mainrequestid=? and c.mstgroupid not in (?) and c.mstgroupid=b.id  and c.activeflg=1 and c.deleteflg=0 and b.activeflg=1 and b.deleteflg=0  order by c.id desc limit 1"
var insertstateactivity = "INSERT into msttransitionactivitymap(clientid,mstorgnhirarchyid,transitionid,activityid) values(?,?,?,?)"
var activitybytransition = "SELECT a.activityid as id,b.actiontypeid FROM iFIX.msttransitionactivitymap a,mstactivity b where a.clientid=? and a.mstorgnhirarchyid=? and a.transitionid=? and a.activityid=b.id and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0;"
var processtransition = "SELECT distinct a.currentstateid,b.statename currentstate,c.recorddifftypeid,c.recorddiffid from msttransition a ,mststate b,maprecordstatetodifferentiation c where a.clientid=? and a.mstorgnhirarchyid=? and a.processid=?  and a.currentstateid=b.id and a.activeflg=1 and a.deleteflg=0 and b.id=c.mststateid and b.activeflg=1 and b.deleteflg=0 and c.activeflg=1 and c.deleteflg=0 "
var checkismanualtransition = "SELECT manualstateselection from mstrequesthistory where mainrequestid=? and activeflg=1 and deleteflg=0 order by id desc limit 1"
var getprevsenderdetails = "SELECT currentstateid,mstgroupid as Mstgroupid,mstuserid as Mstuserid from mstrequesthistory where mainrequestid =?  and activeflg=1 and deleteflg=0 order by id desc "

//var getprocesssrequestdetails="SELECT clientid,mstorgnhirarchyid,processid,title as recordtitle,userid,currentstateid,transitionid,mstgroupid,mstuserid from mstrequest where id=? and activeflg=1 and deleteflg=0"
var getprocesssrequestdetails = "SELECT a.clientid,a.mstorgnhirarchyid,a.processid,a.title as recordtitle,a.userid,a.currentstateid,a.transitionid,a.mstgroupid,a.mstuserid,COALESCE(b.loginname,'') loginname,c.name groupname from mstrequest a left join mstclientuser b on a.mstuserid=b.id and b.activeflag=1 and b.deleteflag=0,mstsupportgrp c where a.id=? and a.activeflg=1 and a.deleteflg=0 and  a.mstgroupid=c.id and c.activeflg=1 and c.deleteflg=0"
var getgroupname = "SELECT name groupname from mstsupportgrp where id=? and activeflg=1 and deleteflg=0"
var getusername = "SELECT loginname,name from mstclientuser where id=? and activeflag=1 and deleteflag=0"
var getgrpidsbymainreqstid = "select mstgroupid from mstrequesthistory where mainrequestid=? and activeflg =1 and deleteflg=0 and mstgroupid IN (select id from mstclientsupportgroup where supportgrouplevelid>1 and activeflg =1 and deleteflg=0)"
var getchildticket = "select childrecordid from mstparentchildmap where clientid=? and mstorgnhirarchyid=? and parentrecordid=? and activeflg=1 and deleteflg=0 "
var getseqno = "select b.seqno,b.id from maprecordtorecorddifferentiation a,mstrecorddifferentiation b where a.recordid=? and a.recorddifftypeid in (SELECT id from mstrecorddifferentiationtype where seqno=? and activeflg=1 and deleteflg=0 ) and a.recorddiffid=b.id and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0 order by a.id desc limit 1"
var getrelmanager = "select b.userid,b.groupid from mstclientuser a ,mstgroupmember b where a.id= ? and a.relmanagerid=b.userid and a.activeflag=1 and a.deleteflag=0 and b.activeflg=1 and b.deleteflg=0"
var statebytranid = "select currentstateid,previousstateid from msttransition where id=?"

func (mdao DbConn) Getstatebytranid(transitionid int64) ([]entities.Workflowentity, error) {
	logger.Log.Println("Getstatebytranid: ", transitionid)
	values := []entities.Workflowentity{}
	stmt, err := mdao.DB.Prepare(statebytranid)
	if err != nil {
		logger.Log.Print("Getstatebytranid Statement Prepare Error", err)
		log.Print("Getstatebytranid Statement Prepare Error", err)
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(transitionid)
	if err != nil {
		logger.Log.Print("Getstatebytranid Statement Execution Error", err)
		log.Print("Getstatebytranid Statement Execution Error", err)
		return nil, err
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Currentstateid, &value.Previousstateid)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getuserrelmanager(userid int64) ([]entities.Workflowentity, error) {
	logger.Log.Println("Getuserrelmanager: ", userid)
	values := []entities.Workflowentity{}
	stmt, err := mdao.DB.Prepare(getrelmanager)
	if err != nil {
		logger.Log.Print("Getuserrelmanager Statement Prepare Error", err)
		log.Print("Getuserrelmanager Statement Prepare Error", err)
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(userid)
	if err != nil {
		logger.Log.Print("Getuserrelmanager Statement Execution Error", err)
		log.Print("Getuserrelmanager Statement Execution Error", err)
		return nil, err
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Mstuserid, &value.Mstgroupid)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getdiffseqno(recordid int64, seqno int64) (int64, int64, error) {
	logger.Log.Println("Getdiffseqno: ", recordid, seqno)
	var seq int64
	var id int64
	stmt, err := mdao.DB.Prepare(getseqno)
	if err != nil {
		logger.Log.Print("Getdiffseqno Statement Prepare Error", err)
		log.Print("Getdiffseqno Statement Prepare Error", err)
		return 0, 0, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(recordid, seqno)
	if err != nil {
		logger.Log.Print("Getdiffseqno Statement Execution Error", err)
		log.Print("Getdiffseqno Statement Execution Error", err)
		return 0, 0, err
	}
	for rows.Next() {
		rows.Scan(&seq, &id)
	}
	logger.Log.Println("sending....", seq, id)
	return seq, id, nil
}
func (mdao DbConn) Getchildticket(tz *entities.Workflowentity) (error, []int64) {
	var S []int64
	stmt, err := mdao.DB.Prepare(getchildticket)
	if err != nil {
		logger.Log.Print("Getchildticket Statement Prepare Error", err)
		log.Print("Getchildticket Statement Prepare Error", err)
		return err, S
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Clientid, tz.Mstorgnhirarchyid, tz.Transactionid)
	if err != nil {
		logger.Log.Print("Getchildticket Statement Execution Error", err)
		log.Print("Getchildticket Statement Execution Error", err)
		return err, S
	}
	for rows.Next() {
		var value int64
		rows.Scan(&value)
		S = append(S, value)
	}
	return nil, S
}
func (mdao DbConn) Gethopcount(id int64) (error, []int64) {
	var S []int64
	stmt, err := mdao.DB.Prepare(getgrpidsbymainreqstid)
	if err != nil {
		logger.Log.Print("Gethopcount Statement Prepare Error", err)
		log.Print("Gethopcount Statement Prepare Error", err)
		return err, S
	}
	defer stmt.Close()
	rows, err := stmt.Query(id)
	if err != nil {
		logger.Log.Print("Gethopcount Statement Execution Error", err)
		log.Print("Gethopcount Statement Execution Error", err)
		return err, S
	}
	for rows.Next() {
		var value int64
		rows.Scan(&value)
		S = append(S, value)
	}
	return nil, S
}
func (mdao DbConn) Getgroupname(id int64) (error, []entities.Workflowentity) {
	requestIds := []entities.Workflowentity{}
	stmt, err := mdao.DB.Prepare(getgroupname)
	if err != nil {
		log.Print("Getgroupname Statement Prepare Error", err)
		logger.Log.Print("Getgroupname Statement Prepare Error", err)
		return err, requestIds
	}
	defer stmt.Close()
	rows, err := stmt.Query(id)
	if err != nil {
		log.Print("Getgroupname Statement Execution Error", err)
		logger.Log.Print("Getgroupname Statement Execution Error", err)
		return err, requestIds
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Groupname)
		requestIds = append(requestIds, value)
	}
	return nil, requestIds
}
func (mdao DbConn) Getusername(id int64) (error, []entities.Workflowentity) {
	requestIds := []entities.Workflowentity{}
	stmt, err := mdao.DB.Prepare(getusername)
	if err != nil {
		log.Print("Getusername Statement Prepare Error", err)
		return err, requestIds
	}
	defer stmt.Close()
	rows, err := stmt.Query(id)
	if err != nil {
		log.Print("Getusername Statement Execution Error", err)
		return err, requestIds
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Loginname, &value.Username)
		requestIds = append(requestIds, value)
	}
	return nil, requestIds
}
func (mdao DbConn) Getprocessrequestdetails(requestid int64) (error, []entities.Workflowentity) {
	requestIds := []entities.Workflowentity{}
	stmt, err := mdao.DB.Prepare(getprocesssrequestdetails)
	if err != nil {
		log.Print("Getprocessrequestdetails Statement Prepare Error", err)
		return err, requestIds
	}
	defer stmt.Close()
	rows, err := stmt.Query(requestid)
	if err != nil {
		log.Print("Getprocessrequestdetails Statement Execution Error", err)
		return err, requestIds
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Clientid, &value.Mstorgnhirarchyid, &value.Processid, &value.Recordtitle, &value.Createduserid, &value.Currentstateid, &value.Transitionid, &value.Mstgroupid, &value.Mstuserid, &value.Loginname, &value.Groupname)
		requestIds = append(requestIds, value)
	}
	return nil, requestIds
}
func (mdao DbConn) Getprevioussenderdetails(id int64) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(getprevsenderdetails, id)

	if err != nil {
		logger.Log.Print("Getprevioussenderdetails Get Statement Prepare Error", err)
		log.Print("Getprevioussenderdetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Currentstateid, &value.Mstgroupid, &value.Mstuserid)
		values = append(values, value)
	}
	//defer mdao.DB.Close()
	return values, nil
}

func (mdao DbConn) Ismanualselection(requestid int64) (bool, error) {
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(checkismanualtransition, requestid)

	if err != nil {
		logger.Log.Print("Ismanualselection Get Statement Prepare Error", err)
		log.Print("Ismanualselection Get Statement Prepare Error", err)
		return false, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		err := rows.Scan(&value.Manualstateselection)
		if err != nil {
			logger.Log.Print("Ismanualselection Sacn Error", err)
			log.Print("Ismanualselection Sacn Error", err)
			return false, err
		}
		values = append(values, value)
	}
	if len(values) > 0 {
		if values[0].Manualstateselection == 0 {
			return false, nil
		} else {
			return true, nil
		}
	} else {
		return false, nil
	}

}
func (mdao DbConn) Gettransitionbyprocess(tz *entities.Workflowentity) ([]entities.WorkflowTransitionEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowTransitionEntity{}
	rows, err := mdao.DB.Query(processtransition, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)

	if err != nil {
		logger.Log.Print("Gettransitionbyprocess Get Statement Prepare Error", err)
		log.Print("Gettransitionbyprocess Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowTransitionEntity{}
		err := rows.Scan(&value.Currentstateid, &value.Currentstate, &value.Recorddifftypeid, &value.Recorddiffid)
		if err != nil {
			logger.Log.Print("Gettransitionbyprocess Sacn Error", err)
			log.Print("Gettransitionbyprocess Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) Getactivitybytransition(tz *entities.Workflowentity) ([]entities.MstactivitySingleEntity, error) {
	log.Println("In side dao")
	values := []entities.MstactivitySingleEntity{}
	rows, err := mdao.DB.Query(activitybytransition, tz.Clientid, tz.Mstorgnhirarchyid, tz.Transitionid)

	if err != nil {
		logger.Log.Print("Getactivitybytransition Get Statement Prepare Error", err)
		log.Print("Getactivitybytransition Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.MstactivitySingleEntity{}
		err := rows.Scan(&value.Id, &value.Actiontypeid)
		if err != nil {
			logger.Log.Print("Getactivitybytransition Sacn Error", err)
			log.Print("Getactivitybytransition Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}

func Deleteactivitydetails(tz *entities.Workflowentity, tx *sql.Tx, ids string) error {
	logger.Log.Print("Deleteactivitydetails ", tz, ids)
	log.Print("Deleteactivitydetails", tz, ids)
	var deleteactivitydetails = "DELETE FROM msttransitionactivitymap  WHERE clientid=? and mstorgnhirarchyid=? and transitionid in (" + ids + ")"
	stmt, err := tx.Prepare(deleteactivitydetails)
	if err != nil {
		logger.Log.Print("Deleteactivitydetails Prepare Statement  Error", err)
		log.Print("Deleteactivitydetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid)
	if err != nil {
		logger.Log.Print("Deleteactivitydetails Execute Statement  Error", err)
		log.Print("Deleteactivitydetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Insertstateactivity(tz *entities.Workflowentity, tx *sql.Tx) (int64, error) {
	grpstmt, grperr := tx.Prepare(insertstateactivity)

	if grperr != nil {
		logger.Log.Print("Insertstateactivity group Prepare Statement Prepare Error", grperr)
		log.Print("Insertstateactivity group Prepare Statement Prepare Error", grperr)
		return 0, grperr
	}
	defer grpstmt.Close()
	_, err := grpstmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Transitionid, tz.Activity)
	if err != nil {
		logger.Log.Print("Insertstateactivity group Save Statement Execution Error", err)
		log.Print("Insertstateactivity group Save Statement Execution Error", err)
		return 0, err
	}
	return 1, nil
}
func (mdao DbConn) Getlastactioner(id int64, groupid int64) ([]entities.TransactionRespEntity, error) {
	log.Println("\n\nIn side Getlastactioner dao----->", id, groupid)
	values := []entities.TransactionRespEntity{}
	rows, err := mdao.DB.Query(lastaction, id, groupid)

	if err != nil {
		logger.Log.Print("Getlastactioner Get Statement Prepare Error", err)
		log.Print("Getlastactioner Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.TransactionRespEntity{}
		rows.Scan(&value.Lastusername, &value.Lastgroupname)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Fetchhistorybyrequestid(id int64) ([]entities.Workflowentity, error) {
	log.Println("In side Fetchhistorybyrequestid dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(getlatesthistory, id)

	if err != nil {
		logger.Log.Print("Fetchhistorybyrequestid Get Statement Prepare Error", err)
		log.Print("Fetchhistorybyrequestid Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Clientid, &value.Mstorgnhirarchyid, &value.Processid, &value.Createduserid, &value.Currentstateid, &value.Transitionid, &value.Manualstateselection, &value.Loginname, &value.Groupname)
		values = append(values, value)
	}
	return values, nil
}
func Updaterequestgroup(tz *entities.Workflowentity, tx *sql.Tx, id int64) error {
	log.Println("In side dao")
	stmt, err := tx.Prepare(updaterequestgroup)

	if err != nil {
		logger.Log.Print("Updaterequestgroup Prepare Statement  Error", err)
		log.Print("Updaterequestgroup Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Mstgroupid, tz.Mstuserid, id)
	if err != nil {
		logger.Log.Print("Updaterequestgroup Execute Statement  Error", err)
		log.Print("Updaterequestgroup Execute Statement  Error", err)
		return err
	}
	return nil
}
func (mdao DbConn) Checkprocesscomplete(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side checkprocesscomplete dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(checkprocesscomplete, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)

	if err != nil {
		logger.Log.Print("checkprocesscomplete Get Statement Prepare Error", err)
		log.Print("checkprocesscomplete Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Iscomplete)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getnextstatedetails(tz *entities.Workflowentity, ids string) ([]entities.TransactionRespEntity, error) {
	log.Println("In side nextstatedetails dao")
	values := []entities.TransactionRespEntity{}
	var nextstatedetails = "select a.id,a.currentstateid,b.statename,c.recorddifftypeid,c.recorddiffid,d.seqno from msttransition a,mststate b,maprecordstatetodifferentiation c,mstrecorddifferentiation d where a.processid=? and a.id in(" + ids + ") and a.currentstateid=b.id and a.currentstateid=c.mststateid and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0 and c.recorddiffid=d.id and c.activeflg=1 and c.deleteflg=0 and d.activeflg=1 and d.deleteflg=0"
	rows, err := mdao.DB.Query(nextstatedetails, tz.Processid)

	if err != nil {
		logger.Log.Print("nextstatedetails Get Statement Prepare Error", err)
		log.Print("nextstatedetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.TransactionRespEntity{}
		rows.Scan(&value.Transitionid, &value.Currentstateid, &value.Statename, &value.Recorddifftypeid, &value.Recorddiffid, &value.Seqno)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getstatedetails(tz *entities.Workflowentity) ([]entities.TransactionRespEntity, error) {
	log.Println("In side dao")
	values := []entities.TransactionRespEntity{}
	rows, err := mdao.DB.Query(statedetails, tz.Clientid, tz.Mstorgnhirarchyid, tz.Recordid, tz.Recordstageid, tz.Clientid, tz.Mstorgnhirarchyid)

	if err != nil {
		logger.Log.Print("Getstatedetails Get Statement Prepare Error", err)
		log.Print("Getstatedetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.TransactionRespEntity{}
		err = rows.Scan(&value.Currentstateid, &value.Transitionid, &value.Groupid, &value.Userid, &value.Statename, &value.Supportgroupname, &value.Grplevel, &value.Status, &value.Seqno, &value.Username, &value.Recorddiffid, &value.Recorddifftypeid)
		if err != nil {
			logger.Log.Print("Getstatedetails Scan Prepare Error", err)
			log.Print("Getstatedetails Scan Prepare Error", err)
			//return values, err
		}
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) Getcurrentstateid(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(getcurrentstateid, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Previousstateid)

	if err != nil {
		log.Print("GetTransitionState Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Currentstateid)
		values = append(values, value)
	}
	return values, nil
}

func Deletetransitiondetails(tz *entities.Workflowentity, tx *sql.Tx, ids string) error {
	logger.Log.Print("Deletetransitiondetails ", tz, ids)
	log.Print("Deletetransitiondetails", tz, ids)
	var deletetransitiondetails = "DELETE FROM maprecorddifferentiongroup  WHERE clientid=? and mstorgnhirarchyid=? and transitionid in (" + ids + ")"
	stmt, err := tx.Prepare(deletetransitiondetails)
	if err != nil {
		logger.Log.Print("Deletetransitiondetails Prepare Statement  Error", err)
		log.Print("Deletetransitiondetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid)
	if err != nil {
		logger.Log.Print("Deletetransitiondetails Execute Statement  Error", err)
		log.Print("Deletetransitiondetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deletetransition(tz *entities.Workflowentity, tx *sql.Tx, ids string) error {
	logger.Log.Print("Deletetransition ", tz, ids)
	log.Print("Deletetransition", tz, ids)
	var deletetransition = "DELETE FROM msttransition  WHERE clientid=? and mstorgnhirarchyid=? and id in (" + ids + ")"
	stmt, err := tx.Prepare(deletetransition)
	if err != nil {
		logger.Log.Print("Deletetransition Prepare Statement  Error", err)
		log.Print("Deletetransition Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid)
	if err != nil {
		logger.Log.Print("Deletetransition Execute Statement  Error", err)
		log.Print("Deletetransition Execute Statement  Error", err)
		return err
	}
	return nil
}
func (mdao DbConn) Getalltransitionstatedetails(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(alltstatedetails, tz.Transitionid)
	defer rows.Close()
	if err != nil {
		log.Print("Getalltransitionstatedetails Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		err := rows.Scan(&value.Recorddifftypeid, &value.Recorddiffid, &value.Mstgroupid, &value.Mstuserid)
		if err != nil {
			log.Print("Getalltransitionstatedetails Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Duplicatetransitiondetails(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	logger.Log.Print("Duplicatetransitiondetails ", )
	log.Print("Duplicatetransitiondetails ", tz.Transitionid)
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(duplicatetransitiondetails, tz.Transitionid)

	if err != nil {
		logger.Log.Print("Duplicatetransitiondetails Get Statement Prepare Error", err)
		log.Print("Duplicatetransitiondetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		err := rows.Scan(&value.Id)
		if err != nil {
			logger.Log.Print("Duplicatetransitiondetails Sacn Error", err)
			log.Print("Duplicatetransitiondetails Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Updatetransitiondetails(tz *entities.Workflowentity) error {
	logger.Log.Print("Updatetransitiondetails ")
	log.Print("Updatetransitiondetails", tz)

	stmt, err := mdao.DB.Prepare(updatetdetais)

	if err != nil {
		logger.Log.Print("Updatetransitiondetails Prepare Statement  Error", err)
		log.Print("Updatetransitiondetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Recorddifftypeid, tz.Recorddiffid, tz.Mstgroupid, tz.Mstuserid, tz.Clientid, tz.Mstorgnhirarchyid, tz.Transitionid)

	if err != nil {
		logger.Log.Print("Updatetransitiondetails Execute Statement  Error", err)
		log.Print("Updatetransitiondetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Inserttransitiondetails(tz *entities.Workflowentity, tx *sql.Tx) (int64, error) {
	grpstmt, grperr := tx.Prepare(inserttransitiongroupquery)

	if grperr != nil {
		log.Print("Inserttransitiondetails group Prepare Statement Prepare Error", grperr)
		return 0, grperr
	}
	defer grpstmt.Close()
	_, err := grpstmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Recorddifftypeid, tz.Recorddiffid, tz.Mstgroupid, tz.Mstuserid, tz.Transitionid)
	if err != nil {
		log.Print("Inserttransitiondetails group Save Statement Execution Error", err)
		return 0, err
	}
	return 1, nil
}
func Createtransition(tz *entities.Workflowentity, tx *sql.Tx) (int64, error) {
	stmt, err := tx.Prepare(inserttransitionquery)
	if err != nil {
		log.Print("Createtransition Prepare Statement Prepare Error", err)
		return 0, err
	}
	defer stmt.Close()
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Currentstateid, tz.Previousstateid)
	if err != nil {
		log.Print("Createtransition Save Statement Execution Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}
func (mdao DbConn) Checkprocessdelete(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(checkprocessdelete, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)

	if err != nil {
		logger.Log.Println("checkprocessdelete Get Statement Prepare Error", err)
		log.Print("checkprocessdelete Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		err := rows.Scan(&value.Id)
		if err != nil {
			logger.Log.Println("checkprocessdelete Scan Error", err)
			log.Print("checkprocessdelete Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Gettransitionuser(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(transitionuser, tz.Mstuserid)

	if err != nil {
		log.Print("Gettransitionuser Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		err := rows.Scan(&value.Loginname)
		if err != nil {
			log.Print("Gettransitionuser Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Gettransitiongroup(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(transitiongroup, tz.Clientid, tz.Mstorgnhirarchyid, tz.Transitionid)

	if err != nil {
		log.Print("Gettransitiongroup Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		err := rows.Scan(&value.Mstgroupid, &value.Groupname, &value.Mstuserid, &value.Loginname)
		if err != nil {
			log.Print("Gettransitiongroup Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Updateprocessdetails(tz *entities.Workflowentity) error {
	log.Println("In side dao")
	stmt, err := mdao.DB.Prepare(updateprocessdetails)
	defer stmt.Close()
	if err != nil {
		log.Print("Updateprocessdetails Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Details, tz.Detailsjson, tz.Iscomplete, tz.Id)
	if err != nil {
		log.Print("Updateprocessdetails Execute Statement  Error", err)
		return err
	}

	return nil
}
func (mdao DbConn) Gettransitionstatedetails(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(tstatedetails, tz.Transitionid)

	if err != nil {
		logger.Log.Print("Gettransitionbystate Get Statement Prepare Error", err)
		log.Print("Gettransitionbystate Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		err := rows.Scan(&value.Mstgroupid, &value.Mstuserid)
		if err != nil {
			logger.Log.Print("Gettransitionbystate Sacn Error", err)
			log.Print("Gettransitionbystate Sacn Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Gettransitionbystate(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(transitionbystate, tz.Clientid, tz.Mstorgnhirarchyid, tz.Currentstateid)
	defer rows.Close()
	if err != nil {
		log.Print("Gettransitionbystate Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		rows.Scan(&value.Id)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getprocessdetails(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, error) {
	values := []entities.WorkflowResponseEntity{}
	rows, err := mdao.DB.Query(getprocess, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)
	defer rows.Close()
	if err != nil {
		log.Print("Getprocess Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.WorkflowResponseEntity{}
		rows.Scan(&value.Id, &value.Details, &value.Detailsjson)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Insertprocess(tz *entities.Workflowentity) (int64, error) {
	log.Println("In side dao")
	stmt, err := mdao.DB.Prepare(insertprocess)
	defer stmt.Close()
	if err != nil {
		log.Print("Insertprocess Prepare Statement  Error", err)
		return 0, err
	}
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Details, tz.Detailsjson, tz.Iscomplete)
	if err != nil {
		log.Print("Insertprocess Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	defer mdao.DB.Close()
	return lastInsertedId, nil
}
func Insertprocesswithtransaction(tz *entities.Workflowentity, tx *sql.Tx) (int64, error) {
	stmt, err := tx.Prepare(insertprocess)
	defer stmt.Close()
	if err != nil {
		log.Print("Insertprocesswithtransaction Prepare Statement  Error", err)
		return 0, err
	}
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Details, tz.Detailsjson, tz.Iscomplete)
	if err != nil {
		log.Print("Insertprocesswithtransaction Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}

func (mdao DbConn) InsertProcessDelegateUser(tz *entities.Workflowentity) (int64, error) {
	log.Println("In side dao")
	stmt, err := mdao.DB.Prepare(insertdelegate)
	defer stmt.Close()
	if err != nil {
		log.Print("InsertDelegateUser Prepare Statement  Error", err)
		return 0, err
	}
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Transitionid, tz.Mstgroupid, tz.Mstuserid, tz.Starttime, tz.Endtime)
	if err != nil {
		log.Print("InsertDelegateUser Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	//defer mdao.DB.Close()
	return lastInsertedId, nil
}

func (mdao DbConn) GetProcessByCategory(tz *entities.Workflowentity) (entities.Workflowentity, error) {
	log.Println("In side dao")
	value := entities.Workflowentity{}
	err := mdao.DB.QueryRow(getProcessByCategory, tz.Clientid, tz.Mstorgnhirarchyid, tz.Recorddifftypeid, tz.Recorddiffid).Scan(&value.Processid)
	switch err {
	case sql.ErrNoRows:
		value.Processid = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("GetProcessByCategory Get Statement Prepare Error", err)
		return value, err
	}
}

func (mdao DbConn) GetTableByProcess(tz *entities.Workflowentity) (entities.Workflowentity, error) {

	log.Println("\n\n In side GetTableByProcess dao")
	log.Print(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)
	value := entities.Workflowentity{}
	err := mdao.DB.QueryRow(getTableByProcess, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid).Scan(&value.Tablename)
	switch err {
	case sql.ErrNoRows:
		value.Tablename = ""
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("GetTableByProcess Get Statement Prepare Error", err)
		return value, err
	}
}

func (mdao DbConn) GetTransitionState(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("\n\nIn side GetTransitionState dao")
	log.Print(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Previousstateid, tz.Currentstateid)
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(getTransitionState, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Previousstateid, tz.Currentstateid)

	if err != nil {
		log.Print("GetTransitionState Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		err := rows.Scan(&value.Transitionid)
		if err != nil {
			log.Print("GetTransitionState scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetDelegateUser(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	timestamp := time.Now().Unix()
	rows, err := mdao.DB.Query(getDelegateUserbyTransition, tz.Processid, tz.Transitionid, timestamp, timestamp)
	defer rows.Close()
	if err != nil {
		log.Print("GetDelegateUser Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Mstgroupid, &value.Mstuserid)
		values = append(values, value)
	}
	//defer mdao.DB.Close()
	return values, nil
}

func (mdao DbConn) GetStateUserByTransitionId(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	log.Print(tz.Processid, tz.Transitionid)
	rows, err := mdao.DB.Query(getStateUser, tz.Processid, tz.Transitionid)
	defer rows.Close()
	if err != nil {
		log.Print("GetStateUser Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Mstgroupid, &value.Mstuserid)
		values = append(values, value)
	}
	//defer mdao.DB.Close()
	return values, nil
}

func (mdao DbConn) GetRecordDetailsById(tz *entities.Workflowentity, tableName string) ([]entities.TransactionEntity, error) {
	log.Println("In side dao")
	values := []entities.TransactionEntity{}
	var getRecordById = "SELECT clientid as Clientid,mstorgnhirarchyid as Mstorgnhirarchyid,userid,usergroupid as groupid,recordtitle as Recordtitle,recorddescription as Recorddescription,requesterinfo as Requesterinfo from " + tableName + " where id=? and deleteflg=0 and activeflg=1"
	rows, err := mdao.DB.Query(getRecordById, tz.Transactionid)

	if err != nil {
		logger.Log.Print("GetRecordDetailsById Get Statement Prepare Error", err)
		log.Print("GetRecordDetailsById Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.TransactionEntity{}
		err := rows.Scan(&value.Clientid, &value.Mstorgnhirarchyid, &value.Userid, &value.Groupid, &value.Recordtitle, &value.Recorddescription, &value.Requesterinfo)
		if err != nil {
			log.Print("GetRecordDetailsById Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) GetLatestTransactionStageDetails(tz *entities.Workflowentity) ([]entities.TransactionEntity, error) {
	log.Println("In side dao")
	values := []entities.TransactionEntity{}
	rows, err := mdao.DB.Query(getLatestStageDetails, tz.Transactionid)

	if err != nil {
		logger.Log.Print("GetLatestTransactionStageDetails Get Statement Prepare Error", err)
		log.Print("GetLatestTransactionStageDetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.TransactionEntity{}
		rows.Scan(&value.Recordstageid)
		values = append(values, value)
	}
	return values, nil
}

func UpsertProcessDetails(tx *sql.Tx, tz *entities.Workflowentity, rec entities.TransactionEntity, isFirstStep bool, id int64) (int64, error) {
	log.Print("====>", tz)
	logger.Log.Print("====>", tz)
	log.Print("====>", rec)
	logger.Log.Print("====>", rec)
	latestTime := time.Now().Unix()
	var requestId int64
	if !isFirstStep {
		requestId = id
		err := updateProcessRequest(tz, tx, latestTime, requestId)
		if err != nil {
			//tx.Rollback()
			return 0, err
		}
	} else {
		lastInsertedId, err := insertProcessRequest(tz, tx, latestTime, rec)
		if err != nil {
			//tx.Rollback()
			return 0, err
		}
		requestId = lastInsertedId
	}
	histerr := InsertProcessHistoryRequest(tz, tx, latestTime, rec, requestId)
	if histerr != nil {
		//tx.Rollback()
		return 0, histerr
	}
	isFirstStaging, err, _ := isStagingFirstStep(tz, tx, rec)
	if err != nil {
		//tx.Rollback()
		return 0, err
	}
	if isFirstStaging {
		stageErr := mapProcessRequestWithTransaction(tz, tx, latestTime, rec, requestId)
		if stageErr != nil {
			//tx.Rollback()
			return 0, stageErr
		}
	}
	//err = tx.Commit()
	//if err != nil {
	//	log.Print("UpsertProcessDetails  Statement Commit error", err)
	//	tx.Rollback()
	//	return 0, err
	//}
	//log.Print("\n\n sending:")
	return requestId, nil
}

func (mdao DbConn) GetRequestIdbyRecordId(tz *entities.Workflowentity) (error, []entities.TransactionEntity) {
	requestIds := []entities.TransactionEntity{}
	stmt, err := mdao.DB.Prepare(getRequestIdByStageId)
	if err != nil {
		log.Print("GetRequestIdbyRecordId isWorkflowFirstStep Statement Prepare Error", err)
		return err, requestIds
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Transactionid)
	if err != nil {
		log.Print("GetRequestIdbyRecordId isWorkflowFirstStep Save Statement Execution Error", err)
		return err, requestIds
	}
	for rows.Next() {
		value := entities.TransactionEntity{}
		rows.Scan(&value.Requestid)
		requestIds = append(requestIds, value)
	}
	return nil, requestIds
}
func isStagingFirstStep(tz *entities.Workflowentity, tx *sql.Tx, rec entities.TransactionEntity) (bool, error, int64) {
	requestIds := []entities.TransactionEntity{}
	stmt, err := tx.Prepare(getIdByStageId)

	if err != nil {
		log.Print("UpsertProcessDetails isStagingFirstStep Statement Prepare Error", err)
		return false, err, 0
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Transactionid, rec.Recordstageid)
	if err != nil {
		log.Print("UpsertProcessDetails isStagingFirstStep Save Statement Execution Error", err)
		return false, err, 0
	}
	for rows.Next() {
		value := entities.TransactionEntity{}
		rows.Scan(&value.Id)
		requestIds = append(requestIds, value)
	}
	if len(requestIds) > 0 {
		return false, nil, requestIds[0].Id
	} else {
		return true, nil, 0
	}
}

func updateProcessRequest(tz *entities.Workflowentity, tx *sql.Tx, latestTime int64, requestId int64) error {
	reqStmt, err := tx.Prepare(updateRequest)
	if err != nil {
		log.Print("UpsertProcessDetails updateProcessRequest Prepare Statement Prepare Error", err)
		return err
	}
	defer reqStmt.Close()
	_, err = reqStmt.Exec(tz.Processid,latestTime, tz.Createduserid, tz.Currentstateid, tz.Transitionid, tz.Mstgroupid, tz.Mstuserid, requestId)
	if err != nil {
		log.Print("UpsertProcessDetails updateProcessRequest Save Statement Execution Error", err)
		return err
	}
	return nil
}

func insertProcessRequest(tz *entities.Workflowentity, tx *sql.Tx, latestTime int64, rec entities.TransactionEntity) (int64, error) {
	reqStmt, err := tx.Prepare(insertRequest)

	if err != nil {
		log.Print("UpsertProcessDetails insertProcessRequest Prepare Statement Prepare Error", err)
		return 0, err
	}
	defer reqStmt.Close()
	res, err := reqStmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, rec.Recordtitle, latestTime, tz.Createduserid, tz.Currentstateid, tz.Transitionid, tz.Mstgroupid, tz.Mstuserid)
	if err != nil {
		log.Print("UpsertProcessDetails insertProcessRequest Save Statement Execution Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}

func InsertProcessHistoryRequest(tz *entities.Workflowentity, tx *sql.Tx, latestTime int64, rec entities.TransactionEntity, requestId int64) error {
	histStmt, histErr := tx.Prepare(insertRequestHistory)

	if histErr != nil {
		log.Print("UpsertProcessDetails insertRequestHistory Prepare Statement Prepare Error", histErr)
		return histErr
	}
	defer histStmt.Close()
	_, histErr = histStmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, requestId, rec.Recordtitle, tz.Createduserid, latestTime, tz.Currentstateid, tz.Transitionid, latestTime, tz.Manualstateselection, tz.Mstgroupid, tz.Mstuserid)
	if histErr != nil {
		log.Print("UpsertProcessDetails insertRequestHistory Save Statement Execution Error", histErr)
		return histErr
	}
	return nil
}

func mapProcessRequestWithTransaction(tz *entities.Workflowentity, tx *sql.Tx, latestTime int64, rec entities.TransactionEntity, requestId int64) error {
	stageStmt, stageErr := tx.Prepare(insertRequestStage)

	if stageErr != nil {
		log.Print("mapProcessRequestWithTransaction  Prepare Statement Prepare Error", stageErr)
		return stageErr
	}
	defer stageStmt.Close()
	_, stageErr = stageStmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Transactionid, rec.Recordstageid, requestId, latestTime)
	if stageErr != nil {
		log.Print("mapProcessRequestWithTransaction  Save Statement Execution Error", stageErr)
		return stageErr
	}
	return nil
}

func (mdao DbConn) Checkduplicatestate(tz *entities.Workflowentity) ([]entities.Workflowentity, error) {
	log.Println("In side dao")
	values := []entities.Workflowentity{}
	rows, err := mdao.DB.Query(duplicatetransition, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid, tz.Currentstateid, tz.Previousstateid)
	if err != nil {
		log.Print("Checkduplicatestate Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Workflowentity{}
		rows.Scan(&value.Id)
		values = append(values, value)
	}
	return values, nil
}
