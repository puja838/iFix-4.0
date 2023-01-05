package dao

import (
	"database/sql"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"log"
)

var processlist = "SELECT id as ID ,processname name,id FROM mstprocess where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var statetypelist = "SELECT id as ID ,statetypename as name,id FROM mststatetype where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var statelist = "SELECT id as ID ,statename as name,seqno FROM mststate where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var grouplist = "SELECT id as ID ,groupname as name,id FROM mstgroup where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var ptemplatelist = "SELECT id as ID ,processname as name,id FROM mstprocesstemplate where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var workflowusersearch = "SELECT id as ID, name as Name , loginname as Loginname FROM mstuser where clientid=? and mstorgnhirarchyid=? and (loginname like ? or NAME like ?) and deleteflg=0 limit 15;"
var dictionarydb = "SELECT id as ID,databasename as Name,id from mstdatadictionarydb where clientid=? and mstorgnhirarchyid=?"
var dictionarytable = "SELECT id as ID,tablename as Name,id from mstdatadictionarytable where clientid=? and mstorgnhirarchyid=? and mstdatadictionarydbid=?"
var dictionaryfield = "SELECT id as ID,columnname as Name,id from mstdatadictionaryfield where clientid=? and mstorgnhirarchyid=? and tableid=?"
var statebytype = "SELECT id as ID,statename as Name,seqno from mststate where clientid=? and mstorgnhirarchyid=? and statetypeid=? and activeflg=1 and deleteflg=0"
var statebyprocess = "SELECT a.id stateid,a.statename,b.id statetypeid,b.statetypename from mapprocessstate c,mststate a,mststatetype b where c.statetid=a.id and c.clientid=? and c.mstorgnhirarchyid=? and c.processid=? and c.activeflg=1 and c.deleteflg=0 and a.statetypeid=b.id and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0 order by a.statetypeid ASC,a.id ASC"
var statebyprocesstemplate = "SELECT a.id stateid,a.statename,b.id statetypeid,b.statetypename from mapprocesstemplatestate c,mststate a,mststatetype b where c.statetid=a.id and c.clientid=? and c.mstorgnhirarchyid=? and c.processid=? and c.activeflg=1 and c.deleteflg=0 and a.statetypeid=b.id and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0 order by a.statetypeid ASC,a.id ASC"
var processbydiffid = "SELECT a.id as ID , a.processname as Name FROM mstprocessrecordmap b,mstprocess a WHERE b.mstprocessid = a.id and b.clientid=? and b.mstorgnhirarchyid=? and b.recorddifftypeid=? and b.recorddiffid=? and b.activeflg=1 and b.deleteflg=0 and a.activeflg=1 and a.deleteflg=0"
var diffidbyprocess = "SELECT recorddifftypeid,recorddiffid FROM mstprocessrecordmap WHERE clientid=? and mstorgnhirarchyid=? and mstprocessid=? and activeflg=1 and deleteflg=0"
var deleteprocessdetails = "DELETE FROM mstprocessdetails  WHERE processid =?"
var deleteprocesstemplatedetails = "DELETE FROM mstprocesstemplatedetails  WHERE  processid =?"
var deleteprocesstransition = "DELETE FROM msttransition  WHERE processid =?"
var deleteprocesstemplatetransition = "DELETE FROM mstprocesstemplatetransition  WHERE processid =?"
var deleteprocessgroupdetails = "DELETE FROM maprecorddifferentiongroup  WHERE processid =?"
var deleteprocesstemplategroupdetails = "DELETE FROM mapprocesstemplategroup  WHERE processid =?"
var getstatebyseq = "select a.recorddiffid,a.recorddifftypeid,a.mststateid from maprecordstatetodifferentiation a,mstrecorddifferentiation b where a.recorddiffid=b.id and b.clientid=? and b.mstorgnhirarchyid=? and b.recorddifftypeid=(select id from mstrecorddifferentiationtype where seqno=?) and b.seqno=? and a.activeflg=1 and a.deleteflg=0 and b.activeflg=1 and b.deleteflg=0"
var updatestaging="UPDATE recordfulldetails set assigneduserloginid=?,assignedgroupid=?,assignedgroup=?,assigneduserid=?,assigneduser=?,lastuserid=?,lastuser=?,reassigncount=?,lastupdateddatetime=now() where recordid=?"
var workingdiffbytid ="SELECT recorddifftypeid,recorddiffid from maprecordtorecorddifferentiation where recordid=? and isworking=1 and islatest=1 and activeflg=1 and deleteflg=0"
var statuspriority="SELECT priority from mstrecorddifferentiationpriority where clientid=? and mstorgnhirarchyid=? and typedifferentiationid =? and differentiationid =? and activeflg=1 and deleteflg=0"
var highestchildprio="SELECT c.priority,c.differentiationid FROM mstparentchildmap a,maprecordtorecorddifferentiation b,mstrecorddifferentiationpriority c WHERE a.clientid=? AND a.mstorgnhirarchyid=? AND a.parentrecordid=? AND a.activeflg=1 AND a.deleteflg=0 AND a.childrecordid = b.recordid AND b.recorddifftypeid=3 AND b.islatest=1 AND b.recorddiffid = c.differentiationid AND c.typedifferentiationtypeid=2 AND c.typedifferentiationid=? AND c.activeflg=1 AND c.deleteflg=0 ORDER BY c.priority ASC LIMIT 1;"
var statebystatusseq="select mststateid from maprecordstatetodifferentiation a where clientid=? and mstorgnhirarchyid=? and recorddiffid in (select id from mstrecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=3 and seqno=? and activeflg =1 and deleteflg=0 ) and activeflg =1 and deleteflg=0"

