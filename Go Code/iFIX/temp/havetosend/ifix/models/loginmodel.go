package models

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"github.com/disintegration/imaging"
	"github.com/pquerna/otp/totp"
	"iFIX/ifix/config"
	"iFIX/ifix/dao"
	"iFIX/ifix/entities"
	"iFIX/ifix/logger"
	"iFIX/ifix/utility"
	"image/png"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"
)
var lock = &sync.Mutex{}
func Changepassword(tz *entities.LoginEntityReq) (int64, bool, error, string) {
	log.Println("In side model")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Fetchpasswordbyid(tz)
	if err1 != nil {
		return 0, false, err1, "Something Went Wrong"
	}
	if len(values) > 0 {
		pwdMatch := utility.ComparePasswords(values[0].Password, []byte(tz.Oldpassword))
		if pwdMatch {
			tz.Password = utility.HashAndSalt([]byte(tz.Password))
			errup := dataAccess.Updatepassword(tz)
			if errup != nil {
				return 0, false, errup, "Something Went Wrong"
			} else {
				return 1, true, nil, ""
			}
		} else {
			return 0, false, nil, "Old password not matched."
		}
	} else {
		return 0, false, nil, "User details not found"
	}
}
func Validateusertoken(tz *entities.LoginEntityResp) (int64, bool, error, string) {
	log.Println("In side model")
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return 0, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	err, values := dataAccess.Validateusertoken(tz)
	if err != nil {
		return 0, false, err, "Something Went Wrong"
	}
	if len(values) > 0 {
		return 1, true, err, ""
	} else {
		return 0, false, nil, "Token not found for user"
	}
}
func Generatetoken(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	t := []entities.LoginEntityResp{}
	db, err := config.ConnectMySqlDb()
	defer db.Close()
	if err != nil {
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.Checkuser(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	if len(values) > 0 {
		tx, err := db.Begin()

		value := []entities.LoginEntityReq{}
		val := entities.LoginEntityReq{}
		val.ID = values[0].Userid
		value = append(value, val)
		tokenString, err := Createandinserttoken(value, tx)
		if err != nil {
			tx.Rollback()
			return nil, false, err, "Something Went Wrong"
		}
		err = tx.Commit()
		if err != nil {
			logger.Log.Print("Token  Statement Commit error", err)
			return t, false, err, ""
		}
		values[0].Token = tokenString
		return values, true, nil, ""
	} else {
		return t, false, nil, "User details not found"
	}
}

func Createandinserttoken(values []entities.LoginEntityReq, tx *sql.Tx) (string, error) {
	tokenString, tokerr := utility.CreateToken(values[0].ID)
	if tokerr != nil {
		log.Print("token create error", tokerr)
		logger.Log.Print("token create error", tokerr)
		return "", tokerr
	}
	err := dao.Deletetoken(tx, values[0].ID)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	err = dao.Inserttoken(tx, values[0].ID, tokenString)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	return tokenString, nil
}
func VerifyTOTP(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	logger.Log.Println("====================================================================VerifyTOTP========================================")

	firstTimeTOPTObject := []entities.LoginEntityResp{}
	val := entities.LoginEntityResp{}
	db, err := config.ConnectMySqlDb()

	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	values, keyerror := dataAccess.Login(tz)
	if keyerror != nil {
		log.Println("Unable to fetch secretkey", keyerror)
		return nil, false, err, "Something Went Wrong"
	}
	logger.Log.Println("===========values==============", values)
	logger.Log.Println("TOTP=====>", tz.Totp)
	logger.Log.Println("SecretKey====>", values[0].Secretkey)
	ok := totp.Validate(string(tz.Totp), values[0].Secretkey)
	if ok {
		logger.Log.Print("TOTP Validated Successfully")

	} else {
		return nil, false, nil, "Sorry......Invalid OTP"
	}
	updateErr := dataAccess.UpdateUserMFA(tz)
	if updateErr != nil {
		logger.Log.Println(updateErr)
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With Update MFA"
	}
	urls, err1 := dataAccess.Geturlbytype(tz, "logout")
	if err1 != nil {
		logger.Log.Println(err1)
		return nil, false, err1, "Something Went Wrong"
	}
	val.Url = urls[0].Url
	firstTimeTOPTObject = append(firstTimeTOPTObject, val)

	return firstTimeTOPTObject, true, nil, "You have registered for Two Factor Authentication Successfully. Please Login again..."
}
func FetchMFA(values []entities.LoginEntityReq, db *sql.DB) ([]entities.LoginEntityResp, bool, error, string) {
	firstTimeTOPTObject := []entities.LoginEntityResp{}
	val := entities.LoginEntityResp{}
	val.Clientid = values[0].Clientid
	val.Userid = values[0].ID
	val.OrgnTypeId = values[0].OrgnTypeId
	val.Mstorgnhirarchyid = values[0].Mstorgnhirarchyid
	dataAccess := dao.DbConn{DB: db}
	urls, err1 := dataAccess.Geturlbytype(&values[0], "mfavalidation")
	if err1 != nil {
		logger.Log.Println(err1)
		return nil, false, err1, "Something Went Wrong"
	}
	val.Url = urls[0].Url
	firstTimeTOPTObject = append(firstTimeTOPTObject, val)
	logger.Log.Println("===========firstTimeTOPTObject==============", firstTimeTOPTObject)

	return firstTimeTOPTObject, true, nil, "You Organisation Has Enabled Two Factor Authentication...Please Register for Two Factor Authentication"

}
func EnableTOTEenable(values []entities.LoginEntityReq, db *sql.DB) ([]entities.LoginEntityResp, bool, error, string) {
	logger.Log.Println("====================================================================EnableTOTEenable========================================")
	firstTimeTOPTObject := []entities.LoginEntityResp{}
	val := entities.LoginEntityResp{}
	val.Clientid = values[0].Clientid
	val.Userid = values[0].ID
	val.OrgnTypeId = values[0].OrgnTypeId
	val.Mstorgnhirarchyid = values[0].Mstorgnhirarchyid

	dataAccess := dao.DbConn{DB: db}
	authURI, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "iFIX",
		AccountName: values[0].UserEmail,
	})
	if err != nil {
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With MFA"
	}
	contextPath, contextPatherr := os.Getwd()
	props, err := utility.ReadPropertiesFile(contextPath + "/ifix/resource/application.properties")
	if err != nil {
		logger.Log.Println(err)
		return firstTimeTOPTObject, false, err, "Unable to Get URL From utility.ReadPropertiesFile"
	}
	if contextPatherr != nil {
		logger.Log.Println(contextPatherr)
		return firstTimeTOPTObject, false, contextPatherr, "Contextpath ERROR"
	}
	//tx, err := db.Begin()
	secretkey := authURI.Secret()
	updateErr := dataAccess.UpdateMstClientUser(&values[0], authURI.String(), secretkey)
	if updateErr != nil {
		logger.Log.Println(updateErr)
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With Update MFA"
	}
	var buf bytes.Buffer
	img, err := authURI.Image(300, 300)
	imgerr := png.Encode(&buf, img)

	if imgerr != nil {
		logger.Log.Println(imgerr)
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With Update MFA"
	}
	filePath := contextPath + "/ifix/resource/downloads/QRImgGA.png"
	imageSaveErr := imaging.Save(img, filePath)
	if imageSaveErr != nil {
		logger.Log.Println(imgerr)
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With QR MFA"
	}
	OriginalFileName, UploadedFileName, err := utility.FileUploadAPICall(values[0].Clientid, values[0].Mstorgnhirarchyid, props["fileUploadUrl"], filePath)
	logger.Log.Println("===========OriginalFileName==============", OriginalFileName)
	logger.Log.Println("===========UploadedFileName==============", UploadedFileName)
	if err != nil {
		logger.Log.Println("Error while downloading", "-", err)
		return firstTimeTOPTObject, false, nil, "Something Went Wrong With QR MFA"
	}
	val.OriginalFileName = OriginalFileName
	val.UploadedFileName = UploadedFileName
	urls, err1 := dataAccess.Geturlbytype(&values[0], "mfaregistration")
	if err1 != nil {
		return nil, false, err1, "Something Went Wrong"
	}
	logger.Log.Println("===========urls==============", urls[0].Url)
	val.Url = urls[0].Url
	//fmt.Println(t.OriginalFileName, t.UploadedFileName)
	//return OriginalFileName, UploadedFileName, true, nil, ""

	firstTimeTOPTObject = append(firstTimeTOPTObject, val)
	logger.Log.Println("===========firstTimeTOPTObject==============", firstTimeTOPTObject)
	return firstTimeTOPTObject, true, nil, "You Organisation Has Enabled Two Factor Authentication...Please Register for Two Factor Authentication"
}
func fetchlogindetails(values []entities.LoginEntityReq, db *sql.DB, tokenString string) ([]entities.LoginEntityResp, bool, error, string) {
	val := entities.LoginEntityResp{}
	t := []entities.LoginEntityResp{}
	dataAccess := dao.DbConn{DB: db}

	if values[0].Clientid == 1 {
		val.Clientid = values[0].Clientid
		val.Mstorgnhirarchyid = values[0].Mstorgnhirarchyid
		val.OrgnTypeId = values[0].OrgnTypeId
		val.Userid = values[0].ID
		val.Token = tokenString
		t = append(t, val)
		return t, true, nil, ""
	} else {
		roles, err1 := dataAccess.GetRolebyUserId(&values[0])
		if err1 != nil {
			return t, false, err1, "Something Went Wrong"
		} else {
			if len(roles) == 0 {
				return t, false, nil, "User is not mapped with any role"
			} else {
				roles[0].Clientid = values[0].Clientid
				roles[0].Mstorgnhirarchyid = values[0].Mstorgnhirarchyid
				roles[0].OrgnTypeId = values[0].OrgnTypeId
				roles[0].Token = tokenString
				urls, err1 := dataAccess.Geturlbytype(&values[0], "dashboard")
				if err1 != nil {
					return nil, false, err1, "Something Went Wrong"
				} else {
					if len(urls) > 0 {
						roles[0].Dashboardurl = urls[0].Url
					} else {
						roles[0].Dashboardurl = ""
					}
					urls, err1 := dataAccess.Geturlbytype(&values[0], "ExternalTicket")
					if err1 != nil {
						return nil, false, err1, "Something Went Wrong"
					} else {
						if len(urls) > 0 {
							roles[0].Externalurl = urls[0].Url
						} else {
							roles[0].Externalurl = ""
						}
						return roles, true, nil, ""
					}
					return roles, true, nil, ""
				}

			}
		}
	}
}
func Loginchecking(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	log.Println("In side model")
	db, err := config.ConnectMySqlDb()

	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}

	err1, values := dataAccess.Getorgdetailsbycode(tz)
	if err1 != nil {
		return nil, false, err1, "Something Went Wrong"
	}
	if len(values) > 0 {
		if values[0].Logintypeid == 1 {
			log.Println("LDAP Login")
			tz.Clientid = values[0].Clientid
			tz.Mstorgnhirarchyid = values[0].Mstorgnhirarchyid
			tz.OrgnTypeId = values[0].OrgnTypeId
			details, success, err, msg := Ldaplogin(tz)
			if err != nil || !success {
				log.Print(msg)
				if msg != "CONNECTION_REFUSED" && values[0].Islocallogin == 2 {
					details, success, err, msg := Login(tz)
					if err != nil || !success {
						return nil, false, err, msg
					} else {
						details[0].Logintypeid = values[0].Logintypeid
						return details, true, nil, ""
					}
				} else {
					return nil, false, err, msg
				}
			} else {
				details[0].Logintypeid = values[0].Logintypeid
				return details, true, nil, ""
			}
		} else {
			log.Println("Local Login")
			details, success, err, msg := Login(tz)
			if err != nil || !success {
				return nil, false, err, msg
			} else {
				details[0].Logintypeid = values[0].Logintypeid
				return details, true, nil, ""
			}
			//return nil, false, nil, "No login type mapped.."
		}
	} else {
		return nil, false, nil, "Sorry...Invalid Credentials"
	}
}

