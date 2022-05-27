<template>
  <div class="activity-card">
    <div class="title font14 font-bold">{{ opType }}</div>
    <div
      class="content hover font14 line-height18 font-bold"
      :id="operation.id + operation.type"
      @click="gotoTransaction()"
    >
      <span v-show="showName" :class="isAdmin ? 'admin' : ''">{{
        username
      }}</span>
      {{ description }}
    </div>
    <b-popover
      :target="operation.id + operation.type"
      :delay="{ show: 800 }"
      triggers="hover focus"
      placement="top"
    >
      {{ description }}
    </b-popover>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <img
        class="rounded-circle hover avatar"
        v-if="userAvatar && userAvatar.length > 0"
        :id="operation.id + operation.type + operation.user"
        :src="userAvatar"
        alt=""
      />
      <img
        v-else
        class="user-avatar rounded-circle avatar"
        :id="operation.id + operation.type + operation.user"
        src="~@/static/images/avatars/default.png"
        alt=""
      />
      <b-popover
        :target="operation.id + operation.type + operation.user"
        triggers="hover focus"
        placement="top"
      >
        {{ username }}
      </b-popover>
      <span
        :id="operation.id + operation.type + operation.timestamp"
        class="hover text-grey-7 font14 line-height14"
        >{{ time }}</span
      >
      <b-popover
        :target="operation.id + operation.type + operation.timestamp"
        triggers="hover focus"
        placement="top"
        :delay="{ show: 500 }"
      >
        {{ getDateString(operation.timestamp) }}
      </b-popover>
    </div>
  </div>
</template>

<script>
import { parseTimestamp, sleep } from "@/utils/helper";
import { ethers } from "ethers";
import { mapState, mapGetters } from "vuex";
import { contractAddress } from "@/utils/web3/contract";
import { BLOCK_CHAIN_BROWER } from "@/config";
import { addressAccToValBech32 } from '@/utils/cosmos/cosmos'
import { getPoolType } from "@/utils/web3/pool";

