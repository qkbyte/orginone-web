<template>
  <div class="workorder-enter-wrap">
    <div class="enter-item" v-for="item in routeList" :key="item.id">
      <div class="item-title">
        {{item.title}}
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="item-card">
        <div class="card-path-name" v-for="child in item.children" :key="child.id" @click="jumpToPathName(child.pathName)">
          <span class="path-name-circle">{{child.abbr}}</span>
          {{child.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        routeList: [
          {
            title: '我的流程',
            id: '1',
            children: [
              {
                pathName: 'workorder-myProcess',
                title: '我的汇总',
                abbr: '汇总',
                id: '1-1'
              },
              {
                pathName: 'workorder-startMyProcess',
                title: '发起流程',
                abbr: '流程',
                id: '1-2'
              },
              {
                pathName: 'workorder-taskTodo',
                title: '我的待办',
                abbr: '待办',
                id: '1-3'
              },
              {
                pathName: 'workorder-taskDone',
                title: '我的已办',
                abbr: '已办',
                id: '1-5'
              }
            ]
          }
        ]
      }
    },
    methods: {
      jumpToPathName(pathName) {
        this.$router.push({
          name: pathName
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
.workorder-enter-wrap {
  padding: 20px;
  .enter-item {
    margin-bottom: 50px;
  }
}
.item-title {
  font-size: 18px;
  margin-bottom: 20px;
}
.item-card {
  display: flex;
  .card-path-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-right: 30px;
    padding-left: 20px;
    .path-name-circle {
      width: 50px;
      height: 50px;
      line-height: 50px;
      background: #154AD8;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      font-size: 18px;
      margin-bottom: 16px;
    }
  }
}
</style>