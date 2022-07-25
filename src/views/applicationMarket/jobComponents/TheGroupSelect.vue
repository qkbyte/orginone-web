<template>
  <div>
    <template v-if="createGroupCount !== 0">
      <div
        class="select-menu"
        @click="showTenantList()"
        :title="nowGroup.groupName"
      >
        <div class="select-item select-item--active">
          <div class="select-item__img">
            {{ nowGroup.groupName.slice(0, 1) }}
          </div>
          <div class="select-item__title">{{ nowGroup.groupName }}</div>
          <svg
            class="svg-icon arrow-icon"
            aria-hidden="true"
            :style="
              btnType ? 'transform: rotate(180deg);' : 'transform: rotate(0);'
            "
          >
            <use :xlink:href="'#icon-down'" />
          </svg>
        </div>
        <div
          class="select-drop"
          style="overflow-y:auto"
          :style="{ height: groupListHeight }"
        >
          <div
            class="select-item-box select-item-box--item"
            v-if="groupList.length > 0"
          >
            <div
              class="select-item select-item--noactive"
              @click="switchTenant(item, index)"
              v-for="(item, index) in dropList"
              :key="item.id"
            >
              <div class="select-item__img">
                {{ item.groupName.slice(0, 1) }}
              </div>
              <div class="select-item__title">{{ item.groupName }}</div>
            </div>
          </div>
          <div
            class="select-item-box select-item-box--btn"
            :style="
              groupList.length > 0
                ? 'border-top: 1px solid rgb(233, 233, 233);margin-top:10px;'
                : ''
            "
          >
            <div class="select-item select-item--noactive" @click="createUnit">
              <div class="select-item__btn">
                <i class="el-icon-plus"></i> 新建集团
              </div>
            </div>
          </div>
        </div>
        <template v-for="item in dialogShow">
          <TheAddDialog
            v-if="item.key === 'add' && item.value"
            :key="item.key"
            :dialogShow="item"
            @closeDialog="handleCloseDialog"
            @reloadPage="getList"
          ></TheAddDialog>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { getRoleIdByTenantId } from "@api/role";
import { async } from "q";
import TheAddDialog from "./TheAddDialog";
import { getManageGroupList } from "@api/group";
export default {
  data() {
    return {
      btnType: false,
      dialogShow: [
        {
          key: "add",
          value: false,
        },
      ],
      groupList: [],
      groupListHeight: "0px",
      nowGroup: {
        groupName: "",
      },
      dropList: [],
      createGroupCount: "",
    };
  },
  components: { TheAddDialog },
  computed: {
    ...mapState("user", ["userName", "roleId"]),
    ...mapGetters("tenant", [
      "unitCount",
      "dropUnitList",
      "curTenant",
      "curTenantId",
    ]),
  },
  created() {
    this.getList();
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.btnType = false;
      }
    });
  },
  methods: {
    showTenantList() {
      this.btnType = !this.btnType;
      let dropHeight = "";
      if (this.dropList.length > 0) {
        dropHeight = "160px";
      } else {
        dropHeight = "80px";
      }
      this.groupListHeight = this.groupListHeight == "0px" ? dropHeight : "0px";
    },
    async getList() {
      await getManageGroupList({ type: 1 }).then((res) => {
        this.groupList = res.data.data;
        this.createGroupCount = this.groupList.length;
      });
      for (let i = 1; i < this.groupList.length; i++) {
        this.dropList.push(this.groupList[i]);
      }

      this.nowGroup = this.groupList[0];
      this.$emit("freashTableData", this.nowGroup.id);
    },
    createUnit() {
      this.dialogShow.map((el) => {
        if (el.key === "add") {
          el.value = true;
        }
      });
    },
    async switchTenant(obj, index) {
      this.nowGroup = obj;
      this.$emit("freashTableData", obj.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-menu {
  height: 60px;
  position: relative;
  cursor: pointer;
  margin-right: 16px;

  .select-drop {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.161);
    border-radius: 0 0 4px 4px;
    z-index: 2;
  }
  .select-item-box {
    z-index: 2 &--item {
      margin-top: 5px;
    }
    &--btn {
      padding: 10px 0;
    }
  }

  .select-item {
    width: 220px;
    min-height: 40px;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;

    &__img {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background: $theme-color;
      color: #ffffff;
      line-height: 30px;
      text-align: center;
    }

    &__title {
      min-width: 140px;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      font-weight: 400;
      margin-right: 22px;
      margin-left: 20px;
    }

    &__btn {
      color: #0b3ed3;
    }

    &--active {
      height: 60px;
    }
    &--noactive {
      &:hover {
        background-color: rgba(245, 246, 252, 1);
      }
    }
    .arrow-icon {
      transition: all 0.5s;
      width: 10px;
      height: 8px;
      color: #909399;
    }
    .select-item__btn {
      position: absolute;
      left: 20px;
    }
  }
}
.createGroup {
  margin-top: 12px;
  width: 120px;
  height: 36px;
  margin-left: 12px;
}
</style>
