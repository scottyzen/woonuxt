<template>
  <form class="bg-white rounded-lg shadow" @submit.prevent="saveChanges">
    <div class="grid p-8 gap-8 md:grid-cols-2">
      <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.account.personalInfo') }}</h3>

      <div class="w-full">
        <label for="first-name">{{ $t('messages.billing.firstName') }}</label>
        <input v-model="user.firstName" placeholder="John" type="text" />
      </div>

      <div class="w-full">
        <label for="last-name">{{ $t('messages.billing.lastName') }}</label>
        <input v-model="user.lastName" placeholder="Doe" type="text" />
      </div>
      <div class="w-full col-span-full">
        <label for="email">{{ $t('messages.billing.email') }}</label>
        <input v-model="user.email" placeholder="johndoe@email.com" type="email" />
      </div>
    </div>
    <div class="bg-gray-100 col-span-full p-4">
      <button
        class="rounded-lg flex font-semibold ml-auto text-white py-2 px-4 gap-4 items-center"
        :class="isUserChanged ? 'bg-primary' : 'bg-gray-400'"
        :disabled="!isUserChanged">
        <LoadingIcon v-if="loading" color="#fff" :size="20" />
        <span>{{ buttonText }}</span>
      </button>
    </div>
  </form>
</template>

<script>
// import UPDATE_CUSTOMER from "~/gql/mutations/updateCustomer.gql";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
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
          id: this.user.userId,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
        },
      };

      try {
        // const { updateCustomer } = await this.$graphql.default.request(UPDATE_CUSTOMER, variables);
        const { updateCustomer } = await GqlUpdateCustomer({ input });
        const user = { ...updateCustomer.customer, userId: this.user.userId };
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
