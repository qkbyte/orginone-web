<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item
        v-for="item in formItem"
        v-bind="item"
        :key="item.prop"
        :label-width="options.labelWidth"
      >
        <!-- slot -->
        <template v-if="item.type === 'slot'">
          <slot :name="'form-' + item.value" />
        </template>
        <!-- 文本框 -->
        <el-input
          v-if="item.prop === 'realName'"
          v-model="form.realName"
          placeholder="请输入姓名"
        ></el-input>
        <!-- 整数框 -->
        <el-input
          v-if="item.prop === 'phoneNumber'"
          v-model.number="form.phoneNumber"
          placeholder="请输入手机号码"
        ></el-input>
        <!-- 日期时间 -->
        <!-- 枚举字典 -->
        <el-select
          v-if="item.prop === 'roleIds'"
          multiple
          v-model="form.roleIds"
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- 数据库表 -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DiyForm",
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss" scoped></style>
