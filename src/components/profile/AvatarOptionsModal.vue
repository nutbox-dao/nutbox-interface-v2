<template>
  <div class="avatar-modal">
    <div class="text-right">
      <i class="modal-close-icon" @click="$emit('close')"></i>
    </div>
    <div class="text-center">Please select an avatar</div>
    <div class="h-line mt-4"></div>
    <div class="avatar-box">
      <div class="avatar-item hover" :class="selectedIndex === index ? 'active' : ''"
           @click="select(index)"
           v-for="(avatar, index) of avatarOptions" :key="index">
        <svg v-if="selectedIndex===index" class="svg-circle" height="100%" width="100%">
          <circle class="circle" cx="50%" cy="50%" r="48%" stroke="#F8B62A" stroke-width="2" fill-opacity="0" />
        </svg>
        <img :src="avatar" alt="">
      </div>
    </div>

  </div>
</template>

<script>
import { updateUserInfo } from '@/utils/web3/account'
import { mapGetters, mapState } from 'vuex'

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
        require('../../static/images/avatars/6.png')
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
      user.avatar = avatar
      await updateUserInfo(user);
      this.$emit('close');
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
  img {
    width: 100%;
    height: 100%;
  }
  &.active::after {
    content: '';
    display: block;
    @include icon(1.2rem, 1.2rem);
    background-image: url("~@/static/images/selected.png");
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    animation: show 0.4s ease-in 1s forwards;
  }
}
.svg-circle {
  position: absolute;
}
.circle {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: stroke 5s ease-out forwards;
}

@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
