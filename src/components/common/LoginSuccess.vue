<template>
    <div>
        Login success
    </div>
</template>

<script>
export default {
    name: 'LoginSuccess',
    mounted () {
        setTimeout(() => {
            window.close()
        }, 1000)
    },
}
</script>

<style lang="scss" scoped>

</style>