package emailticket

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	model "src/entities"
	"src/fileutils"
	ReadProperties "src/fileutils"
	Logger "src/logger"
	"strconv"
	"strings"

	"github.com/BrianLeishman/go-imap"
)

func GetClientIDOrgID(db *sql.DB, senderEmail string) (int64, int64, error) {
	var clientID int64
	var orgID int64
	Logger.Log.Println("Before Truncate===>", senderEmail)
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}
	Logger.Log.Println("senderEmail===>", senderEmail)
	//Logger.Log.Println("senderEmail===>", senderEmail)
	var getClientIDAndOrgIDQuery string = "select clientid,mstorgnhirarchyid from mstclientuser where useremail=? and  activeflag=1 and deleteflag=0"

	getClientIDAndOrgIDErr := db.QueryRow(getClientIDAndOrgIDQuery, senderEmail).Scan(&clientID, &orgID)
	if getClientIDAndOrgIDErr != nil {
		Logger.Log.Println(getClientIDAndOrgIDErr)
		return clientID, orgID, getClientIDAndOrgIDErr
	}
	return clientID, orgID, nil
}
func GetDuplicateEmailCount(db *sql.DB, clientID int64, orgID int64, Subject string, senderEmail string, sentTime string, receivedTime string) (int64, error) {
	var countRow int64
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}
	Logger.Log.Println("senderEmail===>", senderEmail)
	var getRowCountQuery string = "select count(*) as count from mstemailticketlog where clientid =? and mstorgnhirarchyid=? and senderemail=? and emailsubkeyword=? and sentdt=? and receiveddt=?"

	RowCountErr := db.QueryRow(getRowCountQuery, clientID, orgID, senderEmail, Subject, sentTime, receivedTime).Scan(&countRow)
	if RowCountErr != nil {
		Logger.Log.Println(RowCountErr)
		return countRow, RowCountErr
	}
	Logger.Log.Println("Count in GetDuplicateEmailCount ===============>", countRow)
	return countRow, nil
}
func InsertEmailToTicketLog(db *sql.DB, tx *sql.Tx, clientID int64, orgID int64, Subject string, senderEmail string, processFlag string, sentTime string, receivedTime string) error {

	InsertQuery := "INSERT INTO `mstemailticketlog` (`clientid`,`mstorgnhirarchyid`,`senderemail`,`emailsubkeyword`,`sentdt`,`receiveddt`,`processflag`,`createddate`,`activeflg`,`deleteflg`)VALUES(?,?,?,?,?,?,?,round(UNIX_TIMESTAMP(now())),?,?)"

	statement, err := tx.Prepare(InsertQuery)

	if err != nil {
		Logger.Log.Println(err)
		return err
	}
	defer statement.Close()
	_, err1 := statement.Exec(clientID, orgID, senderEmail, Subject, sentTime, receivedTime, processFlag, 1, 0)
	if err1 != nil {
		Logger.Log.Println(err1)
		return err1
	}
	//log.Println("Resultset", resultset)
	return nil

}

