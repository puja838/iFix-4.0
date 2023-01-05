package models

import (
	"bytes"
	"encoding/json"

	"io/ioutil"
	"net/http"
	"os"
	"src/config"
	"src/dao"
	"src/entities"
	"src/fileutils"
	"src/logger"

	Logger "src/logger"
	"strings"
)

func Autoclosure() {

	wd, err := os.Getwd() // to get working directory
	if err != nil {
		Logger.Log.Println(err)
	}
	//log.Println(wd)
	contextPath := strings.ReplaceAll(wd, "\\", "/") // replacing backslash by  forwardslash
	//log.Println(contextPath)
	props, err := fileutils.ReadPropertiesFile(contextPath + "/resource/application.properties")
	if err != nil {
		Logger.Log.Println(err)
	}
	logger.Log.Println("In side Autoclosure model function")
	db, dBerr := config.GetDB()
	if dBerr != nil {
		Logger.Log.Println(dBerr)
		//return errors.New("ERROR: Unable to connect DB")
	}

	//dao := dao.DbConn{DB: db}
	values, err := dao.GetResolvedRecordsInfo(db)
	if err != nil {
		logger.Log.Println("Error is --------->", err)
	}
	logger.Log.Println("Total Tickets ****************************", len(values))
	logger.Log.Println("\n\n")

	for i := 0; i < len(values); i++ {
		var ClientID int64 = values[i].ClientID
		var MstorgnhirarchyID int64 = values[i].MstorgnhirarchyID
		logger.Log.Println("Total Tickets  --------->", len(values))
		logger.Log.Println("===================================================Ticket ID is ===========================>", values[i].RecordID)

		nxtstateID, err := dao.GetNxtStateID(db, ClientID, MstorgnhirarchyID)
		if err != nil {
			logger.Log.Println("Error is --------->", err)
		}
		logger.Log.Println("nxtstateID is---->", nxtstateID)
		hashmap, err := dao.Termsequance(db, ClientID, MstorgnhirarchyID)
		if err != nil {
			logger.Log.Println("Error is --------->", err)
		}

		sequance, err := dao.GetCurrentStatusSeq(db, ClientID, MstorgnhirarchyID, values[i].RecordID)
		if err != nil {
			logger.Log.Println("Error is --------->", err)
		}
		if sequance == 3 {
			//rec.ClientID, rec.Mstorgnhirarchyid, rec.RecordID, rec.RecordstageID, rec.TermID, rec.Termvalue, rec.ForuserID, rec.Userid
			err := dao.InsertClosureComment(db, values[i].ClientID, values[i].MstorgnhirarchyID, values[i].RecordID, values[i].RecordStageID, hashmap[17], "Auto Close", values[i].MstuserID, values[i].CreatedgrpID)
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}
			commenttermnm, err := dao.Gettermnamebyid(db, hashmap[17], values[i].ClientID, values[i].MstorgnhirarchyID)
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}
			err = dao.InsertActivityLogs(db, values[i].ClientID, values[i].MstorgnhirarchyID, values[i].RecordID, 100, commenttermnm+" :: Auto Close", values[i].MstuserID, values[i].CreatedgrpID, hashmap[17])
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}

			err1 := dao.InsertNPSFeedback(db, values[i].ClientID, values[i].MstorgnhirarchyID, values[i].RecordID, values[i].RecordStageID, hashmap[18], "NULL", values[i].MstuserID, values[i].CreatedgrpID)
			if err1 != nil {
				logger.Log.Println("Error is --------->", err1)
			}
			feedbacktermnm, err := dao.Gettermnamebyid(db, hashmap[18], values[i].ClientID, values[i].MstorgnhirarchyID)
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}
			err = dao.InsertActivityLogs(db, values[i].ClientID, values[i].MstorgnhirarchyID, values[i].RecordID, 100, feedbacktermnm+" :: NULL", values[i].MstuserID, values[i].CreatedgrpID, hashmap[18])
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}

			reqbd := &entities.RequestBody{}
			reqbd.ClientID = values[i].ClientID
			reqbd.MstorgnhirarchyID = values[i].MstorgnhirarchyID
			reqbd.RecorddifftypeID = values[i].WorkingDifftypeID
			reqbd.RecorddiffID = values[i].WorkingDiffID

			reqbd.PreviousstateID = values[i].PreviousStateID
			reqbd.CurrentstateID = nxtstateID
			reqbd.TransactionID = values[i].RecordID
			reqbd.CreatedgroupID = values[i].CreatedgrpID
			reqbd.MstgroupID = values[i].CreatedgrpID
			reqbd.MstuserID = values[i].MstuserID
			postBody, _ := json.Marshal(reqbd)
			logger.Log.Println("Record status request body -->", reqbd)
			responseBody := bytes.NewBuffer(postBody)
			resp, err := http.Post(props["MoveWorkflowURL"], "application/json", responseBody)
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				logger.Log.Println("Error is --------->", err)
			}
			sb := string(body)
			wfres := entities.WorkflowResponse{}
			json.Unmarshal([]byte(sb), &wfres)
			var workflowflag = wfres.Success
			var errormsg = wfres.Message
			logger.Log.Println("Auto close workflow message -->", workflowflag)
			logger.Log.Println("Auto close workflow response error message -->", errormsg, "======", values[i].RecordID)
			if workflowflag == true {
				err2 := dao.UpdateclosureFlag(db, values[i].ClientID, values[i].MstorgnhirarchyID, values[i].RecordID)
				if err2 != nil {
					logger.Log.Println("Errorr in UpdateclosureFlag --------->", err2)
				} else {
					logger.Log.Println("<================================Ticket IS closed===============================>", values[i].RecordID)
				}
				logger.Log.Println("")
			} else {
				logger.Log.Println("<***************************MoveWorkflow API Error****************************>", values[i].RecordID)
			}

		}
	}

}
