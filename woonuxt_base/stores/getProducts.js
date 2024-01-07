export const getProductsStore = defineStore('getProducts', () => {
    let newProducts = ref()
    let topProducts = ref()
    let categories = ref()
    async function getProductsData() {
        if (!topProducts.value) {
         
            const { data: getTopProducts } = await useFetch('https://gama.soluve.cloud/products', { params: { 'page': 1, 'orderby': 'popularity' }, });
            topProducts.value = toRaw(getTopProducts.value)
            
        }
        console.log('else')
        console.log(topProducts)
        if (!categories.value) {
            const { data: getCategories } = await useFetch('https://gama.soluve.cloud/categories', { params: { 'per_page': 6 }, })
            categories.value = getCategories.value
        }
        console.log('else')
        if (!newProducts.value) {
            const { data: getNewProducts } = await useFetch('https://gama.soluve.cloud/products', { params: { 'page': 1, 'orderby': 'date' } });
            newProducts.value = getNewProducts.value
        }
        console.log('else')
    }

    return { newProducts, getProductsData, topProducts, categories }
})