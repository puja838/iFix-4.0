package dao

import (
	"database/sql"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"log"
)

var fetchpassword = "SELECT password  from mstclientuser where id=? and activeflag=1 and deleteflag=0"

//var logindetails = "SELECT a.id as ID,a.password as Password,a.clientid as Clientid,a.mstorgnhirarchyid as Mstorgnhirarchyid,b.mstorgnhierarchytypeid as OrgnTypeId from mstclientuser a,mstorgnhierarchy b where a.mstorgnhirarchyid=b.id and a.loginname=? and a.mstorgnhirarchyid in (select id from mstorgnhierarchy where code=? ) and a.activeflag=1 and a.deleteflag=0"
var logindetails = "SELECT a.id as ID,a.password as Password,a.clientid as Clientid,a.mstorgnhirarchyid as Mstorgnhirarchyid,a.useremail as UserEmail ,a.usermfa as UserMFA, coalesce(a.secretkey,'') SecretKey,b.mstorgnhierarchytypeid as OrgnTypeId,b.orgmfa as OrgMFA from mstclientuser a,mstorgnhierarchy b where a.mstorgnhirarchyid=b.id and a.loginname=? and a.mstorgnhirarchyid in (select id from mstorgnhierarchy where code=? ) and a.activeflag=1 and a.deleteflag=0"

var rolebyuser = "SELECT a.id as Roleid,a.issuperadmin isAdmin,a.rolename Rolename from mstclientuserrole a,mapclientuserroleuser b where b.roleid=a.id " +
	" and b.userid=? and b.activeflg=1 and b.deleteflg=0 and a.activeflg=1 and a.deleteflg=0"
var getuserdetails = "SELECT a.clientid as Clientid,a.mstorgnhirarchyid as Mstorgnhirarchyid,COALESCE(a.vipuser,'NA') vipuser,COALESCE(a.color,''),a.loginname as Loginname,a.name as Username,a.useremail as Email,a.usermobileno as Mobile,b.name as Mstorgnname,b.mstorgnhierarchytypeid as Orgntypeid,coalesce(b.logintypeid,0) logintypeid,c.name as Clientname,coalesce(a.branch,'NA') branch,coalesce(a.firstname,'NA') firstname,COALESCE(a.lastname,'NA') lastname from mstclientuser a,mstorgnhierarchy b,mstclient c where a.clientid=c.id and mstorgnhirarchyid=b.id  and a.id=? and a.activeflag=1 and a.deleteflag=0"

//var groupbyuser = "SELECT a.id,a.hascatalog,a.supportgroupname as groupname,a.supportgrouplevelid as levelid from mstclientsupportgroup a,mstgroupmember b where a.id=b.groupid and b.userid=? and b.activeflg=1 and b.deleteflg=0 and a.activeflg=1 and a.deleteflg=0"
var groupbyuser = "SELECT distinct a.grpid,a.hascatalog,c.name as groupname,a.supportgrouplevelid as levelid from mstclientsupportgroup a,mstgroupmember b,mstsupportgrp c where b.userid=? and a.grpid=b.groupid and a.grpid = c.id and b.activeflg=1 and b.deleteflg=0 and a.activeflg=1 and a.deleteflg=0 and c.activeflg=1 and c.deleteflg=0"

