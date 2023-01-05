package main

import (
	"fmt"

	"database/sql"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/tealeg/xlsx"
	//"strings"
)

type MstsupportgrpEntity struct {
	Id             int64  `json:"id"`
	SupportgrpName string `json:"supportgrpname"`
	Activeflg      int64  `json:"activeflg"`

	Clientid          int64 `json:"clientid"`
	Mstorgnhirarchyid int64 `json:"mstorgnhirarchyid"`
	Copyable          int64 `json:"copyable"`
	/*Roleid              int64  `json:"roleid"`
	Rolename            string `json:rolename`
	Groupid             int64  `json:"groupid"`
	Groupname           string `json:"groupname"`
	Activeflg           int64  `json:"activeflg"`
	Offset              int64  `json:"offset"`
	Limit               int64  `json:"limit"`*/
	Clientname          string `json:"clientname"`
	Mstorgnhirarchyname string `json:"mstorgnhirarchyname"`
	Offset              int64  `json:"offset"`
	Limit               int64  `json:"limit"`
}

var DBDRIVER = "mysql"
var DBUSER = "root"
var DBPASWORD = "7980161455"
var DBURL = "tcp(127.0.0.1:3306)"
var DBNAME = "iFIX"
var getmstsupportgrp = "SELECT a.id as Id,a.clientid as Clientid,a.mstorgnhirarchyid as Mstorgnhirarchyid, a.name as SupportgrpName,a.activeflg as Activeflg,b.name as Clientname,c.name as Mstorgnhirarchyname,a.copyable as Copyable FROM mstsupportgrp a,mstclient b,mstorgnhierarchy c WHERE a.clientid=? and a.mstorgnhirarchyid=? and a.deleteflg =0 and a.activeflg=1 and a.clientid=b.id and a.mstorgnhirarchyid=c.id ORDER BY a.id DESC LIMIT ?,?"

func main() {
	//var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error

	var values []MstsupportgrpEntity

	db, err := sql.Open(DBDRIVER, DBUSER+":"+DBPASWORD+"@"+DBURL+"/"+DBNAME)
	defer db.Close()
	if err != nil {
		//logger.Log.Println("database connection failure", err)
		//return 0, false, err, "Something Went Wrong"
		fmt.Printf(err.Error())
	}
	/*dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.GetAllmstsupportgrp(page)
	if err1 != nil {
		//return t, false, err1, "Something Went Wrong"
		fmt.Printf(err.Error())
	}
	fmt.Println(values)*/
	rows, err := db.Query(getmstsupportgrp, 2, 2, 0, 5)
	defer rows.Close()
	if err != nil {
		//logger.Log.Println("GetAllMstsupportgrp Get Statement Prepare Error", err)
		//return values, err
	}
	for rows.Next() {
		value := MstsupportgrpEntity{}
		rows.Scan(&value.Id, &value.Clientid, &value.Mstorgnhirarchyid, &value.SupportgrpName, &value.Activeflg, &value.Clientname, &value.Mstorgnhirarchyname, &value.Copyable)
		values = append(values, value)
	}

	file := xlsx.NewFile()
	sheet, err = file.AddSheet("Sheet1")
	if err != nil {
		fmt.Printf(err.Error())
	}
	//var elem string
	for i := 0; i < len(values); i++ {
		row = sheet.AddRow()
		for j := 0; j < 4; j++ {

			if j == 0 {
				cell = row.AddCell()
				cell.Value = strconv.FormatInt(values[i].Id, 10)
			}
			if j == 1 {
				cell = row.AddCell()
				cell.Value = strconv.FormatInt(values[i].Clientid, 10)
			}
			if j == 2 {
				cell = row.AddCell()
				cell.Value = strconv.FormatInt(values[i].Mstorgnhirarchyid, 10)
			}
			if j == 3 {
				cell = row.AddCell()
				cell.Value = values[i].SupportgrpName
			}

		}
	}
	/*row = sheet.AddRow()
	cell = row.AddCell()
	cell.Value = "I am a cell!"*/
	err = file.Save("DbXLSXFile.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
	}
}
