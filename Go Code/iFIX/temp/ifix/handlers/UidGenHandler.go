package handlers

import (
	"encoding/json"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"iFIX/ifix/models"
	"log"
	"net/http"
)

func ThrowUidGenAllResponse(successMessage string, responseData entities.UidGenEntities, w http.ResponseWriter, success bool) {
	var response = entities.UidGenResponse{}
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

func ThrowUidGenIntResponse(successMessage string, responseData int64, w http.ResponseWriter, success bool) {
	var response = entities.UidGenResponseInt{}
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

func InsertUidGen(w http.ResponseWriter, req *http.Request) {
	var data = entities.UidGenEntity{}
	jsonError := data.FromJSON(req.Body)
	if jsonError != nil {
		log.Print(jsonError)
		logger.Log.Println(jsonError)
		entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
	} else {
		data, success, _, msg := models.InsertUidGen(&data)
		ThrowUidGenIntResponse(msg, data, w, success)
	}
}

func GetAllUidGen(w http.ResponseWriter, req *http.Request) {
	var data = entities.UidGenEntity{}
	jsonError := data.FromJSON(req.Body)
	if jsonError != nil {
		log.Print(jsonError)
		logger.Log.Println(jsonError)
		entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
	} else {
		data, success, _, msg := models.GetAllUidGen(&data)
		ThrowUidGenAllResponse(msg, data, w, success)
	}
}

func DeleteUidGen(w http.ResponseWriter, req *http.Request) {
	var data = entities.UidGenEntity{}
	jsonError := data.FromJSON(req.Body)
	if jsonError != nil {
		log.Print(jsonError)
		logger.Log.Println(jsonError)
		entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
	} else {
		success, _, msg := models.DeleteUidGen(&data)
		ThrowUidGenIntResponse(msg, 0, w, success)
	}
}

func UpdateUidGen(w http.ResponseWriter, req *http.Request) {
	var data = entities.UidGenEntity{}
	jsonError := data.FromJSON(req.Body)
	if jsonError != nil {
		log.Print(jsonError)
		logger.Log.Println(jsonError)
		entities.ThrowJSONResponse(entities.JSONParseErrorResponse(), w)
	} else {
		success, _, msg := models.UpdateUidGen(&data)
		ThrowUidGenIntResponse(msg, 0, w, success)
	}
}