var geturls = "select a.name as urlkey,b.url from mstnonmenuurl b,msturlkey a where b.urlid=a.id and b.clientid=? and b.mstorgnhirarchyid=? and b.activeflg=1 and b.deleteflg=0"
var passwordupdate = "UPDATE mstclientuser SET password=? WHERE id=?"
var passworuserdupdate = "UPDATE mstuser SET password=? WHERE externaluserid=?"
var bucketdetails = "select count() as account,credentialpassword bucket from mstclientcredential where clientid=? and mstorgnhirarchyid=? and activeflg=1 and deleteflg=0"
var checkuser = "SELECT id as userid from mstclientuser where  clientid=? and mstorgnhirarchyid=? and loginname=? and deleteflag =0"
var getusertoken = " SELECT id from msttoken where userid=? and token=? and deleteflg=0"
var orgdetails = "SELECT id mstorgnhirarchyid,clientid,mstorgnhierarchytypeid orgnTypeId,logintypeid,islocallogin from mstorgnhierarchy where code=?"
var enduserid = "SELECT id from mstclientsupportgroup where clientid=? and mstorgnhirarchyid=? and supportgrouplevelid=? and activeflg=1 and deleteflg=0"
var dasboardurl = "SELECT url from mstnonmenuurl where clientid=? and mstorgnhirarchyid=? and urlid in (SELECT id from msturlkey where name=? and activeflg=1 and deleteflg=0) and activeflg=1 and deleteflg=0"
var getuserid = "SELECT id from mstclientuser where clientid=? and mstorgnhirarchyid=? and loginname=? and activeflag=1 and deleteflag=0"
var updatemfainfo = "update mstclientuser set totpurl=?,secretkey=? where loginname=? and clientid=? and mstorgnhirarchyid=?"
var updateusermfa = "update mstclientuser set usermfa=? where loginname=? and clientid=? and mstorgnhirarchyid=?"

