package entities

import (
	"encoding/json"
	"io"
)

type DashboardQueryCopyEntity struct {
	Id int64 `json:"id"`
	//HeaderName string `json:"headername"`
	Clientid   int64 `json:"clientid"`
	ToClientid int64 `json:"toclientid"`

	Clientname          string `json:"clienname"`
	Mstorgnhirarchyid   int64  `json:"mstorgnhirarchyid"`
	ToMstorgnhirarchyid int64  `json:"tomstorgnhirarchyid"`

	Mstorgnhirarchyname string `json:"mstorgnhirarchyname"`
	//RecordDiffTypeid         int64  `json:"recorddifftypeid`
	// ToRecordDiffTypeid         int64  `json:"torecorddifftypeid`

	RecordDiffTypeName string `json:"recorddifftypename"`
	RecordDiffid       int64  `json:"recorddiffid"`
	ToRecordDiffid     int64  `json:"torecorddiffid"`

	RecordDiffName string `json:"recorddiffname"`

	QueryType     int64  `json:"querytype"`
	QueryTypename string `json:"querytypename"`
	Tilesid       int64  `json:"tilesid"`
	TilesName     string `json:"tilesname"`

	Query      interface{} `json:"query"`
	QueryParam interface{} `json:"queryparam"`
	JoinQuery  interface{} `json:"Joinquery"`

	Activeflg int64 `json:"activeglg"`
	Offset    int64 `json:"offset"`
	Limit     int64 `json:"limit"`
}
type DashboardQueryCopyEntities struct {
	Total  int64                      `json:"total"`
	Values []DashboardQueryCopyEntity `json:"values"`
}

type DashboardQueryCopyResponse struct {
	Success bool                       `json:"success"`
	Message string                     `json:"message"`
	Details DashboardQueryCopyEntities `json:"details"`
}

type DashboardQueryCopyResponseInt struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Details int64  `json:"details"`
}

func (w *DashboardQueryCopyEntity) FromJSON(r io.Reader) error {
	e := json.NewDecoder(r)
	return e.Decode(w)
}
