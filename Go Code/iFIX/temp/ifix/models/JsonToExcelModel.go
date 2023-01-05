package models

import (
	"bytes"
	"encoding/json"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"iFIX/ifix/utility"
	"io/ioutil"
	"net/http"
	"os"
)

func JsonToExcelConverter(tz *entities.ResultSetRequestEntity) (string, string, bool, error, string) {
	///t := entities.APIResponseDownload{}
	contextPath, contextPatherr := os.Getwd()
	props, err := utility.ReadPropertiesFile(contextPath + "/ifix/resource/application.properties")
	if err != nil {
		logger.Log.Println(err)
		return "", "", false, err, "Unable to Get URL From utility.ReadPropertiesFile"
	}
	if contextPatherr != nil {
		logger.Log.Println(contextPatherr)
		return "", "", false, contextPatherr, "Contextpath ERROR"
	}

	sendData, err := json.Marshal(tz)
	if err != nil {
		logger.Log.Println(err)
		return "", "", false, err, "Unable to marshal data"
	}
	logger.Log.Println("Create Ticket Json=======>   ", string(sendData))

	resp, err := http.Post(props["GetjsonUrl"], "application/json", bytes.NewBuffer(sendData))
	if err != nil {
		logger.Log.Println(err)
		return "", "", false, err, "Unable to Request For Data"
	}
	var result entities.JsonToExcelResponse
	respBody, err1 := ioutil.ReadAll(resp.Body)
	if err1 != nil {
		logger.Log.Println(err1)
		return "", "", false, err, "Unable to read response data"
	}
	err2 := json.Unmarshal(respBody, &result)
	if err2 != nil {
		logger.Log.Println(err2)
		return "", "", false, err, "Unable to Unmarshal data"
	}
	if !result.Success {
		logger.Log.Println("Unsuccess To Get Record")
		return "", "", false, err, "Something Went Wrong"
	}
	if len(result.Details.RequestResultsetData) == 0 {
		logger.Log.Println("No Data Is There")
		return "", "", false, err, "No Records Found"
	}
	//logger.Log.Println(result)

	_, filePath, err := utility.JsonToExcelConverter(result, tz)
	if err != nil {
		return "", "", false, err, "Something Went Wrong"
	}
	OriginalFileName, UploadedFileName, err := utility.FileUploadAPICall(1, 1, props["fileUploadUrl"], filePath)
	if err != nil {
		logger.Log.Println("Error while downloading", "-", err)
	}
	//fmt.Println(t.OriginalFileName, t.UploadedFileName)
	return OriginalFileName, UploadedFileName, true, nil, ""
}
