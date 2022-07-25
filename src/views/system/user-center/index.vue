<template>
  <div class="flex-column">
    <DiyBoxLayout style="height:250px">
      <template v-slot:table>
        <Basic :getUser="user" />
      </template>
    </DiyBoxLayout>
    <DiyBoxLayout>
      <template v-slot:table>
        <TheTenantTable ref="table" :userPhone="user.phoneNumber"> </TheTenantTable>
      </template>
    </DiyBoxLayout>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo, getUserInfoById } from "@api/user";
import Basic from "./components/BasicData";
import DiyTitle from "@components/DiyTitle/index";
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheTenantTable from "./components/TheTenantTable";

export default {
  name: "personCenter",
  components: {
    Basic,
    DiyTitle,
    DiyBoxLayout,
    TheTenantTable,
  },
  data() {
    return {
      user: {},
    };
  },
  created() {
    this.Loading();
  },
  mounted() {},
  computed: {
    ...mapState("user", ["userId"]),
  },
  methods: {
    async Loading() {
      let info = await getUserInfoById({
        id: this.userId,
      });
      this.user = info.data.data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
