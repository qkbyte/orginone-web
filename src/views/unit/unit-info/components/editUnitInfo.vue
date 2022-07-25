<template>
  <el-dialog
    center
    top="10vh"
    width="800px"
    :visible.sync="dialogShow.value"
    :close-on-click-modal="false"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    element-loading-text="保存中"
    @opened="opened"
  >
    <span slot="title" class="diy-dialog-title"> 编辑单位信息 </span>
    <div class="body-container diy-dialog-body">
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item
          v-for="item in formItem"
          v-bind="item"
          :key="item.prop"
          :label-width="options.labelWidth"
        >
          <el-input
            v-if="item.prop === 'unitName'"
            v-model="form.unitName"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'linkPhone'"
            v-model="form.linkPhone"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'corporateRepresentative'"
            v-model="form.corporateRepresentative"
            clearable
          ></el-input>
          <el-input
            disabled
            v-if="item.prop === 'administrationDivisionCode'"
            v-model="form.administrationDivisionCode"
          ></el-input>
          <el-cascader
            v-if="item.prop === 'administrationDivisionName'"
            v-model="administrationDivisionName"
            :show-all-levels="false"
            :options="division"
            :props="propsName"
            clearable
          >
          </el-cascader>
          <el-input
            disabled
            v-if="item.prop === 'unitCode'"
            v-model="form.unitCode"
          ></el-input>
          <el-input
            prop="socialCreditCode"
            v-if="item.prop === 'socialCreditCode'"
            v-model="form.socialCreditCode"
            clearable
          ></el-input>
          <el-select
            v-if="item.prop === 'isVirtual'"
            v-model="form.isVirtual"
            placeholder="请选择虚/实单位"
            clearable
          >
            <el-option
              v-for="item in isVirtualOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-cascader
            v-if="item.prop === 'value'"
            v-model="value"
            :options="provinces"
            :props="props"
            @change="handleChange"
            clearable
          >
          </el-cascader>
          <el-input
            v-if="item.prop === 'detailAddress'"
            v-model="detailAddress"
            clearable
          ></el-input>
          <el-select
            v-if="item.prop === 'organizationForm'"
            v-model="form.organizationForm"
            placeholder="请选择组织形式"
            clearable
          >
            <el-option
              v-for="item in organizationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'unitType'"
            v-model="form.unitType"
            placeholder="请选择单位分类"
            clearable
          >
            <el-option
              v-for="item in unitTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'budgetCode'"
            v-model="form.budgetCode"
            clearable
          ></el-input>
          <el-select
            v-if="item.prop === 'unitTypeName'"
            v-model="form.unitTypeName"
            placeholder="请选择单位类型名称"
            clearable
          >
            <el-option
              v-for="item in unitTypeNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'accountingSystem'"
            v-model="form.accountingSystem"
            placeholder="请选择单位执行会计制度"
            @change="accountingSystem()"
            clearable
          >
            <el-option
              v-for="item in accountingSystemOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'unitBasicProperty'"
            v-model="form.unitBasicProperty"
            placeholder="请选择单位基本性质"
            no-data-text="请先选择单位执行会计制度"
            @change="unitBasicProperty($event);institutionType()"
            @focus="unitBasicPropertyFocus()"
            clearable
          >
            <el-option
              v-for="item in unitBasicPropertyOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'unitReform'"
            v-model="form.unitReform"
            placeholder="请选择事业单位改革分类"
            @focus="unitReformfocus()"
            clearable
          >
            <el-option
              v-for="item in unitReformOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'personExpenditure'"
            v-model="form.personExpenditure"
            placeholder="请选择基本支出人员经费功能分类"
            @change="personExpenditure()"
            clearable
          >
            <el-option
              v-for="item in personExpenditureOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-cascader
            v-if="item.prop === 'institutionType'"
            v-model="form.institutionType"
            :props="props"
            :options="institutionTypeAll"
            :show-all-levels=false
            @change="institutionTypeChange($event)"
            @focus="institutionTypeFocus()"
            clearable
          ></el-cascader>
          <el-select
            v-if="item.prop === 'budgetUnitName'"
            v-model="form.budgetUnitName"
            placeholder="请选择预算单位级次名称"
            clearable
          >
            <el-option
              v-for="item in budgetUnitNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'budgetManagementLevel'"
            v-model="form.budgetManagementLevel"
            placeholder="请选择预算管理级次"
            clearable
          >
            <el-option
              v-for="item in budgetManagementLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'emailAddress'"
            v-model="form.emailAddress"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'postalCode'"
            v-model="form.postalCode"
            clearable
          ></el-input>
          <el-select
            v-if="item.prop === 'fundSupplyModeName'"
            v-model="form.fundSupplyModeName"
            placeholder="请选择经费供给方式"
            clearable
          >
            <el-option
              v-for="item in fundSupplyModeNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'administrationLevelName'"
            v-model="form.administrationLevelName"
            placeholder="请选择单位行政级别名称"
            clearable
          >
            <el-option
              v-for="item in administrationLevelNameOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="item.prop === 'financialAffiliation'"
            v-model="form.financialAffiliation"
            placeholder="请选择财务隶属关系"
            clearable
          >
            <el-option
              v-for="item in financialAffiliationOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'institutionNumber'"
            v-model="form.institutionNumber"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'authorizedNumber'"
            v-model="form.authorizedNumber"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'ofSideNumber'"
            v-model="form.ofSideNumber"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'institutionAuthority'"
            v-model="form.institutionAuthority"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'administrationAuthority'"
            v-model="form.administrationAuthority"
            clearable
          ></el-input>
          <el-select
            v-if="item.prop === 'departmentIdentification'"
            v-model="form.departmentIdentification"
            placeholder="部门标识"
            clearable
          >
            <el-option
              v-for="item in departmentIdentificationOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-if="item.prop === 'totalHeadcount'"
            v-model="totalHeadcount"
            :disabled="true"
          ></el-input>
          <el-input
            v-if="item.prop === 'otherStaff'"
            v-model="form.otherStaff"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'staffOnActiveDuty'"
            v-model="form.staffOnActiveDuty"
            clearable
          ></el-input>
          <el-input
            v-if="item.prop === 'retiredStaff'"
            v-model="form.retiredStaff"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        style="margin-left: 65%; margin-right: 20px"
        @click="handleCloseDialog"
        >取 消</el-button
      >
      <el-button type="primary" @click="handleSave('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  organizationOptions,
  unitTypeOption,
  accountingSystemOption,
  administrationLevelNameOption,
  budgetManagementLevelOption,
  budgetUnitNameOption,
  fundSupplyModeNameOption,
  unitBasicPropertyOption,
  unitReformOption,
  personExpenditureOption,
  isVirtualOptions,
  financialAffiliationOption,
  departmentIdentificationOption,
  unitTypeNameOption,
} from "../data";
import _ from "lodash";
import { unitUpdate, getAdministrativeTree } from "@api/tenant";
import { mapGetters } from "vuex";
import { areaData } from "@utils/unitArea.js";
import { institutionTypeData } from "@utils/institutionType.js";
import { isvalidatemobile } from "@utils/validate";
import { validateSocialCreCode } from "@utils/validate";
export default {
  name: "TheAppDialog",
  components: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.form.isVirtual == "0") {
        if (value.length !== 18) {
          callback(new Error("统一社会信用代码格式不正确"));
        } else {
          callback();
        }
      }else{
        callback();
      }
    };
    return {
      options: {
        labelWidth: "100px",
      },
      formItem: [
        {
          label: "单位名称",
          prop: "unitName",
        },
        {
          label: "联系方式",
          prop: "linkPhone",
        },
        {
          label: "法人代表",
          prop: "corporateRepresentative",
        },
        {
          label: "单位编码",
          prop: "unitCode",
        },
        {
          label: "区划编码",
          prop: "administrationDivisionCode",
        },
        {
          label: "区划名称",
          prop: "administrationDivisionName",
        },
        {
          label: "统一社会信用代码",
          prop: "socialCreditCode",
        },
        {
          label: "实/虚单位",
          prop: "isVirtual",
        },
        {
          label: "单位地址",
          prop: "value",
        },
        {
          label: "详细地址",
          prop: "detailAddress",
        },
        {
          label: "组织形式",
          prop: "organizationForm",
        },
        {
          label: "单位分类",
          prop: "unitType",
        },
        {
          label: "财政预算代码",
          prop: "budgetCode",
        },
        {
          label: "单位类型名称",
          prop: "unitTypeName",
        },
        {
          label: "单位执行会计制度",
          prop: "accountingSystem",
        },
        {
          label: "单位基本性质",
          prop: "unitBasicProperty",
        },
        {
          label: "事业单位改革分类",
          prop: "unitReform",
        },
        {
          label: "基本支出人员经费功能分类",
          prop: "personExpenditure",
        },
        {
          label: "机构行业类型",
          prop: "institutionType",
        },
        {
          label: "预算单位级次名称",
          prop: "budgetUnitName",
        },
        {
          label: "预算管理级次",
          prop: "budgetManagementLevel",
        },
        {
          label: "电子邮件",
          prop: "emailAddress",
        },
        {
          label: "邮政编码",
          prop: "postalCode",
        },
        {
          label: "经费供给方式",
          prop: "fundSupplyModeName",
        },
        {
          label: "单位行政级别名称",
          prop: "administrationLevelName",
        },
        {
          label: "财务隶属关系",
          prop: "financialAffiliation",
        },
        {
          label: "事业编制人数",
          prop: "institutionNumber",
        },
        {
          label: "行政编制人数",
          prop: "authorizedNumber",
        },
        {
          label: "编制外人数",
          prop: "ofSideNumber",
        },
        {
          label: "核算机构数",
          prop: "institutionAuthority",
        },
        {
          label: "编制机构数",
          prop: "administrationAuthority",
        },
        {
          label: "编制合计人数",
          prop: "totalHeadcount",
        },
        {
          label: "部门标识",
          prop: "departmentIdentification",
        },
        {
          label: "离退休人员",
          prop: "retiredStaff",
        },
        {
          label: "其它人员",
          prop: "otherStaff",
        },
        {
          label: "实有人员",
          prop: "staffOnActiveDuty",
        },
      ],
      flag: false,
      form: {},
      province: "",
      city: "",
      street: "",
      detailAddress: "",
      imageUrl: "",
      provinces: [],
      division: [],
      citys: [],
      streets: [],
      administrationDivisionName: [],
      value: [],
      area: [],
      institutionTypeAll: [],
      institutionTypeName: [],
      propsName: { expandTrigger: "hover", checkStrictly: true },
      props: { expandTrigger: "hover" },
      rules: {
        socialCreditCode: [{ validator: validatePass, trigger: "blur" }],
      },
      organizationOptions: [],
      unitTypeOption: [],
      accountingSystemOption: [],
      administrationLevelNameOption: [],
      budgetManagementLevelOption: [],
      budgetUnitNameOption: [],
      fundSupplyModeNameOption: [],
      unitBasicPropertyOption: [],
      unitReformOption: [],
      personExpenditureOption: [],
      isVirtualOptions: [],
      financialAffiliationOption: [],
      departmentIdentificationoption: [],
      unitTypeNameOption: [],
      // view
      loading: false,
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: () => {},
    },
    tenantInfo: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.$nextTick(() => {
      this.changeArea();
      this.init();
      this.changeUnitInfo();
      this.opened();
    });
  },
  mounted() {
    this.getTree();
  },
  computed: {
    totalHeadcount(){
      return parseInt(this.form.institutionNumber)+parseInt(this.form.authorizedNumber)
    }
  },
  methods: {
    unitBasicPropertyFocus(){
      if(this.form.unitBasicProperty == '' && this.form.accountingSystem == ''){
        this.$message({
          showClose: true,
          message: '请先选择单位执行会计制度',
          type: 'error'
        })
      }
    },
    institutionTypeFocus(){
      if(this.form.institutionType == '' && this.form.personExpenditure == ''){
        this.$message({
          showClose: true,
          message: '请先选择基本支出人员经费功能分类',
          type: 'error'
        })
      }
    },
    unitReformfocus(){
      if(this.form.unitReform == '' && this.form.unitBasicProperty == ''){
        this.$message({
          showClose: true,
          message: '请先选择单位基本性质',
          type: 'error'
        })
      }
      if(this.form.unitReform=='' && this.unitReformOption.length == 0 && this.form.unitBasicProperty != ''){
        this.$message({
          showClose: true,
          message: '当前选择的单位性质选项无需填写事业改革类型',
          type: 'error'
        })
      }
    },
    async getTree() {
      let res = await getAdministrativeTree();
      this.division = res.data.data;
    },
    opened(){
      //对话框opened时更新单位基本性质和事业单位改革类型的选项数组
      this.unitBasicPropertyOption=[]
      if(this.form.accountingSystem == 30){
        unitBasicPropertyOption.forEach(item=>{
          if(item.value == 31){
            this.unitBasicPropertyOption.push(item);
          }
        })
      }else if(this.form.accountingSystem == 50){
        unitBasicPropertyOption.forEach(item=>{
          if(item.code == 50){
            this.unitBasicPropertyOption.push(item);
          }
        })
      }else{
        unitBasicPropertyOption.forEach(item=>{
            this.unitBasicPropertyOption.push(item);
        })
      }
      //更改单位基本性质字段，更新事业单位改革分类字段
      if(this.form.unitReform==''){
        this.unitReformOption=[]
      }
      this.institutionType();
      this.personExpenditure();
    },
    changeUnitInfo() {
      /**
       * 处理一下各个select框，其值为-1时为选择框
       */
      if (this.form.organizationForm == -1) {
        this.form.organizationForm = "";
      }
      if (this.form.unitType == -1) {
        this.form.unitType = "";
      }
      if (this.form.unitTypeName == -1) {
        this.form.unitTypeName = "";
      }
      if (this.form.accountingSystem == -1) {
        this.form.accountingSystem = "";
      }
      if (this.form.budgetManagementLevel == -1) {
        this.form.budgetManagementLevel = "";
      }
      if (this.form.budgetUnitName == -1) {
        this.form.budgetUnitName = "";
      }
      if (this.form.unitBasicProperty == -1) {
        this.form.unitBasicProperty = "";
        this.unitBasicPropertyOption = []
      }
      if (this.form.isVirtual == -1) {
        this.form.isVirtual = "";
      }
      if (this.form.unitReform == -1) {
        this.form.unitReform = "";
        this.unitReformOption = []
      }
      if (this.form.fundSupplyModeName == -1) {
        this.form.fundSupplyModeName = "";
      }
      if (this.form.personExpenditure == -1) {
        this.form.personExpenditure = "";
        this.personExpenditureOption = []
      }
      if (this.form.administrationLevelName == -1) {
        this.form.administrationLevelName = "";
      }
      if (this.form.financialAffiliation == -1) {
        this.form.financialAffiliation = "";
      }
      if (this.form.departmentIdentification == -1) {
        this.form.departmentIdentification = "";
      }
      if (this.form.institutionType == -1){
        this.form.institutionType = ""
        this.institutionTypeAll = []
      }
      /**
       * 处理一下option值
       */
      this.organizationOptions = organizationOptions;
      this.unitTypeOption = unitTypeOption;
      this.accountingSystemOption = accountingSystemOption;
      this.administrationLevelNameOption = administrationLevelNameOption;
      this.budgetManagementLevelOption = budgetManagementLevelOption;
      this.budgetUnitNameOption = budgetUnitNameOption;
      this.fundSupplyModeNameOption = fundSupplyModeNameOption;
      this.unitBasicPropertyOption = unitBasicPropertyOption;
      this.unitReformOption = unitReformOption;
      this.personExpenditureOption = personExpenditureOption;
      this.isVirtualOptions = isVirtualOptions;
      this.financialAffiliationOption = financialAffiliationOption;
      this.departmentIdentificationOption = departmentIdentificationOption;
      this.unitTypeNameOption = unitTypeNameOption;
    },
    init() {  //处理一下street 分成区和详细地址 能显示在输入框中
      let data = _.cloneDeep(this.tenantInfo);
      console.log("data",data)
      this.form = data;
      this.province = data.province;
      this.city = data.city;
      let address = "";
      address = data.streetAddress;
      if (data.administrationDivisionName !== "") {
        this.administrationDivisionName = data.administrationDivisionName.split(
          ","
        );
      }
      if (address != "") {
        let index = address.indexOf("区");
        if (index === -1) {
          index = address.indexOf("县");
        }
        let street = address.substring(0, index + 1);
        this.street = street;
        let detailAddress = address.substring(index + 1, address.length);
        this.detailAddress = detailAddress;
        if (this.street !== "") {
          this.value = [this.province, this.city, this.street];
        } else {
          this.value = [this.province, this.city];
        }
      } else {
        this.street = "";
        this.detailAddress = "";
      }
      if(this.form.virtualUnit){
        this.form.isVirtual = '1'
      }else{
        this.form.isVirtual = '0'
      }
    },
    changeArea() {   //遍历省份
      areaData.forEach((el, index) => {
        this.area.push({
          label: el.province,
          value: el.province,
          children: [],
        });
        el.children.forEach((xl, ol) => {
          if (xl.children) {
            this.area[index].children.push({
              label: xl.name,
              value: xl.name,
              children: [],
            });
            xl.children.forEach((al) => {
              this.area[index].children[ol].children.push({
                label: al,
                value: al,
              });
            });
          } else {
            this.area[index].children.push({
              label: xl.name,
              value: xl.name,
            });
          }
        });
      });
      this.provinces = this.area;
      console.log("provinces", this.provinces);
    },
    changeInstitutionType() {   //遍历行业类型
      this.institutionTypeName=[]
      institutionTypeData.forEach((el, index) => {  //第一节
        if(el.children) {
          this.institutionTypeName.push({
            label: el.code+el.name,
            value: el.code+el.name,
            children: [],
          });
          el.children.forEach((xl, ol) => {  //第二节
            if(xl.children) {
              this.institutionTypeName[index].children.push({
                label: xl.code+xl.name,
                value: xl.code+xl.name,
                children: [],
              });
              xl.children.forEach((sl,il) => {   //第三节
                if(sl.children) {
                  this.institutionTypeName[index].children[ol].children.push({
                    label: sl.code+sl.name,
                    value: sl.code+sl.name,
                    children: [],
                  });
                    sl.children.forEach((al) => {   //第四节
                      this.institutionTypeName[index].children[ol].children[il].children.push({
                        label: al.code+al.name,
                        value: al.code+al.name,
                    });
                  });
                } else {
                  this.institutionTypeName[index].children[ol].children.push({
                    label: sl.code+sl.name,
                    value: sl.code+sl.name,
                  });
                }
              });
            } else {
              this.institutionTypeName[index].children.push({
                label: xl.code+xl.name,
                value: xl.code+xl.name,
              });
            }
          });
        } else {
          this.institutionTypeName.push({
            label: el.code+el.name,
            value: el.code+el.name,
          });
        }
      });
      this.institutionTypeAll = this.institutionTypeName;
    },
    handleCloseDialog() {
      this.$emit("closeDialog", this.dialogShow.key);
    },
    handleChange(val) {
      if (val.length == 3) {
        this.province = val[0];
        this.city = val[1];
        this.street = val[2];
      } else {
        this.province = val[0];
        this.city = val[1];
      }
    },
    //获取行业机构类型最末端数据
    institutionTypeChange(params){
      this.form.institutionType=params.slice(-1)[0]
    },
    //更改单位执行会计制度字段，关联单位基本性质字段
    accountingSystem(){
      this.unitBasicPropertyOption=[]
      this.form.unitBasicProperty=''
      if(this.form.accountingSystem == 30){
        unitBasicPropertyOption.forEach(item=>{
          if(item.value == 31){
            this.unitBasicPropertyOption.push(item);
          }
        })
      }else if(this.form.accountingSystem == 50){
        unitBasicPropertyOption.forEach(item=>{
          if(item.code == 50){
            this.unitBasicPropertyOption.push(item);
          }
        })
      }else{
        unitBasicPropertyOption.forEach(item=>{
            this.unitBasicPropertyOption.push(item);
        })
      }
    },
    //更改单位基本性质字段,关联单位改革分类字段
    unitBasicProperty(params){
      //更新事业单位改革分类字段
      this.unitReformOption=[]
      let unArray=[11,12,13,14,15,16,17,31]
      let flag=0
      for(let i=0;i<unArray.length;i++){
        if(params == unArray[i]){
          this.form.unitReform=''
          flag=1
          break;
        }else{
          continue;
        }
      }
      if(flag==0){
        this.unitReformOption = unitReformOption
      }
      //更新机构行业类型
      this.institutionType();
    },
    //更新机构行业类型
    institutionType(){
      let inArray=[11,12,13,14,15,16,17]
      let code=null
      for (let i = 0; i < inArray.length; i++) {
        if(this.form.unitBasicProperty == inArray[i]){
          code=this.form.unitBasicProperty
        }
      }
      if(code != null){
        this.institutionTypeName=[]
        institutionTypeData.forEach((el) => {  //第一节
          if(el.code === "S" || el.code === "T"){
            if(el.children) {
              this.institutionTypeName.push({
                label: el.code+el.name,
                value: el.code+el.name,
                children: [],
              });
              el.children.forEach((xl) => {  //第二节
                var k=0
                if(xl.children) {
                  this.institutionTypeName[k].children.push({
                    label: xl.code+xl.name,
                    value: xl.code+xl.name,
                    children: [],
                  });
                  xl.children.forEach((sl) => {   //第三节
                    var m=0;
                    if(sl.children) {
                      this.institutionTypeName[k].children[m].children.push({
                        label: sl.code+sl.name,
                        value: sl.code+sl.name,
                        children: [],
                      });
                      sl.children.forEach((al) => {   //第四节
                        var n=0;
                          this.institutionTypeName[k].children[m].children[n].children.push({
                            label: al.code+al.name,
                            value: al.code+al.name,
                        });
                        n+=1
                      });
                    } else {
                      this.institutionTypeName[k].children[m].children.push({
                        label: sl.code+sl.name,
                        value: sl.code+sl.name,
                      });
                    }
                    m+=1
                  });
                } else {
                  this.institutionTypeName[k].children.push({
                    label: xl.code+xl.name,
                    value: xl.code+xl.name,
                  });
                }
                k+=1;
              });
            } else {
              this.institutionTypeName.push({
                label: el.code+el.name,
                value: el.code+el.name,
              });
            }
          }
        });
        this.institutionTypeAll = this.institutionTypeName;
      }else{
        this.changeInstitutionType()
      }
    },
    //更改基本支出人员经费功能分类,更新机构行业类型
    personExpenditure(){
      let firstArray=[];
      let secondArray=[];
      let code=null;
      let flage=true;
      switch(this.form.personExpenditure){
        case 205:
          firstArray=["P","S"]
          secondArray=[["83"],["91","92","93","94","95","96"]]
          break;
        case 206:
          firstArray=["M","S"]
          secondArray=[["73","74","75"],["91","92","93","94","95","96"]]
          break;
        case 20701:
          firstArray=["R","S"]
          secondArray=[["88"],["91","92","93","94","95","96"]]
          break;
        case 20702:
          firstArray=["R","S"]
          secondArray=[["88"],["91","92","93","94","95","96"]]
          code="884"
          break;
        case 20703:
          firstArray=["R","S"]
          secondArray=[["89"],["91","92","93","94","95","96"]]
          break;
        case 20706:
          firstArray=["R","S"]
          secondArray=[["86"],["91","92","93","94","95","96"]]
          break;
        case 20708:
          firstArray=["R","S"]
          secondArray=[["87"],["91","92","93","94","95","96"]]
          break;
        case 20799:
          firstArray=["R","S"]
          secondArray=[["90"],["91","92","93","94","95","96"]]
          break;
        case 210:
          firstArray=["Q","S"]
          secondArray=[["84"],["91","92","93","94","95","96"]]
          break;
        default:
          flage=false
      }
      if(flage){
        this.institutionTypeName=[]
        for (let i = 0; i < firstArray.length; i++) {
          institutionTypeData.forEach((el, index) => {  //第一节
            if(el.code == firstArray[i]){
              if(el.children) {
                this.institutionTypeName.push({
                    label: el.code+el.name,
                    value: el.code+el.name,
                    children: [],
                  });
                for (let k = 0; k < secondArray[i].length; k++) {
                  el.children.forEach((xl, ol) => {  //第二节
                    if(xl.code == secondArray[i][k]){
                      if(xl.children) {
                        this.institutionTypeName[i].children.push({
                          label: xl.code+xl.name,
                          value: xl.code+xl.name,
                          children: [],
                        });
                        if(code != null){
                          xl.children.forEach((sl,il) => {   //第三节
                            if(sl.code == code){
                              if(sl.children) {
                                this.institutionTypeName[i].children[k].children.push({
                                  label: sl.code+sl.name,
                                  value: sl.code+sl.name,
                                  children: [],
                                });
                                sl.children.forEach((al) => {   //第四节
                                  this.institutionTypeName[i].children[k].children[il].children.push({
                                    label: al.code+al.name,
                                    value: al.code+al.name,
                                  });
                                });
                              } else {
                                this.institutionTypeName[i].children[k].children.push({
                                  label: sl.code+sl.name,
                                  value: sl.code+sl.name,
                                });
                              }
                            }
                          });
                          code=null
                        }else{
                          xl.children.forEach((sl,il) => {   //第三节
                            if(sl.children) {
                              this.institutionTypeName[i].children[k].children.push({
                                label: sl.code+sl.name,
                                value: sl.code+sl.name,
                                children: [],
                              });
                              sl.children.forEach((al) => {   //第四节
                                this.institutionTypeName[i].children[k].children[il].children.push({
                                  label: al.code+al.name,
                                  value: al.code+al.name,
                                });
                              });
                            } else {
                              this.institutionTypeName[i].children[k].children.push({
                                label: sl.code+sl.name,
                                value: sl.code+sl.name,
                              });
                            }
                          });
                        }
                      }else{
                        this.institutionTypeName[i].children.push({
                          label: xl.code+xl.name,
                          value: xl.code+xl.name,
                        });
                      }
                    }
                  });
                }
              }
            }
          });
        }
        this.institutionTypeAll = this.institutionTypeName;
      }else{
        this.changeInstitutionType()
      }
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if(this.form.budgetCode < 0){
          this.$message({
            showClose: true,
            message: '财政预算代码不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.institutionNumber < 0){
          this.$message({
            showClose: true,
            message: '核算机构数不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.authorizedNumber < 0){
          this.$message({
            showClose: true,
            message: '编制机构数不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.ofSideNumber < 0){
          this.$message({
            showClose: true,
            message: '编制外人数不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.retiredStaff < 0){
          this.$message({
            showClose: true,
            message: '离退休人员人数不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.otherStaff < 0){
          this.$message({
            showClose: true,
            message: '其他人员不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.staffOnActiveDuty < 0){
          this.$message({
            showClose: true,
            message: '实有人员不能为负数',
            type: 'error'
          });
          return false
        }
        if(this.form.unitBasicProperty!=23 && this.form.budgetCode==""){
            this.$message({
            showClose: true,
            message: '单位基本性质除经费自理事业单位外，财政预算代码不应为空',
            type: 'error'
          });
          return false
        }
        if([11,12,13,14,15,16,17,31].indexOf(this.form.unitBasicProperty)==-1 && this.form.unitReform==''){
          this.$message({
            showClose: true,
            message: '单位基本性质选择“参照公务员法管理事业单位”、“财政补助事业单位”、“经费自理事业单位”时，事业单位改革分类不应为空',
            type: 'error'
          });
          return false
        }
        
      if (valid) {
          this.$loading({ fullscreen: true, text: "修改中" });
          this.form.sort = 0;
          if(this.value == ""){
            let administrationDivisionName = this.administrationDivisionName;
            administrationDivisionName = administrationDivisionName.join(",");
            this.form.administrationDivisionName = administrationDivisionName;
            this.form.streetAddress = "";
            this.form.province = " ";
            this.form.city = " ";
          }else{
            let street = this.street;
            let detailAddress = this.detailAddress;
            let streetAddress = street + detailAddress;
            let administrationDivisionName = this.administrationDivisionName;
            administrationDivisionName = administrationDivisionName.join(",");
            this.form.administrationDivisionName = administrationDivisionName;
            this.form.streetAddress = streetAddress;
            this.form.province = this.province;
            this.form.city = this.city;
          }
          if(this.form.isVirtual == '0'){
            this.form.virtualUnit = false
          }else{
            this.form.virtualUnit = true
          }
          unitUpdate(this.form)
            .then((res) => {
              console.log("res", res);
              if (res.data.code == "200") {
                this.$message.success("修改成功");
                setTimeout(() => {
                  this.$loading().close();
                }, 500);
                location.reload();
                this.$emit("freshUnitInfo");
                this.$emit("closeDialog", "editTenant");
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.$loading().close();
              }, 500);
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100% !important;
}
::v-deep .el-dialog__body {
  overflow: auto;
}
.diy-dialog-body {
  justify-content: space-between;
  .el-form {
    justify-content: space-between;
    .el-input {
      width: 250px;
    }
  }
}
.diy-dialog-footer .el-button:first-child {
  margin-right: 10px;
}
.body-container {
  margin-top: 10px;

  &__title {
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
    color: rgba(48, 49, 51, 1);
  }
}
.body-item {
  margin-top: 10px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-main {
    width: 100%;
    margin-top: 10px;
  }

  .diy-table {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.body-container ::v-deep .el-form {
  .el-cascader,
  .el-input {
    width: 350px;
  }
}
::v-deep .el-textarea__inner {
  height: 200px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 7px;
  background: #ffffff;
}
::-webkit-scrollbar-thumb {
  height: 0px;
  border-radius: 4px;
  background: #90939928;
}
::-webkit-scrollbar-thumb:hover {
  width: 8px;
  background: #90939967;
}
::v-deep.diy-dialog-body {
  border: 0 !important;
}
::v-deep .el-tabs__header {
  margin: 0px !important;
}
::v-deep .el-dialog__body {
  height: 556px;
}
.progress-box {
  width: fit-content;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.tabs {
  width: 490px;
}
.diy-dialog-footer {
  margin-top: 120px;
}
.diy-dialog-box {
  border: 1px solid rgba(235, 238, 245, 1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  &__checkBox {
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &__radio {
    margin-top: 10px;
    border: 1px solid rgba(235, 238, 245, 1);
    padding: 10px;
  }
  &-treeBox {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
  }
  &-left,
  &-right {
    width: 50%;
    padding: 16px;
    border: 1px solid rgba(235, 238, 245, 1);
  }
}
.layout-role {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(235, 238, 245, 1);
}
.diy-dialog-body {
  border: 1px solid rgba(235, 238, 245, 1);
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  justify-content: flex-start;
  &--left,
  &--right {
    width: 50%;
    height: 500px;
    padding: 16px;
  }

  &--left {
    border-right: 1px solid rgba(235, 238, 245, 1);
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    height: 20px;
    color: rgba(48, 49, 51, 1);
  }

  &__list {
    height: 440px;
    margin-top: 10px;
    overflow-y: scroll;

    li {
      overflow: hidden;
      height: 26px;
      line-height: 26px;
      display: flex;
      justify-content: space-between;

      i {
        margin-right: 5px;
        color: #c0c4cc;
        cursor: pointer;

        &:hover {
          color: #9da1a8;
        }
      }
    }
  }
}
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
</style>
