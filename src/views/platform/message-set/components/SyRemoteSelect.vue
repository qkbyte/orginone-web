<template>
  <el-select v-model="currentValue" filterable remote :remote-method="remoteMethod" reserve-keyword @clear="clear"
             :placeholder="placeholder" :multiple="multiple" :loading="loading" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="item in options" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" :disabled="item.disabled" />
  </el-select>
</template>

<script>
  export default {
    name: 'SyRemoteSelect',
    props: {
      value: {
        require: true
      },
      apiPromise: {
        require: true
      },
      labelKey: {
        default: 'userName'
      },
      valueKey: {
        default: 'id'
      },
      extraParams: {
        type: Object,
        default: () => { return { size: 20 } }
      },
      multiple: {
        type: Boolean,
        default: true
      },
      placeholder: String,
      result: Array
    },
    data () {
      return {
        options: [],
        loading: false
      }
    },
    computed: {
      currentValue: {
        get() {
          return this.value
        },
        set(nv) {
          this.$emit('input', nv)
        }
      }
    },
    methods: {
      clear () {
        this.remoteMethod()
      },
      // 查询数据
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          this.apiPromise({ [`${ this.labelKey }`]: query, ...this.extraParams }).then(res => {
            this.options = res.data.data.records.map(i => { return { ...i, userName: `${ i.userName }-${ i.phoneNumber }` } })
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.options = []
        }
      }
    },
    created () {
      if (this.result && this.result.length) {
        return this.options = this.result.map(i => { return { id: i.userId, userName: i.phoneNumber ? `${ i.userName }-${ i.phoneNumber }` : i.name } })
      }
      this.remoteMethod()
    }
  }
</script>
