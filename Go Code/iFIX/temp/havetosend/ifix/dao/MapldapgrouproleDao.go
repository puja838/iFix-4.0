package dao

import (
	"database/sql"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
)

var insertmapldapgrouprole = "INSERT INTO mapldapgrouprole (clientid, mstorgnhirarchyid,roleid,groupid) VALUES (?,?,?,?)"
var duplicatemapldapgrouprole = "SELECT count(id) total FROM  mapldapgrouprole WHERE clientid = ? AND mstorgnhirarchyid = ? AND roleid = ? AND groupid = ? AND deleteflg = 0 AND activeflg=1"

//var getmapldapgrouprole = "SELECT a.id as Id, a.clientid as Clientid, a.mstorgnhirarchyid as Mstorgnhirarchyid, a.roleid as Roleid,a.groupid as Groupid, b.rolename as Rolename,c.supportgroupname as Groupname, a.activeflg as Activeflg,d.name  as Clientname, e.name  as Mstorgnhirarchyname FROM mapldapgrouprole a,mstclientuserrole b,mstclientsupportgroup c,mstclient d,mstorgnhierarchy e WHERE a.clientid = ? AND a.mstorgnhirarchyid = ?  AND a.deleteflg =0 and a.activeflg=1 AND a.roleid=b.id AND b.activeflg=1 AND b.deleteflg=0 AND a.groupid=c.id AND c.activeflg=1 AND c.deleteflg=0 AND a.clientid=d.id AND a.mstorgnhirarchyid=e.id ORDER BY a.id DESC LIMIT ?,?"
var getmapldapgrouprole = "SELECT distinct a.id as Id, a.clientid as Clientid, a.mstorgnhirarchyid as Mstorgnhirarchyid, a.roleid as Roleid,a.groupid as Groupid, b.rolename as Rolename,c.name as Groupname, a.activeflg as Activeflg,d.name  as Clientname, e.name  as Mstorgnhirarchyname FROM mapldapgrouprole a,mstclientuserrole b,mstsupportgrp c,mstclient d,mstorgnhierarchy e WHERE a.clientid = ? AND a.mstorgnhirarchyid = ?  AND a.deleteflg =0 and a.activeflg=1 AND a.roleid=b.id AND b.activeflg=1 AND b.deleteflg=0 AND a.groupid=c.id AND c.activeflg=1 AND c.deleteflg=0 AND a.clientid=d.id AND a.mstorgnhirarchyid=e.id ORDER BY a.id DESC LIMIT ?,?"
var getmapldapgrouprolecount = "SELECT count(a.id) total FROM mapldapgrouprole a,mstclientuserrole b,mstclientsupportgroup c,mstclient d,mstorgnhierarchy e WHERE a.clientid = ? AND a.mstorgnhirarchyid = ?  AND a.deleteflg =0 and a.activeflg=1 AND a.roleid=b.id AND b.activeflg=1 AND b.deleteflg=0 AND a.groupid=c.id AND c.activeflg=1 AND c.deleteflg=0 AND a.clientid=d.id AND a.mstorgnhirarchyid=e.id "
var updatemapldapgrouprole = "UPDATE mapldapgrouprole SET clientid=?,mstorgnhirarchyid = ?,roleid = ?,groupid=? WHERE id = ? "
var deletemapldapgrouprole = "UPDATE mapldapgrouprole SET deleteflg = '1' WHERE id = ? "

func (dbc DbConn) CheckDuplicatemapldapgrouprole(tz *entities.MapldapgrouproleEntity) (entities.MapldapgrouproleEntities, error) {
	logger.Log.Println("In side CheckDuplicatemapldapgrouprole")
	value := entities.MapldapgrouproleEntities{}
	err := dbc.DB.QueryRow(duplicatemapldapgrouprole, tz.Clientid, tz.Mstorgnhirarchyid, tz.Roleid, tz.Groupid).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("CheckDuplicatemapldapgrouprole Get Statement Prepare Error", err)
		return value, err
	}
}

func (dbc DbConn) Insertmapldapgrouprole(tz *entities.MapldapgrouproleEntity) (int64, error) {
	logger.Log.Println("In side Insertmapldapgrouprole")
	logger.Log.Println("Query -->", insertmapldapgrouprole)
	stmt, err := dbc.DB.Prepare(insertmapldapgrouprole)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("Insertmapldapgrouprole Prepare Statement  Error", err)
		return 0, err
	}
	logger.Log.Println("Parameter -->", tz.Clientid, tz.Mstorgnhirarchyid, tz.Roleid, tz.Groupid)
	res, err := stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Roleid, tz.Groupid)
	if err != nil {
		logger.Log.Println("Insertmapldapgrouprole Execute Statement  Error", err)
		return 0, err
	}
	lastInsertedId, err := res.LastInsertId()
	return lastInsertedId, nil
}

func (dbc DbConn) GetAllmapldapgrouprole(page *entities.MapldapgrouproleEntity) ([]entities.MapldapgrouproleEntity, error) {
	logger.Log.Println("In side GelAllmapldapgrouprole")
	values := []entities.MapldapgrouproleEntity{}
	rows, err := dbc.DB.Query(getmapldapgrouprole, page.Clientid, page.Mstorgnhirarchyid, page.Offset, page.Limit)
	defer rows.Close()
	if err != nil {
		logger.Log.Println("GetAllmapldapgrouprole Get Statement Prepare Error", err)
		return values, err
	}
	for rows.Next() {
		value := entities.MapldapgrouproleEntity{}
		rows.Scan(&value.Id, &value.Clientid, &value.Mstorgnhirarchyid, &value.Roleid, &value.Groupid, &value.Rolename, &value.Groupname, &value.Activeflg, &value.Clientname, &value.Mstorgnhirarchyname)
		values = append(values, value)
	}
	return values, nil
}

func (dbc DbConn) Updatemapldapgrouprole(tz *entities.MapldapgrouproleEntity) error {
	logger.Log.Println("In side Updatemapldapgrouprole")
	stmt, err := dbc.DB.Prepare(updatemapldapgrouprole)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("Updatemapldapgrouprole Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Clientid, tz.Mstorgnhirarchyid, tz.Roleid, tz.Groupid, tz.Id)
	if err != nil {
		logger.Log.Println("Updatemapldapgrouprole Execute Statement  Error", err)
		return err
	}
	return nil
}

func (dbc DbConn) Deletemapldapgrouprole(tz *entities.MapldapgrouproleEntity) error {
	logger.Log.Println("In side Deletemapldapgrouprole")
	stmt, err := dbc.DB.Prepare(deletemapldapgrouprole)
	defer stmt.Close()
	if err != nil {
		logger.Log.Println("Deletemapldapgrouprole Prepare Statement  Error", err)
		return err
	}
	_, err = stmt.Exec(tz.Id)
	if err != nil {
		logger.Log.Println("Deletemapldapgrouprole Execute Statement  Error", err)
		return err
	}
	return nil
}

func (dbc DbConn) GetmapldapgrouproleCount(tz *entities.MapldapgrouproleEntity) (entities.MapldapgrouproleEntities, error) {
	logger.Log.Println("In side GetmapldapgrouproleCount")
	value := entities.MapldapgrouproleEntities{}
	err := dbc.DB.QueryRow(getmapldapgrouprolecount, tz.Clientid, tz.Mstorgnhirarchyid).Scan(&value.Total)
	switch err {
	case sql.ErrNoRows:
		value.Total = 0
		return value, nil
	case nil:
		return value, nil
	default:
		logger.Log.Println("GetmapldapgrouproleCount Get Statement Prepare Error", err)
		return value, err
	}
}
