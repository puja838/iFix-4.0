 package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )


func GetAllMstClientCredentialType() ([]entities.MstClientCredentialTypeEntity, bool, error, string) {
    logger.Log.Println("In side MstClientCredentialType model")
    t := []entities.MstClientCredentialTypeEntity{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllMstClientCredentialType()
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
     
    return values, true, err, ""
}