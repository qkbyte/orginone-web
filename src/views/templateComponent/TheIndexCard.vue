<template>
  <div class="home" style="height:100%;overflow:hidden">
    <div class="row-3 block" style="height:100%">
      <indexcard></indexcard>
    </div>
  </div>
</template>

<script>
import indexcard from "./components/indexcard";
export default {
  components: { indexcard},
};
</script>

<style lang="scss" scoped>
.row-2{
  padding: 0px !important;
}
.block {
  padding: 20px;
  background-color: #fff;
}
.line {
  width: 1px;
  background: #ebeef5;
}
.home {
  & > div + div {
    margin-top: 4px;
  }
}
.row-1 {
  height: 300px;

  &-left {
    flex: 1;
    margin-right: 4px;

    &__todo-num {
      width: 55%;
      height: 92px;

      .todo-num {
        display: flex;
        flex-direction: column;
        align-items: center;

        &--active {
          p {
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
          }
          i {
            margin-top: 6px;
            display: inline-block;
            height: 2px;
            width: 60%;
            background-color: #154ad8;
            border-radius: 100px;
          }
          span {
            height: 45px;
            font-size: 32px;
            font-weight: 600;
            color: #154ad8;
            line-height: 45px;
          }
        }

        &--no-active {
          cursor: pointer;
          p {
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #606266;
            line-height: 22px;
          }
          i {
            margin-top: 6px;
            display: inline-block;
            height: 2px;
          }
          span {
            height: 45px;
            font-size: 32px;
            font-weight: 400;
            color: #909399;
            line-height: 45px;
          }
        }
      }
    }

    &__view-more {
      margin-top: 10px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #154ad8;
      line-height: 20px;
      cursor: pointer;

      i {
        font-size: 12px;
      }
    }

    .todo-item + .todo-item {
      margin-top: 16px;
    }

    .todo-item {
      height: 20px;
      align-items: center;
      cursor: pointer;

      &:hover p {
        color: #154ad8;
      }

      &--left {
        display: flex;
        line-height: 20px;

        &__icon {
          width: 16px;
          height: 16px;

          img {
            height: 100%;
            width: 100%;
          }
        }

        p {
          max-width: 200px;
          margin-left: 5px;
          height: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          max-width: 200px;
          margin-left: 8px;
          font-size: 12px;
          font-weight: 400;
          color: #909399;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &--right {
        display: flex;
        min-width: 400px;
        line-height: 20px;
        position: relative;
        span {
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(144, 147, 153, 0.8);
        }

        span:nth-child(2) {
          max-width: 150px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          margin-left: 30px;
        }

        span:nth-child(3) {
          position: absolute;
          right: 0;
          min-width: 135px;
        }
      }
    }

    .todo-no-data {
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &__img {
        width: 170px;
        height: 80px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &__tip {
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(144, 147, 153, 0.8);
      }
    }
  }

  &-right {
    width: 368px;
    &__avatar {
      width: 52px;
      height: 52px;
      margin-top: 10px;
      background-image: linear-gradient(148deg, rgba(21, 74, 216, 1), rgba(255, 255, 255, 1));
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      .avatar {
        width:46px;
        height: 46px;
        background: #fff;
        border-radius: 50%;
        border: 2px solid #ffffff;
      }

        .avatar2{
          width:46px;
        height: 46px;
        border-radius: 50%;
        background: #154AD8;
        border: 2px solid #ffffff;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        color: #ffffff;
      }

    }

    &__content {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      line-height: 17px;

      div + div {
        margin-top: 5px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        line-height: 20px;
      }
    }

    .line {
      margin-top: 12px;
      width: 100%;
      height: 1px;
    }

    .message {
      margin-top: 15px;
      height: 179px;

      &-data {
        div + div {
          margin-top: 16px;
        }
        &__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
          i {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: rgba(21, 74, 216, 1);
            border-radius: 50%;
            margin-right: 16px;
          }
          p {
            right: 0;
            margin-right: 16px;
            color: rgba(48, 49, 51, 1);
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          span {
            min-width: 76px;
            font-size: 12px;
            color: rgba(144, 147, 153, 0.8);
          }
        }
      }
      &-no-data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 41px;

        &__img {
          width: 120px;
          height: 80px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        &__tip {
          margin-top: 20px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(144, 147, 153, 0.8);
        }
      }
    }
  }
}
</style>
