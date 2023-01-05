package main

import (
	"fmt"
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"strconv"

	"github.com/tealeg/xlsx"
	//"strings"
)

func main() {
	//var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error

	var page *entities.MstsupportgrpEntity
	page.Clientid = 2
	page.Mstorgnhirarchyid = 2
	page.Limit = 5
	logger.Log.Println("In side Assetvalidatemodel")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		//logger.Log.Println("database connection failure", err)
		//return 0, false, err, "Something Went Wrong"
		fmt.Printf(err.Error())
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.GetAllmstsupportgrp(page)
	if err1 != nil {
		//return t, false, err1, "Something Went Wrong"
		fmt.Printf(err.Error())
	}
	fmt.Println(values)
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