func CreateTicket(db *sql.DB, tx *sql.Tx, attchments []imap.Attachment, Subject string, body string, rowID int64, senderTypeSeq int64, defaultSeq int64, clientID int64, orgID int64, senderEmail string, sentTime string, receivedTime string) (string, error) {
	Logger.Log.Println("Body======>", body)
	var ticketID string
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}
	Logger.Log.Println("Sender EMAIL in Create ticket====> ", senderEmail)
	var recordEntity model.RecordEntity
	var recordField model.RecordField

	wd, err := os.Getwd() // to get working directory
	if err != nil {
		Logger.Log.Println(err)
		return ticketID, err
	}
	//log.Println(wd)
	contextPath := strings.ReplaceAll(wd, "\\", "/") // replacing backslash by  forwardslash
	//log.Println(contextPath)
	props, err := ReadProperties.ReadPropertiesFile(contextPath + "/resource/application.properties")
	if len(attchments) > 0 {
		recordField.TermID = 1
		for j := range attchments {
			if strings.Contains(attchments[j].Name, ".exe") || strings.Contains(attchments[j].Name, ".js") || strings.Contains(attchments[j].Name, ".json") ||
				strings.Contains(attchments[j].Name, ".jar") || strings.Contains(attchments[j].Name, ".bat") || strings.Contains(attchments[j].Name, ".deb") ||
				strings.Contains(attchments[j].Name, ".asp") || strings.Contains(attchments[j].Name, ".php") || strings.Contains(attchments[j].Name, ".py") ||
				strings.Contains(attchments[j].Name, ".dll") || strings.Contains(attchments[j].Name, ".vbs") {
				continue
			}
			fileBytes := bytes.NewReader(attchments[j].Content)
			filepath := contextPath + "/resource/downloads/" + attchments[j].Name
			output, err := os.Create(contextPath + "/resource/downloads/" + attchments[j].Name)
			if err != nil {
				Logger.Log.Println("Error while creating", "-", err)
			}
			defer output.Close()
			// 	//--------------
			// 	//write the bytes to a file
			_, err = io.Copy(output, fileBytes)
			if err != nil {
				Logger.Log.Println("Error while downloading", "-", err)
			}
			var recordTerm model.RecordTerm

			originalFileName, newFileName, err := fileutils.FileUploadAPICall(clientID, orgID, props["fileUploadUrl"], filepath)
			if err != nil {
				Logger.Log.Println("Error while downloading", "-", err)
			}
			recordTerm.OriginalName = originalFileName
			recordTerm.FileName = newFileName
			recordField.Val = append(recordField.Val, recordTerm)

		}

	}
	recordEntity.Recordfields = append(recordEntity.Recordfields, recordField)
	recordEntity.ClientID = clientID
	recordEntity.Mstorgnhirarchyid = orgID
	recordEntity.Recordname = Subject
	recordEntity.Recordesc = body
	var ticketDiffTypeID int64
	var ticketDiffID int64
	var userID int64
	var userGrpID int64
	var categoryIDList string
	var piorityID int64
	var creatorID int64
	var creatorGrpID int64

	if defaultSeq == 0 {
		if senderTypeSeq == 1 {
			var getSenderTypeSeqQuery string = "select mstrecorddifftypeid,mstrecorddiffid,serviceuserid,serviceusergroupid,categoryidlist,priorityid from mstemailticket where id=?"
			SenderTypeSeqErr := db.QueryRow(getSenderTypeSeqQuery, rowID).Scan(&ticketDiffTypeID, &ticketDiffID, &userID, &userGrpID, &categoryIDList, &piorityID)
			if SenderTypeSeqErr != nil {
				Logger.Log.Println(SenderTypeSeqErr)
				return ticketID, SenderTypeSeqErr
			}
			recordEntity.Createduserid = userID
			recordEntity.Createdusergroupid = userGrpID

		} else {
			return ticketID, errors.New("Not A valid Match")
		}
	} else if defaultSeq == 1 {
		if senderTypeSeq == 1 {
			var getSenderTypeSeqQuery string = "select mstrecorddifftypeid,mstrecorddiffid,serviceuserid,serviceusergroupid,categoryidlist,priorityid from mstemailticket where id=?"
			SenderTypeSeqErr := db.QueryRow(getSenderTypeSeqQuery, rowID).Scan(&ticketDiffTypeID, &ticketDiffID, &userID, &userGrpID, &categoryIDList, &piorityID)
			if SenderTypeSeqErr != nil {
				Logger.Log.Println(SenderTypeSeqErr)
				return ticketID, SenderTypeSeqErr
			}
			recordEntity.Createduserid = userID
			recordEntity.Createdusergroupid = userGrpID
		} else if senderTypeSeq == 2 {
			var getSenderTypeSeqQuery string = "select mstrecorddifftypeid,mstrecorddiffid,serviceuserid,serviceusergroupid,categoryidlist,priorityid from mstemailticket where id=?"
			SenderTypeSeqErr := db.QueryRow(getSenderTypeSeqQuery, rowID).Scan(&ticketDiffTypeID, &ticketDiffID, &userID, &userGrpID, &categoryIDList, &piorityID)
			if SenderTypeSeqErr != nil {
				Logger.Log.Println(SenderTypeSeqErr)
				return ticketID, SenderTypeSeqErr
			}
			var getCreatorUserID string = "select id from mstclientuser where clientid=? and mstorgnhirarchyid=? and useremail=? and activeflag=1 and deleteflag=0"
			getCreatorUserIDErr := db.QueryRow(getCreatorUserID, clientID, orgID, senderEmail).Scan(&creatorID)
			if getCreatorUserIDErr != nil {
				Logger.Log.Println(getCreatorUserIDErr)
				return ticketID, getCreatorUserIDErr
			}
			var getCreatorgrpID string = "select groupid from mstgroupmember where userid=? and groupid in (select grpid from mstclientsupportgroup where clientid=? and mstorgnhirarchyid=? and supportgrouplevelid=1 and activeflg=1 and deleteflg=0)"
			getCreatorgrpIDErr := db.QueryRow(getCreatorgrpID, creatorID, clientID, orgID).Scan(&creatorGrpID)
			if getCreatorUserIDErr != nil {
				Logger.Log.Println(getCreatorgrpIDErr)
				return ticketID, getCreatorUserIDErr
			}
			Logger.Log.Println("Creator ID for Domain Specific==>", creatorID)
			Logger.Log.Println("Group ID for Domain Specific==>", creatorGrpID)

			recordEntity.Createduserid = creatorID
			recordEntity.Createdusergroupid = creatorGrpID

		}
	} else {
		return ticketID, errors.New("Not A valid Match")
	}

	recordEntity.Originaluserid = int64(userID)
	recordEntity.Originalusergroupid = int64(userGrpID)

	var getUserDetailsQuery string = "select name,useremail,usermobileno from mstclientuser where id=?"
	userResulsetErr := db.QueryRow(getUserDetailsQuery, recordEntity.Createduserid).Scan(&recordEntity.Requestername, &recordEntity.Requesteremail, &recordEntity.Requestermobile)
	if userResulsetErr != nil {
		Logger.Log.Println(userResulsetErr)
		return ticketID, userResulsetErr
	}

	var recordSets []model.RecordSet
	var recordSet model.RecordSet
	var catType []model.RecordData
	var category model.RecordData
	var categoryVal []string
	var recordAdditional []model.RecordAdditional
	var recordAdditionalTemp model.RecordAdditional

	categoryVal = strings.Split(categoryIDList, "->")
	var ticketTypeSeqNo int64
	ticketTypeSequenceNoQuery := "select seqno from mstrecorddifferentiation where id=?"
	getTypeSequenceNoErr := db.QueryRow(ticketTypeSequenceNoQuery, ticketDiffID).Scan(&ticketTypeSeqNo)
	if getTypeSequenceNoErr != nil {
		Logger.Log.Println(getTypeSequenceNoErr)
		return ticketID, getTypeSequenceNoErr
	}
	if ticketTypeSeqNo == 1 {
		var getCategoryLevelID string = "select torecorddifftypeid from mstrecordtype a where clientid=? and mstorgnhirarchyid=? and fromrecorddiffid=? and torecorddiffid=0 and torecorddifftypeid in " +
			" (select id from mstrecorddifferentiationtype where parentid =1 and clientid=a.clientid and  mstorgnhirarchyid=a.mstorgnhirarchyid and deleteflg=0 and activeflg=1) and deleteflg=0 and activeflg=1"
		categoryLevelResultset, categoryLevelResultsetErr := db.Query(getCategoryLevelID, clientID, orgID, ticketDiffID)
		if categoryLevelResultsetErr != nil {
			Logger.Log.Println(categoryLevelResultsetErr)
			return ticketID, categoryLevelResultsetErr
		}

		var i int64 = 0
		defer categoryLevelResultset.Close()
		for categoryLevelResultset.Next() {

			//var  categoryLevelName string
			var categoryLevelId int64
			err := categoryLevelResultset.Scan(&categoryLevelId)
			if err != nil {
				Logger.Log.Println(err)
				return ticketID, err
			}
			category.ID = categoryLevelId
			category.Val, err = strconv.ParseInt(categoryVal[i], 10, 64)
			if err != nil {
				Logger.Log.Println(err)
				return ticketID, err
			}
			var additionalFieldList model.AdditionalFieldsList
			var additionaField []model.AdditionalField
			var temp model.AdditionalField

			temp.Mstdifferentiationtypeid = ticketDiffTypeID
			temp.Mstdifferentiationid = ticketDiffID
			additionaField = append(additionaField, temp)
			temp.Mstdifferentiationtypeid = category.ID
			temp.Mstdifferentiationid = category.Val
			additionaField = append(additionaField, temp)

			additionalFieldList.ClientID = clientID
			additionalFieldList.Mstorgnhirarchyid = orgID
			additionalFieldList.UserID = recordEntity.Originaluserid
			additionalFieldList.Mstdifferentiationset = additionaField

			sendDataForAdditionalFields, sendDataForAdditionalFieldserr := json.Marshal(additionalFieldList)
			if sendDataForAdditionalFieldserr != nil {
				Logger.Log.Println(sendDataForAdditionalFieldserr)
				return ticketID, errors.New("Unable to marshal data")
			}
			Logger.Log.Println("sendDataForAdditionalFields Json=======>   ", string(sendDataForAdditionalFields))

			respDataForAdditionalFields, responseErr := http.Post(props["URLAdditionalFields"], "application/json", bytes.NewBuffer(sendDataForAdditionalFields))
			if responseErr != nil {
				Logger.Log.Println(responseErr)
				return ticketID, errors.New("sendDataForGetSeqNo Response Errror")
			}

			respBody, err1 := ioutil.ReadAll(respDataForAdditionalFields.Body)
			if err1 != nil {
				Logger.Log.Println(err1)
				return ticketID, errors.New("Unable to read response data")
			}
			var additionalFieldListResponse = model.AdditionalFieldListResponse{}
			Logger.Log.Println("Response Body===>", string(respBody))
			// jsonError := stateSeqResponse.FromJSON(sendDataForGetSeqNoResp.Body)

			jsonError := json.Unmarshal(respBody, &additionalFieldListResponse)
			// //Logger.Log.Println("RespBOdy",respBody.)
			if jsonError != nil {
				Logger.Log.Println(jsonError)
				return ticketID, errors.New("Unable to Unmarshal data")
			}

			//  json.NewDecoder(resp.Body).Decode(&res)
			if additionalFieldListResponse.Success == false {
				Logger.Log.Println("getting False")
				return ticketID, errors.New("Fetching Additionals  fields failed intermittently. Please try again later")
			} else {

				if len(additionalFieldListResponse.Details) > 0 {
					for i := 0; i < len(additionalFieldListResponse.Details); i++ {
						recordAdditionalTemp.ID = additionalFieldListResponse.Details[i].Fieldid
						recordAdditionalTemp.Termsid = additionalFieldListResponse.Details[i].Termsid
						recordAdditional = append(recordAdditional, recordAdditionalTemp)
						Logger.Log.Println("recordAdditional=====>", recordAdditional)
					}
				}
			}

			catType = append(catType, category)
			i++
		}
		var statusID int64
		var statusTypeID int64 = 3
		var getStatusIDQuery string = "select id from mstrecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=? and seqno=1 and deleteflg=0 and activeflg=1"
		getStatusIDErr := db.QueryRow(getStatusIDQuery, clientID, orgID, statusTypeID).Scan(&statusID)
		if getStatusIDErr != nil {
			Logger.Log.Println(getStatusIDErr)
			return ticketID, getStatusIDErr
		}
		recordSet.ID = 1
		recordSet.Type = catType
		recordEntity.Workingcatlabelid = catType[2].ID
		recordSets = append(recordSets, recordSet)
		recordSet.Type = nil
		recordSet.ID = ticketDiffTypeID
		recordSet.Val = ticketDiffID
		recordSets = append(recordSets, recordSet)
		recordSet.ID = 5
		recordSet.Val = piorityID
		recordSets = append(recordSets, recordSet)
		recordSet.ID = statusTypeID
		recordSet.Val = statusID
		recordSets = append(recordSets, recordSet)
		recordEntity.Additionalfields = recordAdditional
		recordEntity.Source = props["SOURCE"]
		recordEntity.RecordSets = recordSets
	}
	if ticketTypeSeqNo == 2 {
		var getCategoryLevelID string = "select torecorddifftypeid from mstrecordtype a where clientid=? and mstorgnhirarchyid=? and fromrecorddiffid=? and torecorddiffid=0 and torecorddifftypeid in " +
			" (select id from mstrecorddifferentiationtype where parentid =1 and clientid=a.clientid and  mstorgnhirarchyid=a.mstorgnhirarchyid and deleteflg=0 and activeflg=1) and deleteflg=0 and activeflg=1"
		categoryLevelResultset, categoryLevelResultsetErr := db.Query(getCategoryLevelID, clientID, orgID, ticketDiffID)
		if categoryLevelResultsetErr != nil {
			Logger.Log.Println(categoryLevelResultsetErr)
			return ticketID, categoryLevelResultsetErr
		}

		var i int64 = 0
		defer categoryLevelResultset.Close()
		for categoryLevelResultset.Next() {

			//var  categoryLevelName string
			var categoryLevelId int64
			err := categoryLevelResultset.Scan(&categoryLevelId)
			if err != nil {
				Logger.Log.Println(err)
				return ticketID, err
			}
			category.ID = categoryLevelId
			category.Val, err = strconv.ParseInt(categoryVal[i], 10, 64)
			if err != nil {
				Logger.Log.Println(err)
				return ticketID, err
			}
			catType = append(catType, category)
			i++
		}
		var statusID int64
		var statusTypeID int64 = 3
		var getStatusIDQuery string = "select id from mstrecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=? and seqno=12 and deleteflg=0 and activeflg=1"
		getStatusIDErr := db.QueryRow(getStatusIDQuery, clientID, orgID, statusTypeID).Scan(&statusID)
		if getStatusIDErr != nil {
			Logger.Log.Println(getStatusIDErr)
			return ticketID, getStatusIDErr
		}
		recordSet.ID = 1
		recordSet.Type = catType
		recordEntity.Workingcatlabelid = catType[4].ID
		recordSets = append(recordSets, recordSet)
		recordSet.Type = nil
		recordSet.ID = ticketDiffTypeID
		recordSet.Val = ticketDiffID
		recordSets = append(recordSets, recordSet)
		recordSet.ID = 5
		recordSet.Val = piorityID
		recordSets = append(recordSets, recordSet)
		recordSet.ID = statusTypeID
		recordSet.Val = statusID
		recordSets = append(recordSets, recordSet)
		recordEntity.Additionalfields = recordAdditional
		recordEntity.Source = props["SOURCE"]
		recordEntity.RecordSets = recordSets
	}
	sendData, err := json.Marshal(recordEntity)
	if err != nil {
		Logger.Log.Println(err)
		return ticketID, errors.New("Unable to marshal data")
	}
	Logger.Log.Println("Create Ticket Json=======>   ", string(sendData))

	resp, err := http.Post(props["URL"], "application/json", bytes.NewBuffer(sendData))

	var result map[string]interface{}
	respBody, err1 := ioutil.ReadAll(resp.Body)
	if err1 != nil {
		Logger.Log.Println(err1)
		return ticketID, errors.New("Unable to read response data")
	}
	err2 := json.Unmarshal(respBody, &result)
	if err2 != nil {
		Logger.Log.Println(err2)
		return ticketID, errors.New("Unable to Unmarchal data")
	}
	Logger.Log.Println("Ticket ID=====>", result["response"].(string))
	//  json.NewDecoder(resp.Body).Decode(&res)
	if result["success"].(bool) == false {
		Logger.Log.Println("getting False")
		insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "N", sentTime, receivedTime)
		if insertError != nil {
			Logger.Log.Println("Insert Log Error")
		}
		return ticketID, errors.New("Ticket creation failed intermittently. Please try again later")
	} else {
		ticketID = result["response"].(string)

		Logger.Log.Println("Ticket ID=====>", ticketID)
		insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "Y", sentTime, receivedTime)
		if insertError != nil {
			Logger.Log.Println("Insert Log Error")
		}
	}

	return ticketID, nil
}

