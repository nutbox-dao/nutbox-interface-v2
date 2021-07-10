<template>
  <Dropdown :menu-options="concatAddressOptions"
            selected-key="asset"
            :selected-item="selectedAssetData"
            @setSelectedData="setSelectedAsset">
    <template v-slot:empty0>
      <div class="text-center">
        <div class="custom-control" style="line-height: 1.5rem">
          Havn’t Registry yet？
          <router-link to="/community/register/native">Registry one</router-link>
        </div>
      </div>
    </template>
    <template v-slot:drop-item="slotProps">
      <img class="prefix-icon" :src="slotProps.item.icon" alt="">
      <div class="flex-full d-flex flex-column">
        <span>{{slotProps.item.symbol}}</span>
        <span class="font12 text-grey-light">{{slotProps.item.asset | formatUserAddress}}</span>
      </div>
    </template>
  </Dropdown>
</template>

<script>
import Dropdown from '@/components/ToolsComponents/Dropdown'
export default {
  name: 'AssetsDropdown',
  components: { Dropdown },
  data () {
    return {
      selectedKey: 'name',
      selectedAssetData: {},
      assets: null,
      concatAddressOptions: [
        {
          categoryName: 'Personal',
          items: []
        },
        {
          categoryName: ' Official',
          items: [
            { name: 'BBB', symbol: 'BBB', asset: '0xaaaaaaaaaaaaaaaa' }
          ]
        }
      ]
    }
  },
  methods: {
    setSelectedAsset (data) {
      this.selectedAssetData = data
      this.$emit('setSelectedAsset', data)
    }
  }
}
</script>

<style scoped>

</style>
