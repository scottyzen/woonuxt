<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty } = useHelpers();
const { storeSettings } = useAppConfig();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useAsyncGql('getProducts', { slug });
const productsInCategory = (data.value?.products?.nodes || []) as Product[];
setProducts(productsInCategory);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'product-category-slug') return;
    updateProductList();
  },
);

useHead({
  title: 'Products',
  meta: [{ hid: 'description', name: 'description', content: 'Products' }],
});
</script>
<template>


  <div class="container flex items-start gap-16" v-if="productsInCategory.length">
    <Filters v-if="storeSettings.showFilters" :hide-categories="true" />

    <div class="w-full">

      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo voluptate neque in odio officia assumenda nulla cumque. Veniam et tenetur accusantium, fuga pariatur
        repellendus impedit. Quod sint odio quisquam! Sequi repellendus eum dolorum eveniet, quidem dolor necessitatibus velit sunt esse maiores. Eum odit dolorum mollitia?
        Adipisci amet hic veniam debitis architecto nobis necessitatibus inventore iure ullam cum illo quae quam, excepturi beatae itaque exercitationem magnam quidem aspernatur
        iusto. Quos, reprehenderit? Dignissimos autem recusandae qui sit cum velit consequatur pariatur illum omnis excepturi, adipisci ab eius, optio, temporibus iure unde
        inventore. Maxime officiis tempore voluptatum ipsa, ab possimus atque corporis repellendus obcaecati, numquam fuga ullam doloremque ea reprehenderit earum quam culpa neque
        dolor sint voluptates qui rem? Ipsam reiciendis non illum?
      </p>

      
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
</template>
