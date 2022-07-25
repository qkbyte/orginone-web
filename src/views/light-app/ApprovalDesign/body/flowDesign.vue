<template>
    <div class="flowDesign">
        <iframe
                :src="url"
                frameborder="0"
                width="100%"
                height="100%"
                name="myframe"
                id="myframe"
                class="flow-design-main"
        >
        </iframe>
    </div>
</template>

<script>
    import { mapState, mapGetters } from "vuex";
    export default {
        name: "flowDesign",
        data() {
            let self = this;
            window["goToFormlist"] = () => {
                self.goToFormlist();
            };
            return {
                url: "/static/index.html"
            };
        },
        props: {
            formId: {
                type: String,
                default: () => {
                }
            },
        },


        created() {
            // if (this.formId==='')
            //     this.$router.go(-1);
            // this.url += "?" + "token" + "=" + this.token+"&userId="+this.userId+"&tenant_id="+this.getCurTenantCode+"&formId="+this.formId;
        },
        mounted() {
            this.url += "?" + "token" + "=" + this.token+"&userId="+this.userId+"&tenant_id="+this.curTenantCode+"&formId="+this.formId;
        },
        computed: {
            ...mapState("user", ["token"]),
            ...mapState("user", ["userId"]),
            ...mapGetters("tenant", ["curTenantCode"]),
        },
        methods: {
            showNothing(){
                alert("121313");
            },
            goToFormlist(){
                this.$router.push({name:'approvalList'})
            },
            goToTrue(){
                this.$router.push({name:'approvalList'})
            },
        }
    };
</script>

<style lang="scss" scoped>
.flowDesign{
    margin-top: 1rem;
    width: 100%;
    height: 100vh;
}
</style>