func GetDelimeter(db *sql.DB, clientID int64, orgID int64) (string, error) {
	log.Println("In Get Delimiter")
	var delimeter string
	getDelimetreQuery := "select name from mstrecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid in(select id from mstrecorddifferentiationtype where clientid=? and mstorgnhirarchyid=? and seqno=201 and parentid=11)"
	resulsetErr := db.QueryRow(getDelimetreQuery, clientID, orgID, clientID, orgID).Scan(&delimeter)
	if resulsetErr != nil {
		Logger.Log.Println(resulsetErr)
		return delimeter, errors.New("Delemetre is not Present")
	}
	return delimeter, nil
}
func ValidateEmail(db *sql.DB, clientID int64, orgID int64, Subject string, senderEmail string) (int64, int64, int64, bool, error) {
	var present bool = false
	var keyword string
	var rowID int64
	var senderDomain string
	//var senderTypeSeq int64
	log.Println("ValidateEmail")
	Logger.Log.Println("senderEmail======> ", senderEmail)
	Logger.Log.Println("Subject======> ", Subject)
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}

	if strings.Contains(senderEmail, "@") {
		senderDomain = senderEmail[strings.Index(senderEmail, "@")+1 : len(senderEmail)]
	}
	Logger.Log.Println("senderDomain======> ", senderDomain)
	var countRow int64
	var SenderEmailValidateQuery string = "select count(id) as count from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=? and activeflg=1 and deleteflg = 0"
	SenderEmailValidateErr := db.QueryRow(SenderEmailValidateQuery, clientID, orgID, senderEmail).Scan(&countRow)
	if SenderEmailValidateErr != nil {
		Logger.Log.Println(SenderEmailValidateErr)
		//return false, errors.New("invalid senderEmail ")
	}
	if countRow > 0 {
		var splitted []string

		delimeter, delemeterError := GetDelimeter(db, clientID, orgID)
		if delemeterError != nil {
			Logger.Log.Println("delemeter Error ==>", delemeterError)
			return rowID, 1, 0, present, errors.New("something went wrong")
		}
		if strings.Contains(Subject, delimeter) {
			splitted = strings.Split(Subject, delimeter)
			keyword = strings.Trim(splitted[0], " ")
			Logger.Log.Println("KeyWord===>", keyword)
			Logger.Log.Println("Delimiter===>", delimeter)
			Logger.Log.Println("SenderEmail===>", senderEmail)
			var getEmailRow string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=? and emailsubkeyword=? and defaultseq=0 and activeflg=1 and deleteflg = 0"
			getEmailRowErr := db.QueryRow(getEmailRow, clientID, orgID, senderEmail, keyword).Scan(&rowID)
			if getEmailRowErr != nil {
				Logger.Log.Println("getEmailRowErr ==>", getEmailRowErr)
			}
			if rowID == 0 {
				Logger.Log.Println("In Delimiter Matched Condition but not Keyword")
				var getEmailRowQuery string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=?  and defaultseq=1 and activeflg=1 and deleteflg = 0"
				getEmailRowErr1 := db.QueryRow(getEmailRowQuery, clientID, orgID, senderEmail).Scan(&rowID)
				if getEmailRowErr1 != nil {
					Logger.Log.Println("getEmailRowErr for default seq=1 ==>", getEmailRowErr1)
					return rowID, 1, 1, present, getEmailRowErr1
				}
				if rowID > 0 {

					return rowID, 1, 1, true, nil
				} else {
					Logger.Log.Println("No configuration found for delimeter matched but keywordnotmatched")
					return rowID, 1, 1, present, nil
				}
			} else {
				Logger.Log.Println("In KeyWOrd & Delimiter Matched Condition")
				return rowID, 1, 0, true, nil
			}
		} else {
			Logger.Log.Println("In Delimeter Not Matched Condition")
			var getEmailRowForDelimiterNotMAtched string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=?  and defaultseq=1 and activeflg=1 and deleteflg = 0"
			getEmailRowDelimiterNotMAtchedErr := db.QueryRow(getEmailRowForDelimiterNotMAtched, clientID, orgID, senderEmail).Scan(&rowID)
			if getEmailRowDelimiterNotMAtchedErr != nil {
				Logger.Log.Println("getEmailRowErr for default seq=1 ==>", getEmailRowDelimiterNotMAtchedErr)
				return rowID, 1, 1, present, getEmailRowDelimiterNotMAtchedErr
			}
			if rowID > 0 {
				return rowID, 1, 1, true, nil
			} else {
				return rowID, 1, 1, present, nil
			}

		}
		// Logger.Log.Println("KeyWord===>", keyword)
		// var getEmailRow string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=? and emailsubkeyword=? and defaultseq=0 and activeflg=1 and deleteflg = 0"
		// getEmailRowErr := db.QueryRow(getEmailRow, clientID, orgID, senderEmail, keyword).Scan(&rowID)
		// if getEmailRowErr != nil {
		// 	Logger.Log.Println("getEmailRowErr ==>", getEmailRowErr)
		// }
		// if rowID == 0 {
		// 	var getEmailRow string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderemail=?  and defaultseq=1 and activeflg=1 and deleteflg = 0"
		// 	getEmailRowErr := db.QueryRow(getEmailRow, clientID, orgID, senderEmail).Scan(&rowID)
		// 	if getEmailRowErr != nil {
		// 		Logger.Log.Println("getEmailRowErr for default seq=1 ==>", getEmailRowErr)
		// 		return rowID, 1, 1, present, getEmailRowErr
		// 	}
		// 	if rowID > 0 {
		// 		return rowID, 1, 1, true, nil
		// 	} else {
		// 		return rowID, 1, 1, present, nil
		// 	}
		// } else {
		// 	return rowID, 1, 0, true, nil
		// }
	} else {
		Logger.Log.Println("In Specific DOmain Condition")
		var SenderDomainValidateQuery string = "select id from mstemailticket where clientid=? and mstorgnhirarchyid=? and senderdomain=? and defaultseq=1 and activeflg=1 and deleteflg = 0"
		SenderDomainValidateError := db.QueryRow(SenderDomainValidateQuery, clientID, orgID, senderDomain).Scan(&rowID)
		if SenderDomainValidateError != nil {
			Logger.Log.Println("SenderDomainValidateError for default seq=1 ==>", SenderDomainValidateError)
			return rowID, 2, 1, present, errors.New("No configuration Found")
		}
		if rowID > 0 {
			return rowID, 2, 1, true, nil
		}
	}

	return rowID, 0, 2, present, nil
}

