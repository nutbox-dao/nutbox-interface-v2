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
                 :fields="fields"
                 thead-tr-class="th-cell"
                 table-class="c-table"
                 hover
                 tbody-tr-class="c-tr"
                 thead-class="c-th"
        >
          <template #table-colgroup="scope">
            <col v-for="field in scope.fields" :key="field.key"
                 :style="{ width: field.key === 'tokenIcon' ? '3rem' : '' }">
          </template>
          <template #cell(tokenIcon)="row">
            <img class="mr-2" style="width:3rem;height: 3rem" :src="row.item.tokenIcon" alt="">
          </template>
          <template #cell(tokenSymbol)="row">
            <span>{{ row.item.tokenSymbol }}</span>
          </template>
          <template #cell(name)="row">
            <span style="cursor:pointer" @click="openNewTab(row.item)">{{ row.item.name }}</span>
          </template>
          <template #cell(action)>
            <button class="action-btn">Buy</button>
          </template>
        </b-table>
      </div>
      <!-- <b-pagination v-if="items.length !== 0"
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="right"
                    class="change-page-box"
      ></b-pagination> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatBalance, formatPrice } from '@/utils/helper'
export default {
  name: 'CommunityTokens',
  data () {
    return {
      tabOptions: ['cap', 'price'],
      activeTab: 0,
      currentPage: 1,
      totalRows: 0,
      perPage: 12
    }
  },
  computed: {
    ...mapState('web3', ['allCommunities']),
    ...mapState(['ethPrice', 'lang']),
    fields() {
      return [
          { key: 'tokenIcon', label: ''},
          { key: 'tokenSymbol', label: this.$t('asset.tokenSymbol') },
          { key: 'name', label: this.$t('community.community') },
          { key: 'price', label: this.$t('asset.price') },
          { key: 'totalSupply', label: this.$t('asset.totalSupply') },
          { key: 'cap', label: this.$t('asset.cap') },
          // { key: 'action', label: '' }
        ]
    },
    items (){
      let sorted = this.allCommunities ? this.allCommunities.map(c => ({
          ...c,
          price: c.price,
          totalSupply: formatBalance(c.totalSupply.toString() / 1e18),
          cap: (c.price) * (c.totalSupply.toString() / 1e18)
        }))
        : []
      if (this.activeTab === 0) {
        return sorted.sort((a, b) => parseFloat(b.cap) - parseFloat(a.cap)).map(c => ({
          ...c,
          price: formatPrice(c.price),
          cap: formatPrice(c.cap)
        }))
      } else {
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).map(c => ({
          ...c,
          price: formatPrice(c.price),
          cap: formatPrice(c.cap)
        }))
      }
    }
  },
  methods: {
    openNewTab (cardInfo) {
      window.open(`${window.location.origin}/#/specify?id=${cardInfo.id}`, '_blank')
    }
  },
  mounted () {
    console.log('eth', this.ethPrice);
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
  cursor: pointer;
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
  cursor: pointer
}
</style>
