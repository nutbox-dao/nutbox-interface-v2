import store from '@/store'

export const getAllDapps = async () => {
    return new Promise(async (resolve, reject) => {
        let dapps = [
            {
              name: 'DeCus',
              icon: 'https://firebasestorage.googleapis.com/v0/b/astarnetwork-a4924.appspot.com/o/shibuya-testnet-dapps%2F0x03B233193E1F59edbDb154a9f59347dD40584F5a_2021-11-02%2014.58.02.jpg?alt=media&token=599c3270-5c5c-41e0-9b16-25a237b80236',
              address: '0x03B233193E1F59edbDb154a9f59347dD40584F5a'
            },
            {
              name: 'ADAO',
              icon: 'https://firebasestorage.googleapis.com/v0/b/astarnetwork-a4924.appspot.com/o/shibuya-testnet-dapps%2F0x1CeE94a11eAf390B67Aa346E9Dda3019DfaD4f6A_rIb1fUz3_400x400%20(1).jpeg?alt=media&token=acb02e6a-30ce-4dd5-9314-2f07d873720c',
              address: '0x1CeE94a11eAf390B67Aa346E9Dda3019DfaD4f6A'
            },
            {
              name: 'AstarFarm',
              icon: 'https://firebasestorage.googleapis.com/v0/b/astarnetwork-a4924.appspot.com/o/shibuya-testnet-dapps%2F0x21E0C6a9C78edC3445D4aa1A37309E1dDbab72dF_logo.jpg?alt=media&token=d669db33-f015-4171-86d8-9307d4d73518',
              address: '0x21E0C6a9C78edC3445D4aa1A37309E1dDbab72dF'
            }
          ]
        store.commit('dappstaking/saveDappsInfo', dapps)
        resolve(dapps)
    })
}