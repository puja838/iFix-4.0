package utility

import (
	"bytes"
	"encoding/json"
	"errors"
	"iFIX/ifix/config"
	"iFIX/ifix/entities"
	Logger "iFIX/ifix/logger"
	"io"
	"net/http"
	"os"
)

func DownloadFileFromUrl(clientID int64, orgID int64, originalFileName string, uploadedFileName string, filePath string) error {
	// wd, err := os.Getwd() // to get working directory
	// if err != nil {
	// 	Logger.Log.Println(err)
	// 	//return ticketID, err
	// }
	// //log.Println(wd)
	// contextPath := strings.ReplaceAll(wd, "\\", "/") // replacing backslash by  forwardslash
	//log.Println(contextPath)
	//props, err := ReadPropertiesFile(contextPath + "/ifix/resource/application.properties")
	// Create the file
	out, err := os.Create(filePath)
	if err != nil {
		return errors.New("ERROR: Unable to create copy of file")
	}
	defer out.Close()
	var fileDownloadEntity entities.FileuploadEntity
	fileDownloadEntity.Clientid = clientID
	fileDownloadEntity.Mstorgnhirarchyid = orgID
	fileDownloadEntity.Originalfile = originalFileName
	fileDownloadEntity.Filename = uploadedFileName
	sendData, err := json.Marshal(fileDownloadEntity)
	if err != nil {
		Logger.Log.Println(err)
		return errors.New("Unable to marshal data")
	}
	Logger.Log.Println("DownLoadFile API CAll with =======>   ", string(sendData))
	// Get the data
	resp, err := http.Post(config.DownloadFileURL, "application/json", bytes.NewBuffer(sendData))
	if err != nil {
		return errors.New("ERROR: Unable to fetch data from URL")
	}
	defer resp.Body.Close()
	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return errors.New("ERROR: File download Error")
	}
	return nil
}

// func DownloadFileFromUrl(url string, filepath string) error {
//     // Create the file
//     out, err := os.Create(filepath)
//     if err != nil {
//         return errors.New("ERROR: Unable to create copy of file")
//     }
//     defer out.Close()

//     // Get the data
//     resp, err := http.Get(url)
//     if err != nil {
//         return errors.New("ERROR: Unable to fetch data from URL")
//     }
//     defer resp.Body.Close()

//     // Write the body to file
//     _, err = io.Copy(out, resp.Body)
//     if err != nil {
//         return errors.New("ERROR: File download Error")
//     }

//     return nil
// }