export default {
  name: "ActivityItem",
  props: {
    operation: {
      type: Object,
    },
    showName: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      time: "",
      description: "",
      username: "",
      isAdmin: false,
      userAvatar: "",
      opType: "",
    };
  },
  computed: {
    ...mapState("web3", ["allTokens"]),
    ...mapState("user", ["users"]),
    ...mapState("steem", ["vestsToSteem"]),
    ...mapState("hive", ["vestsToHive"]),
    ...mapState("currentCommunity", ["cToken"]),
    ...mapGetters("user", ["getUserByAddress"]),
    ...mapGetters("web3", ["tokenDecimals", "tokenByKey"]),
  },
  methods: {
    gotoTransaction() {
      window.open(BLOCK_CHAIN_BROWER + "tx/" + this.operation.tx, "_blank");
    },
    getDateString(timestamp) {
      try {
        return new Date(parseInt(timestamp) * 1e3)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
      } catch (e) {
        return "--";
      }
    },
  },
  async mounted() {
    // timestamp
    this.time = parseTimestamp(this.operation.timestamp);
    const interval = setInterval(() => {
      this.time = parseTimestamp(this.operation.timestamp);
    }, 5000);
    this.$once("hook:beforeDestroy", () => {
      window.clearInterval(interval);
    });
    let accName =
      this.operation.user.substring(0, 4) +
      "..." +
      this.operation.user.substring(
        this.operation.user.length - 4,
        this.operation.user.length
      );
    const user = this.getUserByAddress(this.operation.user);
    if (user) {
      accName = user.name ?? accName;
      this.userAvatar = user.avatar;
    }
    this.username = accName;
    let symbol;
    let decimals = 18;
    let ctokenSymbol;
    let delegatee;
    const np = (this.operation.amount?.toString() / 1e18).toFixed(2);
    const poolType = getPoolType(this.operation.poolFactory, this.operation.chainId)

    if (
      this.operation.asset &&
      this.operation.asset.length > 0 &&
      this.operation.type !== "ADMINSETDAOFUND" &&
      this.operation.type !== "ADMINWITHDRAWNREVENUE"
    ) {
      try {
        while (!this.allTokens) {
          await sleep(0.3);
        }
        const token = this.tokenByKey(this.operation.asset);
        symbol = token && token.symbol;
        decimals = token && token.decimal;
      } catch (e) {
      }
    }
    const amount = (this.operation.amount?.toString() / 10 ** decimals).toFixed(2);
    // distribution
    switch (this.operation.type) {
      case "DEPOSIT":
        this.opType = "Deposit";
        this.isAdmin = false;
        if (
          this.operation.poolFactory.toLowerCase() ==
          contractAddress.ERC20StakingFactory.toLowerCase()
        ) {
          this.description =
            this.showName ? this.$t('opHistory.depositWithName', {amount, symbol, pool: this.operation.pool.name})
            : this.$t('opHistory.deposit', {amount, symbol, pool: this.operation.pool.name})
        }else if (this.operation.poolFactory.toLowerCase() ===
          contractAddress.ERC1155StakingFactory.toLowerCase()
        ) {
          this.description =
            this.showName ? this.$t('opHistory.depositWithName', {amount: parseInt(this.operation.amount.toString()), symbol, pool: this.operation.pool.name})
            : this.$t('opHistory.deposit', {amount: parseInt(this.operation.amount.toString()), symbol: 'ERC1155', pool: this.operation.pool.name})
        } else if (
          this.operation.poolFactory.toLowerCase() ==
          contractAddress.SPStakingFactory.toLowerCase()
        ) {
          delegatee = ethers.utils.parseBytes32String(this.operation.asset);
          const sp = this.operation.amount?.toString() / 1e6;
          if (parseInt(this.operation.chainId) === 1) {
            this.description =
            this.showName ? this.$t('opHistory.addWithName', {amount: (sp * this.vestsToSteem).toFixed(2), symbol: 'sp', delegatee, pool: this.operation.pool.name})
            : this.$t('opHistory.add', {amount: (sp * this.vestsToSteem).toFixed(2), symbol: 'sp', delegatee, pool: this.operation.pool.name})
          } else {
            this.description =
            this.showName ? this.$t('opHistory.addWithName', {amount: (sp * this.vestsToHive).toFixed(2), symbol: 'hp', delegatee, pool: this.operation.pool.name})
            : this.$t('opHistory.add', {amount: (sp * this.vestsToHive).toFixed(2), symbol: 'hp', delegatee, pool: this.operation.pool.name})
          }
        } else if (
          poolType === 'atom'
        ) {
          const atom = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, poolType);
          this.description =
            this.showName ? this.$t('opHistory.addWithName', {account:this.username, amount: atom, symbol: 'atom', delegatee, pool: this.operation.pool.name})
            : this.$t('opHistory.add', {amount: atom, symbol: 'atom', delegatee, pool: this.operation.pool.name})
        } else if (poolType === 'osmo') {
          const osmo = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, poolType);
          this.description =
            this.showName ? this.$t('opHistory.addWithName', {account:this.username, amount: osmo, symbol: 'osmo', delegatee, pool: this.operation.pool.name})
            : this.$t('opHistory.add', {amount: osmo, symbol: 'osmo', delegatee, pool: this.operation.pool.name})
        } else if (poolType === 'juno') {
          const juno = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, poolType);
          this.description =
            this.showName ? this.$t('opHistory.addWithName', {account:this.username, amount: juno, symbol: 'juno', delegatee, pool: this.operation.pool.name})
            : this.$t('opHistory.add', {amount: juno, symbol: 'juno', delegatee, pool: this.operation.pool.name})
        }
        break;
      case "WITHDRAW":
        this.opType = "Withdraw";
        this.isAdmin = false;
        if (
          this.operation.poolFactory.toLowerCase() ==
          contractAddress.ERC20StakingFactory.toLowerCase()
        ) {
          this.description = this.showName 
            ? this.$t('opHistory.withdrawWithName', {amount, symbol, pool: this.operation.pool.name})
            : this.$t('opHistory.withdraw', {amount, symbol, pool: this.operation.pool.name})
        } else if (this.operation.poolFactory.toLowerCase() ===
          contractAddress.ERC1155StakingFactory.toLowerCase()
        ) {
          this.description = this.showName 
            ? this.$t('opHistory.withdrawWithName', {amount, symbol: 'ERC1155', pool: this.operation.pool.name})
            : this.$t('opHistory.withdraw', {amount, symbol: 'ERC1155', pool: this.operation.pool.name})
        }else if (
          this.operation.poolFactory.toLowerCase() ==
          contractAddress.SPStakingFactory.toLowerCase()
        ) {
          const sp = this.operation.amount?.toString() / 1e6;
          delegatee = ethers.utils.parseBytes32String(this.operation.asset);
          if (parseInt(this.operation.chainId) === 1) {
            this.description = this.showName
              ? this.$t('opHistory.subWithName', {account: this.username,amount: (sp * this.vestsToSteem).toFixed(2), symbol: 'sp', delegatee, pool: this.operation.pool.name})
              : this.$t('opHistory.sub', {amount: (sp * this.vestsToSteem).toFixed(2), symbol: 'sp', delegatee, pool: this.operation.pool.name})
          } else {
            this.description = this.showName
              ? this.$t('opHistory.subWithName', {account: this.username,amount: (sp * this.vestsToHive).toFixed(2), symbol: 'hp', delegatee, pool: this.operation.pool.name})
              : this.$t('opHistory.sub', {amount: (sp * this.vestsToHive).toFixed(2), symbol: 'hp', delegatee, pool: this.operation.pool.name})
          }
        } else if (
          poolType === 'atom'
        ) {
          const atom = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, 'atom');
          this.description = this.showName
              ? this.$t('opHistory.subWithName', {amount: atom, symbol: 'atom', delegatee, pool: this.operation.pool.name})
              : this.$t('opHistory.sub', {amount: atom, symbol: 'atom', delegatee, pool: this.operation.pool.name})
        } else if (poolType === 'osmo') {
          const osmo = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, 'osmo');
          this.description = this.showName
              ? this.$t('opHistory.subWithName', {amount: osmo, symbol: 'osmo', delegatee, pool: this.operation.pool.name})
              : this.$t('opHistory.sub', {amount: osmo, symbol: 'osmo', delegatee, pool: this.operation.pool.name})
        } else if (poolType === 'juno') {
          const juno = this.operation.amount?.toString() / 1e6;
          delegatee = addressAccToValBech32(this.operation.asset, poolType);
          this.description = this.showName
              ? this.$t('opHistory.subWithName', {amount: juno, symbol: 'juno', delegatee, pool: this.operation.pool.name})
              : this.$t('opHistory.sub', {amount: juno, symbol: 'juno', delegatee, pool: this.operation.pool.name})
        }
        break;
      case "VOTE":
        this.opType = 'Vote pool';
        this.isAdmin = false;
        this.description = this.showName 
          ? this.$t('opHistory.voteWithName', {amount: np, symbol: 'NP', pool: this.operation.pool.name})
          : this.$t('opHistory.vote', {amount: np, symbol: 'NP', pool: this.operation.pool.name})
        break;
      case "UNVOTE":
        this.opType = 'Unvote pool';
        this.isAdmin = false;
        this.description = this.showName 
          ? this.$t('opHistory.unvoteWithName', {amount: np, symbol: 'NP', pool: this.operation.pool.name})
          : this.$t('opHistory.unvote', {amount: np, symbol: 'NP', pool: this.operation.pool.name})
        break;
      case "WITHDRAWGAUGECTOKEN":
        this.opType = "Harvest C-Token by NP vote";
        this.isAdmin = false;
        this.description = this.showName 
          ? this.$t('opHistory.harvestGaugeWithName', {amount, symbol: 'C-Token', pool: this.operation.pool.name})
          : this.$t('opHistory.harvestGauge', {amount, symbol: 'C-Token', pool: this.operation.pool.name})
        break;
      case 'WITHDRAWGAUGENUT':
        this.opType = "Harvest NUT by NP vote";
        this.isAdmin = false;
        const nutAmount = this.operation.amount.toString() / 1e18
        this.description = this.showName 
          ? this.$t('opHistory.harvestGaugeWithName', {amount: nutAmount, symbol: 'NUT', pool: this.operation.pool.name})
          : this.$t('opHistory.harvestGauge', {amount: nutAmount, symbol: 'NUT', pool: this.operation.pool.name})
        break;
      case 'ADMINCREATENEWGAUGE':
        this.opType = 'Create Pool Vote';
        this.isAdmin = true
        this.username = 'Admin'
        this.description = this.showName 
          ? this.$t('opHistory.createGaugeWithName', {pool: this.operation.pool.name})
          : this.$t('opHistory.createGauge', {pool: this.operation.pool.name})
        break;
      case 'ADMINWITHDRAWGAUGENUT':
        this.opType = 'Harvest NUT by NP vote';
        this.isAdmin = true;
        this.username = 'Admin';
        this.description = this.showName 
          ? this.$t('opHistory.withdrawGaugeWithName', {amount: this.operation.amount.toString() / 1e18})
          : this.$t('opHistory.withdrawGauge', {amount: this.operation.amount.toString() / 1e18})
        break;
      case "HARVEST":
        this.opType = "Harvest";
        this.isAdmin = false;
        while (!this.cToken) {
          await sleep(0.2);
        }
        ctokenSymbol = this.cToken.symbol;
        this.description = this.showName 
          ? this.$t('opHistory.harvestWithName', {amount: (
            this.operation.amount.toString() /
            10 ** this.tokenDecimals(this.cToken.decimal)
          ).toFixed(2), symbol: ctokenSymbol, pool: this.operation.pool.name})
          : this.$t('opHistory.harvest', {amount: (
            this.operation.amount.toString() /
            10 ** this.tokenDecimals(this.cToken.decimal)
          ).toFixed(2), symbol: ctokenSymbol, pool: this.operation.pool.name})
        break;
      case "HARVESTALL":
        this.opType = "Harvest all";
        this.isAdmin = false;
        while (!this.cToken) {
          await sleep(0.2);
        }
        ctokenSymbol = this.cToken.symbol;

        this.description = this.showName 
          ? this.$t('opHistory.harvestAllWithName', {symbol: ctokenSymbol}) 
          : this.$t('opHistory.harvestAll', {symbol: ctokenSymbol})
        break;
      case "REDEEMFROMTREASURY":
        this.opType = "Redeem From Treasury";
        this.isAdmin = false;
        while (!this.cToken) {
          await sleep(0.2);
        }
        ctokenSymbol = this.cToken.symbol
        this.description = this.showName
          ? this.$t('opHistory.redeemTreasuryWithName', {amount: (
            this.operation.amount.toString() /
            10 ** this.tokenDecimals(this.cToken.decimal)
          ).toFixed(2), symbol: ctokenSymbol})
          : this.$t('opHistory.redeemTreasury', {amount: (
            this.operation.amount.toString() /
            10 ** this.tokenDecimals(this.cToken.decimal)
          ).toFixed(2), symbol: ctokenSymbol})
        break;
      case "ADMINCREATE":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Create Community";
        this.description =
          (this.showName ? " creat" : "Create") + ` this community`;
        this.description = this.showName
         ? this.$t('opHistory.createWithName', {account: this.username})
         : this.$t('opHistory.create')
        break;
      case "ADMINSETFEE":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Set DAO fund ratio";
        this.description = this.showName
          ? this.$t('opHistory.setFeeWithName', {amount: (
            this.operation.amount.toString() / 100
          ).toFixed(2)})
          : this.$t('opHistory.setFee', {amount: (
            this.operation.amount.toString() / 100
          ).toFixed(2)})
        break;
      case "ADMINADDPOOL":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Create new pool";
        this.description = this.showName
          ? this.$t('opHistory.addPoolWithName', {pool: this.operation.pool.name})
          : this.$t('opHistory.addPool', {pool: this.operation.pool.name})
        break;
      case "ADMINCLOSEPOOL":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Close pool";
        this.description = this.showName
          ? this.$t('opHistory.closePoolWithName', {pool: this.operation.pool.name})
          : this.$t('opHistory.closePool', {pool: this.operation.pool.name})
        break;
      case "ADMINSETRATIO":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Reset pool ratios";
        this.description = this.showName
          ? this.$t('opHistory.setRatioWithName', {account: this.username})
          : this.$t('opHistory.setRatio')
        break;
      case "ADMINSETDAOFUND":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Reset DAO fund";
        this.description = this.showName 
          ? this.$t('opHistory.setDaofundWithName', {address: ethers.utils.getAddress(this.operation.asset)})
          : this.$t('opHistory.setDaofund', {address: ethers.utils.getAddress(this.operation.asset)})
        break;
      case "ADMINWITHDRAWNREVENUE":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Withdraw revenue";
        this.description = this.showName 
          ? this.$t('opHistory.withdrawRevenueWithName', {address: ethers.utils.getAddress(this.operation.asset)})
          : this.$t('opHistory.withdrawRevenue', {address: ethers.utils.getAddress(this.operation.asset)})
        break;
      case "ADMINCREATETREASURY":
        this.isAdmin = true;
        this.username = "Admin";
        this.opType = "Create Treasury";
        this.description = this.showName
          ? this.$t('opHistory.createTreasuryWithName', {address: ethers.utils.getAddress(this.operation.asset)})
          : this.$t('opHistory.createTreasury', {address: ethers.utils.getAddress(this.operation.asset)})
        break;
    }
  },
};
</script>

<style scoped lang="scss">
.activity-card {
  @include card(16px 8px, var(--block-bg), unset, fit-conent);
  .content {
    @include text-multi-line(2);
    span {
      color: var(--primary-hover);
    }
    .admin {
      color: var(--warning);
    }
  }
}
.avatar {
  width: 28px;
  height: 28px;
}
</style>
