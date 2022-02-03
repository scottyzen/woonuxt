<template>
	<div class="flex bg-gray-100 w-full justify-center items-center">
		<div class="max-w-md mb-32 w-full">
			<h1 class="text-center py-8 text-3xl text-gray-700">{{ showRegister ? 'Register' : 'Login' }}</h1>
			<LoginForm v-if="!showRegister" />
			<RegisterForm v-else />
			<p v-if="!showRegister" class="mt-8 text-center text-gray-700">
				If you don't have an account, please
				<a
					@click="showRegister = true"
					class="cursor-pointer font-semibold underline inline-block"
				>register</a>.
			</p>
			<p v-else class="mt-8 text-center text-gray-700">
				Already have an account?
				<a
					@click="showRegister = false"
					class="cursor-pointer font-semibold underline inline-block"
				>Login</a>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	head() { return { title: 'My Account' } },
	data() {
		return {
			showRegister: false,
		};
	},
};
</script>
