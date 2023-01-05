import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from './config.service';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
};
const httpOptions1 = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'}),
  responseType: 'blob' as 'blob'
};

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  httpClient: any;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.httpClient = http;
  }

  apiRoot = this.config.apiRoot;
  recordRoot = this.config.recordRoot;
  faqRoot = this.config.faqRoot;
  cateUploadRoot = this.config.cateUploadRoot;
  assetRoot = this.config.assetUploadRoot;
  emailRoot = this.config.emailUploadRoot;
  userRoot = this.config.userUploadRoot;
  messageRoot = this.config.messageRoot;
  locationRoot = this.config.locationRoot;
  dataRoot = this.config.dataRoot;
  reportRoot = this.config.reportRoot;

  updateUrl(data) {
    return this.http.post(this.apiRoot + '/updateUrl', data, httpOptions);
  }

  insertUrl(data) {
    return this.http.post(this.apiRoot + '/insertUrl', data, httpOptions);
  }

  deleteUrl(data) {
    return this.http.post(this.apiRoot + '/deleteUrl', data, httpOptions);
  }

  getAllUrls(data) {
    return this.http.post(this.apiRoot + '/getAllUrls', data, httpOptions);
  }

  insertModule(data) {
    return this.http.post(this.apiRoot + '/insertModule', data, httpOptions);
  }

  getAllModules(data) {
    return this.http.post(this.apiRoot + '/getAllModules', data, httpOptions);
  }

  deleteModule(data) {
    return this.http.post(this.apiRoot + '/deleteModule', data, httpOptions);
  }

  updateModule(data) {
    return this.http.post(this.apiRoot + '/updateModule', data, httpOptions);
  }

  createclient(data) {
    return this.http.post(this.apiRoot + '/createclient', data, httpOptions);
  }

  updateClient(data) {
    return this.http.post(this.apiRoot + '/updateClient', data, httpOptions);
  }

  createclientuser(data) {
    return this.http.post(this.apiRoot + '/createclientuser', data, httpOptions);
  }

  updateclientuser(data) {
    return this.http.post(this.apiRoot + '/updateclientuser', data, httpOptions);
  }

  deleteclientuser(data) {
    return this.http.post(this.apiRoot + '/deleteclientuser', data, httpOptions);
  }

  getclientuser(data) {
    return this.http.post(this.apiRoot + '/getclientuser', data, httpOptions);
  }

  getAllRoles(data) {
    return this.http.post(this.apiRoot + '/getAllRoles', data, httpOptions);
  }

  createrole(data) {
    return this.http.post(this.apiRoot + '/createrole', data, httpOptions);
  }

  deleterole(data) {
    return this.http.post(this.apiRoot + '/deleterole', data, httpOptions);
  }

  getclientuserrole(data) {
    return this.http.post(this.apiRoot + '/getclientuserrole', data, httpOptions);
  }

  createclientuserrole(data) {
    return this.http.post(this.apiRoot + '/createclientuserrole', data, httpOptions);
  }

  deleteclientuserrole(data) {
    return this.http.post(this.apiRoot + '/deleteclientuserrole', data, httpOptions);
  }

  login(data) {
    return this.http.post(this.apiRoot + '/login', data, httpOptions);
  }

  deleteRecordDiff(data) {
    return this.http.post(this.apiRoot + '/deleteRecordDiff', data, httpOptions);
  }

  getRecordDiffType() {
    return this.http.post(this.apiRoot + '/getRecordDiffType', httpOptions);
  }

  insertRecordDiff(data) {
    return this.http.post(this.apiRoot + '/insertRecordDiff', data, httpOptions);
  }

  getAllRecordDiff(data) {
    return this.http.post(this.apiRoot + '/getAllRecordDiff', data, httpOptions);
  }

  updateRecordDiff(data) {
    return this.http.post(this.apiRoot + '/updateRecordDiff', data, httpOptions);
  }

  getclient(data) {
    return this.http.post(this.apiRoot + '/getclient', data, httpOptions);
  }

  deleteClient(data) {
    return this.http.post(this.apiRoot + '/deleteClient', data, httpOptions);
  }

  addorganization(data) {
    return this.http.post(this.apiRoot + '/addorganization', data, httpOptions);
  }

  getorganization(data) {
    return this.http.post(this.apiRoot + '/getorganization', data, httpOptions);
  }

  // ===================
  getAllModuleUrls(data) {
    return this.http.post(this.apiRoot + '/getAllModuleUrls', data, httpOptions);
  }

  getDistinctUrl(data) {
    return this.http.post(this.apiRoot + '/getDistinctUrl', data, httpOptions);
  }

  getRemainingUrl(data) {
    return this.http.post(this.apiRoot + '/getRemainingUrl', data, httpOptions);
  }

  deleteModuleUrl(data) {
    return this.http.post(this.apiRoot + '/deleteModuleUrl', data, httpOptions);
  }

  createmoduleclient(data) {
    return this.http.post(this.apiRoot + '/createmoduleclient', data, httpOptions);
  }

  updateModuleClient(data) {
    return this.http.post(this.apiRoot + '/updatemoduleclient', data, httpOptions);
  }

  deleteModuleClient(data) {
    return this.http.post(this.apiRoot + '/deleteModuleClient', data, httpOptions);
  }

  getmoduleclient(data) {
    return this.http.post(this.apiRoot + '/getmoduleclient', data, httpOptions);
  }

  getModuleByOrgId(data) {
    return this.http.post(this.apiRoot + '/getModuleByOrgId', data, httpOptions);
  }

  addModuleClient(data) {
    return this.http.post(this.apiRoot + '/addModuleClient', data, httpOptions);
  }

  getAllModuleClients(data) {
    return this.http.post(this.apiRoot + '/getAllModuleClients', data, httpOptions);
  }

  getroleactionforclient(data) {
    return this.http.post(this.apiRoot + '/getroleactionforclient', data, httpOptions);
  }

  addroleaction(data) {
    return this.http.post(this.apiRoot + '/addroleaction', data, httpOptions);
  }

  updateorganization(data) {
    return this.http.post(this.apiRoot + '/updateorganization', data, httpOptions);

  }

  updateclientuserrole(data) {
    return this.http.post(this.apiRoot + '/updateclientuserrole', data, httpOptions);
  }

  searchUser(data) {
    return this.http.post(this.apiRoot + '/searchUser', data, httpOptions);
  }

  getorganizationclientwise(data) {
    return this.http.post(this.apiRoot + '/getorganizationclientwise', data, httpOptions);
  }

  deleteroleaction(data) {
    return this.http.post(this.apiRoot + '/deleteroleaction', data, httpOptions);
  }

  getrole(data) {
    return this.http.post(this.apiRoot + '/getrole', data, httpOptions);
  }

  getRoleWiseAction(data) {
    return this.http.post(this.apiRoot + '/getRoleWiseAction', data, httpOptions);
  }

  updaterole(data) {
    return this.http.post(this.apiRoot + '/updaterole', data, httpOptions);
  }

  getroleaction(data) {
    return this.http.post(this.apiRoot + '/getroleaction', data, httpOptions);
  }

  updateclient(data) {
    return this.http.post(this.apiRoot + '/updateclient', data, httpOptions);
  }

  getUserDetailsById(data) {
    return this.http.post(this.apiRoot + '/getUserDetailsById', data, httpOptions);
  }

  searchzone(data) {
    return this.http.post(this.apiRoot + '/searchzone', data, httpOptions);
  }

  getparentmenu(data) {
    return this.http.post(this.apiRoot + '/getparentmenu', data, httpOptions);
  }

  getmodulerolemap(data) {
    return this.http.post(this.apiRoot + '/getmodulerolemap', data, httpOptions);
  }

  addmodulerolemap(data) {
    return this.http.post(this.apiRoot + '/addmodulerolemap', data, httpOptions);
  }

  updatemodulerolemap(data) {
    return this.http.post(this.apiRoot + '/updatemodulerolemap', data, httpOptions);
  }

  deletemodulerolemap(data) {
    return this.http.post(this.apiRoot + '/updatemodulerolemap', data, httpOptions);
  }

  getmenudetails(data) {
    return this.http.post(this.apiRoot + '/getmenudetails', data, httpOptions);
  }

  insertmenu(data) {
    return this.http.post(this.apiRoot + '/insertmenu', data, httpOptions);
  }

  getnonurl(data) {
    return this.http.post(this.apiRoot + '/getnonurl', data, httpOptions);
  }

  deletenonurl(data) {
    return this.http.post(this.apiRoot + '/deletenonurl', data, httpOptions);
  }

  geturlkey(data) {
    return this.http.post(this.apiRoot + '/geturlkey', data, httpOptions);
  }

  addnonurl(data) {
    return this.http.post(this.apiRoot + '/addnonurl', data, httpOptions);
  }

  updatenonurl(data) {
    return this.http.post(this.apiRoot + '/updatenonurl', data, httpOptions);
  }

  deleteuserroleaction(data) {
    return this.http.post(this.apiRoot + '/deleteuserroleaction', data, httpOptions);
  }

  searchUserByOrgnId(data) {
    return this.http.post(this.apiRoot + '/searchUserByOrgnId', data, httpOptions);
  }

  adduserroleaction(data) {
    return this.http.post(this.apiRoot + '/adduserroleaction', data, httpOptions);
  }

  getaction() {
    return this.http.post(this.apiRoot + '/getaction', httpOptions);
  }

  getuserroleaction(data) {
    return this.http.post(this.apiRoot + '/getuserroleaction', data, httpOptions);
  }

  getRoleUserWiseAction(data) {
    return this.http.post(this.apiRoot + '/getRoleUserWiseAction', data, httpOptions);
  }

  deletemenu(data) {
    return this.http.post(this.apiRoot + '/deletemenu', data, httpOptions);
  }

  updatemenu(data) {
    return this.http.post(this.apiRoot + '/updatemenu', data, httpOptions);
  }

  geturlmenudetails(data) {
    return this.http.post(this.apiRoot + '/geturlmenudetails', data, httpOptions);
  }

  deletemodulerolemapuser(data) {
    return this.http.post(this.apiRoot + '/deletemodulerolemapuser', data, httpOptions);
  }

  addmodulerolemapuser(data) {
    return this.http.post(this.apiRoot + '/addmodulerolemapuser', data, httpOptions);
  }

  updatemodulerolemapuser(data) {
    return this.http.post(this.apiRoot + '/updatemodulerolemapuser', data, httpOptions);
  }

  getmodulerolemapuser(data) {
    return this.http.post(this.apiRoot + '/getmodulerolemapuser', data, httpOptions);
  }

  addCategory(data) {
    return this.http.post(this.apiRoot + '/addlabel', data, httpOptions);
  }

  getCategoryLavel(data) {
    return this.http.post(this.apiRoot + '/getlabel', data, httpOptions);
  }

  updateCategoryLevel(data) {
    return this.http.post(this.apiRoot + '/updatelabel', data, httpOptions);
  }

  deleteCategoryLavel(data) {
    return this.http.post(this.apiRoot + '/deletelabel', data, httpOptions);
  }

  getworkingdiff(data) {
    return this.http.post(this.apiRoot + '/getworkingdiff', data, httpOptions);
  }

  addworingkdiff(data) {
    return this.http.post(this.apiRoot + '/addworingkdiff', data, httpOptions);
  }

  getRecordDiffTypePost() {
    return this.http.post(this.apiRoot + '/getRecordDiffType', httpOptions);
  }

  getrecordbydifftype(data) {
    return this.http.post(this.apiRoot + '/getrecordbydifftype', data, httpOptions);
  }

  updateworingkdiff(data) {
    return this.http.post(this.apiRoot + '/updateworingkdiff', data, httpOptions);
  }

  deleteworkingdiff(data) {
    return this.http.post(this.apiRoot + '/deleteworkingdiff', data, httpOptions);
  }

  getrecordconfig(data) {
    return this.http.post(this.apiRoot + '/getrecordconfig', data, httpOptions);
  }

  addrecordconfig(data) {
    return this.http.post(this.apiRoot + '/addrecordconfig', data, httpOptions);
  }

  updaterecordconfig(data) {
    return this.http.post(this.apiRoot + '/updaterecordconfig', data, httpOptions);
  }

  getRecordDiffType1(data) {
    return this.http.post(this.apiRoot + '/getRecordDiffType', data, httpOptions);
  }

  deleterecordconfig(data) {
    return this.http.post(this.apiRoot + '/deleterecordconfig', data, httpOptions);
  }

  addrecordtypemap(data) {
    return this.http.post(this.apiRoot + '/addrecordtypemap', data, httpOptions);
  }

  updaterecordtypemap(data) {
    return this.http.post(this.apiRoot + '/updaterecordtypemap', data, httpOptions);
  }

  getrecordtypemap(data) {
    return this.http.post(this.apiRoot + '/getrecordtypemap', data, httpOptions);
  }

  deleterecordtypemap(data) {
    return this.http.post(this.apiRoot + '/deleterecordtypemap', data, httpOptions);
  }

  getcategorylevel(data) {
    return this.http.post(this.apiRoot + '/getcategorylevel', data, httpOptions);
  }

  getdifferentiationname(data) {
    return this.http.post(this.apiRoot + '/getdifferentiationname', data, httpOptions);
  }

  addrecordcategory(data) {
    return this.http.post(this.apiRoot + '/addrecordcategory', data, httpOptions);
  }

  getrecordcategory(data) {
    return this.http.post(this.apiRoot + '/getrecordcategory', data, httpOptions);
  }

  updaterecordcategory(data) {
    return this.http.post(this.apiRoot + '/updaterecordcategory', data, httpOptions);
  }

  deleterecordcategory(data) {
    return this.http.post(this.apiRoot + '/deleterecordcategory', data, httpOptions);
  }

  getrecorddiff(data) {
    return this.http.post(this.apiRoot + '/getrecorddiff', data, httpOptions);
  }

  addcatelog(data) {
    return this.http.post(this.apiRoot + '/addcatelog', data, httpOptions);
  }

  getcatelog(data) {
    return this.http.post(this.apiRoot + '/getcatelog', data, httpOptions);
  }

  deletecatelog(data) {
    return this.http.post(this.apiRoot + '/deletecatelog', data, httpOptions);
  }

  updatecatelog(data) {
    return this.http.post(this.apiRoot + '/updatecatelog', data, httpOptions);
  }

  getfunctionality() {
    return this.http.post(this.apiRoot + '/getfunctionality', httpOptions);
  }

  insertfuncmapping(data) {
    return this.http.post(this.apiRoot + '/insertfuncmapping', data, httpOptions);
  }

  getfuncmappingbytype(data) {
    return this.http.post(this.apiRoot + '/getfuncmappingbytype', data, httpOptions);
  }

  getfuncmappingdetails(data) {
    return this.http.post(this.apiRoot + '/getfuncmappingdetails', data, httpOptions);
  }

  deletefunctionmapping(data) {
    return this.http.post(this.apiRoot + '/deletefunctionmapping', data, httpOptions);
  }

  addhigherkey(data) {
    return this.http.post(this.apiRoot + '/addhigherkey', data, httpOptions);
  }

  gethigherkey(data) {
    return this.http.post(this.apiRoot + '/gethigherkey', data, httpOptions);
  }

  deletehigherkey(data) {
    return this.http.post(this.apiRoot + '/deletehigherkey', data, httpOptions);
  }

  addcatelogmap(data) {
    return this.http.post(this.apiRoot + '/addcatelogmap', data, httpOptions);
  }

  getcatelogmap(data) {
    return this.http.post(this.apiRoot + '/getcatelogmap', data, httpOptions);
  }

  deletecatelogmap(data) {
    return this.http.post(this.apiRoot + '/deletecatelogmap', data, httpOptions);
  }

  getmenubymodule(data) {
    return this.http.post(this.apiRoot + '/getmenubymodule', data, httpOptions);
  }

  getmenubyuser(data) {
    return this.http.post(this.apiRoot + '/getmenubyuser', data, httpOptions);
  }

  adddayofweek(data) {
    return this.http.post(this.apiRoot + '/adddayofweek', data, httpOptions);
  }

  getdayofweek(data) {
    return this.http.post(this.apiRoot + '/getdayofweek', data, httpOptions);
  }

  deletedayofweek(data) {
    return this.http.post(this.apiRoot + '/deletedayofweek', data, httpOptions);
  }

  getuserroleactionforclient(data) {
    return this.http.post(this.apiRoot + '/getuserroleactionforclient', data, httpOptions);
  }

  getsupportgrp(data) {
    return this.http.post(this.apiRoot + '/getsupportgrp', data, httpOptions);
  }

  deletesupportgrp(data) {
    return this.http.post(this.apiRoot + '/deletesupportgrp', data, httpOptions);

  }

  updatesupportgrp(data) {
    return this.http.post(this.apiRoot + '/updatesupportgrp', data, httpOptions);
  }

  addsupportgrp(data) {
    return this.http.post(this.apiRoot + '/addsupportgrp', data, httpOptions);
  }

  getcities() {
    return this.http.get(this.apiRoot + '/getcities');
  }

  getcountries() {
    return this.http.get(this.apiRoot + '/getcountries');
  }

  adddashboardquery(data) {
    return this.http.post(this.apiRoot + '/adddashboardquery', data, httpOptions);
  }

  getdashboardquery(data) {
    return this.http.post(this.apiRoot + '/getdashboardquery', data, httpOptions);
  }

  deletedashboardquery(data) {
    return this.http.post(this.apiRoot + '/deletedashboardquery', data, httpOptions);
  }

  addclientholiday(data) {
    return this.http.post(this.apiRoot + '/addclientholiday', data, httpOptions);
  }

  getclientholiday(data) {
    return this.http.post(this.apiRoot + '/getclientholiday', data, httpOptions);
  }

  updateclientholiday(data) {
    return this.http.post(this.apiRoot + '/updateclientholiday', data, httpOptions);
  }

  deleteclientholiday(data) {
    return this.http.post(this.apiRoot + '/deleteclientholiday', data, httpOptions);
  }

  getgroupbyorgid(data) {
    return this.http.post(this.apiRoot + '/getgroupbyorgid', data, httpOptions);
  }

  addclientsupportgrpholiday(data) {
    return this.http.post(this.apiRoot + '/addclientsupportgrpholiday', data, httpOptions);
  }

  updateclientsupportgrpholiday(data) {
    return this.http.post(this.apiRoot + '/updateclientsupportgrpholiday', data, httpOptions);
  }

  getclientsupportgrpholiday(data) {
    return this.http.post(this.apiRoot + '/getclientsupportgrpholiday', data, httpOptions);
  }

  deleteclientsupportgrpholiday(data) {
    return this.http.post(this.apiRoot + '/deleteclientsupportgrpholiday', data, httpOptions);
  }

  addgrpusermap(data) {
    return this.http.post(this.apiRoot + '/addgrpusermap', data, httpOptions);
  }

  deletegrpusermap(data) {
    return this.http.post(this.apiRoot + '/deletegrpusermap', data, httpOptions);
  }

  getgrpusermap(data) {
    return this.http.post(this.apiRoot + '/getgrpusermap', data, httpOptions);
  }

  updategrpusermap(data) {
    return this.http.post(this.apiRoot + '/updategrpusermap', data, httpOptions);
  }

  addasset(data) {
    return this.http.post(this.apiRoot + '/addasset', data, httpOptions);
  }

  getasset(data) {
    return this.http.post(this.apiRoot + '/getasset', data, httpOptions);
  }

  deleteasset(data) {
    return this.http.post(this.apiRoot + '/deleteasset', data, httpOptions);
  }

  updateasset(data) {
    return this.http.post(this.apiRoot + '/updateasset', data, httpOptions);
  }

  getsupportgrplevel() {
    return this.http.get(this.apiRoot + '/getsupportgrplevel');
  }

  getworkinglevel(data) {
    return this.http.post(this.apiRoot + '/getworkinglevel', data, httpOptions);
  }

  addcategorysupporgrpmap(data) {
    return this.http.post(this.apiRoot + '/addcategorysupporgrpmap', data, httpOptions);
  }

  getcategorysupporgrpmap(data) {
    return this.http.post(this.apiRoot + '/getcategorysupporgrpmap', data, httpOptions);
  }

  deletecategorysupporgrpmap(data) {
    return this.http.post(this.apiRoot + '/deletecategorysupporgrpmap', data, httpOptions);
  }

  updatecategorysupporgrpmap(data) {
    return this.http.post(this.apiRoot + '/updatecategorysupporgrpmap', data, httpOptions);
  }

  getalllabel(data) {
    return this.http.post(this.apiRoot + '/getalllabel', data, httpOptions);
  }

  getallcategorylevel(data) {
    return this.http.post(this.apiRoot + '/getallcategorylevel', data, httpOptions);
  }

  getrecorddiffbyorg(data) {
    return this.http.post(this.apiRoot + '/getrecorddiffbyorg', data, httpOptions);
  }

  addassetvalidation(data) {
    return this.http.post(this.apiRoot + '/addassetvalidation', data, httpOptions);
  }

  getassetvalidation(data) {
    return this.http.post(this.apiRoot + '/getassetvalidation', data, httpOptions);
  }

  deleteassetvalidation(data) {
    return this.http.post(this.apiRoot + '/deleteassetvalidation', data, httpOptions);
  }

  getassetbytype(data) {
    return this.http.post(this.apiRoot + '/getassetbytype', data, httpOptions);
  }

  getassetdiffval(data) {
    return this.http.post(this.apiRoot + '/getassetdiffval', data, httpOptions);
  }

  updateassetdiffval(data) {
    return this.http.post(this.apiRoot + '/updateassetdiffval', data, httpOptions);
  }

  getassetdifferentiation(data) {
    return this.http.post(this.apiRoot + '/getassetdifferentiation', data, httpOptions);
  }

  getmstrecordterms(data) {
    return this.http.post(this.apiRoot + '/getmstrecordterms', data, httpOptions);
  }

  getmapfunctionalitygrp(data) {
    return this.http.post(this.apiRoot + '/getmapfunctionalitygrp', data, httpOptions);
  }

  addmapfunctionalitygrp(data) {
    return this.http.post(this.apiRoot + '/addmapfunctionalitygrp', data, httpOptions);
  }

  deletemapfunctionalitygrp(data) {
    return this.http.post(this.apiRoot + '/deletemapfunctionalitygrp', data, httpOptions);
  }

  getmststateterms(data) {
    return this.http.post(this.apiRoot + '/getmststateterms', data, httpOptions);
  }

  addmststateterms(data) {
    return this.http.post(this.apiRoot + '/addmststateterms', data, httpOptions);
  }

  deletemststateterms(data) {
    return this.http.post(this.apiRoot + '/deletemststateterms', data, httpOptions);
  }

  updatemststateterms(data) {
    return this.http.post(this.apiRoot + '/updatemststateterms', data, httpOptions);
  }

  addmstrecordterms(data) {
    return this.http.post(this.apiRoot + '/addmstrecordterms', data, httpOptions);

  }

  listmstrecordterms(data) {
    return this.http.post(this.apiRoot + '/listmstrecordterms', data, httpOptions);

  }

  deletemstrecordterms(data) {
    return this.http.post(this.apiRoot + '/deletemstrecordterms', data, httpOptions);

  }

  getmsttermtype(data) {
    return this.http.post(this.apiRoot + '/getmsttermtype', data, httpOptions);
  }

  updatemstrecordterms(data) {
    return this.http.post(this.apiRoot + '/updatemstrecordterms', data, httpOptions);
  }

  addprocessstatemap(data) {
    return this.http.post(this.apiRoot + '/addprocessstatemap', data, httpOptions);
  }

  getprocessstatemap(data) {
    return this.http.post(this.apiRoot + '/getprocessstatemap', data, httpOptions);
  }

  deleteprocessstatemap(data) {
    return this.http.post(this.apiRoot + '/deleteprocessstatemap', data, httpOptions);
  }

  getworklowutilitylist(data) {
    return this.http.post(this.apiRoot + '/getworklowutilitylist', data, httpOptions);
  }

  updateprocessstatemap(data) {
    return this.http.post(this.apiRoot + '/updateprocessstatemap', data, httpOptions);
  }

  getworkdifferentiationvalue(data) {
    return this.http.post(this.apiRoot + '/getworkdifferentiationvalue', data, httpOptions);
  }

  addstatetype(data) {
    return this.http.post(this.apiRoot + '/addstatetype', data, httpOptions);
  }

  updatestatetype(data) {
    return this.http.post(this.apiRoot + '/updatestatetype', data, httpOptions);
  }

  getstatetype(data) {
    return this.http.post(this.apiRoot + '/getstatetype', data, httpOptions);

  }

  deletestatetype(data) {
    return this.http.post(this.apiRoot + '/deletestatetype', data, httpOptions);

  }

  getstate(data) {
    return this.http.post(this.apiRoot + '/getstate', data, httpOptions);

  }

  addstate(data) {
    return this.http.post(this.apiRoot + '/addstate', data, httpOptions);
  }

  updatestate(data) {
    return this.http.post(this.apiRoot + '/updatestate', data, httpOptions);

  }

  deletestate(data) {
    return this.http.post(this.apiRoot + '/deletestate', data, httpOptions);

  }

  getutilitydatabyfield(data) {
    return this.http.post(this.apiRoot + '/getutilitydatabyfield', data, httpOptions);

  }

  addmaprecordstatedifferentiation(data) {
    return this.http.post(this.apiRoot + '/addmaprecordstatedifferentiation', data, httpOptions);

  }

  getmaprecordstatedifferentiation(data) {
    return this.http.post(this.apiRoot + '/getmaprecordstatedifferentiation', data, httpOptions);

  }

  updatemaprecordstatedifferentiation(data) {
    return this.http.post(this.apiRoot + '/updatemaprecordstatedifferentiation', data, httpOptions);

  }

  deletemaprecordstatedifferentiation(data) {
    return this.http.post(this.apiRoot + '/deletemaprecordstatedifferentiation', data, httpOptions);

  }

  getprocess(data) {
    return this.http.post(this.apiRoot + '/getprocess', data, httpOptions);
  }

  deleteprocess(data) {
    return this.http.post(this.apiRoot + '/deleteprocess', data, httpOptions);
  }

  createprocess(data) {
    return this.http.post(this.apiRoot + '/createprocess', data, httpOptions);
  }

  updateprocess(data) {
    return this.http.post(this.apiRoot + '/updateprocess', data, httpOptions);
  }

  getprocessadmin(data) {
    return this.http.post(this.apiRoot + '/getprocessadmin', data, httpOptions);
  }

  deleteprocessadmin(data) {
    return this.http.post(this.apiRoot + '/deleteprocessadmin', data, httpOptions);
  }

  addprocessadmin(data) {
    return this.http.post(this.apiRoot + '/addprocessadmin', data, httpOptions);
  }

  updateprocessadmin(data) {
    return this.http.post(this.apiRoot + '/updateprocessadmin', data, httpOptions);
  }

  searchworkflowuser(data) {
    return this.http.post(this.apiRoot + '/searchworkflowuser', data, httpOptions);
  }

  deleteurlfrommenu(data) {
    return this.http.post(this.apiRoot + '/deleteurlfrommenu', data, httpOptions);
  }

  addassigncommontiles(data) {
    return this.http.post(this.apiRoot + '/addassigncommontiles', data, httpOptions);

  }

  getassigncommontiles(data) {
    return this.http.post(this.apiRoot + '/getassigncommontiles', data, httpOptions);

  }

  deleteassigncommontiles(data) {
    return this.http.post(this.apiRoot + '/deleteassigncommontiles', data, httpOptions);
  }

  updateassigncommontiles(data) {
    return this.http.post(this.apiRoot + '/updateassigncommontiles', data, httpOptions);

  }

  addquestionanswer(data) {
    return this.http.post(this.apiRoot + '/addquestionanswer', data, httpOptions);
  }

  deletedocuments(data) {
    return this.http.post(this.apiRoot + '/deletedocuments', data, httpOptions);

  }

  getdocuments(data) {
    return this.http.post(this.apiRoot + '/getdocuments', data, httpOptions);
  }

  adddocuments(data) {
    return this.http.post(this.apiRoot + '/adddocuments', data, httpOptions);

  }

  updatedocuments(data) {
    return this.http.post(this.apiRoot + '/updatedocuments', data, httpOptions);

  }

  getworkinglabelname(data) {
    return this.http.post(this.apiRoot + '/getworkinglabelname', data, httpOptions);

  }

  getmstrecordfield(data) {
    return this.http.post(this.apiRoot + '/getmstrecordfield', data, httpOptions);
  }

  addmstrecordfield(data) {
    return this.http.post(this.apiRoot + '/addmstrecordfield', data, httpOptions);
  }

  deletemstrecordfield(data) {
    return this.http.post(this.apiRoot + '/deletemstrecordfield', data, httpOptions);
  }

  deletetemplatevariable(data) {
    return this.http.post(this.apiRoot + '/deletetemplatevariable', data, httpOptions);
  }

  gettemplatevariable(data) {
    return this.http.post(this.apiRoot + '/gettemplatevariable', data, httpOptions);
  }

  addtemplatevariable(data) {
    return this.http.post(this.apiRoot + '/addtemplatevariable', data, httpOptions);
  }

  updatetemplatevariable(data) {
    return this.http.post(this.apiRoot + '/updatetemplatevariable', data, httpOptions);
  }

  // ================
  deletemstclientsla(data) {
    return this.http.post(this.apiRoot + '/deletemstclientsla', data, httpOptions);
  }

  getmstclientsla(data) {
    return this.http.post(this.apiRoot + '/getmstclientsla', data, httpOptions);
  }

  addmstclientsla(data) {
    return this.http.post(this.apiRoot + '/addmstclientsla', data, httpOptions);
  }

  updatemstclientsla(data) {
    return this.http.post(this.apiRoot + '/updatemstclientsla', data, httpOptions);
  }

  addslatimezone(data) {
    return this.http.post(this.apiRoot + '/addslatimezone', data, httpOptions);
  }

  getslatimezone(data) {
    return this.http.post(this.apiRoot + '/getslatimezone', data, httpOptions);
  }

  deleteslatimezone(data) {
    return this.http.post(this.apiRoot + '/deleteslatimezone', data, httpOptions);
  }

  getslanames(data) {
    return this.http.post(this.apiRoot + '/getslanames', data, httpOptions);
  }

  updateslatimezone(data) {
    return this.http.post(this.apiRoot + '/updateslatimezone', data, httpOptions);
  }

  addslastate(data) {
    return this.http.post(this.apiRoot + '/addslastate', data, httpOptions);
  }

  getslastate(data) {
    return this.http.post(this.apiRoot + '/getslastate', data, httpOptions);
  }

  deleteslastate(data) {
    return this.http.post(this.apiRoot + '/deleteslastate', data, httpOptions);
  }

  updateslastate(data) {
    return this.http.post(this.apiRoot + '/updateslastate', data, httpOptions);
  }

  deleteslacriteria(data) {
    return this.http.post(this.apiRoot + '/deleteslacriteria', data, httpOptions);
  }

  addmstslacriteria(data) {
    return this.http.post(this.apiRoot + '/addmstslacriteria', data, httpOptions);
  }

  getslacriteria(data) {
    return this.http.post(this.apiRoot + '/getslacriteria', data, httpOptions);
  }

  addmsttemplate(data) {
    return this.http.post(this.apiRoot + '/addmsttemplate', data, httpOptions);
  }

  deletetemplate(data) {
    return this.http.post(this.apiRoot + '/deletetemplate', data, httpOptions);
  }

  gettemplate(data) {
    return this.http.post(this.apiRoot + '/gettemplate', data, httpOptions);

  }

  getmstslaentity(data) {
    return this.http.post(this.apiRoot + '/getmstslaentity', data, httpOptions);
  }

  addmstslaentity(data) {
    return this.http.post(this.apiRoot + '/addmstslaentity', data, httpOptions);
  }

  deletemstslaentity(data) {
    return this.http.post(this.apiRoot + '/deletemstslaentity', data, httpOptions);
  }

  updatemstslaentity(data) {
    return this.http.post(this.apiRoot + '/updatemstslaentity', data, httpOptions);
  }

  updatetemplate(data) {
    return this.http.post(this.apiRoot + '/updatetemplate', data, httpOptions);
  }

  updateslacriteria(data) {
    return this.http.post(this.apiRoot + '/updateslacriteria', data, httpOptions);
  }

  getstatebyprocess(data) {
    return this.http.post(this.apiRoot + '/getstatebyprocess', data, httpOptions);
  }

  searchuserbygroupid(data) {
    return this.http.post(this.apiRoot + '/searchuserbygroupid', data, httpOptions);
  }

  insertprocess(data) {
    return this.http.post(this.apiRoot + '/insertprocess', data, httpOptions);
  }

  getprocessdetails(data) {
    return this.http.post(this.apiRoot + '/getprocessdetails', data, httpOptions);
  }

  gettransitionstatedetails(data) {
    return this.http.post(this.apiRoot + '/gettransitionstatedetails', data, httpOptions);
  }

  addbusinessdirection(data) {
    return this.http.post(this.apiRoot + '/addbusinessdirection', data, httpOptions);
  }

  deletebusinessdirection(data) {
    return this.http.post(this.apiRoot + '/deletebusinessdirection', data, httpOptions);
  }

  getbusinessdirection(data) {
    return this.http.post(this.apiRoot + '/getbusinessdirection', data, httpOptions);
  }

  addslapauseindicator(data) {
    return this.http.post(this.apiRoot + '/addslapauseindicator', data, httpOptions);
  }

  deleteslapauseindicator(data) {
    return this.http.post(this.apiRoot + '/deleteslapauseindicator', data, httpOptions);
  }

  getslapauseindicator(data) {
    return this.http.post(this.apiRoot + '/getslapauseindicator', data, httpOptions);
  }

  updateslapauseindicator(data) {
    return this.http.post(this.apiRoot + '/updateslapauseindicator', data, httpOptions);
  }

  checkmatrixconfig(data) {
    return this.http.post(this.apiRoot + '/checkmatrixconfig', data, httpOptions);
  }

  deletebusinessmatrix(data) {
    return this.http.post(this.apiRoot + '/deletebusinessmatrix', data, httpOptions);

  }

  addbusinessmatrix(data) {
    return this.http.post(this.apiRoot + '/addbusinessmatrix', data, httpOptions);

  }

  getbusinessmatrix(data) {
    return this.http.post(this.apiRoot + '/getbusinessmatrix', data, httpOptions);

  }

  deleteslaresponsesupportgrp(data) {
    return this.http.post(this.apiRoot + '/deleteslaresponsesupportgrp', data, httpOptions);
  }

  getslaresponsesupportgrp(data) {
    return this.http.post(this.apiRoot + '/getslaresponsesupportgrp', data, httpOptions);
  }

  getfullfillmentcriteriaid(data) {
    return this.http.post(this.apiRoot + '/getfullfillmentcriteriaid', data, httpOptions);
  }

  addslaresponsesupportgrp(data) {
    return this.http.post(this.apiRoot + '/addslaresponsesupportgrp', data, httpOptions);
  }

  getsupportgrpenableslanames(data) {
    return this.http.post(this.apiRoot + '/getsupportgrpenableslanames', data, httpOptions);
  }

  addcategorytaskmap(data) {
    return this.http.post(this.apiRoot + '/addcategorytaskmap', data, httpOptions);
  }

  getcategorytaskmap(data) {
    return this.http.post(this.apiRoot + '/getcategorytaskmap', data, httpOptions);
  }

  deletecategorytaskmap(data) {
    return this.http.post(this.apiRoot + '/deletecategorytaskmap', data, httpOptions);
  }

  updateslaresponsesupportgrp(data) {
    return this.http.post(this.apiRoot + '/updateslaresponsesupportgrp', data, httpOptions);
  }

  updatecategorytaskmap(data) {
    return this.http.post(this.apiRoot + '/updatecategorytaskmap', data, httpOptions);
  }

  getlabelbydiffid(data) {
    return this.http.post(this.apiRoot + '/getlabelbydiffid', data, httpOptions);
  }

  getrecorddata(data) {
    return this.http.post(this.recordRoot + '/getrecorddata', data, httpOptions);

  }

  getrecordtypedata(data) {
    return this.http.post(this.recordRoot + '/getrecordtypedata', data, httpOptions);

  }

  getrecordcatchilddata(data) {
    return this.http.post(this.recordRoot + '/getrecordcatchilddata', data, httpOptions);
  }

  getlastlevelcatname(data) {
    return this.http.post(this.apiRoot + '/getlastlevelcatname', data, httpOptions);

  }

  getrecordpriority(data) {
    return this.http.post(this.recordRoot + '/getrecordpriority', data, httpOptions);

  }

  upserttransitiondetails(data) {
    return this.http.post(this.apiRoot + '/upserttransitiondetails', data, httpOptions);
  }

  deletetransitionstate(data) {
    return this.http.post(this.apiRoot + '/deletetransitionstate', data, httpOptions);
  }

  createtransition(data) {
    return this.http.post(this.apiRoot + '/createtransition', data, httpOptions);
  }

  createrecord(data) {
    return this.http.post(this.recordRoot + '/createrecord', data, httpOptions);
  }

  getslanameagainstworkflowid(data) {
    return this.http.post(this.apiRoot + '/getslanameagainstworkflowid', data, httpOptions);
  }

  addslastartendcriteria(data) {
    return this.http.post(this.apiRoot + '/addslastartendcriteria', data, httpOptions);
  }

  deleteslastartendcriteria(data) {
    return this.http.post(this.apiRoot + '/deleteslastartendcriteria', data, httpOptions);
  }

  getslastartendcriteria(data) {
    return this.http.post(this.apiRoot + '/getslastartendcriteria', data, httpOptions);
  }

  updateslastartendcriteria(data) {
    return this.http.post(this.apiRoot + '/updateslastartendcriteria', data, httpOptions);
  }

  getclietwiseasset(data) {
    return this.http.post(this.apiRoot + '/getclietwiseasset', data, httpOptions);
  }

  getassettypes(data) {
    return this.http.post(this.apiRoot + '/getassettypes', data, httpOptions);
  }

  getassetattributes(data) {
    return this.http.post(this.apiRoot + '/getassetattributes', data, httpOptions);
  }

  getassetbytypenvalue(data) {
    return this.http.post(this.apiRoot + '/getassetbytypenvalue', data, httpOptions);
  }

  getadditionalfields(data) {
    return this.http.post(this.recordRoot + '/getadditionalfields', data, httpOptions);
  }

  getdynamicqueryresult(data) {
    return this.http.post(this.recordRoot + '/getdynamicqueryresult', data, httpOptions);
  }

  getactiontypenames(data) {
    return this.http.post(this.apiRoot + '/getactiontypenames', data, httpOptions);
  }

  addactivity(data) {
    return this.http.post(this.apiRoot + '/addactivity', data, httpOptions);
  }

  getactivity(data) {
    return this.http.post(this.apiRoot + '/getactivity', data, httpOptions);
  }

  deleteactivity(data) {
    return this.http.post(this.apiRoot + '/deleteactivity', data, httpOptions);
  }

  updateactivity(data) {
    return this.http.post(this.apiRoot + '/updateactivity', data, httpOptions);
  }

  getrecordcat(data) {
    return this.http.post(this.recordRoot + '/getrecordcategory', data, httpOptions);
  }

  getrecorddetails(data) {
    return this.http.post(this.recordRoot + '/getrecorddetails', data, httpOptions);
  }

  getstatedetails(data) {
    return this.http.post(this.apiRoot + '/getstatedetails', data, httpOptions);
  }

  getnextstatedetails(data) {
    return this.http.post(this.apiRoot + '/getnextstatedetails', data, httpOptions);
  }

  gettransitiongroupdetails(data) {
    return this.http.post(this.apiRoot + '/gettransitiongroupdetails', data, httpOptions);
  }

  moveWorkflow(data) {
    return this.http.post(this.apiRoot + '/moveWorkflow', data, httpOptions);
  }

  changerecordgroup(data) {
    return this.http.post(this.apiRoot + '/changerecordgroup', data, httpOptions);
  }

  gettilesnames(data) {
    return this.http.post(this.apiRoot + '/gettilesnames', data, httpOptions);
  }

  categoryLabel(data) {
    return this.http.post(this.apiRoot + '/getlablelmappingbydifftype', data, httpOptions);
  }

  getactivitywithtype(data) {
    return this.http.post(this.apiRoot + '/getactivitywithtype', data, httpOptions);
  }

  getdynamicquerycountresult(data) {
    return this.http.post(this.recordRoot + '/getdynamicquerycountresult', data, httpOptions);
  }

  getcommontermnames(data) {
    return this.http.post(this.recordRoot + '/getcommontermnames', data, httpOptions);
  }

  inserttermvalue(data) {
    return this.http.post(this.recordRoot + '/inserttermvalue', data, httpOptions);
  }

  gettermvaluesbytermid(data) {
    return this.http.post(this.recordRoot + '/gettermvaluesbytermid', data, httpOptions);
  }

  getcommontermnamesbystate(data) {
    return this.http.post(this.recordRoot + '/getcommontermnamesbystate', data, httpOptions);
  }

  gettermvalues(data) {
    return this.http.post(this.recordRoot + '/gettermvalues', data, httpOptions);
  }

  gettransitionbyprocess(data) {
    return this.http.post(this.apiRoot + '/gettransitionbyprocess', data, httpOptions);
  }

  recordwiseuserinfo(data) {
    return this.http.post(this.apiRoot + '/recordwiseuserinfo', data, httpOptions);
  }

  useridwiseuserinfo(data) {
    return this.http.post(this.apiRoot + '/useridwiseuserinfo', data, httpOptions);
  }

  insertmultipletermvalue(data) {
    return this.http.post(this.recordRoot + '/insertmultipletermvalue', data, httpOptions);
  }

  getrecordassetbyid(data) {
    return this.http.post(this.recordRoot + '/getrecordassetbyid', data, httpOptions);
  }

  deleteassetfromrecord(data) {
    return this.http.post(this.recordRoot + '/deleteassetfromrecord', data, httpOptions);
  }

  addassetwithrecord(data) {
    return this.http.post(this.recordRoot + '/addassetwithrecord', data, httpOptions);
  }

  getassettypesbyrecordid(data) {
    return this.http.post(this.recordRoot + '/getassettypesbyrecordid', data, httpOptions);
  }

  getSlatabvalues(data) {
    return this.http.post(this.recordRoot + '/getSlatabvalues', data, httpOptions);
  }

  getSlaresolutionremain(data) {
    return this.http.post(this.recordRoot + '/getSlaresolutionremain', data, httpOptions);
  }

  clientwisedayofweek(data) {
    return this.http.post(this.apiRoot + '/clientwisedayofweek', data, httpOptions);
  }

  getcategorybycatalog(data) {
    return this.http.post(this.apiRoot + '/getcategorybycatalog', data, httpOptions);
  }

  getSLAmeternames() {
    return this.http.get(this.apiRoot + '/getSLAmeternames');
  }

  getSLAtermsnames(data) {
    return this.http.post(this.apiRoot + '/getSLAtermsnames', data, httpOptions);
  }

  deleteprocessdetails(data) {
    return this.http.post(this.apiRoot + '/deleteprocessdetails', data, httpOptions);
  }

  getmiscdatabyrecordid(data) {
    return this.http.post(this.recordRoot + '/getmiscdatabyrecordid', data, httpOptions);
  }

  getrecorddetailsbyno(data) {
    return this.http.post(this.recordRoot + '/getrecorddetailsbyno', data, httpOptions);
  }

  savechildrecord(data) {
    return this.http.post(this.recordRoot + '/savechildrecord', data, httpOptions);
  }

  getchildrecordbyparent(data) {
    return this.http.post(this.recordRoot + '/getchildrecordbyparent', data, httpOptions);
  }

  getrecordreleationnames(data) {
    return this.http.post(this.apiRoot + '/getrecordreleationnames', data, httpOptions);
  }

  getrecordtermnames(data) {
    return this.http.post(this.apiRoot + '/getrecordtermnames', data, httpOptions);
  }

  getrecordreleationwithterm(data) {
    return this.http.post(this.apiRoot + '/getrecordreleationwithterm', data, httpOptions);
  }

  addrecordreleationwithterm(data) {
    return this.http.post(this.apiRoot + '/addrecordreleationwithterm', data, httpOptions);
  }

  deleterecordreleationwithterm(data) {
    return this.http.post(this.apiRoot + '/deleterecordreleationwithterm', data, httpOptions);
  }

  updaterecordreleationwithterm(data) {
    return this.http.post(this.apiRoot + '/updaterecordreleationwithterm', data, httpOptions);
  }

  getRecorddifferentiationbyparent(data) {
    return this.http.post(this.apiRoot + '/getRecorddifferentiationbyparent', data, httpOptions);
  }

  searchcategory(data) {
    return this.http.post(this.apiRoot + '/searchcategory', data, httpOptions);
  }

  getcatelogrecord(data) {
    return this.http.post(this.apiRoot + '/getcatelogrecord', data, httpOptions);
  }

  getmstsupportgrp(data) {
    return this.http.post(this.apiRoot + '/getmstsupportgrp', data, httpOptions);
  }

  addmstsupportgrp(data) {
    return this.http.post(this.apiRoot + '/addmstsupportgrp', data, httpOptions);
  }

  updatemstsupportgrp(data) {
    return this.http.post(this.apiRoot + '/updatemstsupportgrp', data, httpOptions);
  }

  deletemstsupportgrp(data) {
    return this.http.post(this.apiRoot + '/deletemstsupportgrp', data, httpOptions);
  }

  recentrecords(data) {
    return this.http.post(this.recordRoot + '/recentrecords', data, httpOptions);
  }

  recordcount(data) {
    return this.http.post(this.recordRoot + '/recordcount', data, httpOptions);
  }

  updatepriority(data) {
    return this.http.post(this.recordRoot + '/updatepriority', data, httpOptions);
  }

  frequentrecords(data) {
    return this.http.post(this.recordRoot + '/frequentrecords', data, httpOptions);
  }

  recordlogs(data) {
    return this.http.post(this.recordRoot + '/recordlogs', data, httpOptions);
  }

  getadditionalfieldsbytypecat(data) {
    return this.http.post(this.recordRoot + '/getadditionalfieldsbytypecat', data, httpOptions);
  }

  removechildrecord(data) {
    return this.http.post(this.recordRoot + '/removechildrecord', data, httpOptions);
  }

  getparentrecordid(data) {
    return this.http.post(this.recordRoot + '/getparentrecordid', data, httpOptions);
  }

  faqSearchKeywordCTSforDocs(data) {
    return this.http.get(this.faqRoot + '/faqSearchKeywordCTSforDocs?clientId=' + data.clientId + '&searchKeyword=' + data.searchKeyword + '&diffid=' + data.diffid + '&supportGrpId=' + data.supportGrpId + '&difftypeid=' + data.difftypeid + '&orgnid=' + data.orgnid);
  }

  updatecategory(data) {
    return this.http.post(this.recordRoot + '/updatecategory', data, httpOptions);
  }

  getactivitynms(data) {
    return this.http.post(this.recordRoot + '/getactivitynms', data, httpOptions);
  }

  gethopcount(data) {
    return this.http.post(this.apiRoot + '/gethopcount', data, httpOptions);
  }

  getstatebyseqno(data) {
    return this.http.post(this.apiRoot + '/getstatebyseq', data, httpOptions);
  }

  changepassword(data) {
    return this.http.post(this.apiRoot + '/changepassword', data, httpOptions);
  }

  newactivitylogs(data) {
    return this.http.post(this.recordRoot + '/newactivitylogs', data, httpOptions);
  }

  searchactivitylogs(data) {
    return this.http.post(this.recordRoot + '/searchactivitylogs', data, httpOptions);
  }

  pendingvendortermsvalue(data) {
    return this.http.post(this.recordRoot + '/pendingvendortermsvalue', data, httpOptions);
  }

  getattachedfiles(data) {
    return this.http.post(this.recordRoot + '/getattachedfiles', data, httpOptions);
  }

  gettermnamebyseq(data) {
    return this.http.post(this.recordRoot + '/gettermnamebyseq', data, httpOptions);
  }

  updatedoccount(data) {
    return this.http.post(this.recordRoot + '/updatedoccount', data, httpOptions);
  }

  getassetbyrecordidnfieldname(data) {
    return this.http.post(this.recordRoot + '/getassetbyrecordidnfieldname', data, httpOptions);
  }

  customervisiblecomment(data) {
    return this.http.post(this.recordRoot + '/customervisiblecomment', data, httpOptions);
  }

  filedownload(data) {
    return this.http.post(this.apiRoot + '/filedownload', data, httpOptions1);
  }

  deleteattachment(data) {
    return this.http.post(this.recordRoot + '/deleteattachment', data, httpOptions);
  }

  bulkcategoryupload(data) {
    return this.http.post(this.cateUploadRoot + '/bulkcategoryupload', data, httpOptions);
  }

  bulkassetupload(data) {
    return this.http.post(this.assetRoot + '/bulkassetupload', data, httpOptions);
  }

  updateusercolor(data) {
    return this.http.post(this.apiRoot + '/updateusercolor', data, httpOptions);
  }

  gettermvaluebyseq(data) {
    return this.http.post(this.recordRoot + '/gettermvaluebyseq', data, httpOptions);
  }

  getparencollaborationtchildlogs(data) {
    return this.http.post(this.recordRoot + '/getparencollaborationtchildlogs', data, httpOptions);
  }

  validateusertoken(data) {
    return this.http.post(this.apiRoot + '/validateusertoken', data, httpOptions);
  }

  sendMailTicketWise(data) {
    return this.http.post(this.messageRoot + '/iFIXMessaging/instantmessaging', data, httpOptions);
  }

  addbanner(data) {
    return this.http.post(this.apiRoot + '/addbanner', data, httpOptions);
  }

  updatebanner(data) {
    return this.http.post(this.apiRoot + '/updatebanner', data, httpOptions);
  }

  deletebanner(data) {
    return this.http.post(this.apiRoot + '/deletebanner', data, httpOptions);
  }

  getbanner(data) {
    return this.http.post(this.apiRoot + '/getbanner', data, httpOptions);
  }

  addparentfromchild(data) {
    return this.http.post(this.recordRoot + '/addparentfromchild', data, httpOptions);
  }

  getbannermessage(data) {
    return this.http.post(this.apiRoot + '/getbannermessage', data, httpOptions);
  }

  getparentrecorddetails(data) {
    return this.http.post(this.recordRoot + '/getparentrecorddetails', data, httpOptions);
  }

  updatebannersequence(data) {
    return this.http.post(this.apiRoot + '/updatebannersequence', data, httpOptions);
  }

  childsearchcriteria(data) {
    return this.http.post(this.recordRoot + '/childsearchcriteria', data, httpOptions);
  }

  getassetdetailsbyid(data) {
    return this.http.post(this.recordRoot + '/getassetdetailsbyid', data, httpOptions);
  }

  getallassettypendetailsbyrecordid(data) {
    return this.http.post(this.recordRoot + '/getallassettypendetailsbyrecordid', data, httpOptions);
  }

  searchname(data) {
    return this.http.post(this.apiRoot + '/searchname', data, httpOptions);
  }

  searchloginname(data) {
    return this.http.post(this.apiRoot + '/searchloginname', data, httpOptions);
  }

  searchbranch(data) {
    return this.http.post(this.apiRoot + '/searchbranch', data, httpOptions);
  }

  getnotificationevents(data) {
    return this.http.post(this.apiRoot + '/getnotificationevents', data, httpOptions);
  }

  getallnotificationtemplates(data) {
    return this.http.post(this.apiRoot + '/getallnotificationtemplates', data, httpOptions);
  }

  searchloginnamebygroupids(data) {
    return this.http.post(this.apiRoot + '/searchloginnamebygroupids', data, httpOptions);
  }

  insertnotificationtemplate(data) {
    return this.http.post(this.apiRoot + '/insertnotificationtemplate', data, httpOptions);
  }

  deletenotificationtemplate(data) {
    return this.http.post(this.apiRoot + '/deletenotificationtemplate', data, httpOptions);
  }

  updatenotificationtemplate(data) {
    return this.http.post(this.apiRoot + '/updatenotificationtemplate', data, httpOptions);
  }

  getallnotificationvariables(data) {
    return this.http.post(this.apiRoot + '/getallnotificationvariables', data, httpOptions);
  }

  gettimeformat() {
    return this.http.get(this.apiRoot + '/gettimeformat');
  }

  getlogintype() {
    return this.http.get(this.apiRoot + '/getlogintype');
  }

  addmstldap(data) {
    return this.http.post(this.apiRoot + '/addmstldap', data, httpOptions);
  }

  updatemstldap(data) {
    return this.http.post(this.apiRoot + '/updatemstldap', data, httpOptions);
  }

  updatemstldapcertificate(data) {
    return this.http.post(this.apiRoot + '/updatemstldapcertificate', data, httpOptions);
  }

  getallmstldap(data) {
    return this.http.post(this.apiRoot + '/getallmstldap', data, httpOptions);
  }

  deletemstldap(data) {
    return this.http.post(this.apiRoot + '/deletemstldap', data, httpOptions);
  }

  addmapldapgrouprole(data) {
    return this.http.post(this.apiRoot + '/addmapldapgrouprole', data, httpOptions);
  }

  updatemapldapgrouprole(data) {
    return this.http.post(this.apiRoot + '/updatemapldapgrouprole', data, httpOptions);
  }

  getallmapldapgrouprole(data) {
    return this.http.post(this.apiRoot + '/getallmapldapgrouprole', data, httpOptions);
  }

  deletemapldapgrouprole(data) {
    return this.http.post(this.apiRoot + '/deletemapldapgrouprole', data, httpOptions);
  }

  getmappedattributes(data) {
    return this.http.post(this.apiRoot + '/getmappedattributes', data, httpOptions);
  }

  insertmstsupportgrp(data) {
    return this.http.post(this.apiRoot + '/insertmstsupportgrp', data, httpOptions);
  }

  updatemstsupportgroup(data) {
    return this.http.post(this.apiRoot + '/updatemstsupportgroup', data, httpOptions);
  }

  deletemstsupportgroup(data) {
    return this.http.post(this.apiRoot + '/deletemstsupportgroup', data, httpOptions);
  }

  getmstsupportgroup(data) {
    return this.http.post(this.apiRoot + '/getmstsupportgroup', data, httpOptions);
  }

  getldapattributes(data) {
    return this.http.post(this.apiRoot + '/getldapattributes', data, httpOptions);
  }

  gettabledetails(data) {
    return this.http.post(this.apiRoot + '/gettabledetails', data, httpOptions);
  }

  insertmapexternalattributes(data) {
    return this.http.post(this.apiRoot + '/insertmapexternalattributes', data, httpOptions);
  }

  getAllmapexternalattributes(data) {
    return this.http.post(this.apiRoot + '/getAllmapexternalattributes', data, httpOptions);
  }

  deletemapexternalattributes(data) {
    return this.http.post(this.apiRoot + '/deletemapexternalattributes', data, httpOptions);
  }

  inpersonatelogin(data) {
    return this.http.post(this.apiRoot + '/inpersonatelogin', data, httpOptions);
  }

  checkworkflowstate(data) {
    return this.http.post(this.apiRoot + '/checkworkflowstate', data, httpOptions);
  }

  addclientsupportgroupnew(data) {
    return this.http.post(this.apiRoot + '/addclientsupportgroupnew', data, httpOptions);
  }

  updateclientsupportgroupnew(data) {
    return this.http.post(this.apiRoot + '/updateclientsupportgroupnew', data, httpOptions);
  }

  getallclientsupportgroupnew(data) {
    return this.http.post(this.apiRoot + '/getallclientsupportgroupnew', data, httpOptions);
  }

  deleteclientsupportgroupnew(data) {
    return this.http.post(this.apiRoot + '/deleteclientsupportgroupnew', data, httpOptions);
  }

  getmstsupportgroupbycopyable(data) {
    return this.http.post(this.apiRoot + '/getmstsupportgroupbycopyable', data, httpOptions);
  }

  getcategorybylastid(data) {
    return this.http.post(this.recordRoot + '/getcategorybylastid', data, httpOptions);
  }

  createdifferentiationmap(data) {
    return this.http.post(this.apiRoot + '/createdifferentiationmap', data, httpOptions);
  }

  getalldifferentiationmap(data) {
    return this.http.post(this.apiRoot + '/getalldifferentiationmap', data, httpOptions);
  }

  deletedifferentiationmap(data) {
    return this.http.post(this.apiRoot + '/deletedifferentiationmap', data, httpOptions);
  }

  insertclientsupportgroupfromto(data) {
    return this.http.post(this.apiRoot + '/insertclientsupportgroupfromto', data, httpOptions);
  }

  getAllclientsupportgroupbyclient(data) {
    return this.http.post(this.apiRoot + '/getAllclientsupportgroupbyclient', data, httpOptions);
  }

  insertmstprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/insertmstprocesstemplate', data, httpOptions);
  }

  getallmstprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/getallmstprocesstemplate', data, httpOptions);
  }

  deletemstprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/deletemstprocesstemplate', data, httpOptions);
  }

  updatemstprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/updatemstprocesstemplate', data, httpOptions);
  }

  insertmapprocesstemplatestate(data) {
    return this.http.post(this.apiRoot + '/insertmapprocesstemplatestate', data, httpOptions);
  }

  deletemapprocesstemplatestate(data) {
    return this.http.post(this.apiRoot + '/deletemapprocesstemplatestate', data, httpOptions);
  }

  getallmapprocesstemplatestate(data) {
    return this.http.post(this.apiRoot + '/getallmapprocesstemplatestate', data, httpOptions);
  }

  updatemapprocesstemplatestate(data) {
    return this.http.post(this.apiRoot + '/updatemapprocesstemplatestate', data, httpOptions);
  }

  getstatebyprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/getstatebyprocesstemplate', data, httpOptions);
  }

  getprocesstemplatedetails(data) {
    return this.http.post(this.apiRoot + '/getprocesstemplatedetails', data, httpOptions);
  }

  createprocesstemplatetransition(data) {
    return this.http.post(this.apiRoot + '/createprocesstemplatetransition', data, httpOptions);
  }

  insertprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/insertprocesstemplate', data, httpOptions);
  }

  deletetemplatetransitionstate(data) {
    return this.http.post(this.apiRoot + '/deletetemplatetransitionstate', data, httpOptions);
  }

  upserttemplatetransitiondetails(data) {
    return this.http.post(this.apiRoot + '/upserttemplatetransitiondetails', data, httpOptions);
  }

  gettemplatetransitionstatedetails(data) {
    return this.http.post(this.apiRoot + '/gettemplatetransitionstatedetails', data, httpOptions);
  }

  deleteprocesstemplatedetails(data) {
    return this.http.post(this.apiRoot + '/deleteprocesstemplatedetails', data, httpOptions);
  }

  getprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/getprocesstemplate', data, httpOptions);
  }

  GetUserByGroupId(data) {
    return this.http.post(this.apiRoot + '/GetUserByGroupId', data, httpOptions);
  }

  addgroupmember(data) {
    return this.http.post(this.apiRoot + '/addgroupmember', data, httpOptions);
  }

  getallgrpmember(data) {
    return this.http.post(this.apiRoot + '/getallgrpmember', data, httpOptions);
  }

  mapprocesstemplate(data) {
    return this.http.post(this.apiRoot + '/mapprocesstemplate', data, httpOptions);
  }

  recordtermscopy(data) {
    return this.http.post(this.apiRoot + '/recordtermscopy', data, httpOptions);
  }

  getrolebyorgid(data) {
    return this.http.post(this.apiRoot + '/getrolebyorgid', data, httpOptions);
  }

  getorganizationclientwisenew(data) {
    return this.http.post(this.apiRoot + '/getorganizationclientwisenew', data, httpOptions);
  }

  getprocessgroupbyorgid(data) {
    return this.http.post(this.apiRoot + '/getprocessgroupbyorgid', data, httpOptions);
  }

  addtaskmap(data) {
    return this.http.post(this.apiRoot + '/addtaskmap', data, httpOptions);
  }

  deletetaskmap(data) {
    return this.http.post(this.apiRoot + '/deletetaskmap', data, httpOptions);
  }

  gettaskmap(data) {
    return this.http.post(this.apiRoot + '/gettaskmap', data, httpOptions);
  }

  getpropdetailsbyseq(data) {
    // console.log(JSON.stringify(data))
    return this.http.post(this.apiRoot + '/getdiffdetailsbyseq', data, httpOptions);
  }

  bulkuserupload(data) {
    return this.http.post(this.userRoot + '/bulkuserupload', data, httpOptions);
  }

  bulkcategorydownload(data) {
    return this.http.post(this.cateUploadRoot + '/bulkcategorydownload', data, httpOptions);
  }

  updaterecorddifftypeandrecordtype(data) {
    return this.http.post(this.apiRoot + '/updaterecorddifftypeandrecordtype', data, httpOptions);
  }

  deleterecorddifftypeandrecordtype(data) {
    return this.http.post(this.apiRoot + '/deleterecorddifftypeandrecordtype', data, httpOptions);
  }

  addrecorddifftypeandrecordtype(data) {
    return this.http.post(this.apiRoot + '/addrecorddifftypeandrecordtype', data, httpOptions);
  }

  getallmstrecorddiffpriority(data) {
    return this.http.post(this.apiRoot + '/getallmstrecorddiffpriority', data, httpOptions);
  }

  deletemstrecorddiffpriority(data) {
    return this.http.post(this.apiRoot + '/deletemstrecorddiffpriority', data, httpOptions);
  }

  addmstrecorddiffpriority(data) {
    return this.http.post(this.apiRoot + '/addmstrecorddiffpriority', data, httpOptions);
  }

  updatemstrecorddiffpriority(data) {
    return this.http.post(this.apiRoot + '/updatemstrecorddiffpriority', data, httpOptions);
  }

  getcategorybyparentname(data) {
    return this.http.post(this.apiRoot + '/getcategorybyparentname', data, httpOptions);
  }

  getfromtypebydiffname(data) {
    return this.http.post(this.apiRoot + '/getfromtypebydiffname', data, httpOptions);
  }

  gettabbuttonnames(data) {
    return this.http.post(this.apiRoot + '/gettabbuttonnames', data, httpOptions);
  }

  getmappeddiffbyseq(data) {
    return this.http.post(this.apiRoot + '/getmappeddiffbyseq', data, httpOptions);
  }

  recordgridresult(data) {
    return this.http.post(this.recordRoot + '/recordgridresult', data, httpOptions);
  }

  getrecordid(data) {
    return this.http.post(this.recordRoot + '/getrecordid', data, httpOptions);
  }

  getcategorieslevel(data) {
    return this.http.post(this.apiRoot + '/getcategorieslevel', data, httpOptions);
  }

  getlabelbydiffseq(data) {
    return this.http.post(this.apiRoot + '/getlabelbydiffseq', data, httpOptions);
  }

  getallclientnames() {
    return this.http.post(this.apiRoot + '/getallclientnames', httpOptions);
  }

  searchmenubyuser(data) {
    return this.http.post(this.apiRoot + '/searchmenubyuser', data, httpOptions);
  }

  addmstexceltemplate(data) {
    return this.http.post(this.apiRoot + '/addmstexceltemplate', data, httpOptions);
  }

  updatemstexceltemplate(data) {
    return this.http.post(this.apiRoot + '/updatemstexceltemplate', data, httpOptions);
  }

  deletemstexceltemplate(data) {
    return this.http.post(this.apiRoot + '/deletemstexceltemplate', data, httpOptions);
  }

  getallmstexceltemplate(data) {
    return this.http.post(this.apiRoot + '/getallmstexceltemplate', data, httpOptions);
  }

  getallmstexceltemplatetype() {
    return this.http.post(this.apiRoot + '/getallmstexceltemplatetype', httpOptions);
  }

  generatetoken(data) {
    return this.http.post(this.apiRoot + '/generatetoken', data, httpOptions);
  }

  getallmstclientcredentialtype() {
    return this.http.post(this.apiRoot + '/getallmstclientcredentialtype', httpOptions);
  }

  getallmstclientcredential(data) {
    return this.http.post(this.apiRoot + '/getallmstclientcredential', data, httpOptions);
  }

  insertmstclientcredential(data) {
    return this.http.post(this.apiRoot + '/insertmstclientcredential', data, httpOptions);
  }

  updatemstclientcredential(data) {
    return this.http.post(this.apiRoot + '/updatemstclientcredential', data, httpOptions);
  }

  deletemstclientcredential(data) {
    return this.http.post(this.apiRoot + '/deletemstclientcredential', data, httpOptions);
  }

  recordfullresult(data) {
    return this.http.post(this.recordRoot + '/recordfullresult', data, httpOptions);
  }

  recordfilteradd(data) {
    return this.http.post(this.recordRoot + '/recordfilteradd', data, httpOptions);
  }

  recordfilterlist() {
    return this.http.post(this.recordRoot + '/recordfilterlist', httpOptions);
  }

  recordfilterdelete(data) {
    return this.http.post(this.recordRoot + '/recordfilterdelete', data, httpOptions);
  }

  addmsttemplatevariable(data) {
    return this.http.post(this.apiRoot + '/addmsttemplatevariable', data, httpOptions);
  }

  updatemsttemplatevariable(data) {
    return this.http.post(this.apiRoot + '/updatemsttemplatevariable', data, httpOptions);
  }

  getallmsttemplatevariable(data) {
    return this.http.post(this.apiRoot + '/getallmsttemplatevariable', data, httpOptions);
  }

  deletemsttemplatevariable(data) {
    return this.http.post(this.apiRoot + '/deletemsttemplatevariable', data, httpOptions);
  }

  gettabterms(data) {
    return this.http.post(this.recordRoot + '/gettabterms', data, httpOptions);
  }

  gettabtermvalues(data) {
    return this.http.post(this.recordRoot + '/gettabtermvalues', data, httpOptions);
  }

  getlinkrecorddetails(data) {
    return this.http.post(this.recordRoot + '/getlinkrecorddetails', data, httpOptions);
  }

  removerecordlink(data) {
    return this.http.post(this.recordRoot + '/removerecordlink', data, httpOptions);
  }

  saverecordlink(data) {
    return this.http.post(this.recordRoot + '/saverecordlink', data, httpOptions);
  }

  getparentrecordinfo(data) {
    return this.http.post(this.recordRoot + '/getparentrecordinfo', data, httpOptions);
  }

  addmstschedulednotification(data) {
    return this.http.post(this.apiRoot + '/addmstschedulednotification', data, httpOptions);
  }

  updatemstschedulednotification(data) {
    return this.http.post(this.apiRoot + '/updatemstschedulednotification', data, httpOptions);
  }

  getmstschedulednotification(data) {
    return this.http.post(this.apiRoot + '/getmstschedulednotification', data, httpOptions);
  }

  deletemstschedulednotification(data) {
    return this.http.post(this.apiRoot + '/deletemstschedulednotification', data, httpOptions);
  }

  getclientandorgwiseclientuser(data) {
    return this.http.post(this.apiRoot + '/getclientandorgwiseclientuser', data, httpOptions);
  }

  updaterecordasset(data) {
    return this.http.post(this.recordRoot + '/updaterecordasset', data, httpOptions);
  }

  insertrecordasset(data) {
    return this.http.post(this.recordRoot + '/insertrecordasset', data, httpOptions);
  }

  updateadditionalfields(data) {
    return this.http.post(this.recordRoot + '/updateadditionalfields', data, httpOptions);
  }

  getassethistorybyassetid(data) {
    return this.http.post(this.recordRoot + '/getassethistorybyassetid', data, httpOptions);
  }

  downloadifixdatainexcel(data) {
    return this.http.post(this.apiRoot + '/downloadifixdatainexcel', data, httpOptions);
  }

  downloadgridresult(data) {
    return this.http.post(this.apiRoot + '/downloadgridresult', data, httpOptions);
  }

  getorgassignedcustomer(data) {
    return this.http.post(this.apiRoot + '/getorgassignedcustomer', data, httpOptions);
  }

  searchuserdetailsbygroupid(data) {
    return this.http.post(this.apiRoot + '/searchuserdetailsbygroupid', data, httpOptions);
  }

  getrecorddetailsbynoforlinkrecord(data) {
    return this.http.post(this.recordRoot + '/getrecorddetailsbynoforlinkrecord', data, httpOptions);
  }

  getadditionaltab() {
    return this.http.get(this.apiRoot + '/getadditionaltab');
  }

  addrecordtermadditionalmap(data) {
    return this.http.post(this.apiRoot + '/addrecordtermadditionalmap', data, httpOptions);
  }

  getrecordtermadditionalmap(data) {
    return this.http.post(this.apiRoot + '/getrecordtermadditionalmap', data, httpOptions);
  }

  deleterecordtermadditionalmap(data) {
    return this.http.post(this.apiRoot + '/deleterecordtermadditionalmap', data, httpOptions);
  }

  verifytotp(data) {
    return this.http.post(this.apiRoot + '/verifytotp', data, httpOptions);
  }

  updaterecordconfigincrement(data) {
    return this.http.post(this.apiRoot + '/updaterecordconfigincrement', data, httpOptions);
  }

  addrecordconfigincrement(data) {
    return this.http.post(this.apiRoot + '/addrecordconfigincrement', data, httpOptions);
  }

  getallrecordconfigincrement(data) {
    return this.http.post(this.apiRoot + '/getallrecordconfigincrement', data, httpOptions);
  }

  deleterecordconfigincrement(data) {
    return this.http.post(this.apiRoot + '/deleterecordconfigincrement', data, httpOptions);
  }

  addslatermentry(data) {
    return this.http.post(this.apiRoot + '/addslatermentry', data, httpOptions);
  }

  getallslatermentry(data) {
    return this.http.post(this.apiRoot + '/getallslatermentry', data, httpOptions);
  }

  deleteslatermentry(data) {
    return this.http.post(this.apiRoot + '/deleteslatermentry', data, httpOptions);
  }

  getsupportgroupbyorg(data) {
    return this.http.post(this.apiRoot + '/getsupportgroupbyorg', data, httpOptions);
  }

  groupbyuserwise(data) {
    return this.http.post(this.apiRoot + '/groupbyuserwise', data, httpOptions);
  }

  getprocessgroupbyorgids(data) {
    return this.http.post(this.apiRoot + '/getprocessgroupbyorgids', data, httpOptions);
  }

  insertdashboardquery(data) {
    return this.http.post(this.apiRoot + '/insertdashboardquery', data, httpOptions);
  }

  getalldashboardquerycopy(data) {
    return this.http.post(this.apiRoot + '/getalldashboardquerycopy', data, httpOptions);
  }

  updatedashboardquery(data) {
    return this.http.post(this.apiRoot + '/updatedashboardquery', data, httpOptions);
  }

  deletedashboardquerycopy(data) {
    return this.http.post(this.apiRoot + '/deletedashboardquerycopy', data, httpOptions);
  }

  adddashboardquerycopy(data) {
    return this.http.post(this.apiRoot + '/adddashboardquerycopy', data, httpOptions);
  }

  insertmapcategorywithkeyword(data) {
    return this.http.post(this.apiRoot + '/insertmapcategorywithkeyword', data, httpOptions);
  }

  getallmapcategorywithkeyword(data) {
    return this.http.post(this.apiRoot + '/getallmapcategorywithkeyword', data, httpOptions);
  }

  updatemapcategorywithkeyword(data) {
    return this.http.post(this.apiRoot + '/updatemapcategorywithkeyword', data, httpOptions);
  }

  deletemapcategorywithkeyword(data) {
    return this.http.post(this.apiRoot + '/deletemapcategorywithkeyword', data, httpOptions);
  }

  adduidgen(data) {
    return this.http.post(this.apiRoot + '/adduidgen', data, httpOptions);
  }

  getalluidgen(data) {
    return this.http.post(this.apiRoot + '/getalluidgen', data, httpOptions);
  }

  updateuidgen(data) {
    return this.http.post(this.apiRoot + '/updateuidgen', data, httpOptions);
  }

  deleteuidgen(data) {
    return this.http.post(this.apiRoot + '/deleteuidgen', data, httpOptions);
  }

  searchuserbyclientid(data) {
    return this.http.post(this.apiRoot + '/searchuserbyclientid', data, httpOptions);
  }

  updateuserdefaultgrp(data) {
    return this.http.post(this.apiRoot + '/updateuserdefaultgrp', data, httpOptions);
  }

  addmstrecordactivity(data) {
    return this.http.post(this.apiRoot + '/addmstrecordactivity', data, httpOptions);
  }

  addmstrecordactivitycopy(data) {
    return this.http.post(this.apiRoot + '/addmstrecordactivitycopy', data, httpOptions);
  }

  updatemstrecordactivity(data) {
    return this.http.post(this.apiRoot + '/updatemstrecordactivity', data, httpOptions);
  }

  deletemstrecordactivity(data) {
    return this.http.post(this.apiRoot + '/deletemstrecordactivity', data, httpOptions);
  }

  getallmstrecordactivity(data) {
    return this.http.post(this.apiRoot + '/getallmstrecordactivity', data, httpOptions);
  }

  getorgwiseactivitydesc(data) {
    return this.http.post(this.apiRoot + '/getorgwiseactivitydesc', data, httpOptions);
  }

  workflowgroupbyuserwise(data) {
    return this.http.post(this.apiRoot + '/workflowgroupbyuserwise', data, httpOptions);
  }

  getallcreatedsupportgrp(data) {
    return this.http.post(this.apiRoot + '/getallcreatedsupportgrp', data, httpOptions);
  }

  geturlbykey(data) {
    return this.http.post(this.apiRoot + '/geturlbykey', data, httpOptions);
  }

  searchlocation(data) {
    return this.http.post(this.locationRoot + '/searchlocation', data, httpOptions);
  }

  selectlocation(data) {
    return this.http.post(this.locationRoot + '/selectlocation', data, httpOptions);
  }

  getadditionalinfobasedoncategory(data) {
    return this.http.post(this.recordRoot + '/getadditionalinfobasedoncategory', data, httpOptions);
  }

  addlocation(data) {
    return this.http.post(this.locationRoot + '/addlocation', data, httpOptions);
  }

  getlocation(data) {
    return this.http.post(this.locationRoot + '/getlocation', data, httpOptions);
  }

  priorityupload(data) {
    return this.http.post(this.locationRoot + '/priorityupload', data, httpOptions);
  }

  prioritydownload(data) {
    return this.http.post(this.locationRoot + '/prioritydownload', data, httpOptions);
  }

  updatelocation(data) {
    return this.http.post(this.locationRoot + '/updatelocation', data, httpOptions);
  }

  deletelocation(data) {
    return this.http.post(this.locationRoot + '/deletelocation', data, httpOptions);
  }

  getcatalogorgwise(data) {
    return this.http.post(this.apiRoot + '/getcatalogorgwise', data, httpOptions);
  }

  getfuncmappingbytypeforquery(data) {
    return this.http.post(this.apiRoot + '/getfuncmappingbytypeforquery', data, httpOptions);
  }

  insertmstuserdefaultsupportgroup(data) {
    return this.http.post(this.apiRoot + '/insertmstuserdefaultsupportgroup', data, httpOptions);
  }

  getallmstuserdefaultsupportgroup(data) {
    return this.http.post(this.apiRoot + '/getallmstuserdefaultsupportgroup', data, httpOptions);
  }

  updatemstuserdefaultsupportgroup(data) {
    return this.http.post(this.apiRoot + '/updatemstuserdefaultsupportgroup', data, httpOptions);
  }

  deletemstuserdefaultsupportgroup(data) {
    return this.http.post(this.apiRoot + '/deletemstuserdefaultsupportgroup', data, httpOptions);
  }

  getorgtoolscode(data) {
    return this.http.post(this.apiRoot + '/getorgtoolscode', data, httpOptions);
  }

  deleteorgtoolscode(data) {
    return this.http.post(this.apiRoot + '/deleteorgtoolscode', data, httpOptions);
  }

  updateorgtoolscode(data) {
    return this.http.post(this.apiRoot + '/updateorgtoolscode', data, httpOptions);
  }

  addorgtoolscode(data) {
    return this.http.post(this.apiRoot + '/addorgtoolscode', data, httpOptions);
  }

  getallcategoryvalue(data) {
    return this.http.post(this.apiRoot + '/getallcategoryvalue', data, httpOptions);
  }

  mstusersupportgroupchange(data) {
    return this.http.post(this.apiRoot + '/mstusersupportgroupchange', data, httpOptions);
  }

  gettemplatevariablelist(data) {
    return this.http.post(this.apiRoot + '/gettemplatevariablelist', data, httpOptions);
  }

  addmsttemplatevariablecopy(data) {
    return this.http.post(this.apiRoot + '/addmsttemplatevariablecopy', data, httpOptions);
  }

  updatebusinessdirection(data) {
    return this.http.post(this.apiRoot + '/updatebusinessdirection', data, httpOptions);
  }

  insertsupportgrpworkhours(data) {
    return this.http.post(this.apiRoot + '/insertsupportgrpworkhours', data, httpOptions);
  }

  getsupportgrpworkhours(data) {
    return this.http.post(this.apiRoot + '/getsupportgrpworkhours', data, httpOptions);
  }

  updatesupportgrpworkhours(data) {
    return this.http.post(this.apiRoot + '/updatesupportgrpworkhours', data, httpOptions);
  }

  deletesupportgrpworkhours(data) {
    return this.http.post(this.apiRoot + '/deletesupportgrpworkhours', data, httpOptions);
  }

  getassetrecorddiffbyorg(data) {
    return this.http.post(this.apiRoot + '/getassetrecorddiffbyorg', data, httpOptions);
  }

  updateassetrecorddiff(data) {
    return this.http.post(this.apiRoot + '/updateassetrecorddiff', data, httpOptions);
  }

  addusergroupcategory(data) {
    return this.http.post(this.apiRoot + '/addusergroupcategory', data, httpOptions);
  }

  getusergroupcategory(data) {
    return this.http.post(this.apiRoot + '/getusergroupcategory', data, httpOptions);
  }

  updateusergroupcategory(data) {
    return this.http.post(this.apiRoot + '/updateusergroupcategory', data, httpOptions);
  }

  deleteusergroupcategory(data) {
    return this.http.post(this.apiRoot + '/deleteusergroupcategory', data, httpOptions);
  }

  bulkusergroupcategoryupload(data) {
    return this.http.post(this.apiRoot + '/bulkusergroupcategoryupload', data, httpOptions);
  }

  bulkusergroupcategorydownload(data) {
    return this.http.post(this.apiRoot + '/bulkusergroupcategorydownload', data, httpOptions);
  }

  getalltransporttable(data) {
    return this.http.post(this.apiRoot + '/getalltransporttable', data, httpOptions);
  }

  gettypedescription(data) {
    return this.http.post(this.apiRoot + '/gettypedescription', data, httpOptions);
  }

  updatetransporttable(data) {
    return this.http.post(this.apiRoot + '/updatetransporttable', data, httpOptions);
  }

  deletetransporttable(data) {
    return this.http.post(this.apiRoot + '/deletetransporttable', data, httpOptions);
  }

  inserttransporttable(data) {
    return this.http.post(this.apiRoot + '/inserttransporttable', data, httpOptions);
  }

  gettable(data) {
    return this.http.post(this.apiRoot + '/gettable', data, httpOptions);
  }

  downloadmasterdata(data) {
    return this.http.post(this.dataRoot + '/downloadmasterdata', data, httpOptions);
  }

  uploadmasterdata(data) {
    return this.http.post(this.dataRoot + '/uploadmasterdata', data, httpOptions);
  }

  gettypefortransport(data) {
    return this.http.post(this.apiRoot + '/gettypefortransport', data, httpOptions);
  }

  updateifixsysid(data) {
    return this.http.post(this.dataRoot + '/updateifixsysid', data, httpOptions);
  }

  getorgcode(data) {
    return this.http.post(this.apiRoot + '/getorgcode', data, httpOptions);
  }

  gettoolscode(data) {
    return this.http.post(this.apiRoot + '/gettoolscode', data, httpOptions);
  }

  getfuncmappingbycatalogtype(data) {
    return this.http.post(this.apiRoot + '/getfuncmappingbycatalogtype', data, httpOptions);
  }

  getorganizationwithorgtype(data) {
    return this.http.post(this.apiRoot + '/getorganizationwithorgtype', data, httpOptions);
  }

  addemailbaseconfig(data) {
    return this.http.post(this.apiRoot + '/addemailbaseconfig', data, httpOptions);
  }

  getdelimiterforallclient(data) {
    return this.http.post(this.apiRoot + '/getdelimiterforallclient', data, httpOptions);
  }

  deleteemailbaseconfig(data) {
    return this.http.post(this.apiRoot + '/deleteemailbaseconfig', data, httpOptions);
  }

  saveemailticketconfiguration(data) {
    return this.http.post(this.apiRoot + '/saveemailticketconfiguration', data, httpOptions);
  }

  getemailticketconfigurations(data) {
    return this.http.post(this.apiRoot + '/getemailticketconfigurations', data, httpOptions);
  }

  deleteemailticketconfiguration(data) {
    return this.http.post(this.apiRoot + '/deleteemailticketconfiguration', data, httpOptions);
  }

  updateemailticketconfiguration(data) {
    return this.http.post(this.apiRoot + '/updateemailticketconfiguration', data, httpOptions);
  }

  getserviceuser(data) {
    return this.http.post(this.apiRoot + '/getserviceuser', data, httpOptions);
  }

  getdelemiter(data) {
    return this.http.post(this.apiRoot + '/getdelemiter', data, httpOptions);
  }

  getlastcategorylist(data) {
    return this.http.post(this.apiRoot + '/getlastcategorylist', data, httpOptions);
  }

  getrecordnames(data) {
    return this.http.post(this.apiRoot + '/getrecordnames', data, httpOptions);
  }

  recordfulldetailsdownload(data) {
    return this.http.post(this.apiRoot + '/recordfulldetailsdownload', data, httpOptions);
  }

  getparentrecordidforIM(data) {
    return this.http.post(this.recordRoot + '/getparentrecordidforIM', data, httpOptions);
  }

  bulkassetdownload(data) {
    return this.http.post(this.assetRoot + '/bulkassetdownload', data, httpOptions);
  }

  bulkuserdownload(data) {
    return this.http.post(this.userRoot + '/bulkuserdownload', data, httpOptions);
  }

  addmstadfsattribute(data) {
    return this.http.post(this.apiRoot + '/addmstadfsattribute', data, httpOptions);
  }

  getallmstadfsattribute(data) {
    return this.http.post(this.apiRoot + '/getallmstadfsattribute', data, httpOptions);
  }

  updatemstadfsattribute(data) {
    return this.http.post(this.apiRoot + '/updatemstadfsattribute', data, httpOptions);
  }

  deletemstadfsattribute(data) {
    return this.http.post(this.apiRoot + '/deletemstadfsattribute', data, httpOptions);
  }

  getclientwiseattribute(data) {
    return this.http.post(this.apiRoot + '/getclientwiseattribute', data, httpOptions);
  }

  getrecordbydifftypeofmultiorg(data) {
    return this.http.post(this.apiRoot + '/getrecordbydifftypeofmultiorg', data, httpOptions);
  }

  insertuserticket(data) {
    return this.http.post(this.apiRoot + '/insertuserticket', data, httpOptions);
  }

  deleteuserticket(data) {
    return this.http.post(this.apiRoot + '/deleteuserticket', data, httpOptions);
  }

  recordfilterupdate(data) {
    return this.http.post(this.recordRoot + '/recordfilterupdate', data, httpOptions);
  }

  getallopenticket(data) {
    return this.http.post(this.apiRoot + '/getallopenticket', data, httpOptions);
  }

  deleteopenticket(data) {
    return this.http.post(this.apiRoot + '/deleteopenticket', data, httpOptions);
  }

  getqueryresult(data) {
    return this.http.post(this.reportRoot + '/getqueryresult', data, httpOptions);
  }

  generatereport(data) {
    return this.http.post(this.reportRoot + '/generatereport', data, httpOptions);
  }

  reportgeneratedlist(data) {
    return this.http.post(this.reportRoot + '/reportgeneratedlist', data, httpOptions);
  }

  updatevendorticketid(data) {
    return this.http.post(this.recordRoot + '/updatevendorticketid', data, httpOptions);
  }
  searchanalystorgwise(data) {
    return this.http.post(this.apiRoot + '/searchanalystorgwise', data, httpOptions);
  }
  bulkapprovalfortickets(data) {
    return this.http.post(this.apiRoot + '/bulkapprovalfortickets', data, httpOptions);
  }

  getUserPropertyName(data){
    return this.http.post(this.apiRoot + '/getUserPropertyName', data, httpOptions);
  }

  getUserRoleProperty(data){
    return this.http.post(this.apiRoot + '/getUserRoleProperty', data, httpOptions);
  }

  insertUserRoleProperty(data){
    return this.http.post(this.apiRoot + '/insertUserRoleProperty', data, httpOptions);
  }

  updateUserRoleProperty(data){
    return this.http.post(this.apiRoot + '/updateUserRoleProperty', data, httpOptions);
  }

  deleteUserRoleProperty(data){
    return this.http.post(this.apiRoot + '/deleteUserRoleProperty', data, httpOptions);
  }
}
