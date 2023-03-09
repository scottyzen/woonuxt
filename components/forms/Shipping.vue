<template>
  <form class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
    <div class="grid p-8 gap-8 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.general.shipping') }}</h3>
      <div class="w-full">
        <label for="shipping-address">{{ $t('messages.billing.address1') }}</label>
        <input v-model="user.shipping.address1" placeholder="123 Main St" type="text" />
      </div>

      <div class="w-full">
        <label for="shipping-address-2">{{ $t('messages.billing.address2') }}</label>
        <input v-model="user.shipping.address2" placeholder="Apartment, studio, or floor" type="text" />
      </div>

      <div class="w-full">
        <label for="shipping-city">{{ $t('messages.billing.city') }}</label>
        <input v-model="user.shipping.city" placeholder="New York" type="text" />
      </div>

      <div class="w-full">
        <label for="shipping-state">{{ $t('messages.billing.country') }} <Code></Code></label>
        <input v-model="user.shipping.state" placeholder="NY" type="text" />
      </div>

      <div class="w-full">
        <label for="shipping-zip">{{ $t('messages.billing.zip') }}</label>
        <input v-model="user.shipping.postcode" placeholder="10001" type="text" />
      </div>

      <div class="w-full">
        <label for="shipping-phone">{{ $t('messages.billing.phone') }}</label>
        <input v-model="user.shipping.phone" type="text" />
      </div>
    </div>

    <div class="bg-gray-100 col-span-full p-4">
      <button
        class="rounded-lg flex font-semibold ml-auto text-white py-2.5 px-4 gap-4 items-center"
        :class="isUserChanged ? 'bg-primary' : 'bg-gray-400'"
        :disabled="!isUserChanged">
        <LoadingIcon v-if="loading" color="#fff" :size="20" />
        <span>{{ buttonText }}</span>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: ['user', 'userId'],
  data() {
    return {
      initialUser: JSON.parse(JSON.stringify(this.user)),
      loading: false,
      buttonText: 'Update',
    };
  },
  computed: {
    isUserChanged() {
      return JSON.stringify(this.user) !== JSON.stringify(this.initialUser);
    },
  },
  methods: {
    async saveChanges() {
      this.loading = true;
      this.buttonText = 'Updating...';
      const variables = {
        input: {
          id: this.userId,
          shipping: {
            address1: this.user.shipping.address1,
            address2: this.user.shipping.address2,
            city: this.user.shipping.city,
            state: this.user.shipping.state,
            postcode: this.user.shipping.postcode,
            phone: this.user.shipping.phone,
          },
        },
      };

      try {
        const { updateCustomer } = await GqlUpdateCustomer(variables);
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
      this.buttonText = 'Update';
    },
    makeClone() {
      this.user = JSON.parse(JSON.stringify(this.initialUser));
    },
  },
};
</script>
