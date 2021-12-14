<template>
  <div class="asset-detail-modal position-relative">
    <div class="asset-detail-modal-content d-flex flex-column overflow-hidden">
      <div class="text-right">
        <i class="modal-close-icon" @click="$emit('close')"></i>
      </div>
      <div class="mt-2 text-center">Your Asset Detail</div>
      <div class="d-flex justify-content-between align-items-center my-4">
        <span>Total Asset Value</span>
        <span>$850</span>
      </div>
      <div class="asset-list flex-fill overflow-auto">
        <b-table :fields="fields" :items="listData"
                 thead-tr-class="asset-tr"
                 tbody-tr-class="asset-tr"
                 details-td-class="p-0"
                 class="text-white border-0 font12" borderless>
          <template #table-colgroup="scope">
            <col v-for="field in scope.fields" :key="field.key"
                 :style="{ width: field.key === 'logo' ? '1.6rem' : '' }">
          </template>
          <template #cell(logo)="row">
            <img v-if="row.item.logo"
                 style="width:1.6rem;height: 1.6rem"
                 :src="row.item.logo" alt="">
            <empty-img v-else width="1.6rem" height="1.6rem" class="rounded-circle"></empty-img>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetDetailModal',
  props: {
    listData: {
      type: Array,
      default: () => {
        return [
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
          { logo: '', symbol: 'NUT', amount: 100, value: 1000 },
        ]
      }
    }
  },
  data () {
    return {
      fields: [
        { key: 'logo', label: '' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'amount', label: 'Amount', class: 'text-center' },
        { key: 'value', label: 'Value', class: 'text-right' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.asset-detail-modal-content {
  max-height: 80vh;
}
.asset-tr td{
  vertical-align: middle;
}
</style>
