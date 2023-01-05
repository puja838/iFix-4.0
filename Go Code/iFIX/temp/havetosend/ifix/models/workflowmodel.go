//***************************//
// Package models
// Date Of Creation: 18/12/2020
// Authour Name: Subham Chatterjee
// History: N/A
// Synopsis: This file is used for workflow related works. It is used as model. All the business logic is written here.
// Functions:

// Global Variable: N/A
// Version: 1.0.0
//***************************//
package models

import (
	"bytes"
	"encoding/json"
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"iFIX/ifix/utility"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
)

func InsertProcessDelegateUser(tz *entities.Workflowentity) (int64, bool, error, string) {
	log.Println("In side model")
	db, err := config.ConnectMySqlDb()
	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	id, err := dataAccess.InsertProcessDelegateUser(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	return id, true, err, ""
}
func Checkworkflow(tz *entities.Workflowentity) (int64, bool, error, string) {
	logger.Log.Println("\n\nIn side Checkworkflow::")
	logger.Log.Println(tz.Clientid, tz.Mstorgnhirarchyid, tz.Recorddifftypeid, tz.Recorddiffid, tz.Previousstateid,
		tz.Manualstateselection, tz.Transactionid, tz.Mstgroupid, tz.Mstuserid)
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	/**
	Get Process by using record category value
	*/
	processValue, err := dataAccess.GetProcessByCategory(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if processValue.Processid == 0 {
		return 0, false, nil, "No Process is mapped with category"
	} else {
		tz.Processid = processValue.Processid
		/**
		This process checks whether the process is defined and if defined,
		whether it is completed or not
		*/
		processDetails, err := dataAccess.Checkprocesscomplete(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		if len(processDetails) == 0 {
			return 0, false, err, "Process is not defined yet."
		} else {
			if processDetails[0].Iscomplete == 0 {
				return 0, false, err, "Process is  defined but not completed yet.Please complete it first."
			} else {
				return 1, true, err, ""
			}
		}
	}
}
func Checkworkflowstate(tz *entities.Workflowentity) (int64, bool, error, string) {
	db, err := config.ConnectMySqlDb()

	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}

	/**
	Get Process by using record category value
	*/
	processValue, err := dataAccess.GetProcessByCategory(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if processValue.Processid == 0 {
		return 0, false, nil, "No Process is mapped with category"
	} else {
		tz.Processid = processValue.Processid
		transitionState, err := dataAccess.GetTransitionState(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		log.Print("\n\nTransition state:", transitionState)
		if len(transitionState) > 0 {
			return 0, true, nil, ""
		} else {
			return 0, false, err, "No more State is defined in Workflow"
		}
	}
}
func MoveWorkflow(tz *entities.Workflowentity) (int64, bool, error, string) {
	logger.Log.Println("\n\nIn side MoveWorkflow::")
	logger.Log.Println(tz.Clientid, tz.Mstorgnhirarchyid, tz.Recorddifftypeid, tz.Recorddiffid, tz.Previousstateid, tz.Currentstateid,
		tz.Manualstateselection, tz.Transactionid, tz.Mstgroupid, tz.Mstuserid, tz.Userid, tz.Createdgroupid, tz.Changestatus, tz.Transitionid)
	db, err := config.ConnectMySqlDb()

	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}

	/**
	Get Process by using record category value
	*/
	processValue, err := dataAccess.GetProcessByCategory(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if processValue.Processid == 0 {
		return 0, false, nil, "No Process is mapped with category"
	} else {
		tz.Processid = processValue.Processid
		/**
		This process checks whether the process is defined and if defined,
		whether it is completed or not
		*/
		processDetails, err := dataAccess.Checkprocesscomplete(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		if len(processDetails) == 0 {
			return 0, false, err, "Process is not defined yet."
		} else {
			if processDetails[0].Iscomplete == 0 {
				return 0, false, err, "Process is  defined but not completed yet.Please complete it first."
			} else {
				/**
				This method is used to getting the
				record table name by using the process id
				*/
				tableName, err := dataAccess.GetTableByProcess(tz)
				if err != nil {
					return 0, false, err, "Something Went Wrong"
				}
				if tableName.Tablename == "" {
					return 0, false, nil, "Workflow table name not found"
				}
				/**
				If current state id is not given i.e straight workflow is defined,
				we are fetching current state id from msttransition table using previous state id
				*/
				if tz.Currentstateid == 0 && tz.Transitionid == 0 {
					currentstate, err := dataAccess.Getcurrentstateid(tz)
					if err != nil {
						return 0, false, err, "Something Went Wrong"
					}
					if len(currentstate) == 0 {
						return 0, false, nil, "Workflow not defined properly"
					} else {
						tz.Currentstateid = currentstate[0].Currentstateid
					}
				}
				/**
				Fetching record details from the table (getting by the 'GetTableByProcess()')
				and TransactionId
				*/
				recordDetails, trerr := dataAccess.GetRecordDetailsById(tz, tableName.Tablename)
				if trerr != nil {
					return 0, false, trerr, "Something Went Wrong"
				}
				if len(recordDetails) > 0 {
					err, requestIds := dataAccess.GetRequestIdbyRecordId(tz)
					if err != nil {
						return 0, false, err, "Something Went Wrong"
					}
					var id int64
					var isFirstStep bool
					if len(requestIds) > 0 {
						id = requestIds[0].Requestid
						isFirstStep = false
					} else {
						isFirstStep = true
					}
					logger.Log.Println("Before transition id ", tz.Transitionid)
					tz.Createduserid = recordDetails[0].Userid
					if tz.Manualstateselection == 0 {
						if tz.Transitionid == 0 {
							/**
							Using the process id and previousstate id , fetching the latest transition id
							according with the currentstate id of the record.
							*/
							transitionState, err := dataAccess.GetTransitionState(tz)
							if err != nil {
								return 0, false, err, "Something Went Wrong"
							}
							log.Print("\n\nTransition state if:", transitionState)
							logger.Log.Print("\n\nTransition state if:", transitionState)
							if len(transitionState) == 0 {
								return 0, false, err, "No more State is defined in Workflow"
							}
							tz.Transitionid = transitionState[0].Transitionid
						} else {
							/**
							Using the transition id , fetching the previous state id and
							 current state id of the record.
							*/
							transitionState, err := dataAccess.Getstatebytranid(tz.Transitionid)
							if err != nil {
								return 0, false, err, "Something Went Wrong"
							}
							log.Print("\n\nTransition state:", transitionState)
							logger.Log.Print("\n\nTransition state:", transitionState)
							if len(transitionState) == 0 {
								return 0, false, err, "Next State is not defined in Workflow"
							}
							tz.Currentstateid = transitionState[0].Currentstateid
							tz.Previousstateid = transitionState[0].Previousstateid
						}
						log.Print("\n\nTransition Id:", tz.Transitionid)
						logger.Log.Print("\n\nTransition Id:", tz.Transitionid)
						/**
						Check whether there is any delegated user in this transition state.
						If any then we'll use this delegated user as assigned user for this state
						*/
						delegateUser, err := dataAccess.GetDelegateUser(tz)
						if err != nil {
							return 0, false, err, "Something Went Wrong"
						}
						if len(delegateUser) > 0 {
							tz.Mstgroupid = delegateUser[0].Mstgroupid
							tz.Mstuserid = delegateUser[0].Mstuserid
						} else {
							/**
							If no delegated user is mapped for this state,
							We'll use the user and group that are mapped in the workflow state.
							*/
							stateuser, err := dataAccess.GetStateUserByTransitionId(tz)
							if err != nil {
								return 0, false, err, "Something Went Wrong"
							}
							if len(stateuser) > 0 {
								if stateuser[0].Mstgroupid == 0 && stateuser[0].Mstuserid == -1 {
									log.Print("Go TO CREATOR: ", recordDetails[0].Groupid, recordDetails[0].Userid)
									logger.Log.Print("Go TO CREATOR: ", recordDetails[0].Groupid, recordDetails[0].Userid)
									/**
									  Assigning the userid and groupid from record table for `Go to creator` option
									*/
									tz.Mstgroupid = recordDetails[0].Groupid
									tz.Mstuserid = recordDetails[0].Userid
								} else if stateuser[0].Mstgroupid == 0 && stateuser[0].Mstuserid == 0 {
									/**
									fetching userdetails for `Self Assign` option.
									userid and groupid coming from api(sender userid and groupid).So no need to fetch
									*/
									logger.Log.Print("SELF ASSIGN: ", tz.Mstgroupid, tz.Mstuserid)
								} else if stateuser[0].Mstgroupid == 0 && stateuser[0].Mstuserid == -2 {
									/**
									fetching details for 'Back to sender (User)' option
									fetching previous state user details(group and user both) from `mstrequesthistory` table
									*/
									prevuser, err := dataAccess.Getprevioussenderdetails(id)
									if err != nil {
										return 0, false, err, "Something Went Wrong"
									}
									logger.Log.Print("Go TO Prev: ", len(prevuser))
									if len(prevuser) > 1 {
										var currentstate = prevuser[0].Currentstateid
										for i := 1; i < len(prevuser); i++ {
											if prevuser[i].Currentstateid != currentstate {
												tz.Mstgroupid = prevuser[i].Mstgroupid
												tz.Mstuserid = prevuser[i].Mstuserid
												break
											}
										}
										//tz.Mstgroupid = prevuser[1].Mstgroupid
										//tz.Mstuserid = prevuser[1].Mstuserid
										logger.Log.Print("Go TO Prev details user: ", tz.Mstgroupid, tz.Mstuserid)
									} else {
										return 0, false, nil, "No previous state details found."
									}
								} else if stateuser[0].Mstgroupid == 0 && stateuser[0].Mstuserid == -3 {
									/**
									fetching details for 'Back to sender (Group)' option
									fetching previous state user details(group only) from `mstrequesthistory` table
									*/
									prevuser, err := dataAccess.Getprevioussenderdetails(id)
									if err != nil {
										return 0, false, err, "Something Went Wrong"
									}
									logger.Log.Print("Go TO Prev: ", len(prevuser))
									if len(prevuser) > 1 {
										var currentstate = prevuser[0].Currentstateid
										logger.Log.Println(" Current state : ", currentstate)
										for i := 1; i < len(prevuser); i++ {
											if prevuser[i].Currentstateid != currentstate {
												logger.Log.Println(" Previous state : ", prevuser[i].Currentstateid)
												tz.Mstgroupid = prevuser[i].Mstgroupid
												break
											}
										}
										tz.Mstuserid = 0
										logger.Log.Print("Go TO Prev details group: ", tz.Mstgroupid)
									} else {
										return 0, false, nil, "No previous state details found."
									}
								} else if stateuser[0].Mstgroupid == 0 && stateuser[0].Mstuserid == -4 {

									/**
									fetching details for 'Back to Manager' option
									fetching created user's manager id from `mstclientuser` table
									*/

									relmanagers, err := dataAccess.Getuserrelmanager(tz.Createduserid)
									if err != nil {
										return 0, false, err, "Something Went Wrong"
									}
									logger.Log.Print("Go TO Rel Manager: ", len(relmanagers))
									if len(relmanagers) > 0 {
										tz.Mstgroupid = relmanagers[0].Mstgroupid
										tz.Mstuserid = relmanagers[0].Mstuserid
										logger.Log.Print("Go TO Rel Manager: ", tz.Mstgroupid, tz.Mstuserid)
									} else {
										return 0, false, nil, "No Rel Manager mapped for the creator."
									}
								} else {
									/**
										Assigning the first user and groupid from `maprecorddifferentiongroup`
									table for `Manual selection`
									*/
									tz.Mstgroupid = stateuser[0].Mstgroupid
									tz.Mstuserid = stateuser[0].Mstuserid
									logger.Log.Print("Manual Selection: ", tz.Mstgroupid, tz.Mstuserid)
								}
							} else {
								return 0, false, nil, "No Group / User is mapped with State"
							}
						}
					} else {
						/**
						This is a manual selection.Setting the transitionid to -1
						Also fetching the user details against the currentstateid
						*/
						tz.Transitionid = -1
					}
					/**
					Fetching the latest id of record history table by Transaction Id
					*/
					stageDetails, trerr := dataAccess.GetLatestTransactionStageDetails(tz)
					if trerr != nil {
						return 0, false, trerr, "Something Went Wrong"
					}
					if len(stageDetails) > 0 {
						recordDetails[0].Recordstageid = stageDetails[0].Recordstageid
						/**
						Actual Workflow moving is done here
						1. Storing the latest record state in 'mstrequest' table
						2. Mapping the request state,transaction record details and transaction history
						in 'maprequestorecord'
						3. Workflow moving history is stored in mstrequesthistory.
						*/

						tx, err := db.Begin()
						if err != nil {
							logger.Log.Println("Transaction creation error.", err)
							return 0, false, err, "Something Went Wrong"
						}
						logger.Log.Println("Before sending ", tz.Previousstateid, tz.Currentstateid)
						log.Println("Before sending ", tz.Previousstateid, tz.Currentstateid)
						recordVal, recerr := dao.UpsertProcessDetails(tx, tz, recordDetails[0], isFirstStep, id)
						if recerr != nil {
							logger.Log.Println("Role back error.")
							log.Println("Role back error.")
							tx.Rollback()
							return 0, false, recerr, "Something Went Wrong"
						}
						loggedusername := ""
						uerr, users := dataAccess.Getusername(tz.Userid)
						if uerr != nil {
							return 0, false, uerr, "Something Went Wrong"
						}
						if len(users) > 0 {
							loggedusername = users[0].Username
						}
						var grpname string
						var username string
						var name string
						grperr, group := dataAccess.Getgroupname(tz.Mstgroupid)
						if grperr != nil {
							return 0, false, grperr, "Something Went Wrong"
						}
						if len(group) > 0 {
							grpname = group[0].Groupname
						}
						grperr, user := dataAccess.Getusername(tz.Mstuserid)
						if grperr != nil {
							return 0, false, grperr, "Something Went Wrong"
						}
						if len(user) > 0 {
							username = user[0].Loginname
							name = user[0].Username
						}
						var count int64 = 0
						err, S := dataAccess.Gethopcount(id)
						if err != nil {
							logger.Log.Print("\n Error in hop count for mail sending")
							log.Print("\n Error in hop count for mail sending")
						} else {
							for i := 0; i < len(S)-1; i++ {
								if S[i] != S[i+1] {
									count = count + 1
								}
							}
						}
						stagEntity := entities.StagingUtilityEntity{}
						stagEntity.Assignedgroupid = tz.Mstgroupid
						stagEntity.Assignedgroup = grpname
						stagEntity.Assigneduser = name
						stagEntity.Assignedloginname = username
						stagEntity.Assigneduserid = tz.Mstuserid
						stagEntity.Lastuser = loggedusername
						stagEntity.Lastuserid = tz.Userid
						stagEntity.Reassigncount = count
						stagEntity.Recordid = tz.Transactionid
						stgerr := dao.Updatestagingdetails(&stagEntity, tx)
						if stgerr != nil {
							tx.Rollback()
							return 0, false, stgerr, "Something Went Wrong"
						}
						err = tx.Commit()
						if err != nil {
							log.Print("MoveWorkflow  Statement Commit error", err)
							logger.Log.Print("MoveWorkflow  Statement Commit error", err)
							return 0, false, err, ""
						}
						postBody, _ := json.Marshal(map[string]int64{"clientid": tz.Clientid, "mstorgnhirarchyid": tz.Mstorgnhirarchyid, "recordid": tz.Transactionid, "reordstatusid": tz.Currentstateid, "userid": tz.Userid, "usergroupid": tz.Createdgroupid, "changestatus": tz.Changestatus})

						responseBody := bytes.NewBuffer(postBody)
						logger.Log.Println("changestatus,", tz.Changestatus, tz.Transactionid)
						logger.Log.Println("postBody       --->", responseBody)
						resp, err := http.Post(config.RECORD_URL+"/updaterecordstatus", "application/json", responseBody)
						if err != nil {
							logger.Log.Println("An Error Occured --->", err)
							return 0, false, err, "Something went wrong"
						}
						defer resp.Body.Close()
						//Read the response body
						body, err := ioutil.ReadAll(resp.Body)
						if err != nil {
							logger.Log.Println("response body ------> ", err)
							return 0, false, err, "Something went wrong"

						}
						sb := string(body)
						logger.Log.Println("sb body value is --->", sb)
						return recordVal, true, nil, ""
					} else {
						return 0, false, trerr, "No Staging Record is mapped for this record id."
					}

				} else {
					return 0, false, trerr, "No Record is mapped for this record id."
				}
			}
		}
	}
}
func Insertprocess(tz *entities.Workflowentity) (int64, bool, error, string) {
	log.Println("In side model")
	db, err := config.ConnectMySqlDb()
	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	savemst := dao.DbConn{DB: db}
	values, err1 := savemst.Getprocessdetails(tz)
	if err1 != nil {
		return 0, false, err1, "Something Went Wrong"
	}
	if len(values) == 0 {
		id, err := savemst.Insertprocess(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		return id, true, err, ""
	} else {
		tz.Id = values[0].Id
		err = savemst.Updateprocessdetails(tz)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		return 0, true, err, ""
	}
}
func Getprocessdetails(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.WorkflowResponseEntity{}
	db, err := config.ConnectMySqlDb()

	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Getprocessdetails(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	return values, true, err, ""
}
func Gettransitionstatedetails(tz *entities.Workflowentity) (entities.WorkflowStateResponseEntity, bool, error, string) {
	log.Println("In side model")
	t := entities.WorkflowStateResponseEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	if len(tz.Transitionids) > 0 {
		tz.Transitionid = tz.Transitionids[0]
		details, err2 := dataAccess.Gettransitionstatedetails(tz)
		if err2 != nil {
			return t, false, err2, "Something Went Wrong"
		}
		/*activities, err3 := dataAccess.Getactivitybytransition(tz)
		if err3 != nil {
			return t, false, err3, "Something Went Wrong"
		}
		for _, activity := range activities {
			t.Activityids = append(t.Activityids, activity.Id)
		}*/
		if len(details) > 0 && details[0].Mstuserid > -1 {
			groupdetails, err2 := dataAccess.Gettransitiongroup(tz)
			if err2 != nil {
				return t, false, err2, "Something Went Wrong"
			}
			t.Groups = groupdetails
			return t, true, nil, ""
		} else {
			t.Groups = details
			return t, true, nil, ""
		}
	} else {
		return t, false, nil, "Problem with this state.Please remove and recreate this state"
	}
}
func Gettransitiongroupdetails(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.WorkflowResponseEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	groupdetails, err2 := dataAccess.Gettransitiongroup(tz)
	if err2 != nil {
		return t, false, err2, "Something Went Wrong"
	}

	return groupdetails, true, nil, ""
}
func Checkprocessdelete(tz *entities.Workflowentity) ([]entities.WorkflowResponseEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.WorkflowResponseEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Checkprocessdelete(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	if len(values) > 0 {
		return values, true, nil, ""
	} else {
		return values, true, nil, ""
	}
}
func Createtransition(tw *entities.Workflowentity) (int64, bool, error, string) {
	log.Println("In side model")
	dbcon, err := config.ConnectMySqlDb()
	if err != nil {
		dbcon.Close()
		logger.Log.Println("Database connection failure", err)
		log.Println("Database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer dbcon.Close()
	tx, err := dbcon.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return 0, false, err, "Something Went Wrong"
	}

	dataAccess := dao.DbConn{DB: dbcon}
	//states, err := dataAccess.Checkduplicatestate(tw)
	//if len(states) == 0 {
	id, err := dao.Createtransition(tw, tx)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	if len(tw.Transitionids) > 0 {
		tw.Transitionid = tw.Transitionids[0]
		details, err2 := dataAccess.Getalltransitionstatedetails(tw)
		if err2 != nil {
			return 0, false, err2, "Something Went Wrong"
		}
		if len(details) > 0 {
			for _, val := range details {
				tw.Recorddifftypeid = val.Recorddifftypeid
				tw.Recorddiffid = val.Recorddiffid
				tw.Mstgroupid = val.Mstgroupid
				tw.Mstuserid = val.Mstuserid
				tw.Transitionid = id
				_, err := dao.Inserttransitiondetails(tw, tx)
				if err != nil {
					tx.Rollback()
					return 0, false, err, "Something Went Wrong"
				}
			}
			err = tx.Commit()
			if err != nil {
				log.Print("Createtransition  Statement Commit error", err)
				logger.Log.Print("Createtransition  Statement Commit error", err)
				return 0, false, err, ""
			}

			return id, true, nil, ""
		} else {
			err = tx.Commit()
			if err != nil {
				log.Print("Createtransition  Statement Commit error", err)
				logger.Log.Print("Createtransition  Statement Commit error", err)
				return 0, false, err, ""
			}
			return id, true, nil, ""
		}
	} else {
		err = tx.Commit()
		if err != nil {
			log.Print("Createtransition  Statement Commit error", err)
			logger.Log.Print("Createtransition  Statement Commit error", err)
			return 0, false, err, ""
		}
		return id, true, nil, ""
	}
	//} else {
	//	return 0, false, nil, "Transition path already exist"
	//}
}
func Upserttransitiondetails(tw *entities.Workflowentity) (int64, bool, error, string) {
	log.Println("In side model")
	dbcon, err := config.ConnectMySqlDb()
	if err != nil {
		dbcon.Close()
		logger.Log.Println("Database connection failure", err)
		log.Println("Database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer dbcon.Close()
	tx, err := dbcon.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return 0, false, err, "Something Went Wrong"
	}
	var ids string = ""
	for i, transition := range tw.Transitionids {
		if i > 0 {
			ids += ","
		}
		ids += strconv.Itoa(int(transition))
	}
	err = dao.Deletetransitiondetails(tw, tx, ids)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	/*err = dao.Deleteactivitydetails(tw, tx, ids)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}*/
	for _, tid := range tw.Transitionids {
		tw.Transitionid = tid
		for _, user := range tw.Users {
			tw.Mstuserid = user.Mstuserid
			tw.Mstgroupid = user.Mstgroupid
			_, err := dao.Inserttransitiondetails(tw, tx)
			if err != nil {
				tx.Rollback()
				return 0, false, err, "Something Went Wrong"
			}
		}
		/*for _, activity := range tw.Activities {
			tw.Activity = activity
			_, err := dao.Insertstateactivity(tw, tx)
			if err != nil {
				tx.Rollback()
				return 0, false, err, "Something Went Wrong"
			}
		}*/
	}
	err = tx.Commit()
	if err != nil {
		log.Print("Upserttransitiondetails  Statement Commit error", err)
		logger.Log.Print("Upserttransitiondetails  Statement Commit error", err)
		return 0, false, err, ""
	}
	return 0, true, nil, ""
}
func Deletetransitionstate(tw *entities.Workflowentity) (int64, bool, error, string) {
	dbcon, err := config.ConnectMySqlDb()
	if err != nil {
		dbcon.Close()
		logger.Log.Println("Database connection failure", err)
		log.Println("Database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer dbcon.Close()
	tx, err := dbcon.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return 0, false, err, "Something Went Wrong"
	}
	var ids string = ""
	for i, transition := range tw.Transitionids {
		if i > 0 {
			ids += ","
		}
		ids += strconv.Itoa(int(transition))
	}
	err = dao.Deletetransitiondetails(tw, tx, ids)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	err = dao.Deleteactivitydetails(tw, tx, ids)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	err = dao.Deletetransition(tw, tx, ids)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	err = tx.Commit()
	if err != nil {
		log.Print("Deletetransitionstate  Statement Commit error", err)
		logger.Log.Print("Deletetransitionstate  Statement Commit error", err)
		return 0, false, err, ""
	}
	return 0, true, nil, ""
}
func Getstatedetails(tz *entities.Workflowentity) ([]entities.TransactionRespEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.TransactionRespEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Getstatedetails(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	logger.Log.Println(values)
	if len(values) > 0 {
		if values[0].Grplevel == 1 {
			tz.Transactionid = tz.Recordid
			err, requestIds := dataAccess.GetRequestIdbyRecordId(tz)
			if err != nil {
				return t, false, err, "Something Went Wrong"
			}
			var requestid int64
			if len(requestIds) > 0 {
				requestid = requestIds[0].Requestid
			}
			details, err := dataAccess.Getlastactioner(requestid, values[0].Groupid)
			if err != nil {
				return t, false, err, "Something Went Wrong"
			}
			if len(details) > 0 {
				values[0].Lastgroupname = details[0].Lastgroupname
				values[0].Lastusername = details[0].Lastusername
			}
		}
		return values, true, err, ""
	} else {
		return t, false, nil, "State details not found."
	}
}
func Getnextstatedetails(tz *entities.Workflowentity) ([]entities.TransactionRespEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.TransactionRespEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}

	err, requestIds := dataAccess.GetRequestIdbyRecordId(tz)
	if err != nil {
		return t, false, err, "Something Went Wrong"
	}
	var requestid int64
	if len(requestIds) > 0 {
		requestid = requestIds[0].Requestid
	}
	ismanual, err := dataAccess.Ismanualselection(requestid)
	if err != nil {
		return t, false, err, "Something Went Wrong"
	}
	if !ismanual {
		details, err1 := dataAccess.Getprocessdetails(tz)
		if err1 != nil {
			return nil, false, err1, "Something Went Wrong"
		}
		if len(details) == 0 {
			return nil, false, nil, "Template details not defined"
		}
		in := []byte(details[0].Detailsjson)
		var detailsEntity []entities.ProcessdetailsEntity
		err = json.Unmarshal(in, &detailsEntity)
		if err != nil {
			logger.Log.Println(err)
			log.Print(err)
			return nil, false, err1, "Something Went Wrong"
		}
		var outstates []int64
		matched := false
		for i, ent := range detailsEntity {
			for _, in := range ent.Instate {
				if in == tz.Transitionid {
					outstates = detailsEntity[i].OutState
					matched = true
					break
				}
			}
			if matched {
				break
			}
		}

		log.Println(outstates)
		logger.Log.Println("outstates ", outstates)
		if len(outstates) > 0 {
			var ids string = ""
			for i, state := range outstates {
				if i > 0 {
					ids += ","
				}
				ids += strconv.Itoa(int(state))
			}
			values, err1 := dataAccess.Getnextstatedetails(tz, ids)
			if err1 != nil {
				return t, false, err1, "Something Went Wrong"
			}
			return values, true, err, ""
		} else {
			return nil, false, nil, "No more state defined."
		}
	} else {
		return t, false, err, ""
	}
}
func Gettransitionbyprocess(tz *entities.Workflowentity) ([]entities.WorkflowTransitionEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.WorkflowTransitionEntity{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Gettransitionbyprocess(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	return values, true, err, ""
}
func Changerecordgroup(tw *entities.Workflowentity) (int64, bool, error, string) {
	log.Println("In side model")
	logger.Log.Println("Changerecordgroup:", tw.Transactionid, tw.Mstgroupid, tw.Mstuserid, tw.Createdgroupid, tw.Samegroup)
	dbcon, err := config.ConnectMySqlDb()
	if err != nil {
		dbcon.Close()
		logger.Log.Println("Database connection failure", err)
		log.Println("Database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer dbcon.Close()
	dataAccess := dao.DbConn{DB: dbcon}
	err, requestIds := dataAccess.GetRequestIdbyRecordId(tw)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	var requestid int64
	if len(requestIds) > 0 {
		requestid = requestIds[0].Requestid
	}
	requestHistory, err := dataAccess.Fetchhistorybyrequestid(requestid)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	tw.Clientid = requestHistory[0].Clientid
	tw.Mstorgnhirarchyid = requestHistory[0].Mstorgnhirarchyid
	tw.Processid = requestHistory[0].Processid
	tw.Createduserid = requestHistory[0].Createduserid
	tw.Currentstateid = requestHistory[0].Currentstateid
	tw.Transitionid = requestHistory[0].Transitionid
	tw.Manualstateselection = requestHistory[0].Manualstateselection
	prevgroup := requestHistory[0].Groupname
	prevuser := requestHistory[0].Loginname
	grperr, group := dataAccess.Getgroupname(tw.Mstgroupid)
	if grperr != nil {
		return 0, false, grperr, "Something Went Wrong"
	}
	var grpname string
	var username string
	var name string
	var logstring string
	if len(group) > 0 {
		grpname = group[0].Groupname
	}
	if tw.Mstuserid > 0 {
		grperr, user := dataAccess.Getusername(tw.Mstuserid)
		if grperr != nil {
			return 0, false, grperr, "Something Went Wrong"
		}
		if len(user) > 0 {
			username = user[0].Loginname
			name = user[0].Username
		}
		if prevuser == "" {
			logstring = "From Group: " + prevgroup + " To Group: " + grpname + " User:" + username
		} else {
			logstring = "From Group: " + prevgroup + " User: " + prevuser + " To Group: " + grpname + " User:" + username
		}
	} else {
		if prevuser == "" {
			logstring = "From Group: " + prevgroup + " To Group: " + grpname
		} else {
			logstring = "From Group: " + prevgroup + " User: " + prevuser + " To Group: " + grpname
		}
	}
	tx, err := dbcon.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return 0, false, err, "Something Went Wrong"
	}

	err = dao.Updaterequestgroup(tw, tx, requestid)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	latestTime := time.Now().Unix()
	rec := entities.TransactionEntity{}
	histerr := dao.InsertProcessHistoryRequest(tw, tx, latestTime, rec, requestid)
	if histerr != nil {
		tx.Rollback()
		return 0, false, histerr, "Something Went Wrong"
	}
	log.Print("---->messsage:", logstring)
	logger.Log.Print("---->messsage:", logstring)
	var activityseq int64
	var eventnotificationid int64
	if tw.Samegroup {
		activityseq = 12
		eventnotificationid = 10
	} else {
		activityseq = 2
		eventnotificationid = 11
	}
	err = utility.InsertActivityLogs(tx, tw.Clientid, tw.Mstorgnhirarchyid, tw.Transactionid, activityseq, logstring, tw.Userid, tw.Createdgroupid)
	if err != nil {
		tx.Rollback()
		return 0, false, err, "Something Went Wrong"
	}
	var count int64 = 0
	err, S := dataAccess.Gethopcount(requestid)
	if err != nil {
		logger.Log.Print("\n Error in hop count for mail sending")
		log.Print("\n Error in hop count for mail sending")
	} else {
		for i := 0; i < len(S)-1; i++ {
			if S[i] != S[i+1] {
				count = count + 1
			}
		}
	}
	loggedusername := ""
	uerr, users := dataAccess.Getusername(tw.Userid)
	if uerr != nil {
		return 0, false, uerr, "Something Went Wrong"
	}
	if len(users) > 0 {
		loggedusername = users[0].Username
	}
	stagEntity := entities.StagingUtilityEntity{}
	stagEntity.Assignedgroupid = tw.Mstgroupid
	stagEntity.Assignedgroup = grpname
	stagEntity.Assigneduser = name
	stagEntity.Assignedloginname = username
	stagEntity.Assigneduserid = tw.Mstuserid
	stagEntity.Lastuser = loggedusername
	stagEntity.Lastuserid = tw.Userid
	stagEntity.Reassigncount = count
	stagEntity.Recordid = tw.Transactionid
	stgerr := dao.Updatestagingdetails(&stagEntity, tx)
	if stgerr != nil {
		tx.Rollback()
		return 0, false, stgerr, "Something Went Wrong"
	}
	err = tx.Commit()
	if err != nil {
		logger.Log.Print("Deletetransitionstate  Statement Commit error", err)
		return 0, false, err, ""
	}

	/**
	Sending mail for group or user change
	*/
	postBody, _ := json.Marshal(map[string]int64{"clientid": tw.Clientid, "mstorgnhirarchyid": tw.Mstorgnhirarchyid, "recordid": tw.Transactionid, "eventnotificationid": eventnotificationid, "channeltype": 1})
	responseBody := bytes.NewBuffer(postBody)
	logger.Log.Println("postBody  change group     --->", responseBody)
	resp, err := http.Post(config.EMAIL_URL+"/sendnotification", "application/json", responseBody)
	if err != nil {
		logger.Log.Println("An Error Occured --->", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.Log.Println("response body ------> ", err)
	}
	sb := string(body)
	logger.Log.Println("sb change group body value is --->", sb)

	if !tw.Samegroup {
		/**
		Sending mail for hop count change
		*/
		postBody, _ := json.Marshal(map[string]interface{}{"clientid": tw.Clientid, "mstorgnhirarchyid": tw.Mstorgnhirarchyid, "recordid": tw.Transactionid, "eventnotificationid": 6, "channeltype": 1, "hopcount": count, "lastgroupname": grpname, "lasttolastgroupname": prevgroup})
		responseBody := bytes.NewBuffer(postBody)
		logger.Log.Println("postBody  hop count change  --->", responseBody)
		resp, err := http.Post(config.EMAIL_URL+"/sendnotification", "application/json", responseBody)
		if err != nil {
			logger.Log.Println("An Error Occured --->", err)
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			logger.Log.Println("response body ------> ", err)
		}
		sb := string(body)
		logger.Log.Println("sb change group body value is --->", sb)

	}
	err2, childids := dataAccess.Getchildticket(tw)
	if err2 != nil {
		return 0, false, err2, "Something Went Wrong"
	} else {
		if len(childids) > 0 {
			tw.Parentid = tw.Transactionid
			tw.Childids = childids
			seq, _, err := dataAccess.Getdiffseqno(tw.Parentid, 1)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			if seq != config.SR_SEQ && seq != config.CR_SEQ {
				_, success, _, msg := Updatechildstatus(tw)
				logger.Log.Print("\n Update child status after group change:", success, msg)
				log.Print("\n Update child status after group change:", success, msg)
			}
		}
		return 0, true, nil, ""
	}

}
func Updatechildstatus(tz *entities.Workflowentity) (int64, bool, error, string) {
	logger.Log.Print("Updatechildstatus:", tz.Parentid, tz.Childids)
	log.Print("Updatechildstatus:", tz.Parentid, tz.Childids)

	db, err := config.ConnectMySqlDb()

	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	tz.Transactionid = tz.Parentid
	err, requestIds := dataAccess.GetRequestIdbyRecordId(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	var parentid int64
	if len(requestIds) > 0 {
		parentid = requestIds[0].Requestid
	} else {
		return 0, false, nil, "Parent Ticket is not mapped with process"
	}

	err, requestDetails := dataAccess.Getprocessrequestdetails(parentid)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if len(requestDetails) > 0 {
		tx, err := db.Begin()
		if err != nil {
			logger.Log.Println("Transaction creation error.", err)
			return 0, false, err, "Something Went Wrong"
		}
		for _, childid := range tz.Childids {
			tz.Transactionid = childid
			err, childRequestId := dataAccess.GetRequestIdbyRecordId(tz)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			var id int64
			var isFirstStep bool
			if len(childRequestId) > 0 {
				id = childRequestId[0].Requestid
				isFirstStep = false
			} else {
				isFirstStep = true
			}
			err, childRequestDetails := dataAccess.Getprocessrequestdetails(id)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			if len(childRequestDetails) > 0 {
				requestDetails[0].Processid = childRequestDetails[0].Processid
				requestDetails[0].Createduserid = childRequestDetails[0].Createduserid
				requestDetails[0].Transactionid = childid
				requestDetails[0].Manualstateselection = 0
				/** Activity Log **/
				prevgroup := childRequestDetails[0].Groupname
				prevuser := childRequestDetails[0].Loginname
				grperr, group := dataAccess.Getgroupname(requestDetails[0].Mstgroupid)
				if grperr != nil {
					return 0, false, grperr, "Something Went Wrong"
				}
				var grpname string
				var username string
				var logstring string
				if len(group) > 0 {
					grpname = group[0].Groupname
				}
				if childRequestDetails[0].Mstuserid > 0 {
					grperr, user := dataAccess.Getusername(requestDetails[0].Mstuserid)
					if grperr != nil {
						return 0, false, grperr, "Something Went Wrong"
					}
					if len(user) > 0 {
						username = user[0].Loginname
					}
					logstring = "From Group: " + prevgroup + " User: " + prevuser + " To Group: " + grpname + " User:" + username
				} else {
					logstring = "From Group: " + prevgroup + " User: " + prevuser + " To Group: " + grpname
				}
				logger.Log.Print("\n\nlogstring:->" + logstring)
				stageDetails, trerr := dataAccess.GetLatestTransactionStageDetails(&requestDetails[0])
				if trerr != nil {
					return 0, false, trerr, "Something Went Wrong"
				}
				if len(stageDetails) > 0 {
					tran := entities.TransactionEntity{}
					tran.Recordstageid = stageDetails[0].Recordstageid
					tran.Recordtitle = childRequestDetails[0].Recordtitle

					_, recerr := dao.UpsertProcessDetails(tx, &requestDetails[0], tran, isFirstStep, id)
					if recerr != nil {
						logger.Log.Println("Role back error.")
						log.Println("Role back error.")
						tx.Rollback()
						return 0, false, recerr, "Something Went Wrong"
					}
					var activityseq int64
					if tz.Samegroup {
						activityseq = 12
					} else {
						activityseq = 2
					}
					logger.Log.Print("\n\n activity log:->", requestDetails[0].Clientid, requestDetails[0].Mstorgnhirarchyid, tz.Transactionid, activityseq, logstring, tz.Userid, tz.Createdgroupid)
					err = utility.InsertActivityLogs(tx, requestDetails[0].Clientid, requestDetails[0].Mstorgnhirarchyid, tz.Transactionid, activityseq, logstring, tz.Userid, tz.Createdgroupid)
				} else {
					return 0, false, nil, "No Staging Record is mapped for this record id."
				}
			} else {
				return 0, false, nil, "No process details mapped with child ticket."
			}
		}
		err = tx.Commit()
		if err != nil {
			log.Print("Updatechildstatus  Statement Commit error", err)
			logger.Log.Print("Updatechildstatus  Statement Commit error", err)
			return 0, false, err, ""
		}
		return 0, true, nil, ""
	} else {
		return 0, false, nil, "Parent Process Details Not Found"
	}
}
func Updatetaskstatus(tz *entities.Workflowentity) (int64, bool, error, string) {
	logger.Log.Print("Updatetaskstatus:", tz.Parentid, tz.Childids, tz.Createdgroupid, tz.Userid)
	log.Print("Updatetaskstatus:", tz.Parentid, tz.Childids, tz.Createdgroupid, tz.Userid)

	db, err := config.ConnectMySqlDb()

	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	tz.Transactionid = tz.Parentid
	typeseq, typeid, err := dataAccess.Getdiffseqno(tz.Parentid, 1)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	var statusid int64 = 0
	var statusseq int64 = 0
	var parclientid int64 = 0
	var parorgid int64 = 0
	err, parRequestId := dataAccess.GetRequestIdbyRecordId(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	var parid int64
	if len(parRequestId) > 0 {
		parid = parRequestId[0].Requestid
	} else {
		return 0, false, err, "Parent ticket details not mapped with process table"
	}
	err, parrequestDetails := dataAccess.Getprocessrequestdetails(parid)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if len(parrequestDetails) > 0 {
		parclientid = parrequestDetails[0].Clientid
		parorgid = parrequestDetails[0].Mstorgnhirarchyid
	} else {
		return 0, false, err, "Parent ticket details not found"
	}
	if typeseq == config.STASK_SEQ || typeseq == config.CTASK_SEQ {

		heighesttaskprios, err := dataAccess.Gethighestchildpriority(parclientid, parorgid, tz.Childids[0], typeid)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		if len(heighesttaskprios) > 0 {
			logger.Log.Println("heighesttaskprio status ", heighesttaskprios[0].Seqno)
			statusid = heighesttaskprios[0].Seqno
			logger.Log.Print("statusid :", statusid)
		} else {
			return 0, false, err, "Task status priority not mapped"
		}

	} else {
		innerstatusseq, innerstatusid, err := dataAccess.Getdiffseqno(tz.Parentid, 2)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		}
		statusid = innerstatusid
		statusseq = innerstatusseq
		logger.Log.Print("statusid :", statusid, statusseq)
	}

	//canchangestatus := true
	for _, childid := range tz.Childids {
		canProceed := true
		var currentstateid int64 = 0
		_, childtypeid, err := dataAccess.Getdiffseqno(childid, 1)
		if err != nil {
			canProceed = false
		} else {
			if statusseq == config.CANCEL_SEQ {
				logger.Log.Println("Parent is canceled:")
				childseq, _, err := dataAccess.Getdiffseqno(childid, 2)
				if err != nil {
					canProceed = false
				} else {
					currentstate, err := dataAccess.Getstatebystatusseq(parclientid, parorgid, childseq)
					if err != nil {
						canProceed = false
					} else {
						if len(currentstate) > 0 {
							currentstateid = currentstate[0].ID
							logger.Log.Println("cancel / close currentstateid:", currentstateid)
						} else {
							canProceed = false
							logger.Log.Println("No status  mapped with State")
						}
					}
				}
			} else {
				taskstates, err := dataAccess.Getstateidbyfromdiff(statusid, typeid, childtypeid)
				if err != nil {
					return 0, false, err, "Something Went Wrong"
				}
				if len(taskstates) == 0 {
					canProceed = false
					logger.Log.Println("Child status not mapped with Parent status")
				} else {
					currentstateid = taskstates[0].Id
				}
			}
		}
		if canProceed {
			tz.Transactionid = childid
			err, childRequestId := dataAccess.GetRequestIdbyRecordId(tz)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			var id int64
			if len(childRequestId) > 0 {
				id = childRequestId[0].Requestid
			} else {
			}
			err, requestDetails := dataAccess.Getprocessrequestdetails(id)
			if err != nil {
				return 0, false, err, "Something Went Wrong"
			}
			if len(requestDetails) > 0 {
				if typeseq == config.STASK_SEQ || typeseq == config.CTASK_SEQ {
					requestDetails[0].Changestatus = 1
				}
				logger.Log.Println("Previous:", requestDetails[0].Currentstateid)
				logger.Log.Println("Current:", currentstateid)
				if requestDetails[0].Currentstateid != currentstateid {
					requestDetails[0].Previousstateid = requestDetails[0].Currentstateid
					requestDetails[0].Currentstateid = currentstateid
					requestDetails[0].Transactionid = childid
					requestDetails[0].Manualstateselection = 0
					workingdifftype, workingid, err := dataAccess.Getworkingdiffbytid(childid)
					if err != nil {
						return 0, false, err, "Something Went Wrong"
					}
					requestDetails[0].Recorddifftypeid = workingdifftype
					requestDetails[0].Recorddiffid = workingid
					requestDetails[0].Createdgroupid = tz.Createdgroupid
					requestDetails[0].Mstgroupid = tz.Createdgroupid
					requestDetails[0].Mstuserid = tz.Userid
					requestDetails[0].Userid = tz.Userid
					requestDetails[0].Transitionid = 0
					_, success, err, msg := MoveWorkflow(&requestDetails[0])
					if err != nil {
						log.Print("Error in task status change ", childid)
						logger.Log.Print("Error in task status change ", childid)
					} else {
						log.Print("\n\n--------", success, msg)
						logger.Log.Print("\n\n--------", success, msg)
					}
				} else {
					return 0, false, nil, "Current and Previous status are same"
				}

			} else {
				return 0, false, nil, "No process details mapped with child ticket."
			}
		} else {
			return 0, false, nil, ""
		}
	}
	return 0, true, nil, ""
}

func Gethopcount(tz *entities.Workflowentity) (int64, bool, error, string) {
	logger.Log.Print("Gethopcount:", tz.Transitionid)
	var count int64 = 0
	db, err := config.ConnectMySqlDb()

	if err != nil {
		logger.Log.Println("database connection failure", err)
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	err, requestIds := dataAccess.GetRequestIdbyRecordId(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if len(requestIds) > 0 {
		err, S := dataAccess.Gethopcount(requestIds[0].Requestid)
		if err != nil {
			return 0, false, err, "Something Went Wrong"
		} else {
			for i := 0; i < len(S)-1; i++ {
				if S[i] != S[i+1] {
					count = count + 1
				}
			}
			return count, true, nil, ""
		}
	} else {
		return 0, false, nil, "Ticket is not mapped with process"
	}
}
