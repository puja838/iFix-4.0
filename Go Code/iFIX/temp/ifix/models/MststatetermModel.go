package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )

func InsertMststateterm(tz *entities.MststatetermEntity) (int64, bool, error, string) {
    logger.Log.Println("In side Mststatetermmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return 0, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMststateterm(tz)
    if err != nil {
        return 0, false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
        id, err := dataAccess.InsertMststateterm(tz)
        if err != nil {
            return 0, false, err, "Something Went Wrong"
        }
        return id, true, err, ""
    }else{
        return 0, false, nil, "Data Already Exist."
    }
}


func GetAllMststateterm(page *entities.MststatetermEntity) (entities.MststatetermEntities, bool, error, string) {
    logger.Log.Println("In side Mststatetermmodel")
    t := entities.MststatetermEntities{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllMststateterm(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    if page.Offset == 0{
        total, err1 := dataAccess.GetMststatetermCount(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Total=total.Total
    t.Values=values
    }
    t.Values=values
    return t, true, err, ""
}


func DeleteMststateterm(tz *entities.MststatetermEntity) (bool,error, string) {
    logger.Log.Println("In side Mststatetermmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.DeleteMststateterm(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}


func UpdateMststateterm(tz *entities.MststatetermEntity) (bool,error, string) {
    logger.Log.Println("In side Mststatetermmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMststateterm(tz)
    if err != nil {
        return false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
         err := dataAccess.UpdateMststateterm(tz)
        if err != nil {
            return false, err, "Something Went Wrong"
        }
        return true, err, ""
    }else{
        return false, nil, "Data Already Exist."
    }
}


