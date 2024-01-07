export const getProductsStore = defineStore('getProducts', () => {
    let newProducts = ref([])
    let topProducts = ref([])
    let categories = ref([])
   async function getProductsData() {

        const { data: getTopProducts, pending: pendingLoad } = await useFetch('https://gama.soluve.cloud/products', { params: { 'page': 1, 'orderby': 'popularity' }, });
        topProducts.value = toRaw(getTopProducts.value)
        const { data: getCategories } = await useFetch('https://gama.soluve.cloud/categories', { params: { 'per_page': 6 }, })
        categories.value = getCategories.value
        const { data: getNewProducts } = await useFetch('https://gama.soluve.cloud/products',  { params: { 'page': 1, 'orderby': 'date' }});
        newProducts.value = getNewProducts.value
        console.log(newProducts)
        console.log(categories)
        return {topProducts, categories, newProducts}
    }

    return { newProducts, getProductsData, topProducts, categories }
})