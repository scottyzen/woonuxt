<template>
	<div class="container container-sm my-12">
		<div class="font-light mb-16">
			<h1 class="font-semibold text-xl mb-2">About WooNuxt</h1>

			<p
				class="mb-2"
			>WooNuxt combines the familiarity of WordPress with the performance of Vue by leveraging the modern JAMstack approach. That means building as many elements as possible during the build process, and then only rendering the elements that are actually needed. As a result, fewer server requests are made, meaning better performance and faster load times. This is a huge benefit for both the client and the server.</p>
		</div>

		<div class="flex flex-col my-16 w-full gap-8 justify-between md:gap-16 lg:flex-row">
			<div class="bg-white border rounded-xl flex-1 p-8 lg:max-w-lg">
				<NuxtImg src="/images/logo-woocommerce.svg" width="120" class="mb-4" />
				<div>
					<p class="font-light">
						Everything you know and love about WooCommerce stays the same. If you have a current shop or setting up a new one all you need todo is install and activate the following plugins.
						<a
							class="font-semibold"
						>WPGraphQL</a>,
						<a class="font-semibold">WooGraphQL</a> and
						<a class="font-semibold">WPGraphQL CORS</a>
					</p>
				</div>
			</div>
			<div class="flex">
				<NuxtImg
					src="/images/wpgraphql_logo.png"
					width="100"
					height="100"
					class="bg-white border rounded-full m-auto object-contain p-2 w-[75px]"
				/>
			</div>
			<div class="bg-white border rounded-xl flex-1 p-8 lg:max-w-lg">
				<NuxtImg src="/images/nuxt_logo.svg" width="120" class="mb-4" />
				<div>
					<p class="font-light">
						WooNuxt connects to your WooCommerce store using WPGraphQL and outputs a highly optimized frontend with Nuxt.js. Once your WooCommerce is ready. Simply click
						<a
							class="font-semibold underline"
							href="https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt"
						>here</a> to deploy to Netlify.
					</p>
				</div>
			</div>
		</div>

		<div class="font-light mb-16">
			<h2 class="font-semibold text-xl mb-2">Freqently Asked Questions</h2>
			<div class="mb-4">
				<h3 class="font-semibold">Is it optomized for SEO.</h3>
				<p>Not yet. But it will be soon with Yoast SEO.</p>
			</div>
			<div class="mb-4">
				<h3 class="font-semibold">What payment gateways are available?</h3>
				<p>Stripe is the only payment gateway available at this time. PayPal is coming soon.</p>
			</div>
			<div class="mb-4">
				<h3 class="font-semibold">Does the store support multiple currencies?</h3>
				<p>Not at this time.</p>
			</div>
			<div class="mb-4">
				<h3 class="font-semibold">Can it be install as a PWA?</h3>
				<p>Yes it is fully ready to be installed as a PWA. However, on the login mutation needs the front and back end to be on the same domain for the cross-origin request to work.</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	head() {
		return { title: 'About' }
	},
}
</script>