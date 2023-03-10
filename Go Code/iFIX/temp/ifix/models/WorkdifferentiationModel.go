package models


import (
  "iFIX/ifix/config"
  "iFIX/ifix/entities"
  "iFIX/ifix/logger"
  "iFIX/ifix/dao"
  )

func InsertWorkdifferentiation(tz *entities.WorkdifferentiationEntity) (int64, bool, error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return 0, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    count,err :=dataAccess.CheckDuplicateWorkdifferentiation(tz)
    if err != nil {
        return 0, false, err, "Something Went Wrong"
    }
    if count.Total == 0 {
        id, err := dataAccess.InsertWorkdifferentiation(tz)
        if err != nil {
            return 0, false, err, "Something Went Wrong"
        }
        return id, true, err, ""
    }else{
        return 0, false, nil, "Module Name Already Exist."
    }
}


func GetAllWorkdifferentiation(page *entities.WorkdifferentiationEntity) (entities.WorkdifferentiationEntities, bool, error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    t := entities.WorkdifferentiationEntities{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetAllWorkdifferentiation(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    if page.Offset == 0{
        total, err1 := dataAccess.GetWorkdifferentiationCount(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Total=total.Total
    t.Values=values
    }
    t.Values=values
    return t, true, err, ""
}
func Getworkdifferentiationvalue(page *entities.WorkdifferentiationEntity) ([]entities.WorkdifferentiationsingleEntity, bool, error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    t := []entities.WorkdifferentiationsingleEntity{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
         return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.Getworkdifferentiationvalue(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    return values, true, err, ""
}

func DeleteWorkdifferentiation(tz *entities.WorkdifferentiationEntity) (bool,error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.DeleteWorkdifferentiation(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}
func GetAllWorkinglabelname(page *entities.WorkdifferentiationEntity) (entities.WorkinglabelnameEntities, bool, error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    t := entities.WorkinglabelnameEntities{}
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return t, false, err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    values, err1 := dataAccess.GetWokinglabelname(page)
    if err1 != nil {
        return t, false, err1, "Something Went Wrong"
    }
    t.Values = values
    return t, true, err, ""
}


func UpdateWorkdifferentiation(tz *entities.WorkdifferentiationEntity) (bool,error, string) {
    logger.Log.Println("In side Workdifferentiationmodel")
    db, err := config.ConnectMySqlDb()
    defer db.Close()
    if err != nil {
        logger.Log.Println("database connection failure", err)
        return false,err, "Something Went Wrong"
    }
    dataAccess := dao.DbConn{DB: db}
    err1 := dataAccess.UpdateWorkdifferentiation(tz)
    if err1 != nil {
        return false,err1, "Something Went Wrong"
    }
    return true,nil, ""
}


