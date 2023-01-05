package handlers


import (
  "iFIX/ifix/entities"
  "iFIX/ifix/models"
  "iFIX/ifix/logger"
  "log"
  "net/http"
  "encoding/json"
  )
func ThrowMstExcelTemplateAllResponse(successMessage string, responseData entities.MstExcelTemplateEntities, w http.ResponseWriter, success bool) {
    var response = entities.MstExcelTemplateResponse{}
    response.Success = success
    response.Message = successMessage
    response.Details = responseData
    jsonResponse, jsonError := json.Marshal(response)
    if jsonError != nil {
        logger.Log.Fatal("Internel Server Error")
    }
    w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
}


func ThrowMstExcelTemplateIntResponse(successMessage string, responseData int64, w http.ResponseWriter, success bool) {
    var response = entities.MstExcelTemplateResponseInt{}
    response.Success = success
    response.Message = successMessage
    response.Details = responseData
    jsonResponse, jsonError := json.Marshal(response)
    if jsonError != nil {
        logger.Log.Fatal("Internel Server Error")
    }
    w.Header().Set("Content-Type", "application/json")
    w.Write(jsonResponse)
}


func AddMstExcelTemplate(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstExcelTemplateEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.AddMstExcelTemplate(&data)
        ThrowMstExcelTemplateIntResponse(msg, data, w, success)
    }
}


func GetAllMstExcelTemplate(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstExcelTemplateEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.GetAllMstExcelTemplate(&data)
        ThrowMstExcelTemplateAllResponse(msg, data, w, success)
    }
}


func DeleteMstExcelTemplate(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstExcelTemplateEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.DeleteMstExcelTemplate(&data)
        ThrowMstExcelTemplateIntResponse(msg, 0, w, success)
    }
}


func UpdateMstExcelTemplate(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstExcelTemplateEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.UpdateMstExcelTemplate(&data)
        ThrowMstExcelTemplateIntResponse(msg, 0, w, success)
    }
}
