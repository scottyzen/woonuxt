<template>
  <main class="container">
    <Products
      :category="$route.params.categorySlug"
      :page="$route.params.pageNumber"
    />
  </main>
</template>
