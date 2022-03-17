<template>
    <div class="d-flex align-content-center" style="height: 100vh">
        <div>
            <p>
                {{ account }}
            </p>
            <button class="primary-btn" :disabled="isFaucet" @click="faucet">
                <b-spinner v-show="isFaucet" small/>
                Give me NUT
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { faucet } from '@/apis/api'
export default {
    name: 'Faucet',
    data() {
        return {
            add: '',
            isFaucet: false
        }
    },
    computed: {
        ...mapState('web3', ['account'])
    },
    methods: {
        async faucet() {
            try{
                this.isFaucet = true
                await faucet(this.account)
                this.$bvToast.toast('Test NUT is transfered to your address', {
                    title: 'success',
                    variant: 'success'
                })
            }catch(e){
                console.log(3465, e);
            }finally{
                this.isFaucet = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>