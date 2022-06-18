<template>
	<form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="saveChanges">
		<h3 class="col-span-full">Personal Information</h3>
		<hr class="my-2 col-span-full" />
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
			<input placeholder="johndoe@email.com" type="email" v-model="user.email" />
		</div>
		<div class="col-span-full">
			<button class="rounded-xl flex font-semibold text-white py-2.5 px-4 gap-4 items-center" :class="isUserChanged ? 'bg-primary' : 'bg-gray-400'" :disabled="!isUserChanged">
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
		};
	},
	props: ['user'],
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
				const { updateCustomer } = await this.$graphql.default.request(
					UPDATE_CUSTOMER,
					variables
				);
				let user = { ...updateCustomer.customer, userId: this.user.userId };
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
	computed: {
		isUserChanged() {
			// Session token might be different, so we need to remove it
			delete this.user.sessionToken;
			delete this.initialUser.sessionToken;

			return JSON.stringify(this.user) !== JSON.stringify(this.initialUser);
		},
	},
};
</script>