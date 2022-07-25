<template>
<div class="base-layout">
    <DiyBoxLayout class="box">
      <TheAppCheckTable ref="table"></TheAppCheckTable>
    </DiyBoxLayout>
  </div>
</template>

<script>
import DiyBoxLayout from "@layout/DiyBoxLayout/index";
import TheAppCheckTable from "./components/appCheckTable"
export default {
  components: {
    DiyBoxLayout,
    TheAppCheckTable
  },
};
</script>


