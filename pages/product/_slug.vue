<template>
  <main class="container container-sm py-4 relative lg:py-10">
    <!-- Breadcrumb -->
    <Breadcrumb
      class="mb-6"
      :format="[
        { name: 'Home', slug: '/' },
        { name: 'Products', slug: '/products' },
        { name: primaryCategory.name, slug: `/product-category/${primaryCategory.slug}` },
        { name: product.name },
      ]"
    />

    <div class="flex flex-col gap-10 lg:gap-24 md:flex-row md:justify-between">
      <ProductImageGallery class="flex-1 relative" :first-image="product.image.sourceUrl" :main-image="type.image.sourceUrl" :gallery="product.galleryImages" :node="product" />

      <div class="md:max-w-md md:py-2">
        <div class="flex mb-4 justify-between">
          <div class="flex-1">
            <h1 class="font-semibold text-2xl mb-2">{{ type.name }}</h1>
            <StarRating :rating="product.averageRating" :count="product.reviewCount" />
          </div>
          <ProductPrice class="text-xl" :salePrice="type.salePrice" :regularPrice="type.regularPrice" />
        </div>

        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">Availability: </span>
            <span v-if="product.stockStatus == 'IN_STOCK'" class="text-green-600">In Stock</span>
            <span v-else class="text-red-600">Out of Stock</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">SKU: </span> <span>{{ product.sku || "N/A" }}</span>
          </div>
        </div>

        <div v-html="product.description" class="font-light mb-8 prose"></div>

        <hr />

        <form @submit.prevent="triggerAddToCart">
          <AttributeSelections
            class="mt-4 mb-8"
            v-if="product.type == 'VARIABLE' && product.attributes"
            :attrs="product.attributes.nodes"
            @attrs-changed="updateSelectedVariations"
          />
          <div class="flex mt-12 gap-4 items-center">
            <QuantityButtons class="w-28" @quantity-change="updateQuantity" :quantity="quantity" :min="1" />
            <AddToCartButton
              class="md:max-w-xs w-full flex-1"
              :add-to-cart-button-text="addToCartButtonText"
              :disabled="!activeVariation && product.variations"
              :class="{
                loading: addToCartState == 'loading',
                success: addToCartState == 'success',
              }"
            />
          </div>
        </form>
        <div class="grid gap-2 my-8 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">Categories:</span>
            <div class="product-categories">
              <NuxtLink :to="`/product-category/${category.slug}`" v-for="category in product.productCategories.nodes" :key="category.slug" class="hover:text-primary"
                >{{ category.name }}<span class="comma">, </span></NuxtLink
              >
            </div>
          </div>
        </div>
        <hr />
        <div class="flex flex-wrap gap-4">
          <WishlistButton :product="product" />
          <ShareButton :product="product" />
        </div>
      </div>
    </div>
    <div class="my-24">
      <div class="font-semibold text-xl mb-4">Related Products</div>
      <ProductRow :products="product.related.nodes" />
    </div>
  </main>
</template>

<script>
import GET_PRODUCT from "~/gql/queries/getProduct";
import ADD_TO_CART from "~/gql/mutations/ADD_TO_CART";

function arraysEqual(a1, a2) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(a1) == JSON.stringify(a2);
}

const formatArray = (arr) => {
  return arr.map((v) => {
    let name = v.name.toLowerCase();
    name = name.startsWith("pa_") ? name.replace("pa_", "") : name;
    let value = v.value.toLowerCase();
    return { name, value };
  });
};

export default {
  scrollToTop: true,
  head() {
    return { title: this.product.name };
  },
  data() {
    return {
      imageToShow: 0,
      quantity: 1,
      variation: [],
      activeVariation: null,
      indexOfTypeAny: [],
      attrValues: [],
      showBackButton: false,
      addToCartState: null,
      addToCartButtonText: "Add to Cart",
    };
  },
  transition(to, from) {
    if (from && from.name === "products") {
      return "slide-left";
    }
    if (to.name === "products") {
      return "slide-right";
    }
  },
  async asyncData({ $graphql, params }) {
    const variables = { slug: params.slug };
    const { product } = await $graphql.default.request(GET_PRODUCT, variables);
    return { product: product };
  },
  mounted() {
    if (this.product.variations) {
      this.checkForVariationTypeOfAny();
    }
  },
  methods: {
    updateQuantity(quantity) {
      this.quantity = quantity;
    },
    checkForVariationTypeOfAny() {
      const numberOfVariation = this.product.variations.nodes[0].attributes.nodes.length;

      for (let index = 0; index < numberOfVariation; index++) {
        let tempArray = [];
        this.product.variations.nodes.forEach((element) => {
          tempArray.push(element.attributes.nodes[index].value);
        });

        if (!tempArray.some(Boolean)) {
          this.indexOfTypeAny.push(index);
        }
      }
    },
    updateSelectedVariations(variations) {
      if (!this.product.variations) {
        return;
      }

      this.attrValues = variations.map((el) => ({
        attributeName: el.name,
        attributeValue: el.value,
      }));
      let cloneArray = JSON.parse(JSON.stringify(variations));
      const activeVariation = this.product.variations.nodes.filter((variation) => {
        // If there is any variation of type ANY set the value to ''
        this.indexOfTypeAny.forEach((index) => (cloneArray[index].value = ""));

        return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray));
      });

      this.activeVariation = activeVariation[0];
      this.variation = variations;

      // Overwrite the selected gallery image if the variation has a featured image
      // if (this.activeVariation && this.activeVariation.image.sourceUrl) {
      // 	this.selectedGalleryImage = null
      // }
    },
    async triggerAddToCart() {
      this.addToCartState = "loading";
      this.addToCartButtonText = "Adding ...";
      // { attributeName: 'size', attributeValue: 'Large' }
      const variationInput = this.activeVariation ? this.attrValues : null;

      const input = {
        productId: this.product.databaseId,
        quantity: this.quantity,
        variationId: this.product.variations ? this.activeVariation.databaseId : null,
        variation: variationInput,
      };

      try {
        const { addToCart } = await this.$graphql.default.request(ADD_TO_CART, {
          input,
        });
        this.addToCartState = "success";
        this.addToCartButtonText = "Added to Cart";
        setTimeout(() => {
          this.addToCartState = null;
          this.addToCartButtonText = "Add to Cart";
        }, 2500);

        this.$store.commit("updateCart", addToCart.cart);
      } catch (error) {
        console.error(error);
      }
    },
    // changeGalleryImage(index) {
    // 	this.selectedGalleryImage = this.product.galleryImages.nodes[index].sourceUrl
    // }
  },
  computed: {
    type() {
      return this.activeVariation ? this.activeVariation : this.product;
    },
    primaryCategory() {
      return this.product.productCategories.nodes[0];
    },
  },
};
</script>

<style>
.product-categories > a:last-child .comma {
  display: none;
}
</style>
