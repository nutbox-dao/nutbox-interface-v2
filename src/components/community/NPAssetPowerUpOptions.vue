<template>
  <div class="np-asset-up-modal position-relative">
    <i class="modal-back-icon modal-back-icon-no-bg" @click="$emit('back')"></i>
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="options-tip">
      According to unlock time you choose,you can power up 1 Nut to1-64 NP.
    </div>
    <div class="options-box">
      <div class="options-grid">
        <div class="options-item" v-for="(item, index) of options" :key="index"
             :class="['item'+(index), (isUpgrade && item.unlockTime<=upgradeData.unlockTime)?'disable-item':'active-item']"
             :data-hover-content="`unlock time: ${item.unlockTime}week`"
             @click="$emit('setData', item)">1 Nut to {{item.ratio}} NP</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NPAssetPowerUp',
  props: {
    isUpgrade: {
      type: Boolean,
      default: false
    },
    upgradeData: {
      type: Object,
      default: () => {
        return { unlockTime: 0, ratio: 0 }
      }
    }
  },
  data () {
    return {
      options: [
        { unlockTime: 1, ratio: 1 },
        { unlockTime: 2, ratio: 2 },
        { unlockTime: 4, ratio: 4 },
        { unlockTime: 8, ratio: 8 },
        { unlockTime: 16, ratio: 16 },
        { unlockTime: 32, ratio: 32 },
        { unlockTime: 64, ratio: 64 }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.np-asset-up-modal {
  min-height: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: url("~@/static/images/home-bg1.svg"), url("~@/static/images/home-bg2.png");
  background-repeat: no-repeat;
  background-position: 70% -5rem, 45% 35%;
  background-size: 50%, 50%;
  padding: 12px 24px 24px;
}
.modal-back-icon {
  top: 12px;
  left: 24px;
}
.modal-close-icon-right {
  top: 12px;
  right: 24px;
}
.options-tip {
  margin: 4rem 1.4rem 0;
}
.options-box {
  flex: 1;
  padding-top: 2rem;
}
.options-grid {
  margin: auto;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(12, 1fr);
  gap: 10px;
  width: 810px;
  height: 400px;
  max-height: 400px;
  .options-item {
    background-color: var(--card-bg-primary);
    border-radius: 12px;
    border: 1px solid var(--dividers);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &.disable-item {
      border: none;
      background-color: var(--text-74);
      cursor: not-allowed;
      &:hover{
        //border: 1px solid transparent;
        border: none;
        &::after{
          content: '';
          background-image: none;
        }
      }
    }
    //&.active-item {
    //  background-color: var(--primary-custom);
    //  border: 1px solid var(--primary-custom);
    //}
    &:hover {
      border: none;
      &::after {
        content: attr(data-hover-content);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(135deg, #D252CB, #4826DF);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 12px;
      }
    }
  }
}
.item0 {
  font-size: 12px;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}
.item1 {
  font-size: 12px;
  grid-column: 1 / 2;
  grid-row: 2 / 4;
}
.item2 {
  font-size: 12px;
  grid-column: 2 / 3;
  grid-row: 1 / 4;
}
.item3 {
  font-size: 18px;
  grid-column: 1 / 3;
  grid-row: 4 / 7;
}
.item4 {
  font-size: 1rem;
  grid-column: 3 / 5;
  grid-row: 1 / 7;
}
.item5 {
  font-size: 1.4rem;
  grid-column: 1 / 5;
  grid-row: 7 / 13;
}
.item6 {
  font-size: 2rem;
  grid-column: 5 / 9;
  grid-row: 1 / 13;
}
@media (max-width: 1199px) {
  .options-grid {
    width: auto;
  }
}
@media (max-width: 991px) {
  .options-grid {
    margin: auto;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(18, 1fr);
  }
  .item0 {
    font-size: 12px;
    grid-column: 1 / 3;
    grid-row: 1 / 2;
  }
  .item1 {
    font-size: 12px;
    grid-column: 1 / 3;
    grid-row: 2 / 4;
  }
  .item2 {
    font-size: 12px;
    grid-column: 3 / 5;
    grid-row: 1 / 4;
  }
  .item3 {
    font-size: 18px;
    grid-column: 1 / 5;
    grid-row: 4 / 7;
  }
  .item4 {
    font-size: 20px;
    grid-column: 5 / 9;
    grid-row: 1 / 7;
  }
  .item5 {
    font-size: 28px;
    grid-column: 1 / 9;
    grid-row: 7 / 12;
  }
  .item6 {
    grid-column: 1 / 9;
    grid-row: 12 / 19;
  }
}
</style>
