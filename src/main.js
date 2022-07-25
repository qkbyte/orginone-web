import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as directives from "./directives";
import { mixin } from "./mixin/index.js";
import "./permission";
import "./styles/index.scss";
import "./plugins/element.js";
import "./assets/theme/index.css";
import dict from "@/constants/index.js";
import echarts from "echarts";
import FormMaking from "../lib/form-making";
import "../lib/form-making/dist/FormMaking.css";
import axios from "axios";
import lodash from "lodash";
import ElementUI from "element-ui";
import VCharts from "v-charts";
import VueECharts from "vue-echarts";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import Vue2OrgTree from "vue2-org-tree";
import VueClipboards from "vue-clipboard2";
import "./assets/iconFont/iconfont.css";
import "./assets/ziti/iconfont.css";
import "./directives/modules/select";
import "./assets/icon/iconfont.css";

import DiyHelp from "@components/DiyHelp/index";
import { formatDictText, getDicts } from "@/utils/index";

Vue.use(VCharts);
Vue.use(ElementUI);
Vue.use(FormMaking);
Vue.use(Vue2OrgTree);
Vue.use(DiyHelp);
Vue.use(VueClipboards);

Vue.component("e-charts", VueECharts);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component("diy-help", DiyHelp);

Vue.mixin(mixin);

Object.keys(directives).forEach((el) => Vue.directive(el, directives[el]));

Vue.prototype._ = lodash;
Vue.prototype.$ajax = axios;
Vue.prototype.dict = dict;
Vue.prototype.$echarts = echarts;
Vue.prototype.getDicts = getDicts;
Vue.prototype.formatDictText = formatDictText;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  component: {
    DiyHelp,
  },
  render: (h) => h(App),
}).$mount("#app");
