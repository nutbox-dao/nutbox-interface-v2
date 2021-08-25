<template>
  <b-dropdown class="c-dropdown" menu-class="full-dropdown-menu">
    <template #button-content>
      <div class="c-dropdown-btn flex-between-center">
        <span>{{selectedItem[selectedKey]}}</span>
        <i class="dropdown-icon ml-3"></i>
      </div>
    </template>
    <div class="text-center my-3 text-primary" v-if="loading" >
      <b-spinner class="dropdown-loading" label="Spinning"></b-spinner>
    </div>
    <b-dropdown-group v-else
                      v-for="(group, index) of menuOptions" :key="index"
                      :header="$t('community.'+group.categoryName)">
      <slot v-if="group.items.length===0" :name="`empty${index}`"></slot>
      <b-dropdown-item v-for="(item, sIndex) of group.items" :key="index+sIndex"
                       @click="setSelectedItem(item)">
        <template #default>
          <div class="flex-between-center">
            <slot name="drop-item" v-bind:item="item">
              <img class="prefix-icon" :src="item.icon" alt="">
              <div class="flex-full d-flex flex-column">
                <span>{{item.name}}</span>
                <span class="font12 text-grey-light">{{item.text}}</span>
              </div>
            </slot>
            <i class="selected-icon" v-if="selectedKey && selectedItem[selectedKey]===item[selectedKey]"></i>
          </div>
        </template>
      </b-dropdown-item>
    </b-dropdown-group>
  </b-dropdown>

</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    selectedKey: {
      type: String,
      default: ''
    },
    selectedItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    menuOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    setSelectedItem (data) {
      this.$emit('setSelectedData', data)
    }
  }
}
</script>

<style scoped lang="scss">
.c-dropdown {
  width: 100%;
  background-color: #F6F7F9;
  border-radius: .8rem;
}
.c-dropdown-btn {
  height: 2.4rem;
  border-radius: .8rem;
  background-color: #F6F7F9;
  .btn img {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: .6rem;
  }
  .btn span {
    color: #242629;
  }
  .dropdown-icon {
    @include icon(.6rem, .6rem);
    background-image: url("~@/static/images/dropdown-icon.svg");
  }
  .selected-icon {
    @include icon(1.4rem, 1.4rem);
    background-image: url("~@/static/images/selected.png");
  }
}
</style>
