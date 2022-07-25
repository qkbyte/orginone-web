<template>
  <div class="app-info" v-if="isShow">
    <div class="diy-dialog-body">
      <div class="app-info_header">
        <div class="header-icon">
          <img :src="form.icon ? form.icon : require('@assets/default-head.svg') " alt />
        </div>
        <div class="header-name">{{ form.appName }}</div>
      </div>
      <div class="app-info_body">
        <div class="body-firstFloor">
          <div class="body-firstFloor_version first">
            版本号：{{ form.version }}
          </div>
          <div class="body-firstFloor_platform first">
            发布平台：{{ platform[form.platform -1].label }}
          </div>
          <div class="body-firstFloor_status first">
            应用类型：{{ appType[form.appType-1].label }}
          </div>
          <div class="body-firstFloor_targetUser first">
            目标用户：{{ targetUser[form.targetUser-1].label }}
          </div>
        </div>
        <div class="body-secondFloor">
          <div class="body-secondFloor_description first">
            应用详情：{{ form.description }}
          </div>
        </div>
        <div class="body-thirdFloor">
          <div class="body-thirdFloor_contactName first">
            负责人姓名：{{ form.contactName }}
          </div>
          <div class="body-thirdFloor_contact first">
            负责人手机号：{{ form.contact }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getDictItemList } from "@utils/index";
export default {
  data() {
    return {
      form: {
        appName: "",
        version: "",
        icon: "",
        contact: "",
        contactName: "",
        platform: 1,
        description: "",
        tenantId: "",
        targetUser: 0,
        saleStatus: 0,
        status: "",
      },
      platLabel:'',
      appType: [],
      targetUser: [],
      platform: [],
      isShow:false
    };
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        console.log('new', newValue);
        this.form = this.formData;
        this.loadData()
      },
      deep: true,
    },
  },
  created() {
    this.form.tenantId = this.curTenantCode;
  },
  computed: {
    ...mapGetters("tenant", ["curTenantCode"]),
  },
  methods:{
    async loadData(){
      this.appType = await getDictItemList(this.dict.APP_TYPE);
      this.platform = await getDictItemList(this.dict.APP_PLATFORM);
      this.targetUser = await getDictItemList(this.dict.APP_TARGET);
      this.isShow = true
      this.$emit('handleShow', this.isShow)
    }
  },
};
</script>

<style lang="scss" scoped>
.app-info {
  width: 800px;
  .diy-dialog-body {
    width: 1000px;
    display: block;
  }
  &_header {
    margin-top: 22px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-icon {
      img {
        height: 40px;
        width: 40px;
      }
      margin-right: 16px;
    }
    .header-name {
      font-size: 16px;
      color: #000;
      line-height: 22px;
      font-weight: bold;
    }
  }
  &_body {
    margin-left: 58px;
    width: 100%;
    color: #58657d;
    font-weight: 600;
    .body-firstFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .first {
      width: 240px;
      white-space: nowrap;
    }
    .space {
      margin-top: 20px;
      width: 100%;
    }
    .body-secondFloor {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-thirdFloor {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .body-fourthFloor {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 6px;
    }
  }
}
</style>
