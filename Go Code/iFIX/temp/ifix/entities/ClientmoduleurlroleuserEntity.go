package entities

import (
	"encoding/json"
	"io"
)

type ClientmoduleurlroleuserEntity struct {
	Id                  int64  `json:"id"`
	Clientid            int64  `json:"clientid"`
	Mstorgnhirarchyid   int64  `json:"mstorgnhirarchyid"`
	Moduleid            int64  `json:"moduleid"`
	Roleid              int64  `json:"roleid"`
	Menuid              int64  `json:"menuid"`
	Refuserid           int64  `json:"refuserid"`
	Activeflg           int64  `json:"activeflg"`
	Audittransactionid  int64  `json:"audittransactionid"`
	Offset              int64  `json:"offset"`
	Limit               int64  `json:"limit"`
	Clientname          string `json:"clientname"`
	Mstorgnhirarchyname string `json:"mstorgnhirarchyname"`
	Rolename            string `json:"rolename"`
	Modulename          string `json:"modulename"`
	Menuname            string `json:"menuname"`
	Refusername         string `json:"Refusername"`
}

type ClientmoduleurlroleuserEntities struct {
	Total  int64                           `json:"total"`
	Values []ClientmoduleurlroleuserEntity `json:"values"`
}

type ClientmoduleurlroleuserResponse struct {
	Success bool                            `json:"success"`
	Message string                          `json:"message"`
	Details ClientmoduleurlroleuserEntities `json:"details"`
}

type ClientmoduleurlroleuserResponseInt struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Details int64  `json:"details"`
}

func (w *ClientmoduleurlroleuserEntity) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(w)
}