func Inpersonatelogin(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	log.Println("In side model")
	//lock.Lock()
	db, err := config.ConnectMySqlDb()
	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	//defer lock.Unlock()
	defer db.Close()
	//dataAccess := dao.DbConn{DB: db}
	tx, err := db.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return nil, false, err, "Something Went Wrong"
	}
	values := []entities.LoginEntityReq{}
	if tz.ID > 0 {
		value := entities.LoginEntityReq{}
		value.Clientid = tz.Clientid
		value.Mstorgnhirarchyid = tz.Mstorgnhirarchyid
		value.ID = tz.ID
		values = append(values, value)
		token, err := Createandinserttoken(values, tx)
		if err != nil {
			tx.Rollback()
			return nil, false, err, "Something Went Wrong"
		}
		err = tx.Commit()
		if err != nil {
			logger.Log.Print("Token  Statement Commit error", err)
			return nil, false, err, ""
		}
		details, success, err, msg := fetchlogindetails(values, db, token)
		if err != nil {
			return nil, false, err, "Something Went Wrong"
		} else {
			if success {
				return details, true, nil, ""
			} else {
				return nil, false, nil, msg
			}
		}
	} else {
		return nil, false, nil, "User not found"
	}
}

func Login(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	log.Println("In side model")
	//lock.Lock()
	db, err := config.ConnectMySqlDb()
	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	//defer lock.Unlock()
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	tx, err := db.Begin()
	if err != nil {
		logger.Log.Println("Transaction creation error.", err)
		return nil, false, err, "Something Went Wrong"
	}
	values, err1 := dataAccess.Login(tz)
	if err1 != nil {
		return nil, false, err1, "Something Went Wrong"
	}
	
	logger.Log.Println("===========values==============", values)
	if len(values) > 0 {
	values[0].Loginname = tz.Loginname
		pwdMatch := utility.ComparePasswords(values[0].Password, []byte(tz.Password))
		if pwdMatch || (tz.OrgMFA == 1 && tz.UserMFA == 1){
			//after passwordmatches we have to write the code for authienticator

			token, err := Createandinserttoken(values, tx)
			if err != nil {
				tx.Rollback()
				return nil, false, err, "Something Went Wrong"
			}
			err = tx.Commit()
			if err != nil {
				logger.Log.Print("Token  Statement Commit error", err)
				return nil, false, err, ""
			}

			if tz.OrgMFA == 1 && tz.UserMFA == 1 {
				ok := totp.Validate(string(tz.Totp), values[0].Secretkey)
				if ok {
					logger.Log.Print("OTP Validated Successfully")

				} else {
					return nil, false, nil, "Sorry......Invalid OTP"
				}
			} else if values[0].UserMFA == 1 && values[0].OrgMFA == 1 {
				//ok := totp.Validate(string(tz.Totp), values[0].Secretkey)
				details, success, err, msg := FetchMFA(values, db)
				details[0].UserMFA = values[0].UserMFA
				details[0].OrgMFA = values[0].OrgMFA
				details[0].Token = token
				if err != nil {
					return nil, false, err, "Something Went Wrong"
				} else {
					if success {
						return details, true, nil, ""
					} else {
						return nil, false, nil, msg
					}
				}

			} else if values[0].UserMFA == 2 && values[0].OrgMFA == 1 {
				details, success, err, msg := EnableTOTEenable(values, db)
				details[0].OrgMFA = 1
				details[0].UserMFA = 2
				details[0].Token = token
				if err != nil {
					return nil, false, err, "Something Went Wrong"
				} else {
					if success {
						return details, true, nil, ""
					} else {
						return nil, false, nil, msg
					}
				}
			}

			details, success, err, msg := fetchlogindetails(values, db, token)
			if err != nil {
				return nil, false, err, "Something Went Wrong"
			} else {
				if success {
					return details, true, nil, ""
				} else {
					return nil, false, nil, msg
				}
			}
		} else {
			return nil, false, nil, "Sorry......Invalid Credentials"
		}
	} else {
		return nil, false, nil, "Sorry...Invalid Credentials"
	}
}

