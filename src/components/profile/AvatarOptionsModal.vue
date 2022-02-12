<template>
  <div class="avatar-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="modal-title">Please select an avatar</div>
    <div class="h-line mt-4"></div>
    <div class="avatar-box">
      <div class="avatar-item hover" :class="selectedIndex === index ? 'active' : ''"
           @click="select(index)"
           v-for="(avatar, index) of avatarOptions" :key="index">
        <div v-if="selectedIndex===index" class="circle-box"></div>
        <img :src="avatar" alt="">
      </div>
    </div>

  </div>
</template>

<script>
import { updateUserInfo } from '@/utils/web3/account'
import { mapGetters, mapState } from 'vuex'
import { handleApiErrCode } from '../../utils/helper'

export default {
  name: 'AvatarOptionsModal',
  data () {
    return {
      selectedIndex: -1,
      avatarOptions: [
        require('../../static/images/avatars/1.png'),
        require('../../static/images/avatars/2.png'),
        require('../../static/images/avatars/3.png'),
        require('../../static/images/avatars/4.png'),
        require('../../static/images/avatars/5.png'),
        require('../../static/images/avatars/6.png'),
        require('../../static/images/avatars/7.png'),
        require('../../static/images/avatars/8.png'),
        require('../../static/images/avatars/9.png'),
        require('../../static/images/avatars/10.png')
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['getUserByAddress']),
    ...mapState('web3', ['account'])
  },
  methods: {
    async select(index) {
      console.log(index);
      this.selectedIndex = index;
      let user = this.getUserByAddress(this.account)
      if (!user){
        user = {
          address: this.account,
        }
      }
      index++;
      const avatar = 'https://cdn.wherein.mobi/walnut/avatar/default/'+ index +'.png'
      try{
        await updateUserInfo({...user, avatar});
        user.avatar = avatar
        this.$emit('close', avatar);
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
        this.selectedIndex = -1;
      } finally {
      }
    }
  },
}
</script>

<style scoped lang="scss">
.avatar-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
}
.avatar-item {
  width: 5rem;
  height: 5rem;
  margin: 1rem;
  position: relative;
  padding: 2px;
  img {
    width: 100%;
    height: 100%;
    z-index: 2;
    position: relative;
    border-radius: 50%;
    &:hover {
      box-shadow: 0 0 6px 2px var(--primary-custom);
    }
  }
  &.active::after {
    content: '';
    display: block;
    @include icon(1.2rem, 1.2rem);
    background-image: url("~@/static/images/selected.png");
    position: absolute;
    top: 0;
    right: 0;
  }
}
.circle-box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid var(--primary-custom);
  border-radius: 50%;
  clip-path: polygon(50% 0, 50% 50%, 100% 25%, 100% 100%, 0 100%, 0 0);
  z-index: 0;
  animation: spinner-relative 1.2s linear infinite;
}
</style>
