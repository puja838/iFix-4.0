package main

import (
	"fmt"
	"log"

	//"TestGo"
	excel "github.com/tealeg/xlsx"
)

//https://pkg.go.dev/github.com/tealeg/xlsx

func main() {
	log.Println("Main started")
	fmt.Println("testttttttttttttting Excel  code")

	excelFileName := "/home/mantech/Documents/josim/go/iFIX/NewifIX/MyXLSXFile.xlsx"
	xlFile, err := excel.OpenFile(excelFileName)
	if err != nil {
		log.Println("Error==> ", err)
	}
	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {
			for _, cell := range row.Cells {
				text := cell.String()
				fmt.Printf("%s\n", text)
			}
		}
	}

}
