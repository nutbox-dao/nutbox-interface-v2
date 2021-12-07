export default {
  methods: {
    onCopy (message, options = {}) {
      navigator.clipboard.writeText(this.$store.state.web3.account).then(() => {
        this.$bvToast.toast(message, {
          ...{
            title: 'Nutbox',
            autoHideDelay: 2000,
            variant: 'info'
          },
          ...(options || {})
        })
      })
    }
  }
}
