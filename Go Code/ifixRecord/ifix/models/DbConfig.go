package models

//***************************//
// Package Name: config
// Date Of Creation: 17/12/2020
// Authour Name: Moloy Mondal
// History: N/A
// Synopsis: Database configuration file with connection
// Functions: ConnectMySqlDb
// Inputs: <*sql.DB>, <error>
// Global Variable: N/A
// Version: 1.0.0
//***************************//

import (
	"database/sql"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

/*var db *sql.DB = nil
func ConnectMySqlDb() (*sql.DB, error) {
	dbDriver := "mysql"           // Database Driver Name
	dbUser := "gouser"            // Database Username
	dbPassword := "TCSUAT@54321"  // Database  Password
	dbUrl := "tcp(10.5.2.4:3306)" // Database ip/host with port
	dbName := "iFIX"              // Database Name

	if db == nil {
		d, err := sql.Open(dbDriver, dbUser+":"+dbPassword+"@"+dbUrl+"/"+dbName)
		if err != nil {
			// panic(err.Error())
			return nil, err
		}
		db = d
	}
	return db, nil

}*/

var (
	db   *sql.DB
	once sync.Once
)

func ConnectMySqlDb() (*sql.DB, error) {
	once.Do(func() {
		var err error
		dbDriver := "mysql"            // Database Driver Name
		dbUser := "root"               // Database Username
		dbPassword := "password"       // Database  Password
		dbUrl := "tcp(127.0.0.1:3306)" // Database ip/host with port
		dbName := "iFIX"               // Database Name

		// dbDriver := "mysql"             // Database Driver Name
		// dbUser := "ifix"                // Database Username
		// dbPassword := "Staging@4321"    // Database  Password
		// dbUrl := "tcp(172.17.0.1:3306)" // Database ip/host with port
		// dbName := "iFIX"                // Database Name

		//dbDriver := "mysql"                   // Database Driver Name
		//dbUser := "gouser"                    // Database Username
		//dbPassword := "#TCSICCiFIXProd@65243" // Database  Password
		//dbUrl := "tcp(10.5.3.10:3306)"        // Database ip/host with port
		//dbName := "iFIX"                      // Database Name

		db, err = sql.Open(dbDriver, dbUser+":"+dbPassword+"@"+dbUrl+"/"+dbName)
		if err != nil {
			panic(err.Error())
			//return nil, err
		}
		db.SetMaxIdleConns(0)
		db.SetMaxOpenConns(100)
		db.SetConnMaxLifetime(time.Millisecond * 100)
	})
	return db, nil

}
