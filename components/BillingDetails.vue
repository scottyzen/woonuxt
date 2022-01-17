<template>
    <div class="w-full grid gap-4 lg:grid-cols-2">
        <div class="w-full">
            <label for="first-name">First Name</label>
            <input placeholder="John" type="text" required v-model="billing.firstName" />
        </div>

        <div class="w-full">
            <label for="last-name">Last Name</label>
            <input placeholder="Doe" type="text" required v-model="billing.lastName" />
        </div>

        <div class="w-full">
            <label for="email">Email</label>
            <input placeholder="johndoe@email.com" type="email" required v-model="billing.email" />
        </div>

        <div class="w-full">
            <label for="phone">Phone</label>
            <input placeholder="+353871234567" type="tel" required v-model="billing.phone" />
        </div>

        <div class="w-full col-span-full">
            <label for="address1">Address Line 1</label>
            <input placeholder="5998 Sunset Blvd" type="text" required v-model="billing.address1" />
        </div>

        <div class="w-full col-span-full">
            <label for="address2">Address Line 2</label>
            <input placeholder="Los Angeles" type="text" required v-model="billing.address2" />
        </div>

        <div class="w-full">
            <label for="city">City</label>
            <input placeholder="California" type="text" required v-model="billing.city" />
        </div>

        <div class="w-full">
            <label for="country">Country</label>
            <CountrySelect :defaultValue="billing.country" v-model="billing.country" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        billing: {
            type: Object,
            required: true,
        },
    },
    methods: {
        updateBilling(billing) {
            this.$emit('update-billing', billing);
        },
    },
    watch: {
        billing: {
            handler(billing) {
                this.updateBilling(billing);
            },
            deep: true,
        },
    },
}
</script>

<style>
</style>