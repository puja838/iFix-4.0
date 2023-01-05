package main

import (
	"fmt"

	"github.com/tealeg/xlsx"
)

func main() {
	//var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error

	file := xlsx.NewFile()
	sheet, err = file.AddSheet("Sheet1")
	if err != nil {
		fmt.Printf(err.Error())
	}
	var elem string
	for i := 0; i < 5; i++ {
		row = sheet.AddRow()
		for j := 0; j < 3; j++ {
			cell = row.AddCell()
			fmt.Scanln(&elem)
			cell.Value = elem
		}
	}
	/*row = sheet.AddRow()
	cell = row.AddCell()
	cell.Value = "I am a cell!"*/
	err = file.Save("NewXLSXFile.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
	}
}