func (mdao DbConn) Getstatebystatusseq(clientid int64,mstorgnhirarchyid int64 ,seqno int64) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGetstatebystatusseq:", clientid, mstorgnhirarchyid,  seqno)
	values := []entities.WorkflowSingleEntity{}
	rows, err := mdao.DB.Query(statebystatusseq, clientid, mstorgnhirarchyid,clientid, mstorgnhirarchyid,seqno)

	if err != nil {
		logger.Log.Print("Getstatebystatusseq Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Gethighestchildpriority(clientid int64,mstorgnhirarchyid int64 ,parentid int64,childtypeid int64) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGethighestchildpriority:", clientid, mstorgnhirarchyid,  parentid,childtypeid)
	values := []entities.WorkflowSingleEntity{}
	rows, err := mdao.DB.Query(highestchildprio, clientid, mstorgnhirarchyid,  parentid,childtypeid)

	if err != nil {
		logger.Log.Print("Gethighestchildpriority Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID,&value.Seqno)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getstatuspriority(tz *entities.WorkflowUtilityEntity ,statusid int64) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGetstatuspriority:", tz)
	values := []entities.WorkflowSingleEntity{}
	rows, err := mdao.DB.Query(statuspriority, tz.Clientid, tz.Mstorgnhirarchyid,  tz.Recorddiffid,statusid)

	if err != nil {
		logger.Log.Print("Getstatuspriority Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getworkingdiffbytid(recordid int64) (int64,int64, error) {
	logger.Log.Println("\n\nGetworkingdiffbytid:", recordid)
	var difftypeid int64
	var diffid int64
	rows, err := mdao.DB.Query(workingdiffbytid, recordid)

	if err != nil {
		logger.Log.Print("Getworkingdiffbytid Get Statement Prepare Error", err)
		return 0,0, err
	}
	defer rows.Close()
	for rows.Next() {
		rows.Scan(&difftypeid, &diffid)
	}
	return difftypeid, diffid,nil
}
func (mdao DbConn) Getprocessbydiffid(tz *entities.WorkflowUtilityEntity) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGetprocessbydiffid:", tz)
	values := []entities.WorkflowSingleEntity{}
	rows, err := mdao.DB.Query(processbydiffid, tz.Clientid, tz.Mstorgnhirarchyid, tz.Recorddifftypeid, tz.Recorddiffid)

	if err != nil {
		logger.Log.Print("Getprocessbydiffid Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID, &value.Name)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getworklowutilitylist(tz *entities.WorkflowUtilityEntity) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGetworklowutilitylist:", tz)
	values := []entities.WorkflowSingleEntity{}
	var query string
	if tz.Type == 1 {
		query = processlist
	} else if tz.Type == 2 {
		query = statetypelist
	} else if tz.Type == 3 {
		query = statelist
	} else if tz.Type == 4 {
		query = dictionarydb
	} else if tz.Type == 5 {
		query = grouplist
	} else if tz.Type == 6 {
		query = ptemplatelist
	}
	log.Print(query)
	rows, err := mdao.DB.Query(query, tz.Clientid, tz.Mstorgnhirarchyid)
	defer rows.Close()
	if err != nil {
		logger.Log.Print("Getworklowutilitylist Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID, &value.Name,&value.Seqno)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getutilitydatabyfield(tz *entities.WorkflowUtilityEntity) ([]entities.WorkflowSingleEntity, error) {
	logger.Log.Println("\n\nGetutilitydatabyfield:", tz)
	values := []entities.WorkflowSingleEntity{}
	var query string
	if tz.Type == 1 {
		query = dictionarytable
	} else if tz.Type == 2 {
		query = dictionaryfield
	} else {
		query = statebytype
	}
	rows, err := mdao.DB.Query(query, tz.Clientid, tz.Mstorgnhirarchyid, tz.Fieldid)
	defer rows.Close()
	if err != nil {
		logger.Log.Print("Getutilitydatabyfield Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.WorkflowSingleEntity{}
		rows.Scan(&value.ID, &value.Name, &value.Seqno)
		values = append(values, value)
	}
	return values, nil
}

// search a specific user from workflow system using loginname ,clientid and orgnid
func (mdao DbConn) Searchworkflowuser(tz *entities.WorkflowUtilityEntity) ([]entities.MstUserSearchEntity, error) {
	log.Println("In side dao")
	values := []entities.MstUserSearchEntity{}
	rows, err := mdao.DB.Query(workflowusersearch, tz.Clientid, tz.Mstorgnhirarchyid, "%"+tz.Loginname+"%", "%"+tz.Loginname+"%")
	defer rows.Close()
	if err != nil {
		log.Print("SearchUser Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.MstUserSearchEntity{}
		rows.Scan(&value.ID, &value.Name, &value.Loginname)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) Getstatebyprocess(tz *entities.WorkflowUtilityEntity) ([]entities.StateProcessEntity, error) {
	log.Println("In side dao")
	values := []entities.StateProcessEntity{}
	rows, err := mdao.DB.Query(statebyprocess, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)
	defer rows.Close()
	if err != nil {
		log.Print("Getstatebyprocess Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.StateProcessEntity{}
		rows.Scan(&value.Stateid, &value.Statename, &value.Statetypeid, &value.Statetypename)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getstatebyprocesstemplate(tz *entities.WorkflowUtilityEntity) ([]entities.StateProcessEntity, error) {
	log.Println("In side dao")
	values := []entities.StateProcessEntity{}
	rows, err := mdao.DB.Query(statebyprocesstemplate, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)
	defer rows.Close()
	if err != nil {
		log.Print("Getstatebyprocesstemplate Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.StateProcessEntity{}
		rows.Scan(&value.Stateid, &value.Statename, &value.Statetypeid, &value.Statetypename)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getdiffidbyprocess(tz *entities.WorkflowUtilityEntity) ([]entities.WorkflowUtilityEntity, error) {
	log.Println("In side dao")
	values := []entities.WorkflowUtilityEntity{}
	rows, err := mdao.DB.Query(diffidbyprocess, tz.Clientid, tz.Mstorgnhirarchyid, tz.Processid)
	defer rows.Close()
	if err != nil {
		log.Print("Getstatebyprocess Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.WorkflowUtilityEntity{}
		rows.Scan(&value.Recorddifftypeid, &value.Recorddiffid)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getstatebyseq(tz *entities.WorkflowUtilityEntity) ([]entities.StateStatusEntity, error) {
	log.Println("In side dao")
	values := []entities.StateStatusEntity{}
	rows, err := mdao.DB.Query(getstatebyseq, tz.Clientid, tz.Mstorgnhirarchyid, tz.Typeseqno, tz.Seqno)
	defer rows.Close()
	if err != nil {
		log.Print("Getstatebyseq Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.StateStatusEntity{}
		rows.Scan(&value.Recorddiffid, &value.Recorddifftypeid, &value.Mststateid)
		values = append(values, value)
	}
	return values, nil
}

func Deleteprocessdetails(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deleteprocessdetails ", tz)
	log.Print("Deleteprocessdetails", tz)

	stmt, err := tx.Prepare(deleteprocessdetails)
	if err != nil {
		logger.Log.Print("Deleteprocessdetails Prepare Statement  Error", err)
		log.Print("Deleteprocessdetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(  tz.Processid)
	if err != nil {
		logger.Log.Print("Deleteprocessdetails Execute Statement  Error", err)
		log.Print("Deleteprocessdetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deletetprocesstransition(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deletetprocesstransition ", tz)
	log.Print("Deletetprocesstransition", tz)

	stmt, err := tx.Prepare(deleteprocesstransition)
	if err != nil {
		logger.Log.Print("Deletetprocesstransition Prepare Statement  Error", err)
		log.Print("Deletetprocesstransition Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec( tz.Processid)
	if err != nil {
		logger.Log.Print("Deletetprocesstransition Execute Statement  Error", err)
		log.Print("Deletetprocesstransition Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deleteprocessgroupdetails(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deleteprocessgroupdetails ", tz)
	log.Print("Deleteprocessgroupdetails", tz)

	stmt, err := tx.Prepare(deleteprocessgroupdetails)
	if err != nil {
		logger.Log.Print("Deleteprocessgroupdetails Prepare Statement  Error", err)
		log.Print("Deleteprocessgroupdetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec( tz.Processid)
	if err != nil {
		logger.Log.Print("Deleteprocessgroupdetails Execute Statement  Error", err)
		log.Print("Deleteprocessgroupdetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deleteprocesstemplatedetails(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deleteprocesstemplatedetails ", tz)
	log.Print("Deleteprocesstemplatedetails", tz)

	stmt, err := tx.Prepare(deleteprocesstemplatedetails)
	if err != nil {
		logger.Log.Print("Deleteprocesstemplatedetails Prepare Statement  Error", err)
		log.Print("Deleteprocesstemplatedetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec( tz.Processid)
	if err != nil {
		logger.Log.Print("Deleteprocesstemplatedetails Execute Statement  Error", err)
		log.Print("Deleteprocesstemplatedetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Updatestagingdetails(tz *entities.StagingUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Updatestagingdetails ", tz)
	log.Print("Updatestagingdetails", tz)

	stmt, err := tx.Prepare(updatestaging)
	if err != nil {
		logger.Log.Print("Updatestagingdetails Prepare Statement  Error", err)
		log.Print("Updatestagingdetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec( tz.Assignedloginname,tz.Assignedgroupid,tz.Assignedgroup,tz.Assigneduserid,tz.Assigneduser,tz.Lastuserid,tz.Lastuser,tz.Reassigncount,tz.Recordid)
	if err != nil {
		logger.Log.Print("Updatestagingdetails Execute Statement  Error", err)
		log.Print("Updatestagingdetails Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deletetprocesstemplatetransition(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deletetprocesstemplatetransition ", tz)
	log.Print("Deletetprocesstemplatetransition", tz)

	stmt, err := tx.Prepare(deleteprocesstemplatetransition)
	if err != nil {
		logger.Log.Print("Deletetprocesstemplatetransition Prepare Statement  Error", err)
		log.Print("Deletetprocesstemplatetransition Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec( tz.Processid)
	if err != nil {
		logger.Log.Print("Deletetprocesstemplatetransition Execute Statement  Error", err)
		log.Print("Deletetprocesstemplatetransition Execute Statement  Error", err)
		return err
	}
	return nil
}
func Deleteprocesstemplategroupdetails(tz *entities.WorkflowUtilityEntity, tx *sql.Tx) error {
	logger.Log.Print("Deleteprocesstemplategroupdetails ", tz)
	log.Print("Deleteprocesstemplategroupdetails", tz)

	stmt, err := tx.Prepare(deleteprocesstemplategroupdetails)
	if err != nil {
		logger.Log.Print("Deleteprocesstemplategroupdetails Prepare Statement  Error", err)
		log.Print("Deleteprocesstemplategroupdetails Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Processid)
	if err != nil {
		logger.Log.Print("Deleteprocesstemplategroupdetails Execute Statement  Error", err)
		log.Print("Deleteprocesstemplategroupdetails Execute Statement  Error", err)
		return err
	}
	return nil
}
