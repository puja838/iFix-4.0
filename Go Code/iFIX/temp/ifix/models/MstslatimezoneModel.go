package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )

func InsertMstslatimezone(tz *entities.MstslatimezoneEntity) (int64, bool, error, string) {
    logger.Log.Println("In side Mstslatimezonemodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return 0, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstslatimezone(tz)
    if err != nil {
        return 0, false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
        id, err := dataAccess.InsertMstslatimezone(tz)
        if err != nil {
            return 0, false, err, "Something Went Wrong"
        }
        return id, true, err, ""
    }else{
        return 0, false, nil, "Data Already Exist."
    }
}


func GetAllMstslatimezone(page *entities.MstslatimezoneEntity) (entities.MstslatimezoneEntities, bool, error, string) {
    logger.Log.Println("In side Mstslatimezonemodel")
    t := entities.MstslatimezoneEntities{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllMstslatimezone(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    if page.Offset == 0{
        total, err1 := dataAccess.GetMstslatimezoneCount(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Total=total.Total
    t.Values=values
    }
    t.Values=values
    return t, true, err, ""
}


func DeleteMstslatimezone(tz *entities.MstslatimezoneEntity) (bool,error, string) {
    logger.Log.Println("In side Mstslatimezonemodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.DeleteMstslatimezone(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}


func UpdateMstslatimezone(tz *entities.MstslatimezoneEntity) (bool,error, string) {
    logger.Log.Println("In side Mstslatimezonemodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstslatimezone(tz)
    if err != nil {
        return false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
         err := dataAccess.UpdateMstslatimezone(tz)
        if err != nil {
            return false, err, "Something Went Wrong"
        }
        return true, err, ""
    }else{
        return false, nil, "Data Already Exist."
    }
}


