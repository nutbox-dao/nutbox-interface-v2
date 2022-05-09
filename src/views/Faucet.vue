<template>
    <div class="position-relative h-100">
        <div class="scroll-content page-view align-content-center ml-5 h-100">
        <div>
            <p>
                {{ account }}
            </p>
            <button class="primary-btn w-50" :disabled="isFaucet" @click="faucet">
                <b-spinner v-show="isFaucet" small />
                Give me NUT
            </button>
        </div>
        <div>
            <p class="mt-5">
                NFT1: 0x94Cd64e037A14F9816C7b79A08C00299Fe4604A0
            </p>
            <div class="nft-box">
                <button v-for="i of [1, 2, 3, 4, 5, 6]" class="primary-btn w-25 mt-2 nft-btn" :disabled="getingNFT1" @click="getNFT1(i)"
                    :key="i">
                    <b-spinner v-show="getingNFT1" small />
                    Give me NFT1 (id = {{ i }})
                </button>
            </div>
        </div>
        <div>
            <p class="mt-5">
                NFT2: 0x747f74dd73472290DdB8557E9ab0162809dAF16c
            </p>
            <div class="nft-box">
                <button v-for="i of [1, 2, 3, 4, 5, 6]" class="primary-btn w-25 mt-2 nft-btn" :disabled="getingNFT2" @click="getNFT2(i)"
                    :key="i">
                    <b-spinner v-show="getingNFT2" small />
                    Give me NFT2 (id = {{ i }})
                </button>
            </div>
        </div>
        <div>
            <p class="mt-5">
                NFT3: 0x0f26bAbE42355E4a6931Dfe20f6987ae342F6341
            </p>
            <div class="nft-box">
                <button v-for="i of [1, 2, 3, 4, 5, 6]" class="primary-btn w-25 mt-1 nft-btn" :disabled="getingNFT3"
                    @click="getNFT3(i)" :key="i">
                    <b-spinner v-show="getingNFT3" small />
                    Give me NFT3 (id = {{ i }})
                </button>
            </div>

        </div>
    </div>
    </div>  
</template>

<script>
import { mapState } from 'vuex'
import { faucet, getTestNFT } from '@/apis/api'
import { handleApiErrCode } from '../utils/helper'

export default {
    name: 'Faucet',
    data() {
        return {
            add: '',
            isFaucet: false,
            getingNFT1: false,
            getingNFT2: false,
            getingNFT3: false
        }
    },
    computed: {
        ...mapState('web3', ['account'])
    },
    methods: {
        async faucet() {
            try {
                this.isFaucet = true
                await faucet(this.account)
                this.$bvToast.toast('Test NUT is transfered to your address', {
                    title: 'success',
                    variant: 'success'
                })
            } catch (e) {
                console.log(3465, e);
            } finally {
                this.isFaucet = false
            }
        },
        async getNFT1(id) {
            try {
                this.getingNFT1 = true
                await getTestNFT({
                    account: this.account,
                    nftid: 1,
                    id
                })
            } catch (e) {
                handleApiErrCode(e, (title, info) => {
                    this.$bvToast.toast(title, info)
                });
            } finally {
                this.getingNFT1 = false
            }
        },
        async getNFT2(id) {
            try {
                this.getingNFT2 = true
                await getTestNFT({
                    account: this.account,
                    nftid: 2,
                    id
                })
            } catch (e) {
                console.log(e);
                handleApiErrCode(e, (title, info) => {
                    this.$bvToast.toast(title, info)
                });
            } finally {
                this.getingNFT2 = false
            }
        },
        async getNFT3(id) {
            try {
                this.getingNFT3 = true
                await getTestNFT({
                    account: this.account,
                    nftid: 3,
                    id
                })
            } catch (e) {
                handleApiErrCode(e, (title, info) => {
                    this.$bvToast.toast(title, info)
                });
            } finally {
                this.getingNFT3 = false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.nft-box {
    gap: 2rem;
    display: flex;
    flex-flow: wrap;
}
</style>