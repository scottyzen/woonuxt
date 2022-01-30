<template>
    <div class="container container-sm account-form">
        <h1 class="font-semibold my-8 text-xl">My Account</h1>

        <div class="flex flex-col mb-24 w-full gap-8 items-start lg:flex-row" v-if="user">
            <nav class="min-w-xs my-8 w-full grid top-24 text-gray-600 gap-1 lg:w-auto lg:sticky">
                <NuxtLink
                    to="/account"
                    class="rounded-xl flex bg-purple-50 p-3 px-4 text-purple-800 gap-4 items-center"
                >
                    <Icons icon="info" :size="22" />My Details
                </NuxtLink>
                <NuxtLink
                    to="/account"
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                >
                    <Icons icon="bag" :size="22" />Orders
                </NuxtLink>
                <NuxtLink
                    to="/account"
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                >
                    <Icons icon="download" :size="22" />Downloads
                </NuxtLink>
                <NuxtLink
                    to="/logout"
                    class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
                >
                    <Icons icon="logout" :size="22" />Logout
                </NuxtLink>
            </nav>

            <main class="bg-white rounded-xl flex-1 shadow w-full p-12">
                <div>
                    <h2 class="font-semibold text-lg">My Details</h2>
                    <h3 class="mt-12">Personal Information</h3>
                    <hr class="my-4" />
                    <form class="mt-4 grid gap-4 md:grid-cols-2">
                        <div class="w-full">
                            <label for="first-name">First Name</label>
                            <input placeholder="John" type="text" v-model="user.firstName" />
                        </div>

                        <div class="w-full">
                            <label for="last-name">Last Name</label>
                            <input placeholder="Doe" type="text" v-model="user.lastName" />
                        </div>
                        <div class="w-full col-span-full">
                            <label for="email">Email</label>
                            <input
                                placeholder="johndoe@email.com"
                                type="email"
                                v-model="user.email"
                            />
                        </div>
                        <div>
                            <button
                                class="rounded-xl font-semibold bg-gray-400 text-white py-2.5 px-4"
                            >Update</button>
                        </div>
                    </form>

                    <h3 class="mt-24">Change Password</h3>
                    <hr class="my-4" />
                    <form class="mt-4 grid gap-4 md:grid-cols-2">
                        <div class="w-full">
                            <label for="current-password">Current Password</label>
                            <input
                                placeholder="••••••••••"
                                type="password"
                                required
                                v-model="password.current"
                            />
                        </div>
                        <br />

                        <div class="w-full">
                            <label for="new-password">New Password</label>
                            <input
                                placeholder="••••••••••"
                                type="password"
                                required
                                v-model="password.new"
                            />
                        </div>

                        <div class="w-full">
                            <label for="new-password-confirm">Confirm New Password</label>
                            <input
                                placeholder="••••••••••"
                                type="password"
                                required
                                v-model="password.confirm"
                            />
                        </div>

                        <div>
                            <button
                                class="rounded-xl font-semibold bg-gray-400 text-white py-2.5 px-4"
                                :class="{ 'active': !!password.current || !!password.new || !!password.confirm }"
                            >Update Password</button>
                        </div>
                    </form>

                    <h3 class="mt-24">Billing</h3>
                    <hr class="my-4" />
                    <form class="mt-4 grid gap-4 md:grid-cols-2">
                        <div class="w-full">
                            <label for="billing-address">Address 1</label>
                            <input
                                placeholder="123 Main St"
                                type="text"
                                v-model="user.billing.address1"
                            />
                        </div>

                        <div class="w-full">
                            <label for="billing-address-2">Address 2</label>
                            <input
                                placeholder="Apartment, studio, or floor"
                                type="text"
                                v-model="user.billing.address2"
                            />
                        </div>

                        <div class="w-full">
                            <label for="billing-city">City</label>
                            <input placeholder="New York" type="text" v-model="user.billing.city" />
                        </div>

                        <div class="w-full">
                            <label for="billing-state">State</label>
                            <input placeholder="NY" type="text" v-model="user.billing.state" />
                        </div>

                        <div class="w-full">
                            <label for="billing-zip">Zip</label>
                            <input placeholder="10001" type="text" v-model="user.billing.postcode" />
                        </div>

                        <div class="col-span-full">
                            <button
                                class="rounded-xl font-semibold bg-gray-400 text-white py-2.5 px-4"
                            >Update</button>
                        </div>
                    </form>

                    <h3 class="mt-24">Shipping</h3>
                    <hr class="my-4" />
                    <form class="mt-4 grid gap-4 md:grid-cols-2">
                        <div class="w-full">
                            <label for="shipping-address">Address 1</label>
                            <input
                                placeholder="123 Main St"
                                type="text"
                                v-model="user.shipping.address1"
                            />
                        </div>

                        <div class="w-full">
                            <label for="shipping-address-2">Address 2</label>
                            <input
                                placeholder="Apartment, studio, or floor"
                                type="text"
                                v-model="user.shipping.address2"
                            />
                        </div>

                        <div class="w-full">
                            <label for="shipping-city">City</label>
                            <input placeholder="New York" type="text" v-model="user.shipping.city" />
                        </div>

                        <div class="w-full">
                            <label for="shipping-state">State</label>
                            <input placeholder="NY" type="text" v-model="user.shipping.state" />
                        </div>

                        <div class="w-full">
                            <label for="shipping-zip">Zip</label>
                            <input placeholder="10001" type="text" v-model="user.shipping.postcode" />
                        </div>

                        <div class="col-span-full">
                            <button
                                class="rounded-xl font-semibold bg-gray-400 text-white py-2.5 px-4"
                            >Update</button>
                        </div>
                    </form>
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
            password: {},
            user: null
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

<style lang="postcss">
.account-form input[type="text"],
.account-form input[type="email"],
.account-form input[type="tel"],
.account-form input[type="password"],
.account-form textarea,
.account-form .StripeElement,
.account-form select {
    @apply border rounded-xl outline-none bg-gray-50 w-full py-2.5 px-4 block;
}
label {
    @apply text-xs mb-1.5 text-gray-600 inline-block uppercase block;
}

button.active {
    @apply bg-primary text-white;
}
</style>