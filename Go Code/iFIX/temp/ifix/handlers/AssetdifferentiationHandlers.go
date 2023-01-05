package handlers


import (
  "iFIX/ifix/entities"
  "iFIX/ifix/models"
  "iFIX/ifix/logger"
  "log"
  "net/http"
  "encoding/json"
  )

func ThrowAssetdifferentiationAllResponse(successMessage string, responseData entities.AssetdifferentiationEntities, w http.ResponseWriter, success bool) {
    var response = entities.AssetdifferentiationResponse{}
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


func ThrowAssetdifferentiationIntResponse(successMessage string, responseData int64, w http.ResponseWriter, success bool) {
    var response = entities.AssetdifferentiationResponseInt{}
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


func InsertAssetdifferentiation(w http.ResponseWriter, req *http.Request) {
    var data = entities.AssetdifferentiationEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.InsertAssetdifferentiation(&data)
        ThrowAssetdifferentiationIntResponse(msg, data, w, success)
    }
}


func GetAllAssetdifferentiation(w http.ResponseWriter, req *http.Request) {
    var data = entities.AssetdifferentiationEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        data, success, _, msg := models.GetAllAssetdifferentiation(&data)
        ThrowAssetdifferentiationAllResponse(msg, data, w, success)
    }
}


func DeleteAssetdifferentiation(w http.ResponseWriter, req *http.Request) {
    var data = entities.AssetdifferentiationEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.DeleteAssetdifferentiation(&data)
        ThrowAssetdifferentiationIntResponse(msg, 0, w, success)
    }
}


func UpdateAssetdifferentiation(w http.ResponseWriter, req *http.Request) {
    var data = entities.AssetdifferentiationEntity{}
    jsonError := data.FromJSON(req.Body)
    if jsonError != nil {
        log.Print(jsonError)
        logger.Log.Println(jsonError)
        entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
    } else {
        success, _, msg := models.UpdateAssetdifferentiation(&data)
        ThrowAssetdifferentiationIntResponse(msg, 0, w, success)
    }
}