func ValidateKeywordAndSenderEmail(db *sql.DB, keyword string, clientID int64, orgID int64, senderEmail string) (bool, error) {
	log.Println("ValidateKeywordAndSenderEmail")
	log.Println("senderEmail======> ", senderEmail)
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}

	var Count int64
	var senderTypeSeq int64
	var senderDomain string
	var getSenderTypeSeqQuery string = "select sendertypeseq from mstemailticket where clientid=? and mstorgnhirarchyid=? and emailsubkeyword=?"
	SenderTypeSeqErr := db.QueryRow(getSenderTypeSeqQuery, clientID, orgID, keyword).Scan(&senderTypeSeq)
	if SenderTypeSeqErr != nil {
		Logger.Log.Println(SenderTypeSeqErr)
		return false, errors.New("Not a Valid KeyWord")
	}
	log.Println("senderTypeSeq======> ", senderTypeSeq)
	log.Println("senderEmail======> ", senderEmail)
	if senderTypeSeq == 1 {
		ValidateKeywordQuery := "select count(id) as count from mstemailticket where clientid=? and mstorgnhirarchyid=? and emailsubkeyword=? and senderemail=?"
		resulsetErr := db.QueryRow(ValidateKeywordQuery, clientID, orgID, keyword, senderEmail).Scan(&Count)
		if resulsetErr != nil {
			Logger.Log.Println(resulsetErr)
			return false, errors.New("Sender is not valid")
		}
		log.Println("Count=======> ", Count)
	}
	if senderTypeSeq == 2 {

		ValidateKeywordQuery := "select senderdomain from mstemailticket where clientid=? and mstorgnhirarchyid=? and emailsubkeyword=?"
		resulsetErr := db.QueryRow(ValidateKeywordQuery, clientID, orgID, keyword).Scan(&senderDomain)
		if resulsetErr != nil {
			Logger.Log.Println(resulsetErr)
			return false, errors.New("KeyWord is not valid")
		}
		if strings.Contains(senderEmail, senderDomain) {
			return true, nil
		}
	}

	if Count != 1 {
		return false, errors.New("KeyWord or sender email not matched")
	}

	return true, nil
}

func UpdateUiD(db *sql.DB, tx *sql.Tx, presentUID int, baseClientid int64, baseorgID int64) error {
	Logger.Log.Println("UpdateUiD")

	updateQuery := "update uidgen set uid=? where difftypeid=11 and clientid = ? and mstorgnhirarchyid = ? and activeflg = 1 and deleteflg = 0"

	statement, err := tx.Prepare(updateQuery)
	if err != nil {
		Logger.Log.Println(err)
		return err
	}
	defer statement.Close()
	_, err1 := statement.Exec(presentUID, baseClientid, baseorgID)
	if err1 != nil {
		Logger.Log.Println(err1)
		return err1
	}
	//log.Println("Resultset", resultset)
	return nil
}
func GetLastUpdatedUID(db *sql.DB, ClientID int64, orgID int64) (int, error) {

	var lastUpdatedUID int

	Logger.Log.Println("getLastUpdatedUID")

	var getLastUpdatedUIDQuery string = "select uid from uidgen where  difftypeid=11 and clientid = ? and mstorgnhirarchyid = ? and activeflg = 1 and deleteflg = 0"
	getLastUpdatedUIDError := db.QueryRow(getLastUpdatedUIDQuery, ClientID, orgID).Scan(&lastUpdatedUID)
	if getLastUpdatedUIDError != nil {
		Logger.Log.Println(getLastUpdatedUIDError)
		return lastUpdatedUID, errors.New("Unable to fetch LastUpdatedUID")
	}

	return lastUpdatedUID, nil
}

func GetCredential(db *sql.DB, clientID int64, orgID int64) (string, int, string, string, error) {

	// var lastUpdatedUID int
	var IMAPEmailDomain string
	var IMAPPort int
	var UserName string
	var password string

	Logger.Log.Println("GetCredential")

	var getLastUpdatedUIDQuery string = "SELECT  a.credentialaccount, a.credentialpassword, a.credentialkey, a.credentialendpoint  FROM mstclientcredential a where a.clientid = ? and a.mstorgnhirarchyid = ?  and a.activeflg = 1 and a.deleteflg = 0 and a.credentialtypeid = 3;"
	Logger.Log.Print(clientID, orgID)
	getLastUpdatedUIDError := db.QueryRow(getLastUpdatedUIDQuery, clientID, orgID).Scan(&UserName, &password, &IMAPEmailDomain, &IMAPPort)
	Logger.Log.Print(UserName, password, IMAPEmailDomain, IMAPPort)
	if getLastUpdatedUIDError != nil {
		Logger.Log.Println(getLastUpdatedUIDError)
		return IMAPEmailDomain, IMAPPort, UserName, password, errors.New("Unable to fetch LastUpdatedUID")
	}

	return IMAPEmailDomain, IMAPPort, UserName, password, nil
}

