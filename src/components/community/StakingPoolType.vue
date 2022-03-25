<template>
  <div class="pool-type-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-type-modal-content d-flex flex-column">
      <div class="modal-title mt-4">Choose a pool type</div>
      <div
        class="
          col-lg-10
          mx-auto
          flex-fill
          d-flex
          my-4
          align-items-center
          h-100
          types
        "
      >
        <div class="type-box type-box-cosmos">
          <button class="cosmos-btn" @click="$emit('onType', 'atom')">
            Atom
          </button>
        </div>
        <div class="type-box type-box-osmo">
          <button class="osmo-btn" @click="$emit('onType', 'osmo')">
            Osmo
          </button>
        </div>
        <div class="type-box type-box-steem">
          <button class="steem-btn" @click="$emit('onType', 'steem')">
            Steem
          </button>
        </div>
        <div class="type-box type-box-hive">
          <button class="hive-btn" @click="$emit('onType', 'hive')">
            Hive
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StakingPoolTypeModal",
  data() {
    return {
      poolType: "",
    };
  },
};
</script>

<style scoped lang="scss">
.pool-type-modal-content {
  min-height: 50vh;
}
.type-box {
  flex: 1;
  margin: 0 0.5rem;
  text-align: center;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
  background-size: contain, 35% auto;
  background-position: center, center 3rem;
  width: 180px;
  height: 260px;
  position: relative;
  &-moonbeam {
    background-image: url("~@/static/images/m-bg-moonbeam.png"),
      url("~@/static/images/m-bg-icon-moonbeam.png");
  }
  &-bsc {
    background-image: url("~@/static/images/m-bg-bsc.png"),
      url("~@/static/images/m-bg-icon-bsc.svg");
  }
  &-steem {
    background-image: url("~@/static/images/m-bg-steem.png"),
      url("~@/static/images/m-bg-icon-steem.svg");
  }
  &-hive {
    background-image: url("~@/static/images/m-bg-hive.png"),
      url("~@/static/images/m-bg-icon-hive.svg");
  }
  &-cosmos {
    background-image: url("~@/static/images/m-bg-cosmos.png"),
      url("~@/static/images/m-bg-icon-cosmos.svg");
  }
  &-osmo {
    background-image: url("~@/static/images/m-bg-osmo.png"),
      url("~@/static/images/m-bg-icon-osmo.svg");
  }
  button {
    border: none;
    font-size: 1rem;
    line-height: 1rem;
    color: white;
    height: 2.8rem;
    width: 70%;
    border-radius: 2.8rem;
    position: absolute;
    bottom: 1.6rem;
  }
  .moonbeam-btn {
    background-image: linear-gradient(to bottom, #66edea, #53cbc8);
  }
  .bsc-btn {
    background-color: #f5b638;
  }
  .steem-btn {
    background-image: linear-gradient(to bottom, #6176d6, #425cf0);
  }
  .hive-btn {
    background-image: linear-gradient(to bottom, #f32b68, #e31337);
  }
  .cosmos-btn {
    background-image: linear-gradient(to bottom, #555a83, #363a5a);
  }
  .osmo-btn {
     background-image: linear-gradient(to bottom, #8100b6, #4e02a8);
  }
}
@media (max-width: 991px) {
  .type-box {
    width: 9rem;
    height: 13rem;
  }
}
@media (max-width: 577px) {
  .types {
    flex-direction: column;
  }
  .type-box {
    width: 100%;
    height: auto;
    background-size: 120%, auto 50%;
    background-position: center, 2rem center;
    border: 2px solid var(--text-74);
    border-radius: 20px;
    margin-bottom: 10px;
    button {
      width: 7rem;
      font-size: 14px;
      line-height: 14px;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
