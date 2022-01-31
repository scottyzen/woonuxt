<template>
    <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="saveChanges">
        <h3 class="mt-12 col-span-full">Shipping</h3>
        <hr class="my-2 col-span-full" />
        <div class="w-full">
            <label for="shipping-address">Address 1</label>
            <input placeholder="123 Main St" type="text" v-model="user.shipping.address1" />
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
                class="rounded-xl flex font-semibold text-white py-2.5 px-4 gap-4 items-center"
                :class="isUserChanged ? 'bg-primary' : 'bg-gray-400'"
                :disabled="!isUserChanged"
            >
                <LoadingIcon v-if="loading" color="#fff" :size="20" />
                <span>{{ buttonText }}</span>
            </button>
        </div>
    </form>
</template>

<script>
import UPDATE_CUSTOMER from '~/gql/mutations/updateCustomer.gql';
export default {
    data() {
        return {
            initialUser: JSON.parse(JSON.stringify(this.user)),
            loading: false,
            buttonText: 'Update',
        }
    },
    props: ['user'],
    methods: {
        async saveChanges() {
            this.loading = true;
            this.buttonText = 'Updating...';
            const variables = {
                input: {
                    id: this.user.userId,
                    shipping: this.user.shipping,
                },
            };

            try {
                const { updateCustomer } = await this.$graphql.default.request(UPDATE_CUSTOMER, variables);
                console.log(updateCustomer);
            } catch (error) {
                console.log(error);
            }

            this.loading = false;
            this.buttonText = 'Update';
        },
    },
    computed: {
        isUserChanged() {
            return JSON.stringify(this.user) !== JSON.stringify(this.initialUser);
        },
    },

}
</script>