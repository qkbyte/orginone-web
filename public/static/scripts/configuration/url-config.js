/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var FLOWABLE = FLOWABLE || {};

/*
 * Contains methods to retrieve the (mostly) base urls of the different end points.
 * Two of the methods #getImageUrl and #getModelThumbnailUrl are exposed in the $rootScope for usage in the HTML views.
 */
FLOWABLE.APP_URL = {
  /* ACCOUNT URLS */

  getAccountUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/account";
  },

  getLogoutUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/logout";
  },

  /* MODEL URLS */

  getModelsUrl: function(query) {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/models" + (query || "");
  },

  getModelUrl: function(modelId) {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/models/" + modelId;
  },

  getModelModelJsonUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/model-json"
    );
  },

  getModelBpmn20ExportUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/bpmn20?version=" +
      Date.now()
    );
  },

  getCloneModelsUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/models/" + modelId + "/clone"
    );
  },

  getModelHistoriesUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/history"
    );
  },

  getModelHistoryUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/history/" +
      modelHistoryId
    );
  },

  getModelHistoryModelJsonUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/history/" +
      modelHistoryId +
      "/model-json"
    );
  },

  getModelHistoryBpmn20ExportUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/history/" +
      modelHistoryId +
      "/bpmn20?version=" +
      Date.now()
    );
  },

  getCmmnModelDownloadUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      (modelHistoryId ? "/history/" + modelHistoryId : "") +
      "/cmmn?version=" +
      Date.now()
    );
  },

  getModelParentRelationsUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/parent-relations"
    );
  },

  /* APP DEFINITION URLS  */

  getAppDefinitionImportUrl: function(renewIdmIds) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/import?renewIdmEntries=" +
      renewIdmIds
    );
  },

  getAppDefinitionTextImportUrl: function(renewIdmIds) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/text/import?renewIdmEntries=" +
      renewIdmIds
    );
  },

  getAppDefinitionUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/app-definitions/" + modelId
    );
  },

  getAppDefinitionModelImportUrl: function(modelId, renewIdmIds) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/import?renewIdmEntries=" +
      renewIdmIds
    );
  },

  getAppDefinitionModelTextImportUrl: function(modelId, renewIdmIds) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/text/import?renewIdmEntries=" +
      renewIdmIds
    );
  },

  getAppDefinitionPublishUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/publish"
    );
  },

  getAppDefinitionExportUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/export?version=" +
      Date.now()
    );
  },

  getAppDefinitionBarExportUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/export-bar?version=" +
      Date.now()
    );
  },

  getAppDefinitionHistoryUrl: function(modelId, historyModelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/app-definitions/" +
      modelId +
      "/history/" +
      historyModelId
    );
  },

  getModelsForAppDefinitionUrl: function() {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/models-for-app-definition"
    );
  },

  getCmmnModelsForAppDefinitionUrl: function() {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/cmmn-models-for-app-definition"
    );
  },

  /* PROCESS INSTANCE URLS */

  getProcessInstanceModelJsonUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/process-instances/" +
      modelId +
      "/model-json"
    );
  },

  getProcessInstanceModelJsonHistoryUrl: function(historyModelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/process-instances/history/" +
      historyModelId +
      "/model-json"
    );
  },

  /* PROCESS DEFINITION URLS */

  getProcessDefinitionModelJsonUrl: function(processDefinitionId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/process-definitions/" +
      processDefinitionId +
      "/model-json"
    );
  },

  /* PROCESS MODEL URLS */

  getImportProcessModelUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/import-process-model";
  },

  getImportProcessModelTextUrl: function() {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/import-process-model/text"
    );
  },

  /* DECISION TABLE URLS */

  getDecisionTableModelsUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/decision-table-models";
  },

  getDecisionTableImportUrl: function() {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/import-decision-table"
    );
  },

  getDecisionTableTextImportUrl: function() {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/import-decision-table-text"
    );
  },

  getDecisionTableModelUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/" +
      modelId
    );
  },

  getDecisionTableModelValuesUrl: function(query) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/values?" +
      query
    );
  },

  getDecisionTableModelsHistoryUrl: function(modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/history/" +
      modelHistoryId
    );
  },

  getDecisionTableModelHistoryUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/decision-table-models/" +
      modelId +
      "/history/" +
      modelHistoryId
    );
  },

  /* FORM MODEL URLS */

  getFormModelsUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/form-models";
  },

  getFormModelValuesUrl: function(query) {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/form-models/values?" + query
    );
  },

  getFormModelUrl: function(modelId) {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/form-models/" + modelId;
  },

  getFormModelHistoryUrl: function(modelId, modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/form-models/" +
      modelId +
      "/history/" +
      modelHistoryId
    );
  },

  /* CASE MODEL URLS */

  getCaseModelsUrl: function(query) {
    return (
      FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/case-models" + (query || "")
    );
  },

  getCaseModelImportUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/import-case-model";
  },

  getCaseModelTextImportUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/import-case-model/text";
  },

  getCaseInstancesHistoryModelJsonUrl: function(modelHistoryId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/case-instances/history/" +
      modelHistoryId +
      "/model-json"
    );
  },

  getCaseInstancesModelJsonUrl: function(modelId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/case-instances/" +
      modelId +
      "/model-json"
    );
  },

  getCaseDefinitionModelJsonUrl: function(caseDefinitionId) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/case-definitions/" +
      caseDefinitionId +
      "/model-json"
    );
  },

  /* IMAGE URLS (exposed in rootscope in app.js */

  getImageUrl: function(imageId) {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/image/" + imageId;
  },



  getModelThumbnailUrl: function(e,modelId, version) {
    return (
      FLOWABLE.CONFIG.contextRoot +
      "/dev-app/rest/models/" +
      modelId +
      "/thumbnail" +
      (version ? "?version=" + version : "")
    );

    // let url= FLOWABLE.CONFIG.contextRoot +
    //     "/dev-app/rest/models/" +
    //     modelId +
    //     "/thumbnail" +
    //     (version ? "?version=" + version : "");
    //
    //
    // let reg = new RegExp("(^|&)" + "token" + "=([^&]*)(&|$)", "i");
    // let r = window.location.search.substr(1).match(reg);
    // let ret=null;
    // if (r != null) {
    //   ret= unescape(r[2]);
    // }
    //
    // var request =jQuery.ajax({
    //   type: 'get',
    //   url:url,
    //   headers: {
    //     "blade-auth": ret,
    //     Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
    //   },
    // });
    // console.log(e);
    // request.success(function(data, textStatus, jqXHR) {
    //   // e.attr("src","data:image/png;base64,"+data);
    //   // console.log(data)
    // });




  },

  /* OTHER URLS */

  getEditorUsersUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/editor-users";
  },

  getEditorGroupsUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/editor-groups";
  },

  getAboutInfoUrl: function() {
    return FLOWABLE.CONFIG.contextRoot + "/dev-app/rest/about-info";
  }
};
