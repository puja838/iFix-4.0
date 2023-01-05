package models

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"ifixRecord/ifix/dao"
	"ifixRecord/ifix/entities"
	"ifixRecord/ifix/fileutils"
	"ifixRecord/ifix/logger"
	"ifixRecord/ifix/mutexutility"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

func EbondingTicket(page *entities.EbondingRecordEntity) (bool, error, string) {
	logger.Log.Println("In side EbondingTicket")
	// t := []entities.RecordDetailsEntity{}
	// if mutexutility.MutexLocked(lock) == false {
	// 	lock.Lock()
	// 	defer lock.Unlock()
	// }
	// db, err := ConnectMySqlDb()
	// if err != nil {
	// 	logger.Log.Println("database connection failure", err)
	// 	return false, err, "Something Went Wrong"
	// }
	// dataAccess := dao.DbConn{DB: db}
	status, err := Ebonding(page)
	msg := ""
	if err != nil {
		msg = "Something Went Wrong"
		// 	logger.Log.Println("database connection failure", err)
		// 	return  status, err, "Something Went Wrong"
	}
	return status, err, msg
}
func OtonAuthentication(tz *entities.EbondingRecordEntity, db *sql.DB) (string, error) {

	tempModuleSeq := tz.EbondingModuleSeq
	tz.EbondingModuleSeq = 1
	var auth string
	dataAccess := dao.DbConn{DB: db}
	authenticationUrl, authenticationUrlerr := dataAccess.GetModuleUrl(tz)
	if authenticationUrlerr != nil {
		return auth, authenticationUrlerr
	}
	tz.EbondingModuleSeq = tempModuleSeq
	client := http.Client{}
	form := url.Values{}
	form.Add("username", "TataAAI_IFIX_User")
	form.Add("password", "TataAAI123")
	req, err := http.NewRequest("POST", authenticationUrl, strings.NewReader(form.Encode()))
	if err != nil {
		logger.Log.Println("err")
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		logger.Log.Println("err resp", err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.Log.Println("err resp")
	}
	logger.Log.Println(string(body))
	auth = "AR-JWT " + string(body)
	resp.Body.Close()
	return auth, nil
}

func OtonCreateTicket(tz *entities.EbondingRecordEntity, db *sql.DB, auth string) error {
	dataAccess := dao.DbConn{DB: db}
	client := http.Client{}
	shortDesc, longDesc, _, descErr := dataAccess.GetDescription(tz)
	if descErr != nil {
		logger.Log.Println(descErr)
		return descErr
	}
	categories, categoriesErr := dataAccess.GetCategories(tz)
	if categoriesErr != nil {
		logger.Log.Println(categoriesErr)
		return categoriesErr
	}
	if len(categories) == 0 {
		return errors.New("Category Not Configured")
	}
	createEbodingTicketUrl, createEbodingTicketUrlErr := dataAccess.GetModuleUrl(tz)
	if createEbodingTicketUrlErr != nil {
		return createEbodingTicketUrlErr
	}

	ebondingOtonCreateRecordEntity := entities.EbondingOtonCreateRecordEntity{}
	ebondingOtonCreateRecordEntity.Values.First_Name = "Tata AAI"
	ebondingOtonCreateRecordEntity.Values.Last_Name = "User"
	ebondingOtonCreateRecordEntity.Values.ShortDescription = shortDesc
	ebondingOtonCreateRecordEntity.Values.LongDescription = longDesc
	ebondingOtonCreateRecordEntity.Values.Impact = "3-Moderate/Limited"
	ebondingOtonCreateRecordEntity.Values.Urgency = "3-Medium"
	ebondingOtonCreateRecordEntity.Values.Status = "Assigned"
	ebondingOtonCreateRecordEntity.Values.Reported_Source = "Other"
	ebondingOtonCreateRecordEntity.Values.Service_Type = "User Service Request"
	ebondingOtonCreateRecordEntity.Values.Cat3 = categories[0]
	ebondingOtonCreateRecordEntity.Values.Cat4 = categories[1]
	ebondingOtonCreateRecordEntity.Values.Cat5 = categories[2]
	ebondingOtonCreateRecordEntity.Values.IfixTicketID = tz.RecordCode
	postBody, jsonErr := json.Marshal(ebondingOtonCreateRecordEntity)
	if jsonErr != nil {
		return jsonErr
	}
	logger.Log.Println("postBody=======>", string(postBody))
	reqForCreateTicket, reqForCreateTicketErr := http.NewRequest("POST", createEbodingTicketUrl, bytes.NewReader(postBody))

	if reqForCreateTicketErr != nil {
		logger.Log.Println("reqForCreateTicketErr=======>", reqForCreateTicketErr)
		return errors.New("Something Went Wrong!!!")
	}
	reqForCreateTicket.Header.Add("Content-Type", "application/json")
	reqForCreateTicket.Header.Add("Authorization", auth)

	respForCreateTicket, respForCreateTicketErr := client.Do(reqForCreateTicket)
	if respForCreateTicketErr != nil {
		logger.Log.Println("respForCreateTicketErr======>", respForCreateTicketErr)
		return errors.New("Something Went Wrong!!!")

	}
	responseBody, responseBodyErr := ioutil.ReadAll(respForCreateTicket.Body)
	logger.Log.Println("responseBody=======>", string(responseBody))
	if responseBodyErr != nil {
		logger.Log.Println("responseBodyErr=======>", responseBodyErr)
		return errors.New("Something Went Wrong!!!")
	}
	ebondingOtonCreateTicketResponseEntities := entities.EbondingOtonCreateTicketResponseEntities{}
	resultErr := json.Unmarshal(responseBody, &ebondingOtonCreateTicketResponseEntities)
	if resultErr != nil {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")
	}
	externalTicketID := ebondingOtonCreateTicketResponseEntities.Values.IncidentNumber

	recordTermID, recordTermIDErr := dataAccess.GetMstRecordtermId(tz)
	if recordTermIDErr != nil {
		logger.Log.Println("recordTermIDErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}

	_, updateErr := dataAccess.UpdateExternalTicketId(tz, recordTermID, externalTicketID)
	if updateErr != nil {
		logger.Log.Println("updateErr=====>", updateErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}
	if respForCreateTicket.StatusCode != 201 {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("CreateTicket OTON API Error")
	}
	ebondingTransactionLog := entities.EbondingTransactionLog{}
	ebondingTransactionLog.Ebondingid = 2
	ebondingTransactionLog.RecordID = tz.RecordID
	ebondingTransactionLog.Requestjson = string(postBody)
	ebondingTransactionLog.Responsejson = string(responseBody)
	ebondingTransactionLog.Responsecode = int64(respForCreateTicket.StatusCode)
	_, insertErr := dataAccess.InsertTransactionLog(&ebondingTransactionLog)
	if insertErr != nil {
		logger.Log.Println("insertErr Transaction log=====>", insertErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}

	logger.Log.Println(string(responseBody))
	respForCreateTicket.Body.Close()

	return nil
}

func OtonWorkLog(tz *entities.EbondingRecordEntity, db *sql.DB, auth string) error {

	dataAccess := dao.DbConn{DB: db}
	client := http.Client{}
	workLogEbodingUrl, workLogEbodingUrlErr := dataAccess.GetModuleUrl(tz)
	if workLogEbodingUrlErr != nil {
		logger.Log.Println("workLogEbodingUrl =====>", workLogEbodingUrlErr)
		return workLogEbodingUrlErr
	}
	externalTicketID, externalTicketIDErr := dataAccess.GetExternalTicketID(tz)
	if externalTicketIDErr != nil {
		logger.Log.Println("externalTicketIDErr =====>", externalTicketIDErr)
		return externalTicketIDErr
	}
	// workNote, workNoteErr := dataAccess.GetExternalWorkNote(tz)
	// if workNoteErr != nil {
	// 	logger.Log.Println("externalTicketIDErr =====>", workNoteErr)
	// 	return workNoteErr
	// }

	otonWorkLogEntities := entities.OtonWorkLogEntities{}
	otonWorkLogEntities.Values.IncidentNumber = externalTicketID
	otonWorkLogEntities.Values.WorkLogType = "General Information"
	otonWorkLogEntities.Values.Z1DAction = "CREATE"
	otonWorkLogEntities.Values.ViewAccess = "Public"
	otonWorkLogEntities.Values.SecureWorkLog = "Yes"
	otonWorkLogEntities.Values.DetailedDescription = tz.Worknote

	postBody, jsonErr := json.Marshal(otonWorkLogEntities)
	if jsonErr != nil {
		return jsonErr
	}
	logger.Log.Println("postBody=======>", string(postBody))
	reqForWorklog, reqForWorklogErr := http.NewRequest("POST", workLogEbodingUrl, bytes.NewReader(postBody))

	if reqForWorklogErr != nil {
		logger.Log.Println("reqForWorklogErr=======>", reqForWorklogErr)
		return errors.New("Something Went Wrong!!!")
	}
	reqForWorklog.Header.Add("Content-Type", "application/json")

	reqForWorklog.Header.Add("Authorization", auth)

	respForWorklog, respForWorklogErr := client.Do(reqForWorklog)
	if respForWorklogErr != nil {
		logger.Log.Println("respForWorklogErr======>", respForWorklogErr)
		return errors.New("Something Went Wrong!!!")

	}
	responseBody, responseBodyErr := ioutil.ReadAll(respForWorklog.Body)
	if responseBodyErr != nil {
		logger.Log.Println("responseBodyErr=======>", responseBodyErr)
		return errors.New("Something Went Wrong!!!")
	}
	logger.Log.Println("responseBody=======>", string(responseBody))
	ebondingOtonCreateTicketResponseEntities := entities.EbondingOtonCreateTicketResponseEntities{}
	resultErr := json.Unmarshal(responseBody, &ebondingOtonCreateTicketResponseEntities)
	if resultErr != nil {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")
	}
	if respForWorklog.StatusCode != 201 {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("WorkLog API Error")
	}
	ebondingTransactionLog := entities.EbondingTransactionLog{}
	ebondingTransactionLog.Ebondingid = 2
	ebondingTransactionLog.RecordID = tz.RecordID
	ebondingTransactionLog.Requestjson = string(postBody)
	ebondingTransactionLog.Responsejson = string(responseBody)
	ebondingTransactionLog.Responsecode = int64(respForWorklog.StatusCode)
	_, insertErr := dataAccess.InsertTransactionLog(&ebondingTransactionLog)
	if insertErr != nil {
		logger.Log.Println("insertErr Transaction log=====>", insertErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}
	respForWorklog.Body.Close()

	return nil
}
func OtonAttachment(tz *entities.EbondingRecordEntity, db *sql.DB, auth string) error {

	dataAccess := dao.DbConn{DB: db}
	contextPath, contextPatherr := getContextPath()
	if contextPatherr != nil {
		logger.Log.Println(contextPatherr)
		return contextPatherr
	}
	client := http.Client{}
	AttachmentUrl, AttachmentUrlErr := dataAccess.GetModuleUrl(tz)
	if AttachmentUrlErr != nil {
		logger.Log.Println("workLogEbodingUrl =====>", AttachmentUrlErr)
		return AttachmentUrlErr
	}
	externalTicketID, externalTicketIDErr := dataAccess.GetExternalTicketID(tz)
	logger.Log.Println("OToN TciketID =====>", externalTicketID)
	if externalTicketIDErr != nil {
		logger.Log.Println("externalTicketIDErr =====>", externalTicketIDErr)
		return externalTicketIDErr
	}
	// workNote, workNoteErr := dataAccess.GetExternalWorkNote(tz)
	// if workNoteErr != nil {
	// 	logger.Log.Println("externalTicketIDErr =====>", workNoteErr)
	// 	return workNoteErr
	// }
	otonAttachmentEntitis := entities.OtonAttachmentEntitis{}
	otonAttachmentEntitis.Values.IncidentNumber = externalTicketID
	otonAttachmentEntitis.Values.WorkLogType = "General Information"
	otonAttachmentEntitis.Values.Z1DAction = "CREATE"
	otonAttachmentEntitis.Values.ViewAccess = "Internal"
	otonAttachmentEntitis.Values.SecureWorkLog = "Yes"
	otonAttachmentEntitis.Values.DetailedDescription = tz.Worknote
	otonAttachmentEntitis.Values.Z2AFWorkLog01 = tz.OriginalFileName

	if len(tz.OriginalFileName) > 0 && len(tz.UploadedFileName) > 0 {
		filePath := contextPath + "/ifix/resource/downloads/" + tz.OriginalFileName
		fileDownloadErr := fileutils.DownloadFileFromUrl(tz.ClientID, tz.MstorgnhirarchyID, tz.OriginalFileName, tz.UploadedFileName, filePath)
		if fileDownloadErr != nil {
			fmt.Println("Dowlloaderror")
			logger.Log.Println(fileDownloadErr)
			return errors.New("OTON File download error")
		}
		logger.Log.Println(filePath)
		writerbody := &bytes.Buffer{}
		writer := multipart.NewWriter(writerbody)

		mimeHeader1 := make(map[string][]string)
		mimeHeader1["Content-Disposition"] = append(mimeHeader1["Content-Disposition"], "form-data; name=\"entry\"")
		mimeHeader1["Content-Type"] = append(mimeHeader1["Content-Type"], "application/json")

		postBody, postBodyErr := json.Marshal(otonAttachmentEntitis)
		if postBodyErr != nil {
			logger.Log.Println("OTON ATTACHMENT postBodyErr=====", postBodyErr)
		}
		logger.Log.Println("OTON Attachemnt PostBody====>", string(postBody))
		fieldWriter1, _ := writer.CreatePart(mimeHeader1)
		fieldWriter1.Write(postBody)
		file, errFile := os.Open(filePath)
		if errFile != nil {
			logger.Log.Println("-------------Oton attachment open file error---------", errFile)
		}
		defer file.Close()
		part2, errFile2 := writer.CreateFormFile("attach-z2AF Work Log01", filepath.Base(filePath))
		_, errFile2 = io.Copy(part2, file)
		if errFile2 != nil {
			logger.Log.Println("OTON Attachment errFile2 Part 2", errFile2)
			return errFile2
		}
		writerErr := writer.Close()
		if writerErr != nil {
			logger.Log.Println("OTON writerErr postBodyErr=====", writerErr)

			return writerErr
		}
		reqForOtonAttachment, _ := http.NewRequest("POST", AttachmentUrl, writerbody)
		reqForOtonAttachment.Header.Add("Authorization", auth)
		//req1.Header.Add("Content-Type", appl)
		reqForOtonAttachment.Header.Add("Content-Type", "application/octet-stream")
		reqForOtonAttachment.Header.Set("Content-Type", writer.FormDataContentType())
		//req1.Header.Add("Content-Type", "application/json")
		//log.Println(req1.Header)
		respForOtonAttachment, respForOtonAttachmentErr := client.Do(reqForOtonAttachment)
		if respForOtonAttachmentErr != nil {
			logger.Log.Println("respForOtonAttachmentErr======>", respForOtonAttachmentErr)
			return errors.New("Something Went Wrong!!!")

		}
		responseBody, responseBodyErr := ioutil.ReadAll(respForOtonAttachment.Body)
		if responseBodyErr != nil {
			logger.Log.Println("Oton Attachment responseBodyErr=======>", responseBodyErr)
			return errors.New("Something Went Wrong!!!")
		}
		logger.Log.Println("Oton Attachment responseBody=======>", string(responseBody))
		ebondingOtonCreateTicketResponseEntities := entities.EbondingOtonCreateTicketResponseEntities{}
		resultErr := json.Unmarshal(responseBody, &ebondingOtonCreateTicketResponseEntities)
		if resultErr != nil {
			logger.Log.Println("resultErr=====>", resultErr)
			//return ticketNo, errors.New("Unable to Unmarchal data")
			return errors.New("Something Went Wrong!!!")
		}
		if respForOtonAttachment.StatusCode != 201 {
			logger.Log.Println("resultErr=====>", resultErr)
			//return ticketNo, errors.New("Unable to Unmarchal data")
			return errors.New("WorkLog API Error")
		}
		ebondingTransactionLog := entities.EbondingTransactionLog{}
		ebondingTransactionLog.Ebondingid = 2
		ebondingTransactionLog.RecordID = tz.RecordID
		ebondingTransactionLog.Requestjson = string(postBody)
		ebondingTransactionLog.Responsejson = string(responseBody)
		ebondingTransactionLog.Responsecode = int64(respForOtonAttachment.StatusCode)
		_, insertErr := dataAccess.InsertTransactionLog(&ebondingTransactionLog)
		if insertErr != nil {
			logger.Log.Println("insertErr Transaction log=====>", insertErr)
			//return ticketNo, errors.New("Unable to Unmarchal data")
			return errors.New("Something Went Wrong!!!")

		}
		respForOtonAttachment.Body.Close()

	}

	return nil
}

func TDLCreateTicket(tz *entities.EbondingRecordEntity, db *sql.DB) error {
	dataAccess := dao.DbConn{DB: db}
	contextPath, contextPatherr := getContextPath()
	if contextPatherr != nil {
		logger.Log.Println(contextPatherr)
		return contextPatherr
	}
	client := http.Client{}
	TDLCreateTicketUrl, TDLCreateTicketUrlErr := dataAccess.GetModuleUrl(tz)
	if TDLCreateTicketUrlErr != nil {
		logger.Log.Println("TDLCreateTicketUrlErr =====>", TDLCreateTicketUrlErr)
		return TDLCreateTicketUrlErr
	}
	shortDesc, longDesc, userID, descErr := dataAccess.GetDescription(tz)
	if descErr != nil {
		logger.Log.Println(descErr)
		return descErr
	}
	userName, userEmail, userContact, userErr := dataAccess.GetUserDetails(userID)
	if userErr != nil {
		logger.Log.Println("userDetailsErr=======>", userErr)
		return userErr
	}
	categories, categoriesErr := dataAccess.GetCategories(tz)
	if categoriesErr != nil {
		logger.Log.Println(categoriesErr)
		return categoriesErr
	}
	impact, impactErr := dataAccess.GetImpact(tz)
	if impactErr != nil {
		logger.Log.Println("userDetailsErr=======>", impactErr)
		return categoriesErr
	}
	urgency, urgencyErr := dataAccess.GetUrgency(tz)
	if urgencyErr != nil {
		logger.Log.Println("userDetailsErr=======>", urgencyErr)
		return categoriesErr
	}
	if len(categories) == 0 {
		return errors.New("Category Not Configured")
	}
	if len(urgency) == 0 {
		return errors.New("urgency Not Configured")
	}
	if len(impact) == 0 {
		return errors.New("impact Not Configured")
	}
	attachment, err := dataAccess.GetAttachment(tz.ClientID, tz.MstorgnhirarchyID, tz.RecordID)
	if err != nil {
		logger.Log.Println(err)
		// return 0, err
	}

	ebondingTDLCreateRecord := entities.EbondingTDLCreateRecord{}

	for i := 0; i < len(attachment); i++ {

		filePath := contextPath + "/ifix/resource/downloads/" + attachment[i].OriginalFileName
		fileDownloadErr := fileutils.DownloadFileFromUrl(tz.ClientID, tz.MstorgnhirarchyID, attachment[i].OriginalFileName, attachment[i].UploadedFileName, filePath)
		if fileDownloadErr != nil {
			fmt.Println("Dowlloaderror")
			logger.Log.Println(fileDownloadErr)
			//return t, false, fileDownloadErr, "File download error"
		}
		logger.Log.Println(filePath)
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			logger.Log.Println(err)
		}
		contentEncode := base64.StdEncoding.EncodeToString(content)
		attachEncode := entities.EbondingTDLFileAttachmentDetails{}
		attachEncode.Filename = attachment[i].OriginalFileName
		attachEncode.Filetype = http.DetectContentType(content)
		attachEncode.Filecontent = contentEncode

		ebondingTDLCreateRecord.Fileattachment = append(ebondingTDLCreateRecord.Fileattachment, attachEncode)
		//logger.Log.Println("For Ending", t)

	}

	ebondingTDLCreateRecord.ShortDescription = shortDesc
	ebondingTDLCreateRecord.LongDescription = longDesc
	ebondingTDLCreateRecord.Impact = impact
	ebondingTDLCreateRecord.Urgency = urgency
	ebondingTDLCreateRecord.Email = userEmail
	ebondingTDLCreateRecord.LoginID = userName
	ebondingTDLCreateRecord.RequestorMobile = userContact
	ebondingTDLCreateRecord.TicketID = tz.RecordCode
	ebondingTDLCreateRecord.Notes = ""
	postBody, jsonErr := json.Marshal(ebondingTDLCreateRecord)
	if jsonErr != nil {
		return jsonErr
	}
	logger.Log.Println("TDL create ticket postBody======>", string(postBody))
	reqForCreateTicket, reqForCreateTicketErr := http.NewRequest("POST", TDLCreateTicketUrl, bytes.NewReader(postBody))
	if reqForCreateTicketErr != nil {
		logger.Log.Println("reqForWorklogErr=======>", reqForCreateTicketErr)
		return errors.New("Something Went Wrong!!!")
	}
	reqForCreateTicket.SetBasicAuth("aai_ifix.integration", "+pbDJIot+7JVd[tnhkwY[0u1{wE2dCCXx3Eu2CCq")

	respForCreateTicket, respForCreateTicketErr := client.Do(reqForCreateTicket)
	if respForCreateTicketErr != nil {
		logger.Log.Println("respForCreateTicketErr======>", respForCreateTicketErr)
		return errors.New("Something Went Wrong!!!")

	}
	responseBody, responseBodyErr := ioutil.ReadAll(respForCreateTicket.Body)
	logger.Log.Println("TDLcreateticket responseBody ====>", string(responseBody))

	if responseBodyErr != nil {
		logger.Log.Println("responseBodyErr=======>", responseBodyErr)
		return errors.New("Something Went Wrong!!!")
	}
	ebondingTDLCreateRecordResponseEntity := entities.EbondingTDLCreateRecordResponseEntity{}
	resultErr := json.Unmarshal(responseBody, &ebondingTDLCreateRecordResponseEntity)
	if resultErr != nil {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")
	}
	logger.Log.Println("ebondingTDLCreateRecordResponseEntity unmarshal===>>", ebondingTDLCreateRecordResponseEntity)

	externalTicketID := ebondingTDLCreateRecordResponseEntity.Result.TDLTicketID
	logger.Log.Println("TDL externalTicketID====>", externalTicketID)
	recordTermID, recordTermIDErr := dataAccess.GetMstRecordtermId(tz)
	if recordTermIDErr != nil {
		logger.Log.Println("recordTermIDErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}

	_, updateErr := dataAccess.UpdateExternalTicketId(tz, recordTermID, externalTicketID)
	if updateErr != nil {
		logger.Log.Println("updateErr=====>", updateErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}
	if respForCreateTicket.StatusCode != 200 {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("CreateTicket OTON API Error")
	}
	ebondingTransactionLog := entities.EbondingTransactionLog{}
	ebondingTransactionLog.Ebondingid = 3
	ebondingTransactionLog.RecordID = tz.RecordID
	ebondingTransactionLog.Requestjson = string(postBody)
	ebondingTransactionLog.Responsejson = string(responseBody)
	ebondingTransactionLog.Responsecode = int64(respForCreateTicket.StatusCode)
	_, insertErr := dataAccess.InsertTransactionLog(&ebondingTransactionLog)
	if insertErr != nil {
		logger.Log.Println("insertErr Transaction log=====>", insertErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}
	logger.Log.Println("TDL create Ticket Response", string(responseBody))
	respForCreateTicket.Body.Close()

	return nil
}
func TDLUpdateTicket(tz *entities.EbondingRecordEntity, db *sql.DB) error {

	dataAccess := dao.DbConn{DB: db}
	contextPath, contextPatherr := getContextPath()
	if contextPatherr != nil {
		logger.Log.Println(contextPatherr)
		return contextPatherr
	}
	client := http.Client{}
	TDLUpdateTicketUrl, TDLUpdateTicketUrlErr := dataAccess.GetModuleUrl(tz)
	if TDLUpdateTicketUrlErr != nil {
		logger.Log.Println("TDLUpdateTicketUrl =====>", TDLUpdateTicketUrlErr)
		return TDLUpdateTicketUrlErr
	}
	updateTicketID, externalTicketIDErr := dataAccess.GetExternalTicketID(tz)
	if externalTicketIDErr != nil {
		logger.Log.Println("externalTicketIDErr =====>", externalTicketIDErr)
		return externalTicketIDErr
	}
	// workNote, workNoteErr := dataAccess.GetExternalWorkNote(tz)
	// if workNoteErr != nil {
	// 	logger.Log.Println("externalTicketIDErr =====>", workNoteErr)
	// 	return workNoteErr
	// }
	impact, impactErr := dataAccess.GetImpact(tz)
	if impactErr != nil {
		logger.Log.Println("impact=======>", impactErr)
		return impactErr
	}
	urgency, urgencyErr := dataAccess.GetUrgency(tz)
	if urgencyErr != nil {
		logger.Log.Println("urgency=======>", urgencyErr)
		return urgencyErr
	}
	if len(urgency) == 0 {
		logger.Log.Println("urgency Not Configured")
		return errors.New("urgency Not Configured")
	}
	if len(impact) == 0 {
		logger.Log.Println("Impact Not Configured")
		return errors.New("impact Not Configured")
	}
	ebondingTDLUpdateRecord := entities.EbondingTDLUpdateRecord{}
	if len(tz.UploadedFileName) > 0 || len(tz.OriginalFileName) > 0 {
		filePath := contextPath + "/ifix/resource/downloads/" + tz.OriginalFileName
		fileDownloadErr := fileutils.DownloadFileFromUrl(tz.ClientID, tz.MstorgnhirarchyID, tz.OriginalFileName, tz.UploadedFileName, filePath)
		if fileDownloadErr != nil {
			fmt.Println("Dowlloaderror")
			logger.Log.Println(fileDownloadErr)
			//return t, false, fileDownloadErr, "File download error"
		}
		logger.Log.Println(filePath)
		content, err := ioutil.ReadFile(filePath)
		if err != nil {
			logger.Log.Println(err)
		}
		contentEncode := base64.StdEncoding.EncodeToString(content)
		attachEncode := entities.EbondingTDLFileAttachmentDetails{}
		attachEncode.Filename = tz.OriginalFileName
		attachEncode.Filetype = http.DetectContentType(content)
		attachEncode.Filecontent = contentEncode
		ebondingTDLUpdateRecord.Fileattachment = append(ebondingTDLUpdateRecord.Fileattachment, attachEncode)
	}

	ebondingTDLUpdateRecord.ServicenowID = updateTicketID
	ebondingTDLUpdateRecord.TicketID = tz.RecordCode
	ebondingTDLUpdateRecord.StateID = "2"
	ebondingTDLUpdateRecord.Impact = impact
	ebondingTDLUpdateRecord.Urgency = urgency
	ebondingTDLUpdateRecord.Notes = tz.Worknote

	postBody, jsonErr := json.Marshal(ebondingTDLUpdateRecord)
	if jsonErr != nil {
		return jsonErr
	}
	logger.Log.Println("postBody===>", string(postBody))

	reqForUpdateTicket, reqForUpdateTicketErr := http.NewRequest("PUT", TDLUpdateTicketUrl, bytes.NewReader(postBody))

	if reqForUpdateTicketErr != nil {
		logger.Log.Println("reqForUpdateTicketErr=======>", reqForUpdateTicketErr)
		return errors.New("Something Went Wrong!!!")
	}
	reqForUpdateTicket.SetBasicAuth("aai_ifix.integration", "+pbDJIot+7JVd[tnhkwY[0u1{wE2dCCXx3Eu2CCq")

	respForUpdateTicket, respForUpdateTicketErr := client.Do(reqForUpdateTicket)
	if respForUpdateTicketErr != nil {
		logger.Log.Println("respForWorklogErr======>", respForUpdateTicketErr)
		return errors.New("Something Went Wrong!!!")

	}
	responseBody, responseBodyErr := ioutil.ReadAll(respForUpdateTicket.Body)
	logger.Log.Println("responseBody update Ticket===>", string(responseBody))
	if responseBodyErr != nil {
		logger.Log.Println("responseBodyErr=======>", responseBodyErr)
		return errors.New("Something Went Wrong!!!")
	}
	ebondingTDLUpdateRecordResponseEntity := entities.EbondingTDLUpdateRecordResponseEntity{}
	resultErr := json.Unmarshal(responseBody, &ebondingTDLUpdateRecordResponseEntity)
	if resultErr != nil {
		logger.Log.Println("resultErr=====>", resultErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")
	}
	if respForUpdateTicket.StatusCode != 200 {
		logger.Log.Println("respForUpdateTicket.StatusCode=====>", respForUpdateTicket.StatusCode)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("CreateTicket OTON API Error")
	}
	ebondingTransactionLog := entities.EbondingTransactionLog{}
	ebondingTransactionLog.Ebondingid = 3
	ebondingTransactionLog.RecordID = tz.RecordID
	ebondingTransactionLog.Requestjson = string(postBody)
	ebondingTransactionLog.Responsejson = string(responseBody)
	ebondingTransactionLog.Responsecode = int64(respForUpdateTicket.StatusCode)
	_, insertErr := dataAccess.InsertTransactionLog(&ebondingTransactionLog)
	if insertErr != nil {
		logger.Log.Println("insertErr Transaction log=====>", insertErr)
		//return ticketNo, errors.New("Unable to Unmarchal data")
		return errors.New("Something Went Wrong!!!")

	}
	logger.Log.Println("TDL create Ticket Response", string(responseBody))
	respForUpdateTicket.Body.Close()

	return nil

}

func Ebonding(tz *entities.EbondingRecordEntity) (bool, error) {
	if mutexutility.MutexLocked(lock) == false {
		lock.Lock()
		defer lock.Unlock()
	}
	db, err := ConnectMySqlDb()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		return false, err
	}
	dataAccess := dao.DbConn{DB: db}

	ebondingModuleName, ebondingModuleNameErr := dataAccess.GetEbondingModeleName(tz)
	if ebondingModuleNameErr != nil {
		logger.Log.Println("GetEbondingModeleNameErr=====>", ebondingModuleNameErr)
		return false, ebondingModuleNameErr
	}
	ebondingId, ebondingIdErr := dataAccess.GetebondingId(tz)
	if ebondingIdErr != nil {
		logger.Log.Println("GetebondingIdErr=====>", ebondingIdErr)
		return false, ebondingIdErr
	}
	tz.EbondingModule = ebondingModuleName
	tz.EbondingID = ebondingId
	var status bool = false
	logger.Log.Println("Ebonding TZ=====>", tz)
	if tz.EbondingSeq == 1 {
		auth, OtonAuthenticationErr := OtonAuthentication(tz, db)
		logger.Log.Println("auth=========================================>", auth)

		if OtonAuthenticationErr != nil {
			logger.Log.Println("OtonAuthenticationErr=====>", OtonAuthenticationErr)
			return status, OtonAuthenticationErr
		}
		logger.Log.Println("tz.EbondingModuleSeq========================================>", tz.EbondingModuleSeq)
		if tz.EbondingModuleSeq == 2 {
			logger.Log.Println("=========================================OtonCreateTicket=====>")

			otonCreateTicketErr := OtonCreateTicket(tz, db, auth)
			if otonCreateTicketErr != nil {
				logger.Log.Println("otonCreateTicketErr=====>", otonCreateTicketErr)
				return status, otonCreateTicketErr
			} else {
				status = true
			}

		} else if tz.EbondingModuleSeq == 3 {
			logger.Log.Println("=========================================OtonWorkLog=====>")
			OtonWorkLogErr := OtonWorkLog(tz, db, auth)
			if OtonWorkLogErr != nil {
				logger.Log.Println("OtonWorkLogErr=====>", OtonWorkLogErr)
				return status, OtonWorkLogErr
			} else {
				status = true
			}

		} else if tz.EbondingModuleSeq == 4 {
			logger.Log.Println("=========================================OtonAttachment=====>")

			OtonAttachmentErr := OtonAttachment(tz, db, auth)
			if OtonAttachmentErr != nil {
				logger.Log.Println("OtonWorkLogErr=====>", OtonAttachmentErr)
				return status, OtonAttachmentErr
			} else {
				status = true
			}
		}

	} else if tz.EbondingSeq == 2 {
		if tz.EbondingModuleSeq == 2 {
			logger.Log.Println("=========================================TDLCreateTicket=====>")
			TDLCreateTicketErr := TDLCreateTicket(tz, db)
			if TDLCreateTicketErr != nil {
				logger.Log.Println("TDLCreateTicketErr=====>", TDLCreateTicketErr)
				return status, TDLCreateTicketErr
			} else {
				status = true
			}
		} else if tz.EbondingModuleSeq == 3 {
			logger.Log.Println("=========================================TDLWorkNoteUPdate=====>")

			TDLUpdateTicketErr := TDLUpdateTicket(tz, db)
			if TDLUpdateTicketErr != nil {
				logger.Log.Println("TDLUpdateTicketErr=====>", TDLUpdateTicketErr)
				return status, TDLUpdateTicketErr
			} else {
				status = true
			}

		} else if tz.EbondingModuleSeq == 4 {
			logger.Log.Println("=========================================TDLAttachment=====>")

			TDLUpdateTicketErr := TDLUpdateTicket(tz, db)
			if TDLUpdateTicketErr != nil {
				logger.Log.Println("TDLUpdateTicketErr=====>", TDLUpdateTicketErr)
				return status, TDLUpdateTicketErr
			} else {
				status = true
			}

		} else if tz.EbondingModuleSeq == 5 {
			logger.Log.Println("=========================================TDLStateUpdate=====>")

			TDLUpdateTicketErr := TDLUpdateTicket(tz, db)
			if TDLUpdateTicketErr != nil {
				logger.Log.Println("TDLUpdateTicketErr=====>", TDLUpdateTicketErr)
				return status, TDLUpdateTicketErr
			} else {
				status = true
			}

		}

	}

	return status, nil
}
