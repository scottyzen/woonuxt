<template>
  <div class="w-full grid gap-4 lg:grid-cols-2">
    <!-- <pre>{{ $store.state.user }}</pre> -->
    <div class="w-full">
      <label for="first-name">First Name</label>
      <input
        placeholder="John"
        type="text"
        required
        v-model="shipping.firstName"
      />
    </div>

    <div class="w-full">
      <label for="last-name">Last Name</label>
      <input
        placeholder="Doe"
        type="text"
        required
        v-model="shipping.lastName"
      />
    </div>

    <div class="w-full">
      <label for="email">Email</label>
      <input
        placeholder="johndoe@email.com"
        type="email"
        required
        v-model="shipping.email"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
      />
    </div>

    <div class="w-full">
      <label for="phone">Phone</label>
      <input placeholder="+353871234567" type="tel" v-model="shipping.phone" />
    </div>

    <div class="w-full col-span-full">
      <label for="address1">Address Line 1</label>
      <input
        placeholder="5998 Sunset Blvd"
        type="text"
        required
        v-model="shipping.address1"
      />
    </div>

    <div class="w-full col-span-full">
      <label for="address2">Address Line 2</label>
      <input
        placeholder="Los Angeles"
        type="text"
        v-model="shipping.address2"
      />
    </div>

    <div class="w-full">
      <label for="city">City</label>
      <input
        placeholder="California"
        type="text"
        required
        v-model="shipping.city"
      />
    </div>

    <div class="w-full">
      <label for="country">Country</label>
      <CountrySelect
        :defaultValue="shipping.country"
        v-model="shipping.country"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shipping: {},
    };
  },
  methods: {
    updateShipping(shipping) {
      this.$emit('update-shipping', shipping);
    },
    prefillAvailableShipping() {
      const interval = setInterval(() => {
        const user = this.$store.state.user;
        if (user) {
          this.shipping = JSON.parse(JSON.stringify(user.shipping));
          clearInterval(interval);
        }
      }, 1000);
    },
  },
  mounted() {
    this.prefillAvailableShipping();
  },
  watch: {
    shipping: {
      handler(shipping) {
        this.updateShipping(shipping);
      },
      deep: true,
    },
  },
};
</script>
