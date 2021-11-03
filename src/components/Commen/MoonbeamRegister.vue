<template>
    <div class="tip-modal">
        <img
        class="close-btn"
        src="~@/static/images/close.svg"
        alt=""
        @click="hide"
        />
         <div class="tip-contribute">
             <h3>
                Moonbeam Crowdloan Terms and Conditions
             </h3>
            <Markdown :body="legalese" v-if="status === 'pending'"/>
            <div class="tip-contribute" v-if="status === 'signedLegales'">
                <p>
                    Next step
                </p>
                Use your account to send the signture as remark to Polkadot
            </div>
            <b-form-checkbox v-if="status === 'pending'" class="checkbox-item" v-model="hasReaded">
                I have read and agree to the terms and conditions
            </b-form-checkbox>
            <button class="primary-btn" @click="confirm" :disabled="!hasReaded || isSigningRemark || isSigningLegalses">
                <b-spinner small type="grow" v-show="isSigningLegalses || isSigningRemark"></b-spinner>
                {{ status === 'pending' ? $t('cl.signLegales') : $t('cl.signAndSend') }}
            </button>
        </div>
    </div>
</template>

<script>
import Markdown from './Markdown.vue'
import { legalese } from '@/utils/commen/Legalese'
import { signLegalese, sendRemark } from '@/utils/commen/crowdloan'
import { handleApiErrCode } from '@/utils/helper'

export default {
    name: 'MoonbeamRegister',
    data () {
        return {
            legalese: legalese,
            isSigningLegalses: false,
            isSigningRemark: false,
            hasReaded: false,
            status: 'pending', // pending, signedLegales, 
            remark: ''
        }
    },
    components: {
        Markdown,
    },
    props: {
        relaychain: {
            type: String
        }
    },
    computed: {
        balance(){
            switch (this.relaychain){
                case 'polkadot':
                return this.$store.getters["polkadot/available"].toNumber()
                case 'kusama':
                return this.$store.getters['kusama/available'].toNumber()
                default:
                return 0
            }
        },
    },
    methods: {
        async confirm () {
            try{
                if (this.balance < 0) {
                    this.$bvToast.toast(this.$t('cl.insufficientBalance'), {
                        title: this.$t('tip.insufficientBalance'),
                        variant: 'info'
                    });
                    return;
                }
                if (this.status === 'pending'){
                   this.isSigningLegalses = true
                   this.remark = await signLegalese();
                   this.status = 'signedLegales'
                } else if(this.status === 'signedLegales'){
                    this.isSigningRemark = true;
                    const res = await sendRemark(this.chain, this.remark, 
                            (info, param) => {
                                this.$bvToast.toast(info, param);
                            },);
                    if (res) {
                        this.$bvToast.toast(this.$t('cl.signed'), {
                            title: this.$t('tip.success'),
                            variant: 'success'
                        })
                        setTimeout(() => {this.$emit("hideMoonbeam")}, 2000)
                    }else {

                    }
                }
            }catch (e) {
                console.log(423, e);
                handleApiErrCode(e, (tip, param) => {
                    this.$bvToast.toast(tip, param) 
                })
            }finally {
                this.isSigningLegalses = false;
                this.isSigningRemark = false;
            }
        },
        hide () {
            this.$emit("hideMoonbeam");
        }
    },
}
</script>

<style lang="scss" scoped>

</style>