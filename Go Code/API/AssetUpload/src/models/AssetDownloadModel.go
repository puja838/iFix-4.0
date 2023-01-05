package entitiess

import (
	"errors"
	"fmt"
	"src/config"
	Dao "src/dao"
	FileUtils "src/fileutils"
	Logger "src/logger"

	Excel "github.com/tealeg/xlsx"
)

func BulkAssetDownload(clientID int64, mstOrgnHirarchyId int64) (string, string, error) {
	contextPath, contextPatherr := getContextPath()
	if contextPatherr != nil {
		Logger.Log.Println(contextPatherr)
		return "", "", contextPatherr
	}
	Logger.Log.Println("BulkAssetDownload M1")
	db, dBerr := config.GetDB()
	Logger.Log.Println("BulkAssetDownload M1")
	if dBerr != nil {
		Logger.Log.Println(dBerr)
		fmt.Println(dBerr)
		return "", "", errors.New("ERROR: Unable to connect DB")
	}
	OrgName, OrgNameErr := Dao.GetOrgName(db, clientID, mstOrgnHirarchyId)
	if OrgNameErr != nil {
		fmt.Println(OrgNameErr)
		Logger.Log.Println(OrgNameErr)
		return "", "", errors.New("ERROR: Dao error")
	}
	filePath := contextPath + "/resource/downloads/" + OrgName + "_" + "ASSET.xlsx"
	fmt.Println(clientID, mstOrgnHirarchyId)

	assetTypeNames, assetTypeId, headerErr := Dao.Gettypename(db, clientID, mstOrgnHirarchyId)
	if headerErr != nil {
		fmt.Println(headerErr)
		Logger.Log.Println(headerErr)
		return "", "", errors.New("ERROR: Dao error")
	}
	file := Excel.NewFile()
	for i := 0; i < len(assetTypeId); i++ {
		sheet, sheetErr := file.AddSheet(assetTypeNames[i])
		if sheetErr != nil {
			Logger.Log.Print(sheetErr)

			//fmt.Printf(err.Error())
			return "", "", errors.New("ERROR: sheet adding error")
		}

		assetHeader, assetHeaderId, assetErr := Dao.GetassetHeader(db, clientID, mstOrgnHirarchyId, assetTypeId[i])
		Logger.Log.Println("Asset Header Ids", assetHeaderId)
		if assetErr != nil {
			fmt.Println(assetErr)
			Logger.Log.Println(assetErr)
			return "", "", errors.New("ERROR: Dao error")
		}
		// assetNameLength := len(assetHeader)
		trnassetid, asseterr := Dao.Getassetrows(db, clientID, mstOrgnHirarchyId, assetTypeId[i])
		Logger.Log.Println("Asset no of Rows", trnassetid)
		if asseterr != nil {
			fmt.Println(asseterr)
			Logger.Log.Println(asseterr)
			return "", "", errors.New("ERROR: Dao error")
		}
		row := sheet.AddRow()
		for m := 0; m < len(assetHeader); m++ {
			cell := row.AddCell()
			cell.Value = assetHeader[m]
		}
		for j := 0; j < len(trnassetid); j++ {
			rows, asseterr := Dao.GetParentasset(db, clientID, mstOrgnHirarchyId, trnassetid[j], assetTypeId[i])
			Logger.Log.Println(rows)
			if asseterr != nil {
				fmt.Println(asseterr)
				Logger.Log.Println(asseterr)
				return "", "", errors.New("ERROR: Dao error")
			}
			Logger.Log.Println("Asset header len", len(assetHeaderId))
			row := sheet.AddRow()
			for k := 0; k < len(assetHeaderId); k++ {
				cell := row.AddCell()
				v, found := rows[assetHeaderId[k]]
				if found == true {
					cell.Value = fmt.Sprintf("%v", v)
				} else {
					cell.Value = ""
				}
			}
		}

	}
	saveErr := file.Save(filePath)
	if saveErr != nil {
		Logger.Log.Print(saveErr)

		//fmt.Printf(err.Error())
		return "", "", errors.New("ERROR: File saving error")
	}
	props, err := FileUtils.ReadPropertiesFile(contextPath + "/resource/application.properties")
	originalFileName, newFileName, err := FileUtils.FileUploadAPICall(clientID, mstOrgnHirarchyId, props["fileUploadUrl"], filePath)
	if err != nil {
		Logger.Log.Println("Error while downloading", "-", err)
	}

	return originalFileName, newFileName, nil
}
