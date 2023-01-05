package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )

func InsertMstldap(tz *entities.MstldapEntity) (int64, bool, error, string) {
    logger.Log.Println("In side Mstldapmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return 0, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstldap(tz)
    if err != nil {
        return 0, false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
        id, err := dataAccess.InsertMstldap(tz)
        if err != nil {
            return 0, false, err, "Something Went Wrong"
        }
        return id, true, err, ""
    }else{
        return 0, false, nil, "Data Already Exist."
    }
}


func GetAllMstldap(page *entities.MstldapEntity) (entities.MstldapEntities, bool, error, string) {
    logger.Log.Println("In side Mstldapmodel")
    t := entities.MstldapEntities{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllMstldap(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    if page.Offset == 0{
        total, err1 := dataAccess.GetMstldapCount(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Total=total.Total
    t.Values=values
    }
    t.Values=values
    return t, true, err, ""
}
func Gettabledetails(tz *entities.MstldapEntity) ([]string, bool, error, string) {
    db, err := config.ConnectMySqlDb()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return nil, false, err, "Something Went Wrong"
    }
    defer db.Close()
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.Gettabledetails(tz)
    if err1 != nil {
        return nil, false, err1, "Something Went Wrong"
    }
    return values, true, err, ""
}


func DeleteMstldap(tz *entities.MstldapEntity) (bool,error, string) {
    logger.Log.Println("In side Mstldapmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.DeleteMstldap(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}


func UpdateMstldap(tz *entities.MstldapEntity) (bool,error, string) {
    logger.Log.Println("In side Mstldapmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateMstldap(tz)
    if err != nil {
        return false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
         err := dataAccess.UpdateMstldap(tz)
        if err != nil {
            return false, err, "Something Went Wrong"
        }
        return true, err, ""
    }else{
        return false, nil, "Data Already Exist."
    }
}
func UpdateMstldapCertificate(tz *entities.MstldapEntity) (bool,error, string) {
    logger.Log.Println("In side Mstldapmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
     
         err1 := dataAccess.UpdateMstldapCertificate(tz)
        if err1 != nil {
            return false, err1, "Something Went Wrong"
        }
        return true, err1, ""
     
}

