<template>
    <div class="container my-8">
        <div class="flex justify-between items-center">
            <h1 class="text-lg">
                Account:
                <span class="font-semibold">{{ user.username }}</span>
            </h1>
            <NuxtLink
                to="/logout"
                class="bg-primary rounded-2xl text-white text-center p-2 px-4 gap-4 items-center justify-center focus:outline-none"
            >Logout</NuxtLink>
        </div>
    </div>
</template>

<script>
export default {
    head() {
        return { title: 'Account' }
    },
    computed: {
        user() {
            return this.$store.state.user
        }
    }
}
</script>