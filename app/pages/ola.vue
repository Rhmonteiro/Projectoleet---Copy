
<template>
  <div>
    <AutoCompletame :links="links" @update:state1="handleState1Update" @update:state2="handleState2Update"></AutoCompletame>
  </div>
</template>

<script>
export default {
    middleware: 'authenticated',
  data() {
    return {
      links: [{ value: 'New York' }, { value: 'London' }, { value: 'Berlin' }, { value: 'Paris'}],
      state1: '',
    };
  },
  methods: {
    handleState1Update(newValue) {
      console.log('state1 updated to:', newValue);
        this.state1 = newValue;
    }
  }
};
</script>

<style>
</style>
