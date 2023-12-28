<script setup>
const { setProducts, updateProductList } = useProducts();
const route = useRoute();

const { isQueryEmpty } = useHelpers();
const pageSize = 25;
let afterProduct = "0";
const productsRef = ref(['']);
 async function  datagrab(afterProductId) {
   try  {
    console.log('test 1')
  const  updatedData  = await useAsyncGql('getProducts' , {after: afterProductId})

 const updatedProducts = updatedData.data._value.products.nodes
  productsRef.value = [...productsRef.value, ...updatedProducts];
  afterProduct = updatedData.data._value.products.pageInfo.endCursor ?? [];
  
  setProducts(productsRef.value);
  console.log(updatedData)
  console.log(afterProduct)
  } catch (e) {console.log('error: ' + e.message)}
  
 // datagrab()
}


/*
.then((data)=>{
  console.log(data.data)
  afterProduct = data.data._rawValue.products.pageInfo.endCursor;
 
  return afterProduct;

});
*/

//let afterProduct = data;
  // Update products with the new batch


  setProducts(productsRef.value);

  // Increment the current page for the next batch


//const allProducts = data.value?.products?.nodes ?? [];
//setProducts(allProducts);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
  datagrab(afterProduct)

});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>

<template>
  <div class="container flex items-start gap-16">
    <Filters />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" />
        <LazyShowFilterTrigger class="md:hidden" />
      </div>
      <ProductGrid />
      <NoProductsFound />
    </div>
  </div>
</template>