func Ldaplogin(tz *entities.LoginEntityReq) ([]entities.LoginEntityResp, bool, error, string) {
	log.Println("In side model")

	//lock.Lock()

	db, err := config.ConnectMySqlDb()

	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	defer db.Close()
	dataAccess := dao.DbConn{DB: db}
	ldapentity := entities.MstldapEntity{}
	ldapentity.Clientid = tz.Clientid
	ldapentity.Mstorgnhirarchyid = tz.Clientid
	ldapentity.Offset = 0
	ldapentity.Limit = 1
	ldapdetails, err := dataAccess.GetAllMstldap(&ldapentity)
	if err != nil {
		return nil, false, err, "Something Went Wrong"
	} else {
		if len(ldapdetails) > 0 {
			tx, err := db.Begin()
			if err != nil {
				logger.Log.Println("Transaction creation error.", err)
				return nil, false, err, "Something Went Wrong"
			}
			postBody, _ := json.Marshal(map[string]string{"username": tz.Loginname, "password": tz.Password, "servername": ldapdetails[0].ServerName, "serverurl": ldapdetails[0].ServerUrl, "binddn": ldapdetails[0].Binddn, "basedn": ldapdetails[0].Basedn, "bindpassword": ldapdetails[0].Password, "filterdn": ldapdetails[0].Filterdn, "chncertificate": ldapdetails[0].Chn_Certificate})

			responseBody := bytes.NewBuffer(postBody)
			logger.Log.Println("postBody       --->", responseBody)
			resp, err := http.Post(config.LDAP_URL+"/verifyldapuser", "application/json", responseBody)
			if err != nil {
				logger.Log.Println("An Error Occured --->", err)
				return nil, false, err, "Login Server Error"
			}
			defer resp.Body.Close()
			//Read the response body
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				logger.Log.Println("response body ------> ", err)
				return nil, false, err, "Login Server Fetch Error"
			}
			var result entities.LdapAttrEntityResponse
			json.Unmarshal(body, &result)
			if result.Success {
				values, err1 := dataAccess.Login(tz)
				if err1 != nil {
					return nil, false, err1, "Something Went Wrong"
				}
				attr := entities.MapexternalattributesEntity{}
				attr.Systemid = 1
				attr.Clientid = tz.Clientid
				attr.Mstorgnhirarchyid = tz.Mstorgnhirarchyid
				attrs, attrerr := dataAccess.GetMappedattributes(&attr)
				user := entities.MstClientUserEntity{}
				if attrerr != nil {
					return nil, false, attrerr, "Something Went Wrong"
				}
				if len(attrs) > 0 {
					for _, mapped := range attrs {
						/*if mapped.Sysattr == "loginname" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Loginname = extattrs.Value
									break
								}
							}
						}*/
						if mapped.Sysattr == "firstname" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Firstname = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "lastname" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Lastname = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "usermobileno" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Usermobileno = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "division" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Division = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "useremail" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Useremail = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "secondaryno" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Secondaryno = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "designation" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Designation = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "branch" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Branch = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "brand" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.Brand = extattrs.Value
									break
								}
							}
						}
						if mapped.Sysattr == "city" {
							for _, extattrs := range result.Details {
								if extattrs.Key == mapped.Extattr {
									user.City = extattrs.Value
									break
								}
							}
						}
					}
				} else {
					log.Println("No attributes is mapped with system")
					logger.Log.Println("No attributes is mapped with system")
					return nil, false, nil, "No attributes is mapped with system"
				}
				user.Loginname = tz.Loginname
				user.Vipuser = "N"
				user.Usertype = "NA"
				user.Password = utility.HashAndSalt([]byte(tz.Password))
				user.ClientID = tz.Clientid
				user.MstorgnhirarchyID = tz.Mstorgnhirarchyid
				if len(values) > 0 {
					token, err := Createandinserttoken(values, tx)
					if err != nil {
						tx.Rollback()
						return nil, false, err, "Something Went Wrong"
					}
					details, _, err, msg := fetchlogindetails(values, db, token)
					if err != nil {
						return nil, false, err, msg
					} else {
						//user := entities.MstClientUserEntity{}
						//user.ClientID = values[0].Clientid
						//user.MstorgnhirarchyID = values[0].Mstorgnhirarchyid
						user.ID = values[0].ID
						err = dao.UpdateClientUserData(tx, &user)
						if err != nil {
							tx.Rollback()
							return nil, false, err, "Something Went Wrong"
						}
						err = dao.UpdateMstUserData(tx, &user)
						if err != nil {
							tx.Rollback()
							return nil, false, err, "Something Went Wrong"
						}
						err = dao.Updatepasswordtransaction(tx, user.Password, user.ID)
						if err != nil {
							tx.Rollback()
							return nil, false, err, "Something Went Wrong"
						}
						err = dao.Updateuserpasswordtransaction(tx, user.Password, user.ID)
						if err != nil {
							tx.Rollback()
							return nil, false, err, "Something Went Wrong"
						}
						err = tx.Commit()
						if err != nil {
							logger.Log.Print("Token  Statement Commit error", err)
							return nil, false, err, ""
						}
						if err != nil {
							return nil, false, err, msg
						}
						return details, true, nil, ""
					}
				} else {

					count, err := dao.CheckDuplicateCientUser(tx, &user)
					if err != nil {
						tx.Rollback()
						return nil, false, err, "Something Went Wrong"
					}
					if count == 0 {
						userid, err := dao.InsertClientUserData(tx, &user)
						if err != nil {
							tx.Rollback()
							return nil, false, err, "Something Went Wrong"
						}
						if userid > 0 {
							log.Print("user added in transaction")
							logger.Log.Print("user added in transaction")
							count1, err := dao.CheckDuplicateMstUser(tx, &user)
							if err != nil {
								tx.Rollback()
								return nil, false, err, "Something Went Wrong"
							}
							if count1 == 0 {
								mstuserid, err := dao.InsertMstUserData(tx, &user, userid)
								if err != nil {
									tx.Rollback()
									return nil, false, err, "Something Went Wrong"
								}
								if mstuserid > 0 {
									log.Print("user added in workflow")
									logger.Log.Print("user added in workflow")
									groupentity := entities.MapldapgrouproleEntity{}
									groupentity.Clientid = tz.Clientid
									groupentity.Mstorgnhirarchyid = tz.Mstorgnhirarchyid
									groupentity.Limit = 1
									groupentity.Offset = 0
									mapping, err := dataAccess.GetAllmapldapgrouprole(&groupentity)
									if err != nil {
										tx.Rollback()
										return nil, false, err, "Something went wrong"
									}
									if len(mapping) > 0 {
										memberentity := entities.GroupmemberEntity{}
										memberentity.Clientid = tz.Clientid
										memberentity.Mstorgnhirarchyid = tz.Mstorgnhirarchyid
										memberentity.Groupid = mapping[0].Groupid
										memberentity.Refuserid = userid

										count, err := dataAccess.CheckDuplicateGroupmember(&memberentity)
										if err != nil {
											tx.Rollback()
											return nil, false, err, "Something Went Wrong"
										}
										if count.Total == 0 {
											log.Print("\nGroup Added:")
											logger.Log.Print("\nGroup Added:")
											_, err := dataAccess.InsertGroupmembertransaction(&memberentity, tx)
											if err != nil {
												tx.Rollback()
												return nil, false, err, "Something Went Wrong"
											}
											roleentity := entities.MapClientUserRoleUserEntity{}
											roleentity.ClientID = tz.Clientid
											roleentity.MstorgnhirarchyID = tz.Mstorgnhirarchyid
											roleentity.RoleID = mapping[0].Roleid
											roleentity.Refuserid = userid
											count, err := dataAccess.CheckDuplicateMapRoleUser(&roleentity)
											if err != nil {
												tx.Rollback()
												return nil, false, err, "Something Went Wrong"
											}
											if count.Total > 0 {
												tx.Rollback()
												return nil, false, nil, "Mapping already exist."
											}
											roleid, err := dataAccess.InsertMapRoleUserDataTransaction(&roleentity, tx)
											if err != nil {
												tx.Rollback()
												return nil, false, err, "Something Went Wrong"
											}
											log.Print("\nRole Added:", roleid)
											logger.Log.Print("\nRole Added:", roleid)

											loginvalues := []entities.LoginEntityReq{}
											loginval := entities.LoginEntityReq{}
											loginval.Clientid = tz.Clientid
											loginval.Mstorgnhirarchyid = tz.Mstorgnhirarchyid
											loginval.OrgnTypeId = tz.OrgnTypeId
											loginval.ID = userid
											loginvalues = append(loginvalues, loginval)
											token, err := Createandinserttoken(loginvalues, tx)
											if err != nil {
												tx.Rollback()
												return nil, false, err, "Something Went Wrong"
											}
											err = tx.Commit()
											if err != nil {
												logger.Log.Print("Token  Statement Commit error", err)
												return nil, false, err, ""
											}
											details, success, err, msg := fetchlogindetails(loginvalues, db, token)
											if err != nil {
												return nil, false, err, "Something Went Wrong"
											} else {
												if success {
													return details, true, nil, ""
												} else {
													return nil, false, nil, msg
												}
											}
										} else {
											tx.Rollback()
											return nil, false, nil, "Data Already Exist."
										}
									} else {
										tx.Rollback()
										return nil, false, nil, "Support Group Not Found "
									}
								} else {
									tx.Rollback()
									return nil, false, nil, "User Already Exist."
								}
							} else {
								tx.Rollback()
								return nil, false, nil, "User Already Exist.."
							}
						} else {
							tx.Rollback()
							return nil, false, nil, "User Already Exist..."
						}

					} else {
						tx.Rollback()
						return nil, false, nil, "User Already Exist...."
					}

					/*} else {
						return nil, false, nil, "Organization not mapped with system"
					}*/

				}
			} else {
				return nil, false, err, result.Message
			}
		} else {
			return nil, false, err, "LDAP Configuration is not done yet"
		}
	}

}

