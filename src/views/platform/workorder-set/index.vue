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
            title: '流程管理',
            id: '2',
            children: [
              {
                pathName: 'workorder-form',
                title: '表单管理',
                abbr: '管理',
                id: '2-1'
              },
              {
                pathName: 'workorder-model',
                title: '模型管理',
                abbr: '模型',
                id: '2-2'
              },
              {
                pathName: 'workorder-processDefinition',
                title: '流程定义',
                abbr: '定义',
                id: '2-3'
              },
              {
                pathName: 'workorder-processInstance',
                title: '流程实例',
                abbr: '实例',
                id: '2-4'
              },
              {
                pathName: 'workorder-task',
                title: '任务管理',
                abbr: '任务',
                id: '2-5'
              },
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