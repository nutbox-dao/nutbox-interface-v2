export default {
  methods: {
    onCopy (message, options = {}, content) {
      navigator.clipboard.writeText(content || this.$store.state.web3.account).then(() => {
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