func (mdao DbConn) UpdateUserMFA(tz *entities.LoginEntityReq) error {

	stmt, err := mdao.DB.Prepare(updateusermfa)

	if err != nil {
		logger.Log.Print("updateusermfa Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(1, tz.Loginname, tz.Clientid, tz.Mstorgnhirarchyid)
	if err != nil {
		logger.Log.Print("updateusermfa Execute Statement  Error", err)
		return err
	}
	return nil
}

func (mdao DbConn) UpdateMstClientUser(tz *entities.LoginEntityReq, authURI string, secretkey string) error {

	stmt, err := mdao.DB.Prepare(updatemfainfo)

	if err != nil {
		logger.Log.Print("updatemfainfo Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(authURI, secretkey, tz.Loginname, tz.Clientid, tz.Mstorgnhirarchyid)
	if err != nil {
		logger.Log.Print("updatemfainfo Execute Statement  Error", err)
		return err
	}
	return nil
}

func (mdao DbConn) Getuserdetailsbyloginid(tz *entities.LoginEntityReq) ([]entities.LoginEntityReq, error) {
	log.Println("In side dao")
	values := []entities.LoginEntityReq{}
	rows, err := mdao.DB.Query(getuserid, tz.Clientid, tz.Mstorgnhirarchyid, tz.Loginname)
	defer rows.Close()
	if err != nil {
		logger.Log.Print("Login Get Statement Prepare Error", err)
		log.Print("Login Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.LoginEntityReq{}
		err = rows.Scan(&value.ID)
		if err != nil {
			logger.Log.Print("Login Scan Error", err)
			log.Print("Login Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Geturlbytype(tz *entities.LoginEntityReq, urltype string) ([]entities.LoginEntityResp, error) {
	log.Println("In side dao")
	values := []entities.LoginEntityResp{}
	rows, err := mdao.DB.Query(dasboardurl, tz.Clientid, tz.Mstorgnhirarchyid, urltype)
	defer rows.Close()
	if err != nil {
		log.Print("Getdashboardurl Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.LoginEntityResp{}
		rows.Scan(&value.Url)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getenduserid(tz *entities.ClientsupportgroupEntity) ([]entities.ClientsupportgroupsingleEntity, error) {
	values := []entities.ClientsupportgroupsingleEntity{}
	stmt, err := mdao.DB.Prepare(enduserid)
	if err != nil {
		logger.Log.Print("Getenduserid Statement Prepare Error", err)
		log.Print("Getenduserid Statement Prepare Error", err)
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Clientid, tz.Mstorgnhirarchyid, tz.Supportgrouplevelid)
	if err != nil {
		logger.Log.Print("Getenduserid Statement Execution Error", err)
		log.Print("Getenduserid Statement Execution Error", err)
		return nil, err
	}
	for rows.Next() {
		value := entities.ClientsupportgroupsingleEntity{}
		rows.Scan(&value.Id)
		values = append(values, value)
	}
	return values, nil
}

func (mdao DbConn) Getorgdetailsbycode(tz *entities.LoginEntityReq) (error, []entities.LoginEntityResp) {
	values := []entities.LoginEntityResp{}
	stmt, err := mdao.DB.Prepare(orgdetails)
	if err != nil {
		logger.Log.Print("Getorgdetailsbycode Statement Prepare Error", err)
		log.Print("Getorgdetailsbycode Statement Prepare Error", err)
		return err, values
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Code)
	if err != nil {
		logger.Log.Print("Getorgdetailsbycode Statement Execution Error", err)
		log.Print("Getorgdetailsbycode Statement Execution Error", err)
		return err, values
	}
	for rows.Next() {
		value := entities.LoginEntityResp{}
		rows.Scan(&value.Mstorgnhirarchyid, &value.Clientid, &value.OrgnTypeId, &value.Logintypeid, &value.Islocallogin)
		values = append(values, value)
	}
	return nil, values
}
func (mdao DbConn) Validateusertoken(tz *entities.LoginEntityResp) (error, []string) {
	var tokens []string
	stmt, err := mdao.DB.Prepare(getusertoken)
	if err != nil {
		logger.Log.Print("getusertoken Statement Prepare Error", err)
		log.Print("getusertoken Statement Prepare Error", err)
		return err, tokens
	}
	defer stmt.Close()
	rows, err := stmt.Query(tz.Userid, tz.Token)
	if err != nil {
		logger.Log.Print("getusertoken Statement Execution Error", err)
		log.Print("getusertoken Statement Execution Error", err)
		return err, tokens
	}
	for rows.Next() {
		var token string
		rows.Scan(&token)
		tokens = append(tokens, token)
	}
	return nil, tokens
}

func (mdao DbConn) Checkuser(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, error) {
	values := []entities.LoginEntityResp{}
	rows, err := mdao.DB.Query(checkuser, tz.Clientid, tz.Mstorgnhirarchyid, tz.Loginname)

	if err != nil {
		logger.Log.Print("Checkuser Get Statement Prepare Error", err)
		log.Print("Checkuser Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.LoginEntityResp{}
		err = rows.Scan(&value.Userid)
		if err != nil {
			logger.Log.Print("Fetchpasswordbyid Scan Error", err)
			log.Print("Fetchpasswordbyid Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Updatepassword(tz *entities.LoginEntityReq) error {
	logger.Log.Println("userupdate Query -->", passwordupdate)
	stmt, err := mdao.DB.Prepare(passwordupdate)

	if err != nil {
		logger.Log.Print("Updatepassword Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(tz.Password, tz.ID)
	if err != nil {
		logger.Log.Print("Updatepassword Execute Statement  Error", err)
		return err
	}
	return nil
}
func Updatepasswordtransaction(tx *sql.Tx, password string, id int64) error {
	logger.Log.Println("userupdate Query -->", passwordupdate)
	stmt, err := tx.Prepare(passwordupdate)

	if err != nil {
		logger.Log.Print("Updatepasswordtransaction Prepare Statement  Error", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(password, id)
	if err != nil {
		logger.Log.Print("Updatepasswordtransaction Execute Statement  Error", err)
		return err
	}
	return nil
}
func (mdao DbConn) Fetchpasswordbyid(tz *entities.LoginEntityReq) ([]entities.LoginEntityReq, error) {
	log.Println("In side dao")
	values := []entities.LoginEntityReq{}
	rows, err := mdao.DB.Query(fetchpassword, tz.ID)

	if err != nil {
		logger.Log.Print("Fetchpasswordbyid Get Statement Prepare Error", err)
		log.Print("Fetchpasswordbyid Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.LoginEntityReq{}
		err = rows.Scan(&value.Password)
		if err != nil {
			logger.Log.Print("Fetchpasswordbyid Scan Error", err)
			log.Print("Fetchpasswordbyid Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Login(tz *entities.LoginEntityReq) ([]entities.LoginEntityReq, error) {
	log.Println("In side dao")
	values := []entities.LoginEntityReq{}
	rows, err := mdao.DB.Query(logindetails, tz.Loginname, tz.Code)
	defer rows.Close()
	if err != nil {
		logger.Log.Print("Login Get Statement Prepare Error", err)
		log.Print("Login Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.LoginEntityReq{}
		err = rows.Scan(&value.ID, &value.Password, &value.Clientid, &value.Mstorgnhirarchyid, &value.UserEmail, &value.UserMFA, &value.Secretkey, &value.OrgnTypeId, &value.OrgMFA)
		if err != nil {
			logger.Log.Print("Login Scan Error", err)
			log.Print("Login Scan Error", err)
			return values, err
		}
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) GetRolebyUserId(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, error) {
	log.Println("In side dao")
	values := []entities.LoginEntityResp{}
	rows, err := mdao.DB.Query(rolebyuser, tz.ID)
	defer rows.Close()
	if err != nil {
		log.Print("GetRolebyUserId Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.LoginEntityResp{}
		rows.Scan(&value.Roleid, &value.IsAdmin, &value.Rolename)
		value.Userid = tz.ID
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getgroupbyuserid(tz *entities.LoginEntityReq) ([]entities.Usergroupentity, error) {
	log.Println("In side dao")
	values := []entities.Usergroupentity{}
	rows, err := mdao.DB.Query(groupbyuser, tz.ID)

	if err != nil {
		log.Print("Getgroupbyuserid Get Statement Prepare Error", err)
		logger.Log.Print("Getgroupbyuserid Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Usergroupentity{}
		rows.Scan(&value.ID, &value.Hascatalog, &value.Groupname, &value.Levelid)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Geturlbyuser(tz *entities.UserEntity) ([]entities.Userurlentity, error) {
	log.Println("\n\nIn side Geturlbyuser dao")
	log.Print(tz.Clientid, tz.Mstorgnhirarchyid)
	values := []entities.Userurlentity{}
	rows, err := mdao.DB.Query(geturls, tz.Clientid, tz.Mstorgnhirarchyid)

	if err != nil {
		log.Print("Geturlbyuser Get Statement Prepare Error", err)
		logger.Log.Print("Geturlbyuser Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Userurlentity{}
		rows.Scan(&value.Urlkey, &value.Url)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) Getbucketdetails(tz *entities.UserEntity) ([]entities.Userurlentity, error) {
	log.Println("\n\nIn side Getbucketdetails dao")
	log.Print(tz.Clientid, tz.Mstorgnhirarchyid)
	values := []entities.Userurlentity{}
	rows, err := mdao.DB.Query(geturls, tz.Clientid, tz.Mstorgnhirarchyid)

	if err != nil {
		log.Print("Getbucketdetails Get Statement Prepare Error", err)
		logger.Log.Print("Getbucketdetails Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.Userurlentity{}
		rows.Scan(&value.Urlkey, &value.Url)
		values = append(values, value)
	}
	return values, nil
}
func (mdao DbConn) GetUserDetailsById(tz *entities.UserEntity) ([]entities.UserEntity, error) {
	log.Println("In side dao")
	values := []entities.UserEntity{}
	rows, err := mdao.DB.Query(getuserdetails, tz.Userid)

	if err != nil {
		log.Print("GetUserDetailsbyId Get Statement Prepare Error", err)
		return values, err
	}
	defer rows.Close()
	for rows.Next() {
		value := entities.UserEntity{}
		err = rows.Scan(&value.Clientid, &value.Mstorgnhirarchyid, &value.Vipuser, &value.Color, &value.Loginname, &value.Username, &value.Email, &value.Mobile, &value.Mstorgnname, &value.Orgntypeid,&value.Logintypeid, &value.Clientname, &value.Branch, &value.Firstname, &value.Lastname)
		if err != nil {
			log.Print("GetUserDetailsbyId Scan Error", err)
			return values, err
		}
		value.Userid = tz.Userid
		values = append(values, value)
	}
	return values, nil
}
