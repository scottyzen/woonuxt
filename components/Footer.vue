<template>
  <footer>
    <div class="container py-8">
      <nav class="grid gap-1">
        <a href="https://woonuxt.netlify.app/cart">Cart</a>
        <a href="https://woonuxt.netlify.app/checkout">Checkout</a>
        <nuxt-link :prefetch="false" to="/cart">Cart</nuxt-link>
        <nuxt-link :prefetch="false" to="https://woonuxt.netlify.app/checkout">Checkout</nuxt-link>
      </nav>
    </div>
  </footer>
</template>