func ValidateTicketNowithSenderEmail(db *sql.DB, clientID int64, orgID int64, ticketNo string, SenderEmail string) (int64, int64, int64, int64, bool, bool, error) {
	if strings.Contains(SenderEmail, "<") {
		SenderEmail = SenderEmail[strings.Index(SenderEmail, "<")+1 : len(SenderEmail)-1]
	}
	var invalidSender bool = false
	var present bool = false
	var recordID int64
	var creatorID int64
	var originalCreatorID int64
	var creatorGrpID int64
	var originalCreatorGrpID int64
	var recordStagedID int64
	var creatorEmail string
	var originalCreatorEmail string
	//var count int64
	var validateTicketNoQuery string = "select id,userid,usergroupid,originaluserid,originalusergroupid,recordstageid from trnrecord where clientid=? and mstorgnhirarchyid=? and code=?"
	validateTicketNoQueryError := db.QueryRow(validateTicketNoQuery, clientID, orgID, ticketNo).Scan(&recordID, &creatorID, &creatorGrpID, &originalCreatorID, &originalCreatorGrpID, &recordStagedID)
	if validateTicketNoQueryError != nil {
		Logger.Log.Println(validateTicketNoQueryError)
		return recordID, creatorID, creatorGrpID, recordStagedID, present, invalidSender, errors.New("TicketNo Not Found")
	}
	Logger.Log.Println("RecordID===>", recordID)
	Logger.Log.Println("creatorID==>", creatorID)
	Logger.Log.Println("CreatorGrpID===>", creatorGrpID)
	Logger.Log.Println("Original Creator==>", originalCreatorID)
	Logger.Log.Println("Original Creator grp ID==>", originalCreatorGrpID)
	Logger.Log.Println("Record StagedID==>", recordStagedID)
	Logger.Log.Println("SenderEmail===>", SenderEmail)
	if recordID > 0 {
		Logger.Log.Println("")
		Logger.Log.Println("")
		Logger.Log.Println("============================Record found for Updated==================>")
		Logger.Log.Println("")
		Logger.Log.Println("")
		var getCreatorEmail string = "select useremail from mstclientuser where id=?"
		getCreatorEmailError := db.QueryRow(getCreatorEmail, creatorID).Scan(&creatorEmail)
		if getCreatorEmailError != nil {
			Logger.Log.Println(getCreatorEmailError)
			//return recordID, present, errors.New("TicketNo Not Found")
		}
		Logger.Log.Println(" Creator Email=>", creatorEmail)
		//Logger.Log.Println("Record StagedID==>", recordStagedID)
		if strings.EqualFold(creatorEmail, SenderEmail) {
			return recordID, creatorID, creatorGrpID, recordStagedID, true, true, nil
		}
		var getOriginalCreatorEmail string = "select useremail from mstclientuser where id=?"
		getOriginalCreatorEmailError := db.QueryRow(getOriginalCreatorEmail, originalCreatorID).Scan(&originalCreatorEmail)
		if getOriginalCreatorEmailError != nil {
			Logger.Log.Println(getOriginalCreatorEmailError)
			//return recordID, present, errors.New("TicketNo Not Found")
		}
		Logger.Log.Println(" original Creator Email=>", originalCreatorEmail)
		if strings.EqualFold(originalCreatorEmail, SenderEmail) {
			return recordID, originalCreatorID, originalCreatorGrpID, recordStagedID, true, true, nil
		} else {
			Logger.Log.Println("==================================Sender Email Not MAtched for update ticket==================>")

			return recordID, creatorID, creatorGrpID, recordStagedID, present, invalidSender, errors.New("Sender Email NotMatched")

		}

	} else {
		Logger.Log.Println("==================================NO Record Found for Update Hence Creating Ticket==================>")

		return recordID, creatorID, creatorGrpID, recordStagedID, present, true, errors.New("No Record Found")

	}

}

