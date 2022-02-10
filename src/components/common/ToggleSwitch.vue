<template>
  <input type="checkbox" class="toggle"
         v-model="value"
         @change="$emit('input', value)">
</template>

<script>
export default {
  name: 'ToggleSwitch',
  // data() {
  //   return {
  //     value: false
  //   }
  // },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
input[type=checkbox] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}
input[type=checkbox]:focus {
  outline: 0;
}
.toggle {
  height: 1.4rem;
  width: 3rem;
  min-width: 3rem;
  border-radius: 1.4rem;
  display: inline-block;
  position: relative;
  margin: 0;
  background: var(--nav-tab-bg);
  transition: all 0.2s ease;
}
.toggle:after {
  content: "";
  position: absolute;
  top: .2rem;
  left: .2rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 2px rgba(44, 44, 44, 0.2);
  transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35);
}
.toggle:checked {
  background: var(--primary-custom);
}
.toggle:checked:after {
  transform: translatex(1.6rem);
}
</style>
