<template>
  <form class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
    <div class="grid p-8 gap-8 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.billing.billing') }}</h3>
      <div class="w-full">
        <label for="billing-address">{{ $t('messages.billing.address1') }}</label>
        <input v-model="user.billing.address1" placeholder="123 Main St" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-address-2">{{ $t('messages.billing.address2') }}</label>
        <input v-model="user.billing.address2" placeholder="Apartment, studio, or floor" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-city">{{ $t('messages.billing.city') }}</label>
        <input v-model="user.billing.city" placeholder="New York" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-state">{{ $t('messages.billing.countryCode') }}</label>
        <input v-model="user.billing.state" placeholder="NY" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-zip">{{ $t('messages.billing.zip') }}</label>
        <input v-model="user.billing.postcode" placeholder="10001" type="text" />
      </div>

      <div class="w-full">
        <label for="billing-phone">{{ $t('messages.billing.phone') }}</label>
        <input v-model="user.billing.phone" type="tel" />
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
      // Session token might be different, so we need to remove it
      delete this.user.sessionToken;
      delete this.initialUser.sessionToken;

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
          billing: {
            address1: this.user.billing.address1,
            address2: this.user.billing.address2,
            city: this.user.billing.city,
            state: this.user.billing.state,
            postcode: this.user.billing.postcode,
            phone: this.user.billing.phone,
          },
        },
      };

      try {
        const { updateCustomer } = await GqlUpdateCustomer(variables);
        const user = { ...updateCustomer.customer, userId: this.userId };
        // Session token might be different, so we need to remove it
        delete user.sessionToken;
        this.initialUser = JSON.parse(JSON.stringify(user));
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
      this.buttonText = 'Update';
    },
  },
};
</script>
