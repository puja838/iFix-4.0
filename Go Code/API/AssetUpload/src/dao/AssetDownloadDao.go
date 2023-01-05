package dao

import (
	//"log"
	Logger "src/logger"
	//"src/config"
	"database/sql"
	"errors"
)

func Gettypename(db *sql.DB, clientID int64, mstOrgnHirarchyId int64) ([]string, []int64, error) {
	var assetTypeName []string
	var assetTypeId []int64
	var selectHeaderForAssetQuery string = "select id,typename from mstrecorddifferentiationtype where clientid=? and mstorgnhirarchyid=? and parentid = (select id from mstrecorddifferentiationtype where seqno = 5)  and deleteflg=0 and activeflg=1 order by seqno asc"
	//fetching category header Details and storing into slice
	assetHeadeResultSet, err := db.Query(selectHeaderForAssetQuery, clientID, mstOrgnHirarchyId)
	if err != nil {
		Logger.Log.Println(err)

		return assetTypeName, assetTypeId, errors.New("ERROR: Unable to fetch AccetHeaderResultSet")
	}
	defer assetHeadeResultSet.Close()
	for assetHeadeResultSet.Next() {
		var assetHeader string
		var assetId int64
		err = assetHeadeResultSet.Scan(&assetId, &assetHeader)
		if err != nil {
			Logger.Log.Println(err)

			return assetTypeName, assetTypeId, errors.New("ERROR: Unable to scan AssetHeadeResultSet")
		}
		assetTypeName = append(assetTypeName, assetHeader)
		assetTypeId = append(assetTypeId, assetId)
	}
	return assetTypeName, assetTypeId, nil
}

func GetassetHeader(db *sql.DB, clientID int64, mstOrgnHirarchyId int64, assetTypeId int64) ([]string, []int64, error) {
	var assetheader []string
	var assetheaderId []int64

	var selectAssetQuery string = "SELECT id,name FROM mstrecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid = ? and deleteflg=0 and activeflg=1"
	Logger.Log.Println(clientID, mstOrgnHirarchyId, assetTypeId)
	assetQueryresult, err := db.Query(selectAssetQuery, clientID, mstOrgnHirarchyId, assetTypeId)
	if err != nil {
		Logger.Log.Println(err)
		return assetheader, assetheaderId, errors.New("ERROR: Unable to fetch")
	}

	defer assetQueryresult.Close()
	for assetQueryresult.Next() {
		var name string
		var id int64
		err = assetQueryresult.Scan(&id, &name)
		if err != nil {
			Logger.Log.Println(err)

			return assetheader, assetheaderId, errors.New("ERROR: Unable to scan AssetHeadeResultSet")
		}
		assetheader = append(assetheader, name)
		assetheaderId = append(assetheaderId, id)
	}
	return assetheader, assetheaderId, nil
}

func Getassetrows(db *sql.DB, clientID int64, mstOrgnHirarchyId int64, assetHeaderId int64) ([]int64, error) {
	var transid []int64
	var selectAssetRows = "select distinct trnassetid from mapassetdifferentiation where clientid=? and mstorgnhirarchyid=? and deleteflg=0 and activeflg = 1 and mstdifferentiationtypeid=?"
	Logger.Log.Println(clientID, mstOrgnHirarchyId, assetHeaderId)
	assetRowsResult, err := db.Query(selectAssetRows, clientID, mstOrgnHirarchyId, assetHeaderId)

	if err != nil {
		Logger.Log.Println(err)
		return transid, errors.New("ERROR: Unable to fetch")
	}

	defer assetRowsResult.Close()
	for assetRowsResult.Next() {
		var trnassetid int64
		err = assetRowsResult.Scan(&trnassetid)
		if err != nil {
			Logger.Log.Println(err)

			return transid, errors.New("ERROR: Unable to scan AssetHeadeResultSet")
		}
		transid = append(transid, trnassetid)
	}
	return transid, nil
}

func GetParentasset(db *sql.DB, clientID int64, mstOrgnHirarchyId int64, trnassetid int64, assetTypeId int64) (map[int64]string, error) {
	// var mstdifferentiationid []int64
	// var values []string
	var v = make(map[int64]string)
	var selectParentcategoryQuery = "SELECT mstdifferentiationid,value FROM mapassetdifferentiation where mstdifferentiationtypeid=?   and   mstorgnhirarchyid=? and clientid=? and trnassetid=?   and  deleteflg=0"
	Logger.Log.Println("trnassetid", assetTypeId, mstOrgnHirarchyId, clientID, trnassetid)
	parentcategoryResult, err := db.Query(selectParentcategoryQuery, assetTypeId, mstOrgnHirarchyId, clientID, trnassetid)
	if err != nil {
		Logger.Log.Println(err)
		return v, err
	}
	defer parentcategoryResult.Close()
	for parentcategoryResult.Next() {
		var diffTypeId int64
		var value string
		err = parentcategoryResult.Scan(&diffTypeId, &value)
		if err != nil {
			Logger.Log.Println(err)

			return v, err
		}
		// values = append(values, value)
		// mstdifferentiationid = append(mstdifferentiationid, diffTypeId)
		v[diffTypeId] = value

	}
	return v, err
}