func Getldapattributes(tz *entities.LoginEntityReq) (entities.LdapAttrEntityResponse, bool, error, string) {
	//lock.Lock()

	db, err := config.ConnectMySqlDb()
	t := entities.LdapAttrEntityResponse{}
	if err != nil {
		log.Println("database connection failure", err)
		return t, false, err, "Something Went Wrong"
	}
	defer db.Close()
	//defer lock.Unlock()
	dataAccess := dao.DbConn{DB: db}
	ldapentity := entities.MstldapEntity{}
	ldapentity.Clientid = tz.Clientid
	ldapentity.Mstorgnhirarchyid = tz.Clientid
	ldapentity.Offset = 0
	ldapentity.Limit = 1
	ldapdetails, err := dataAccess.GetAllMstldap(&ldapentity)
	if err != nil {
		return t, false, err, "Something Went Wrong"
	} else {
		if len(ldapdetails) > 0 {
			if err != nil {
				logger.Log.Println("Transaction creation error.", err)
				return t, false, err, "Something Went Wrong"
			}
			postBody, _ := json.Marshal(map[string]string{"username": tz.Loginname, "servername": ldapdetails[0].ServerName, "serverurl": ldapdetails[0].ServerUrl, "binddn": ldapdetails[0].Binddn, "basedn": ldapdetails[0].Basedn, "bindpassword": ldapdetails[0].Password, "filterdn": ldapdetails[0].Filterdn, "chncertificate": ldapdetails[0].Chn_Certificate})

			responseBody := bytes.NewBuffer(postBody)
			logger.Log.Println("postBody       --->", responseBody)
			resp, err := http.Post(config.LDAP_URL+"/getldapattributes", "application/json", responseBody)
			if err != nil {
				logger.Log.Println("An Error Occured --->", err)
				return t, false, err, "Login Server Error"
			}
			defer resp.Body.Close()
			//Read the response body
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				logger.Log.Println("response body ------> ", err)
				return t, false, err, "Login Server Fetch Error"
			}
			sb := string(body)
			logger.Log.Println("sb change group body value is --->", sb)
			var result entities.LdapAttrEntityResponse
			json.Unmarshal(body, &result)
			if result.Success {
				//log.Print(result.Details)
				return result, true, nil, ""
			} else {
				return t, false, err, result.Message
			}
		} else {
			return t, false, err, "LDAP Configuration is not done yet"
		}
	}
}

