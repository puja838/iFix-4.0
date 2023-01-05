package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )

func InsertMstslaentity(tz *entities.MstslaentityEntity) (int64, bool, error, string) {
    logger.Log.Println("In side Mstslaentitymodel")
    lock.Lock()
    defer lock.Unlock()
    db, err := config.ConnectMySqlDbSingleton()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return 0, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstslaentity(tz)
    if err != nil {
        return 0, false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
        id, err := dataAccess.InsertMstslaentity(tz)
        if err != nil {
            return 0, false, err, "Something Went Wrong"
        }
        return id, true, err, ""
    }else{
        return 0, false, nil, "Data Already Exist."
    }
}


func GetAllMstslaentity(page *entities.MstslaentityEntity) (entities.MstslaentityEntities, bool, error, string) {
    logger.Log.Println("In side Mstslaentitymodel")
    t := entities.MstslaentityEntities{}
    lock.Lock()
    defer lock.Unlock()
    db, err := config.ConnectMySqlDbSingleton()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllMstslaentity(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    if page.Offset == 0{
        total, err1 := dataAccess.GetMstslaentityCount(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Total=total.Total
    t.Values=values
    }
    t.Values=values
    return t, true, err, ""
}


func DeleteMstslaentity(tz *entities.MstslaentityEntity) (bool,error, string) {
    logger.Log.Println("In side Mstslaentitymodel")
    lock.Lock()
    defer lock.Unlock()
    db, err := config.ConnectMySqlDbSingleton()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.DeleteMstslaentity(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}


func UpdateMstslaentity(tz *entities.MstslaentityEntity) (bool,error, string) {
    logger.Log.Println("In side Mstslaentitymodel")
    lock.Lock()
    defer lock.Unlock()
    db, err := config.ConnectMySqlDbSingleton()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstslaentity(tz)
    if err != nil {
        return false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
         err := dataAccess.UpdateMstslaentity(tz)
        if err != nil {
            return false, err, "Something Went Wrong"
        }
        return true, err, ""
    }else{
        return false, nil, "Data Already Exist."
    }
}