func UpdateTicket(db *sql.DB, tx *sql.Tx, clientID int64, orgID int64, recordID int64, userID int64,
	userGrpID int64, recordStagedID int64, Subject string, body string, attchments []imap.Attachment, senderEmail string, sentTime string, receivedTime string) error {
	if strings.Contains(senderEmail, "<") {
		senderEmail = senderEmail[strings.Index(senderEmail, "<")+1 : len(senderEmail)-1]
	}
	var RecordDiffID int64
	var recordCommonEntity model.RecordcommonEntity
	var currentStatusSeq int64
	var currentStateID int64

	wd, err := os.Getwd() // to get working directory
	if err != nil {
		Logger.Log.Println(err)
		return err
	}
	//log.Println(wd)
	contextPath := strings.ReplaceAll(wd, "\\", "/") // replacing backslash by  forwardslash
	//log.Println(contextPath)
	props, err := ReadProperties.ReadPropertiesFile(contextPath + "/resource/application.properties")
	statusSeqToCheck, err := strconv.ParseInt(props["statusSeqToCheck"], 10, 64)
	if err != nil {
		Logger.Log.Println("string to int for status ")
	}
	var ticketTypeSeqNo int64
	var recordDiffTypeID int64
	//var recordDiffID int64
	var recordeStagedID int64
	var sql = "SELECT b.seqno,a.recorddifftypeid,a.recorddiffid,a.recordstageid  FROM maprecordtorecorddifferentiation a,mstrecorddifferentiation b WHERE a.clientid=? AND a.mstorgnhirarchyid=? AND a.recordid=? AND a.recorddifftypeid=2 AND a.islatest=1 AND a.recorddiffid=b.id"
	rowsErr := db.QueryRow(sql, clientID, orgID, recordID).Scan(&ticketTypeSeqNo, &recordDiffTypeID, &RecordDiffID, &recordeStagedID)
	if rowsErr != nil {
		Logger.Log.Println(rowsErr)
		return errors.New("ERROR: Unable to Fetch Ticket Seq No")
	}

	// getRecordDiffID := "SELECT recorddiffid FROM maprecordtorecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=2 and islatest=1 and recordid=?"

	// getRecordDiffIDError := db.QueryRow(getRecordDiffID, clientID, orgID, recordID).Scan(&RecordDiffID)
	// if getRecordDiffIDError != nil {
	// 	Logger.Log.Println(getRecordDiffIDError)
	// 	return errors.New("Unable to fetch Ticket Type id")
	// }

	if ticketTypeSeqNo == 1 {
		var statusSeqno int64
		recordCheckingForStatusQuery := "select seqno from mstrecorddifferentiation  where id  in (select a.recorddiffid from maprecordtorecorddifferentiation a " +
			" where a.clientid=? and a.mstorgnhirarchyid=? and islatest=1 and a.recordid=? and a.recorddifftypeid=3 and   a.recorddiffid  in" +
			" (SELECT id FROM mstrecorddifferentiation m where recorddifftypeid=a.recorddifftypeid and clientid=a.clientid and " +
			" mstorgnhirarchyid=a.mstorgnhirarchyid and seqno not in (3,8,11)))"

		recordCheckingForStatusErr := db.QueryRow(recordCheckingForStatusQuery, clientID, orgID, recordID).Scan(&statusSeqno)
		if recordCheckingForStatusErr != nil {
			Logger.Log.Println(recordCheckingForStatusErr)
			return errors.New("Record is in  Closed/Resolved/Canceled")
		}

		if len(attchments) > 0 {
			for j := range attchments {
				if strings.Contains(attchments[j].Name, ".exe") || strings.Contains(attchments[j].Name, ".js") || strings.Contains(attchments[j].Name, ".json") ||
					strings.Contains(attchments[j].Name, ".jar") || strings.Contains(attchments[j].Name, ".bat") || strings.Contains(attchments[j].Name, ".deb") ||
					strings.Contains(attchments[j].Name, ".asp") || strings.Contains(attchments[j].Name, ".php") || strings.Contains(attchments[j].Name, ".py") ||
					strings.Contains(attchments[j].Name, ".dll") || strings.Contains(attchments[j].Name, ".vbs") {
					continue
				}
				var AttachmentSeq int64 = 1
				recordCommonEntity.ClientID = clientID
				recordCommonEntity.Mstorgnhirarchyid = orgID
				recordCommonEntity.Recorddifftypeid = recordDiffTypeID
				recordCommonEntity.Recorddiffid = RecordDiffID
				recordCommonEntity.RecordID = recordID
				recordCommonEntity.RecordstageID = recordStagedID
				recordCommonEntity.ForuserID = userID
				recordCommonEntity.Usergroupid = userGrpID
				recordCommonEntity.UserID = userID
				recordCommonEntity.Termseq = AttachmentSeq

				fileBytes := bytes.NewReader(attchments[j].Content)
				filepath := contextPath + "/resource/downloads/" + attchments[j].Name
				output, err := os.Create(contextPath + "/resource/downloads/" + attchments[j].Name)
				if err != nil {
					Logger.Log.Println("Error while creating", "-", err)
				}
				defer output.Close()
				// 	//--------------

				// 	//write the bytes to a file
				_, err = io.Copy(output, fileBytes)
				if err != nil {
					Logger.Log.Println("Error while downloading", "-", err)
				}
				//var recordTerm model.RecordTerm

				originalFileName, newFileName, err := fileutils.FileUploadAPICall(clientID, orgID, props["fileUploadUrl"], filepath)
				if err != nil {
					Logger.Log.Println("Error while downloading", "-", err)
				}
				recordCommonEntity.Termvalue = originalFileName
				recordCommonEntity.Termdescription = newFileName
				//recordField.Val = append(recordField.Val, recordTerm)
				sendData, err := json.Marshal(recordCommonEntity)
				if err != nil {
					Logger.Log.Println(err)
					return errors.New("Unable to marshal data")
				}
				Logger.Log.Println("Add Comment Json Json=======>   ", string(sendData))

				resp, err := http.Post(props["URLAddComment"], "application/json", bytes.NewBuffer(sendData))

				var result map[string]interface{}
				respBody, err1 := ioutil.ReadAll(resp.Body)
				if err1 != nil {
					Logger.Log.Println(err1)
					return errors.New("Unable to read response data")
				}
				err2 := json.Unmarshal(respBody, &result)
				if err2 != nil {
					Logger.Log.Println(err2)
					return errors.New("Unable to Unmarshal data")
				}

				//  json.NewDecoder(resp.Body).Decode(&res)
				if result["success"].(bool) == false {
					Logger.Log.Println("getting False for Attachment added")
					return errors.New("Ticket Comment Updation failed intermittently. Please try again later")
				} else {

					//Logger.Log.Println("Attachment Added Successfull")
					Logger.Log.Println("Attachment Added Successfull in TicketID======>", recordID)
				}

			}

		}
		var commentSeq int64 = 11
		recordCommonEntity.ClientID = clientID
		recordCommonEntity.Mstorgnhirarchyid = orgID
		recordCommonEntity.Recorddifftypeid = 2
		recordCommonEntity.Recorddiffid = RecordDiffID
		recordCommonEntity.RecordID = recordID
		recordCommonEntity.RecordstageID = recordStagedID
		recordCommonEntity.ForuserID = userID
		recordCommonEntity.Usergroupid = userGrpID
		recordCommonEntity.UserID = userID
		recordCommonEntity.Termseq = commentSeq
		recordCommonEntity.Termvalue = body
		recordCommonEntity.Termdescription = ""
		sendData, err := json.Marshal(recordCommonEntity)
		if err != nil {
			Logger.Log.Println(err)
			return errors.New("Unable to marshal data")
		}
		Logger.Log.Println("Add Comment Json Json=======>   ", string(sendData))

		resp, err := http.Post(props["URLAddComment"], "application/json", bytes.NewBuffer(sendData))

		var result map[string]interface{}
		respBody, err1 := ioutil.ReadAll(resp.Body)
		if err1 != nil {
			Logger.Log.Println(err1)
			return errors.New("Unable to read response data")
		}
		err2 := json.Unmarshal(respBody, &result)
		if err2 != nil {
			Logger.Log.Println(err2)
			return errors.New("Unable to Unmarshal data")
		}

		//  json.NewDecoder(resp.Body).Decode(&res)
		if result["success"].(bool) == false {
			Logger.Log.Println("getting False")
			insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "N", sentTime, receivedTime)
			if insertError != nil {
				Logger.Log.Println("Insert Log Error")
			}
			return errors.New("Ticket Comment Updation failed intermittently. Please try again later")
		} else {
			insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "Y", sentTime, receivedTime)
			if insertError != nil {
				Logger.Log.Println("Insert Log Error")
			}
			Logger.Log.Println("Add Comment TO recordID Done====>", recordID)
		}

		//responseData := result["response"].(string)

		Logger.Log.Println("Check For Current Status of the ticket====>", recordID)

		getRecordCurrentStatusSeq := "select seqno from mstrecorddifferentiation where id in(SELECT recorddiffid FROM maprecordtorecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=3 and islatest=1 and recordid=?)"

		getRecordCurrentStatusSeqError := db.QueryRow(getRecordCurrentStatusSeq, clientID, orgID, recordID).Scan(&currentStatusSeq)
		if getRecordCurrentStatusSeqError != nil {
			Logger.Log.Println(getRecordCurrentStatusSeqError)
			return errors.New("Unable to fetch status seq id")
		}
		Logger.Log.Println("Current Sequence=====>", currentStatusSeq)
		if statusSeqToCheck == currentStatusSeq {
			Logger.Log.Println("")
			Logger.Log.Println("<================================Pendng for user Action To User Replied =====================>")
			Logger.Log.Println("")

			Logger.Log.Println("Status is in pendng for user Action")
			getRecordCurrentStateID := "select currentstateid from mstrequest where id in( select mstrequestid from maprequestorecord where clientid=? and mstorgnhirarchyid=? and recordid=?) "

			getRecordCurrentStateIDError := db.QueryRow(getRecordCurrentStateID, clientID, orgID, recordID).Scan(&currentStateID)
			if getRecordCurrentStateIDError != nil {
				Logger.Log.Println(getRecordCurrentStateIDError)
				return errors.New("Unable to fetch current state id")
			}
			var stateSeq model.StateSeq
			stateSeq.ClientID = clientID
			stateSeq.OrgID = recordCommonEntity.Mstorgnhirarchyid
			stateSeq.TypeSeqNo = 2
			stateSeq.SeqNo = 9
			stateSeq.UserID = userID
			sendDataForGetSeqNo, sendDataForGetSeqNoerr := json.Marshal(stateSeq)
			if sendDataForGetSeqNoerr != nil {
				Logger.Log.Println(sendDataForGetSeqNoerr)
				return errors.New("Unable to marshal data")
			}
			Logger.Log.Println("sendDataForGetSeqNo Json=======>   ", string(sendDataForGetSeqNo))

			sendDataForGetSeqNoResp, responseErr := http.Post(props["URLGetSeq"], "application/json", bytes.NewBuffer(sendDataForGetSeqNo))
			if responseErr != nil {
				Logger.Log.Println(responseErr)
				return errors.New("sendDataForGetSeqNo Response Errror")
			}

			respBody, err1 := ioutil.ReadAll(sendDataForGetSeqNoResp.Body)
			if err1 != nil {
				Logger.Log.Println(err1)
				return errors.New("Unable to read response data")
			}
			var stateSeqResponse = model.StateSeqResponse{}
			Logger.Log.Println("Response Body===>", string(respBody))
			// jsonError := stateSeqResponse.FromJSON(sendDataForGetSeqNoResp.Body)

			jsonError := json.Unmarshal(respBody, &stateSeqResponse)
			// //Logger.Log.Println("RespBOdy",respBody.)
			if jsonError != nil {
				Logger.Log.Println(jsonError)
				return errors.New("Unable to Unmarshal data")
			}

			//  json.NewDecoder(resp.Body).Decode(&res)
			if stateSeqResponse.Success == false {
				Logger.Log.Println("getting False")
				return errors.New("Ticket Comment GetSeq failed intermittently. Please try again later")
			} else {
				Logger.Log.Println("Response Data by SendRequest:-,", stateSeqResponse.Success)
				Logger.Log.Println("MStStateID:-,", stateSeqResponse.Details[0].Mststateid)
				var moveWorkFlow model.MoveWorkFlow
				moveWorkFlow.ClientID = clientID
				moveWorkFlow.OrgID = orgID
				moveWorkFlow.Previousstateid = currentStateID
				moveWorkFlow.Currentstateid = stateSeqResponse.Details[0].Mststateid
				moveWorkFlow.Manualstateselection = 0
				moveWorkFlow.Transactionid = recordID
				moveWorkFlow.Mstgroupid = userGrpID
				moveWorkFlow.Createdgroupid = userGrpID
				moveWorkFlow.Mstuserid = userID
				moveWorkFlow.UserID = userID

				getworkingCategoryTypeIDAndCatID := "select recorddifftypeid,recorddiffid from maprecordtorecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recordid=? and islatest=1 and isworking=1 and activeflg=1 and deleteflg=0"

				getworkingCategoryTypeIDAndCatIDError := db.QueryRow(getworkingCategoryTypeIDAndCatID, clientID, orgID, recordID).Scan(&moveWorkFlow.Recorddifftypeid, &moveWorkFlow.RecordDiffID)
				if getworkingCategoryTypeIDAndCatIDError != nil {
					Logger.Log.Println(getworkingCategoryTypeIDAndCatIDError)
					return errors.New("Unable to fetch Working categoryID")
				}
				sendDataForMoveWorkFlow, err := json.Marshal(moveWorkFlow)
				if err != nil {
					Logger.Log.Println(err)
					return errors.New("Unable to marshal data for move Workflow")
				}
				Logger.Log.Println("UserReplied Json Json=======>   ", string(sendDataForMoveWorkFlow))

				resp, err := http.Post(props["URLMoveWorkFlow"], "application/json", bytes.NewBuffer(sendDataForMoveWorkFlow))

				var moveWorkFlowResult map[string]interface{}
				respBody, err1 := ioutil.ReadAll(resp.Body)
				if err1 != nil {
					Logger.Log.Println(err1)
					return errors.New("Unable to read response data")
				}
				err2 := json.Unmarshal(respBody, &moveWorkFlowResult)
				if err2 != nil {
					Logger.Log.Println(err2)
					return errors.New("Unable to Unmarshal data")
				}

				//  json.NewDecoder(resp.Body).Decode(&res)
				if moveWorkFlowResult["success"].(bool) == false {
					Logger.Log.Println("getting False")
					return errors.New("Ticket State change to  User Replied failed intermittently. Please try again later")
				} else {
					Logger.Log.Println("Status Change to User Replied for RecordID==>", recordID)
				}

			}

		}
	}
	if ticketTypeSeqNo == 2 {
		var statusSeqno int64
		recordCheckingForStatusQuery := "select seqno from mstrecorddifferentiation  where id  in (select a.recorddiffid from maprecordtorecorddifferentiation a " +
			" where a.clientid=? and a.mstorgnhirarchyid=? and islatest=1 and a.recordid=? and a.recorddifftypeid=3 and   a.recorddiffid  in" +
			" (SELECT id FROM mstrecorddifferentiation m where recorddifftypeid=a.recorddifftypeid and clientid=a.clientid and " +
			" mstorgnhirarchyid=a.mstorgnhirarchyid and seqno not in (3,8,11,14)))"

		recordCheckingForStatusErr := db.QueryRow(recordCheckingForStatusQuery, clientID, orgID, recordID).Scan(&statusSeqno)
		if recordCheckingForStatusErr != nil {
			Logger.Log.Println(recordCheckingForStatusErr)
			return errors.New("Record is in  Closed/Resolved/Canceled/Rejected in SR")
		}
		if len(attchments) > 0 {
			for j := range attchments {
				if strings.Contains(attchments[j].Name, ".exe") || strings.Contains(attchments[j].Name, ".js") || strings.Contains(attchments[j].Name, ".json") ||
					strings.Contains(attchments[j].Name, ".jar") || strings.Contains(attchments[j].Name, ".bat") || strings.Contains(attchments[j].Name, ".deb") ||
					strings.Contains(attchments[j].Name, ".asp") || strings.Contains(attchments[j].Name, ".php") || strings.Contains(attchments[j].Name, ".py") ||
					strings.Contains(attchments[j].Name, ".dll") || strings.Contains(attchments[j].Name, ".vbs") {
					continue
				}
				var AttachmentSeq int64 = 1
				recordCommonEntity.ClientID = clientID
				recordCommonEntity.Mstorgnhirarchyid = orgID
				recordCommonEntity.Recorddifftypeid = recordDiffTypeID
				recordCommonEntity.Recorddiffid = RecordDiffID
				recordCommonEntity.RecordID = recordID
				recordCommonEntity.RecordstageID = recordStagedID
				recordCommonEntity.ForuserID = userID
				recordCommonEntity.Usergroupid = userGrpID
				recordCommonEntity.UserID = userID
				recordCommonEntity.Termseq = AttachmentSeq

				fileBytes := bytes.NewReader(attchments[j].Content)
				filepath := contextPath + "/resource/downloads/" + attchments[j].Name
				output, err := os.Create(contextPath + "/resource/downloads/" + attchments[j].Name)
				if err != nil {
					Logger.Log.Println("Error while creating", "-", err)
				}
				defer output.Close()
				// 	//--------------

				// 	//write the bytes to a file
				_, err = io.Copy(output, fileBytes)
				if err != nil {
					Logger.Log.Println("Error while downloading", "-", err)
				}
				//var recordTerm model.RecordTerm

				originalFileName, newFileName, err := fileutils.FileUploadAPICall(clientID, orgID, props["fileUploadUrl"], filepath)
				if err != nil {
					Logger.Log.Println("Error while downloading", "-", err)
				}
				recordCommonEntity.Termvalue = originalFileName
				recordCommonEntity.Termdescription = newFileName
				//recordField.Val = append(recordField.Val, recordTerm)
				sendData, err := json.Marshal(recordCommonEntity)
				if err != nil {
					Logger.Log.Println(err)
					return errors.New("Unable to marshal data")
				}
				Logger.Log.Println("Add Comment Json Json=======>   ", string(sendData))

				resp, err := http.Post(props["URLAddComment"], "application/json", bytes.NewBuffer(sendData))

				var result map[string]interface{}
				respBody, err1 := ioutil.ReadAll(resp.Body)
				if err1 != nil {
					Logger.Log.Println(err1)
					return errors.New("Unable to read response data")
				}
				err2 := json.Unmarshal(respBody, &result)
				if err2 != nil {
					Logger.Log.Println(err2)
					return errors.New("Unable to Unmarshal data")
				}

				//  json.NewDecoder(resp.Body).Decode(&res)
				if result["success"].(bool) == false {
					Logger.Log.Println("getting False for Attachment added")
					return errors.New("Ticket Comment Updation failed intermittently. Please try again later")
				} else {

					//Logger.Log.Println("Attachment Added Successfull")
					Logger.Log.Println("Attachment Added Successfull in TicketID======>", recordID)
				}

			}

		}
		var commentSeq int64 = 11
		recordCommonEntity.ClientID = clientID
		recordCommonEntity.Mstorgnhirarchyid = orgID
		recordCommonEntity.Recorddifftypeid = 2
		recordCommonEntity.Recorddiffid = RecordDiffID
		recordCommonEntity.RecordID = recordID
		recordCommonEntity.RecordstageID = recordStagedID
		recordCommonEntity.ForuserID = userID
		recordCommonEntity.Usergroupid = userGrpID
		recordCommonEntity.UserID = userID
		recordCommonEntity.Termseq = commentSeq
		recordCommonEntity.Termvalue = body
		recordCommonEntity.Termdescription = ""
		sendData, err := json.Marshal(recordCommonEntity)
		if err != nil {
			Logger.Log.Println(err)
			return errors.New("Unable to marshal data")
		}
		Logger.Log.Println("Add Comment Json Json=======>   ", string(sendData))

		resp, err := http.Post(props["URLAddComment"], "application/json", bytes.NewBuffer(sendData))

		var result map[string]interface{}
		respBody, err1 := ioutil.ReadAll(resp.Body)
		if err1 != nil {
			Logger.Log.Println(err1)
			return errors.New("Unable to read response data")
		}
		err2 := json.Unmarshal(respBody, &result)
		if err2 != nil {
			Logger.Log.Println(err2)
			return errors.New("Unable to Unmarshal data")
		}

		//  json.NewDecoder(resp.Body).Decode(&res)
		if result["success"].(bool) == false {
			Logger.Log.Println("getting False")
			insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "N", sentTime, receivedTime)
			if insertError != nil {
				Logger.Log.Println("Insert Log Error")
			}
			return errors.New("Ticket Comment Updation failed intermittently. Please try again later")
		} else {
			insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "Y", sentTime, receivedTime)
			if insertError != nil {
				Logger.Log.Println("Insert Log Error")
			}
			Logger.Log.Println("Add Comment TO recordID Done====>", recordID)
		}

		var sTaskIDList []int64

		getsTaskListQuery := "SELECT childrecordid FROM mstparentchildmap where clientid=? and mstorgnhirarchyid=? and parentrecordid=? and activeflg=1 and deleteflg=0"
		resultset, resultsetErr := db.Query(getsTaskListQuery, clientID, orgID, recordID)
		if resultsetErr != nil {
			Logger.Log.Println(resultsetErr)
			return errors.New("ERROR: Unable To get STask")
		}
		defer resultset.Close()
		for resultset.Next() {
			var sTaskID int64
			scanErr := resultset.Scan(&sTaskID)
			if scanErr != nil {
				Logger.Log.Println(resultsetErr)
				return errors.New("ERROR: Unable To Scan STask")
			}
			sTaskIDList = append(sTaskIDList, sTaskID)
		}
		//var currentStateID int64

		Logger.Log.Println("...........................STast Status Update..............................")
		for i := 0; i < len(sTaskIDList); i++ {
			// getRecordCurrentStateID := "select currentstateid from mstrequest where id in( select mstrequestid from maprequestorecord where clientid=? and mstorgnhirarchyid=? and recordid=?) "

			// getRecordCurrentStateIDError := db.QueryRow(getRecordCurrentStateID, clientID, orgID, sTaskIDList[i]).Scan(&currentStateID)
			// if getRecordCurrentStateIDError != nil {
			// 	Logger.Log.Println(getRecordCurrentStateIDError)
			// 	return errors.New("Unable to fetch current state id for a stask")
			// }
			// var updateRecordStatus entities.UpdateRecordStatus
			// updateRecordStatus.ClientID = clientID
			// updateRecordStatus.OrgID = orgID
			// updateRecordStatus.RecordID = sTaskIDList[i]
			// updateRecordStatus.CurrentStateID = currentStateID

			// sendDataForUpdateStatus, err := json.Marshal(updateRecordStatus)
			// if err != nil {
			// 	Logger.Log.Println(err)
			// 	return errors.New("Unable to marshal data")
			// }
			// Logger.Log.Println("updateRecordStatus=====> ", string(sendDataForUpdateStatus))

			// respns, err := http.Post(props["URLUpdateRecordStatus"], "application/json", bytes.NewBuffer(sendDataForUpdateStatus))

			// var result map[string]interface{}
			// respBody, err1 := ioutil.ReadAll(respns.Body)
			// if err1 != nil {
			// 	Logger.Log.Println(err1)
			// 	return errors.New("Unable to read response data")
			// }
			// err2 := json.Unmarshal(respBody, &result)
			// if err2 != nil {
			// 	Logger.Log.Println(err2)
			// 	return errors.New("Unable to Unmarshal data")
			// }

			// //  json.NewDecoder(resp.Body).Decode(&res)

			// if result["success"].(bool) == false {
			// 	Logger.Log.Println("getting False")
			// 	insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "N", sentTime, receivedTime)
			// 	if insertError != nil {
			// 		Logger.Log.Println("Insert Log Error")
			// 	}
			// 	return errors.New("Ticket Status Updation failed intermittently. Please try again later")
			// } else {
			// 	insertError := InsertEmailToTicketLog(db, tx, clientID, orgID, Subject, senderEmail, "Y", sentTime, receivedTime)
			// 	if insertError != nil {
			// 		Logger.Log.Println("Insert Log Error")
			// 	}
			// 	Logger.Log.Println("Update Status TO recordID Done====>", sTaskIDList[i])
			// }

			getRecordCurrentStatusSeq := "select seqno from mstrecorddifferentiation where id in(SELECT recorddiffid FROM maprecordtorecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recorddifftypeid=3 and islatest=1 and recordid=?)"

			getRecordCurrentStatusSeqError := db.QueryRow(getRecordCurrentStatusSeq, clientID, orgID, sTaskIDList[i]).Scan(&currentStatusSeq)
			if getRecordCurrentStatusSeqError != nil {
				Logger.Log.Println(getRecordCurrentStatusSeqError)
				return errors.New("Unable to fetch status seq id")
			}
			Logger.Log.Println("Current Sequence=====>", currentStatusSeq)
			if statusSeqToCheck == currentStatusSeq {
				var moveWorkFlow model.MoveWorkFlow
				moveWorkFlow.ClientID = clientID
				moveWorkFlow.OrgID = orgID
				moveWorkFlow.Previousstateid = 4
				moveWorkFlow.Currentstateid = 7
				moveWorkFlow.Manualstateselection = 0
				moveWorkFlow.Transactionid = sTaskIDList[i]
				moveWorkFlow.Mstgroupid = userGrpID
				moveWorkFlow.Createdgroupid = userGrpID
				moveWorkFlow.Mstuserid = userID
				moveWorkFlow.UserID = userID

				getworkingCategoryTypeIDAndCatID := "select recorddifftypeid,recorddiffid from maprecordtorecorddifferentiation where clientid=? and mstorgnhirarchyid=? and recordid=? and islatest=1 and isworking=1 and activeflg=1 and deleteflg=0"

				getworkingCategoryTypeIDAndCatIDError := db.QueryRow(getworkingCategoryTypeIDAndCatID, clientID, orgID, sTaskIDList[i]).Scan(&moveWorkFlow.Recorddifftypeid, &moveWorkFlow.RecordDiffID)
				if getworkingCategoryTypeIDAndCatIDError != nil {
					Logger.Log.Println(getworkingCategoryTypeIDAndCatIDError)
					return errors.New("Unable to fetch Working categoryID")
				}
				sendDataForMoveWorkFlow, err := json.Marshal(moveWorkFlow)
				if err != nil {
					Logger.Log.Println(err)
					return errors.New("Unable to marshal data for move Workflow")
				}
				Logger.Log.Println("UserReplied Json Json FOR SR=======>   ", string(sendDataForMoveWorkFlow))

				resp, err := http.Post(props["URLMoveWorkFlow"], "application/json", bytes.NewBuffer(sendDataForMoveWorkFlow))

				var moveWorkFlowResult map[string]interface{}
				respBody, err1 := ioutil.ReadAll(resp.Body)
				if err1 != nil {
					Logger.Log.Println(err1)
					return errors.New("Unable to read response data")
				}
				err2 := json.Unmarshal(respBody, &moveWorkFlowResult)
				if err2 != nil {
					Logger.Log.Println(err2)
					return errors.New("Unable to Unmarshal data")
				}

				//  json.NewDecoder(resp.Body).Decode(&res)
				if moveWorkFlowResult["success"].(bool) == false {
					Logger.Log.Println("getting False")
					return errors.New("Ticket State change to  User Replied failed intermittently. Please try again later")
				} else {
					Logger.Log.Println("Status Change to User Replied for RecordID==>", sTaskIDList[i])
				}

			}

		}

	}

	return nil
}
