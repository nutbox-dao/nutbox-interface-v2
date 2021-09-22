<template>
  <!--  <div class="proposal-item text-left">
    <label
      ><span> 1 </span>
      <span> {{ proposalItem.author }}</span>
      <span> {{ proposalItem.title }}</span></label
    >

    <b-button variant="primary" class="createproposal" size="sm">
      {{ $t("cs.nominate") }}</b-button
    >
  </div> -->
  <div class="nps">
    <div class="nps-card">
      <div class="proposal">
        <p
          style="
            width: 32px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid var(--primary);
            font-size: 14px;
            line-height: 32px;
          "
        >
          {{ index + 1 }}
        </p>
        <a
          target="_blank"
          :href="'https://blog.nutbox.io/@' + proposalItem.author"
          style="width: 100px; text-align: left"
        >
          {{ proposalItem.author }}
        </a>
        <a
          target="_blank"
          :href="
            'https://blog.nutbox.io/@' +
            proposalItem.author +
            '/' +
            proposalItem.permlink
          "
          style="
            flex: 1;
            text-align: left;
            font-weight: 500;
            border-radius: 8px;
          "
        >
          {{ proposalItem.title }}
        </a>
        <p
          :class="proposalItem.status"
          style="
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
            padding: 0px 6px;
          "
        >
          正在投票
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProposalItem",
  data() {
    return {};
  },
  props: ["proposalItem", "index"],
};
</script>

<style  lang="less" scoped>
/* .proposal-item {
  padding: 20px;
  background-color: white;
  border-radius: 30px;
  font: bold;
  font-size: 18px;
}

div button {
  float: right;
}
span {
  margin-right: 10px;
}
 */
.nps {
  .nps-card {
    height: 108px;
    background: white;
    padding: 18px;
    margin-top: 20px;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.02);
    border-radius: 28px;
    border: 1px solid rgba(227, 229, 232, 0.5);
  }
  .proposal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
    p,
    a {
      margin: 0 10px;
      color: var(--primary-text);
      font-size: 16px;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      max-height: 60px;
      font-weight: 600;
      line-height: 20px;
    }
    a:hover {
      color: var(--link);
    }

    .pass {
      background: rgba(80, 191, 0, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(80, 191, 0, 0.3);
      color: var(--success);
    }
    .pending {
      background: rgba(255, 219, 38, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 219, 38, 0.3);
      color: var(--warning);
    }
    .unpass {
      background: rgba(255, 91, 77, 0.051);
      border-radius: 8px;
      border: 1px solid rgba(255, 91, 77, 0.3);
      color: var(--error);
    }
    .rolling {
      background: #408fff0d;
      border-radius: 8px;
      border: 1px solid #408fff4d;
      color: var(--link);
    }
  }
}
</style>