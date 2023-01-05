package handlers


import (
  "iFIX/ifix/entities"
  "iFIX/ifix/models"
  "iFIX/ifix/logger"
  "log"
  "net/http"
  "encoding/json"
  )

func ThrowMstslafullfillmentcriteriaAllResponse(successMessage string, responseData entities.MstslafullfillmentcriteriaEntities, w http.ResponseWriter, success bool) {
    var response = entities.MstslafullfillmentcriteriaResponse{}
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


func ThrowMstslafullfillmentcriteriaIntResponse(successMessage string, responseData int64, w http.ResponseWriter, success bool) {
    var response = entities.MstslafullfillmentcriteriaResponseInt{}
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


func InsertMstslafullfillmentcriteria(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstslafullfillmentcriteriaEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.InsertMstslafullfillmentcriteria(&data)
        ThrowMstslafullfillmentcriteriaIntResponse(msg, data, w, success)
    }
}


func GetAllMstslafullfillmentcriteria(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstslafullfillmentcriteriaEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.GetAllMstslafullfillmentcriteria(&data)
        ThrowMstslafullfillmentcriteriaAllResponse(msg, data, w, success)
    }
}


func DeleteMstslafullfillmentcriteria(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstslafullfillmentcriteriaEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.DeleteMstslafullfillmentcriteria(&data)
        ThrowMstslafullfillmentcriteriaIntResponse(msg, 0, w, success)
    }
}


func UpdateMstslafullfillmentcriteria(w http.ResponseWriter, req *http.Request) {
    var data = entities.MstslafullfillmentcriteriaEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.UpdateMstslafullfillmentcriteria(&data)
        ThrowMstslafullfillmentcriteriaIntResponse(msg, 0, w, success)
    }
}


