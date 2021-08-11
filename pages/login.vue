<template>
	<div class="container">
		<h1 class="py-12 text-3xl text-center">Login</h1>
		<pre class="mb-12 text-xs">{{this.$auth.user}}</pre>
		<UserAuthForm buttonText="Login" :submitForm="loginUser" />
	</div>
</template>

<script>
export default {
	methods: {
		loginUser(logininfo) {
			alert('You pressed a button ', logininfo)
		}
	},
	created() {
		console.dir(this.$auth)
	}
}
</script>