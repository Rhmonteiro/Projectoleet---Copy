<template>
    <div>
        <h1>Welcome to the Testing123 Page!</h1>
        <p>This is a sample Nuxt.js 2 template page.</p>
    </div>
</template>

<script>
export default {
    middleware: 'authenticated',
    name: 'Testing123',
    // Add your component logic here
}
</script>

<style scoped>
/* Add your component styles here */
</style>