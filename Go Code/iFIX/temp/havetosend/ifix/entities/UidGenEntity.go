package entities

import (
	"encoding/json"
	"io"
)

type UidGenEntity struct {
	Id                  int64  `json:"id"`
	Clientid            int64  `json:"clientid"`
	Mstorgnhirarchyid   int64  `json:"mstorgnhirarchyid"`
	Difftypeid          int64  `json:"difftypeid"`
	 Difftypename       string `json:"difftypename"`
	 Code               string `json:"code"`
	 Uid                int64  `json:"uid"`
	Activeflg           int64  `json:"activeflg"`
	Offset              int64  `json:"offset"`
	Limit               int64  `json:"limit"`
	Clientname          string `json:"clientname"`
	Mstorgnhirarchyname string `json:"mstorgnhirarchyname"`
}

type UidGenEntities struct {
	Total  int64                       `json:"total"`
	Values []UidGenEntity `json:"values"`
}

type UidGenResponse struct {
	Success bool                        `json:"success"`
	Message string                      `json:"message"`
	Details UidGenEntities `json:"details"`
}

type UidGenResponseInt struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Details int64  `json:"details"`
}

func (w *UidGenEntity) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(w)
}
