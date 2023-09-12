<template>
    <div style="text-align: center;">
        <h3>
            Authorization successful
        </h3>
        <p>
            Please close this window
        </p>

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