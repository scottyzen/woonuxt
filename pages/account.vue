<template>
    <LoginAndRegisterForms v-if="!user" />
    <div v-else class="container container-sm">
        <h1 class="font-semibold my-8 text-xl">My Account</h1>

        <div class="flex flex-col mb-24 w-full gap-8 items-start lg:flex-row" v-if="user">
            <nav class="min-w-xs my-8 w-full grid top-24 text-gray-600 gap-1 lg:w-auto lg:sticky">
                <button
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                    @click="activeTab = 'my-details'"
                    :class="{ 'active': activeTab == 'my-details' }"
                >
                    <Icons icon="info" :size="22" />My Details
                </button>
                <button
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                    @click="activeTab = 'orders'"
                    :class="{ 'active': activeTab == 'orders' }"
                >
                    <Icons icon="bag" :size="22" />Orders
                </button>
                <button
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                    @click="activeTab = 'downloads'"
                    :class="{ 'active': activeTab == 'downloads' }"
                >
                    <Icons icon="download" :size="22" />Downloads
                </button>
                <NuxtLink
                    to="/logout"
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                >
                    <Icons icon="logout" :size="22" />Logout
                </NuxtLink>
            </nav>

            <main class="rounded-xl flex-1 w-full md:bg-white md:shadow md:p-12">
                <AccountMyDetails :user="user" v-if="activeTab === 'my-details'" />
                <div v-else-if="activeTab === 'orders'">
                    <h2 class="font-semibold text-lg">Orders</h2>
                    <OrderList />
                </div>
            </main>
        </div>
        <!-- <pre>{{ user }}</pre> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
            activeTab: 'my-details',
        }
    },
    head() {
        return { title: 'Account' }
    },
    computed: {
        currentUserValue() {
            return this.$store.state.user
        }
    },
    watch: {
        currentUserValue: {
            handler(value) {
                if (value) {
                    this.user = JSON.parse(JSON.stringify(value))
                }
            },
            immediate: true,
            deep: true
        }
    },
}
</script>