func GetUserDetailsById(tz *entities.UserEntity) ([]entities.UserEntity, bool, error, string) {
	log.Println("In side model")
	t := []entities.UserEntity{}
	val := entities.LoginEntityReq{}
	lock.Lock()
	db, err := config.ConnectMySqlDbSingleton()
	if err != nil {
		log.Println("database connection failure", err)
		return nil, false, err, "Something Went Wrong"
	}
	//defer db.Close()
	defer lock.Unlock()

	dataAccess := dao.DbConn{DB: db}
	values, err1 := dataAccess.GetUserDetailsById(tz)
	if err1 != nil {
		return t, false, err1, "Something Went Wrong"
	}
	if len(values) > 0 {
		/*if values[0].Orgntypeid == 1 {
			return values, true, nil, ""
		} else {*/
		val.ID = tz.Userid
		roles, err1 := dataAccess.GetRolebyUserId(&val)
		if err1 != nil {
			return t, false, err1, "Something Went Wrong"
		} else {
			if len(roles) == 0 {
				return t, false, nil, "User is not mapped with any role"
			} else {
				values[0].Rolename = roles[0].Rolename
				values[0].Roleid = roles[0].Roleid
				values[0].IsAdmin = roles[0].IsAdmin
				groups, err2 := dataAccess.Getgroupbyuserid(&val)
				if err2 != nil {
					return t, false, err2, "Something Went Wrong"
				}
				values[0].Group = groups
				urls, err2 := dataAccess.Geturlbyuser(&values[0])
				if err2 != nil {
					return t, false, err2, "Something Went Wrong"
				}
				values[0].Urls = urls
				acn := entities.UserroleactionnameEntity{}
				acn.Clientid = values[0].Clientid
				acn.Mstorgnhirarchyid = values[0].Mstorgnhirarchyid
				acn.UserID = tz.Userid
				actions, _, err2, _ := GetUserActionname(&acn)
				if err2 != nil {
					return t, false, err2, "Something Went Wrong"
				} else {
					if len(actions) > 0 {
						for i := 0; i < len(actions); i++ {
							if actions[i] == 1 {
								values[0].Add = true
							} else if actions[i] == 2 {
								values[0].Delete = true
							} else if actions[i] == 3 {
								values[0].View = true
							} else {
								values[0].Edit = true
							}
						}
						return values, true, nil, ""
					} else {
						return values, true, nil, ""
					}
				}

			}
		}
		//}
	} else {
		return t, false, nil, "User Details Not Found"
	}
}
