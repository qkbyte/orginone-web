<template>
  <el-dialog
      title="修改手机号"
      :visible.sync="dialogShow.key"
      width="30%"
      class="dialog-person"
      :close-on-click-modal="false"
      @close="handleClose('ruleForm')"
    >

    <el-carousel
      ref="carousel"
      class="forgetPd-box"
      indicator-position="none"
      arrow="never"
      :autoplay="false"
    >
      <el-carousel-item v-for="item in carousel" :key="item">
        <template v-if="item === 'oldPhone'">
          <phoneFrom
            :oldPhone="dialogShow.sendData.phoneNumber"
            @handleToggle="handleToggle"
            :phoneNumber.sync="form.phoneNumber"
          ></phoneFrom>
        </template>
        <template v-else-if="item === 'validation'">
          <checkNum
            @handleToggle="handleToggle"
            :phoneNumber="form.phoneNumber"
            :isActive="active === 1"
          ></checkNum>
        </template>
        <template v-else-if="item === 'newPhone'">
          <setPhone
            @handleToggle="handleToggle"
            @handleResetPhone="handleResetPhone"
            :phoneNumber.sync="form.phoneNumber"
          ></setPhone>
        </template>
      </el-carousel-item>
    </el-carousel>
    </el-dialog>
</template>

<script>
import { mapState,mapActions } from "vuex";
import { updatePassword } from "@api/user";
import { validatePassword } from "@utils/validate";
import { updatePersonInform } from "@api/tenant";
import phoneFrom from "./ThePhoneForm"
import checkNum from "./TheCheckNum"
import setPhone from "./TheSetPhone"
export default {
  name: "TheAppDialog",
  data() {
    return {
      options: {
        labelWidth: "100px",
      },
      loading: false,
      active: 0,
      form: {
        phoneNumber: "",
        password: "",
      },
      carousel:['oldPhone','validation', 'newPhone']
    };
  },
  props: {
    dialogShow: {
      type: Object,
      default: ()=>{},
    }
  },
  components:{
    phoneFrom,
    checkNum,
    setPhone,  
  },
  created() {
  },
  mounted() {
    console.log('dialog', this.dialogShow);
  },
  computed: {
    ...mapState("user", ["userId"]),
  },
  methods: {
    ...mapActions("user", ["changeAccountName"]),
    handleClose(formRef) {
      this.$parent.closeDialog('phone')
    },
    handleToggle(val){
      this.active = val
      this.$refs.carousel.setActiveItem(val);
    },
    handleResetPhone(){
      const { phoneNumber } = this.form
      let params = {
        phoneNumber: phoneNumber,
        name: this.dialogShow.sendData.realName,
        userId: this.userId
      }
      updatePersonInform(params).then((res) => {
        this.$message.success("修改成功");
        this.$parent.closeDialog('phone')
        this.changeAccountName(phoneNumber)
        this.$parent.$parent.$parent.$refs.table.loadData()
        this.$parent.Loading()
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.diy-dialog-footer .el-button:first-child {
  margin-right: 40px;
}
.demo-ruleForm{
  padding-top: 30px;
  width:100%
}
::v-deep .el-carousel {
  .el-carousel__container {
    height: 100%;
  }
  .el-carousel__item {
    display: flex;
    align-items: center;
  }
}
.forgetPd-box{
    height: 300px;
    width: 100%;
}
</style>
