package handlers
 

import (
  "iFIX/ifix/entities"
  "iFIX/ifix/models"
  "iFIX/ifix/logger"
  "log"
  "net/http"
  "encoding/json"
  )
func ThrowMstTemplateVariableAllResponse(successMessage string, responseData entities.MstTemplateVariableEntities, w http.ResponseWriter, success bool) {
    var response = entities.MstTemplateVariableResponse{}
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


func ThrowMstTemplateVariableIntResponse(successMessage string, responseData int64, w http.ResponseWriter, success bool) {
    var response = entities.MstTemplateVariableResponseInt{}
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


func AddMstTemplateVariable(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstTemplateVariableEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.AddMstTemplateVariable(&data)
        ThrowMstTemplateVariableIntResponse(msg, data, w, success)
    }
}


func GetAllMstTemplateVariable(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstTemplateVariableEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.GetAllMstTemplateVariable(&data)
        ThrowMstTemplateVariableAllResponse(msg, data, w, success)
    }
}


func DeleteMstTemplateVariable(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstTemplateVariableEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.DeleteMstTemplateVariable(&data)
        ThrowMstTemplateVariableIntResponse(msg, 0, w, success)
    }
}


func UpdateMstTemplateVariable(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstTemplateVariableEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.UpdateMstTemplateVariable(&data)
        ThrowMstTemplateVariableIntResponse(msg, 0, w, success)
    }
}
