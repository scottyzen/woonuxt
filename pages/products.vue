<template>
	<main class="container">
		<h1>{{ $route.params.categorySlug }}</h1>
		<Products :category="$route.params.categorySlug" :page="parseInt($route.params.pageNumber) || 1" :products="products.nodes" />
	</main>
</template>

<script>
import getProducts from '~/gql/queries/getProducts'
export default {
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(getProducts, variables)
		return { products }
	}
}
</script>

