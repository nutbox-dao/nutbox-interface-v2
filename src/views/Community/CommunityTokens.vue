<template>
  <div class="container scroll-content py-5">
    <div class="table-card text-left">
      <div class="tabs">
        <span class="tab-item font16" :class="activeTab===index?'active':''"
              v-for="(item, index) of tabOptions" :key="index"
              @click="activeTab=index">{{ $t('asset.' + item) }}</span>
      </div>
      <div class="empty-bg" v-if="items.length === 0">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t('asset.noTokens') }}</p>
      </div>
      <div class="table-box">
        <b-table v-show="items.length > 0"
                 :items="items"
                 :fields="fields[activeTab]"
                 thead-tr-class="th-cell"
                 table-class="c-table"
                 hover
                 tbody-tr-class="c-tr"
                 thead-class="c-th"
        >
          <template #cell(coin)="row">
             <b-avatar size="sm" class="mr-2">C</b-avatar>
            <span>{{ row.item.coin }}</span>
          </template>
          <template #cell(action)>
            <button class="action-btn">Buy</button>
          </template>
        </b-table>
      </div>
      <b-pagination v-if="items.length !== 0"
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="right"
                    class="change-page-box"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityTokens',
  data () {
    return {
      tabOptions: ['sortByCap', 'sortByPrice'],
      activeTab: 0,
      fields: [
        [
          { key: 'coin', label: 'Coin' },
          { key: 'creator', label: 'Creator' },
          { key: 'price', label: 'Price' },
          { key: 'supply', label: 'Cirulating Coin Supply' },
          { key: 'cap', label: 'Markrt cap' },
          { key: 'action', label: '' }
        ]
      ],
      items: [
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' },
        { coin: '$KSK', creator: 'Kevin Chou', price: '$46.363', supply: '150.535', cap: '$587.234' }
      ],
      currentPage: 1,
      totalRows: 0,
      perPage: 12
    }
  },
  mounted () {
    
  },
}
</script>

<style scoped lang="scss">
.table-card {
  @include card(1.2rem, white, none, fit-content);
}
.tabs {
  display: flex;
  margin-bottom: 1.2rem;
}
.tab-item{
  padding-bottom: .8rem;
  margin-right: 2rem;
  &.active {
    border-bottom: 4px solid var(--primary-custom);
  }
}
.table-box {
  width: 100%;
  height: 100%;
  overflow-x: auto;
}
.action-btn {
  height: 1.8rem;
  border: 1px solid var(--dividers);
  border-radius: 1.8rem;
  padding: 0 .9rem;
}
</style>
