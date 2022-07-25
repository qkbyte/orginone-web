<template>
  <div class="base">
    <MessageComponent
      v-if="containLink == 'messageComponent'"
    ></MessageComponent>
    <UserInform v-if="containLink == 'userInform'"></UserInform>
    <TheInvitation v-if="containLink == 'invitation'"></TheInvitation>
    <TheIndexCard v-if="containLink == 'indexcard'"></TheIndexCard>
    <TheUsualApp v-if="containLink == 'usualapp'"></TheUsualApp>
    <TheIndexAsset v-if="containLink == 'indexasset'"></TheIndexAsset>
    <TheIndexVisit v-if="containLink == 'indexvisit'"></TheIndexVisit>
    <TheWelcome v-if="containLink == 'banner'"></TheWelcome>
    <TheWelcomejg v-if="containLink == 'bannerjg'"></TheWelcomejg>
    <TheNewMessage v-if="containLink == 'newMessage'"></TheNewMessage>
    <TheAnnouncement v-if="containLink == 'announcement'"></TheAnnouncement>
    <TheTaskwaring v-if="containLink == 'taskwaring'"></TheTaskwaring>
    <TheTaskBtn v-if="containLink == 'taskbtn'"></TheTaskBtn>
    <TheCockpitBtn v-if="containLink == 'cockpitbtn'"></TheCockpitBtn>
    <TheAnalyBtn v-if="containLink == 'analybtn'"></TheAnalyBtn>
    <TheScenarios v-if="containLink == 'scenarios'"></TheScenarios>
    <TheShowPlateBtn v-if="containLink == 'showplate'"></TheShowPlateBtn>
    <TheLineCharts v-if="containLink == 'charts'"></TheLineCharts>
    <TheBsPlatform v-if="containLink == 'bsplat'"></TheBsPlatform>
    <TheXzComponent v-if="containLink == 'xzComponent'"></TheXzComponent>
  </div>
</template>
<script>
import MessageComponent from "@views/templateComponent/TheMessageComponent";
import UserInform from "@views/templateComponent/TheUserInform";
import TheInvitation from "@views/templateComponent/TheInvitation";
import TheIndexCard from "@views/templateComponent/TheIndexCard";
import TheUsualApp from "@views/templateComponent/TheUsualApp";
import TheIndexAsset from "@views/templateComponent/TheIndexAsset";
import TheIndexVisit from "@views/templateComponent/TheIndexVisit";
import TheWelcome from "@views/templateComponent/TheWelcome";
import TheWelcomejg from "@views/templateComponent/TheWelcomejg";
import TheNewMessage from "@views/templateComponent/TheNewMessage";
import TheAnnouncement from "@views/templateComponent/TheAnnouncements";
import TheTaskwaring from "@views/templateComponent/TheTaskWaring";
import TheTaskBtn from "@views/templateComponent/TheTaskBtn";
import TheCockpitBtn from "@views/templateComponent/TheCockpitBtn";
import TheAnalyBtn from "@views/templateComponent/TheAnalyBtn";
import TheScenarios from "@views/templateComponent/TheScenarios";
import TheShowPlateBtn from "@views/templateComponent/TheShowPlateBtn";
import TheLineCharts from "@views/templateComponent/TheLineChar";
import TheBsPlatform from "@views/templateComponent/TheBsPlatform";
import TheXzComponent from "@views/templateComponent/TheXzComponent";

export default {
  components: {
    MessageComponent,
    UserInform,
    TheInvitation,
    TheIndexCard,
    TheUsualApp,
    TheIndexAsset,
    TheIndexVisit,
    TheWelcome,
    TheWelcomejg,
    TheNewMessage,
    TheAnnouncement,
    TheTaskwaring,
    TheTaskBtn,
    TheCockpitBtn,
    TheAnalyBtn,
    TheScenarios,
    TheShowPlateBtn,
    TheLineCharts,
    TheBsPlatform,
    TheXzComponent,
  },
  data() {
    return {};
  },
  props: {
    containLink: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.base{
  width: 100%;
  height: 100%;
}
</style>
