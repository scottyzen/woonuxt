<template>
  <main class="container py-4 relative">
    <!-- Breadcrumb -->
    <Breadcrumb
      class="mb-4"
      :format="[
      { name: 'Home', slug: '/' },
      { name: 'Products', slug: '/products' },
      { name: primaryCategory.name, slug: `/product-category/${primaryCategory.slug}` },
      { name: product.name },
    ]"
    />

    <div
      class="block border border-[#e6e6e6] overflow-hidden bg-white shadow rounded-2xl box-border md:rounded-4xl"
    >
      <div class="flex flex-col justify-between md:flex-row md:p-5 md:gap-6">
        <ProductImageGallery
          :first-image="product.image.sourceUrl"
          :gallery="product.galleryImages"
        />

        <div class="p-4 overflow-auto sm:p-5 md:p-0">
          <div class="pb-4 mb-4 border-b border-[#eaeaea]">
            <h1 class="text-[#333] font-semibold text-lg sm:text-2xl">{{ type.name }}</h1>
            <StarRating
              :rating="product.averageRating"
              :count="product.reviewCount"
            />
            <ProductPrice
              :salePrice="type.salePrice"
              :regularPrice="type.regularPrice"
            />
          </div>

          <form @submit.prevent="triggerAddToCart">
            <AttributeSelections
              v-if="product.type == 'VARIABLE' && product.attributes"
              :attrs="product.attributes.nodes.filter(attr => attr.variation != false)"
              @attrs-changed="updateSelectedVariations"
            />
            <div class="flex">
              <AddToCartButton
                :add-to-cart-button-text="addToCartButtonText"
                :disabled="!activeVariation && product.variations"
                :class="{
                  loading: addToCartState == 'loading',
                  success: addToCartState == 'success',
                }"
              />
              <WishlistButton :product="product" />
            </div>
          </form>

          <aside class="my-4 flex border-b border-[#eaeaea] pb-4 flex-col">
            <div class="flex justify-between">
              <div class="text-xs text-true-gray-900 sm:text-sm md:text-xs lg:text-sm">
                <div class="flex items-center justify-center gap-2">
                  <svg
                    width="1.5rem"
                    fill="#0bc15c"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m16.5 14.5-4.2-1.9c-.2-.1-.4-.1-.6 0l-4.2 1.9V6.9l2-5.6h5l2 5.9v7.3zM9 7.3v4.9l2.1-.9c.6-.3 1.2-.3 1.8 0l2.1.9V7.3l-1.6-4.5h-2.9L9 7.3z"
                    ></path>
                    <path
                      d="M20.5 22.8h-17c-1.2 0-2.2-1-2.2-2.2V19c0-.4.3-.8.8-.8s.8.3.8.8v1.5c0 .4.3.8.8.8h17c.4 0 .8-.3.8-.8V7.3c0-.1 0-.2-.1-.3l-1.5-3.8c-.1-.3-.4-.5-.7-.5H5c-.3 0-.6.2-.7.5L2.8 7c0 .1-.1.2-.1.3V10c0 .4-.3.8-.8.8s-.7-.4-.7-.8V7.3c0-.3.1-.6.2-.8l1.5-3.8c.4-.9 1.2-1.5 2.1-1.5h14c.9 0 1.7.6 2.1 1.4l1.5 3.8c.1.3.2.5.2.8v13.2c0 1.3-1.1 2.4-2.3 2.4z"
                    ></path>
                    <path
                      d="M2 7h20v1.5H2zM4.8 13.8h-4c-.5 0-.8-.4-.8-.8s.3-.8.8-.8h4c.4 0 .8.3.8.8s-.4.8-.8.8zM4.8 16.8h-4c-.5 0-.8-.4-.8-.8s.3-.8.8-.8h4c.4 0 .8.3.8.8-.1.4-.4.8-.8.8z"
                    ></path>
                  </svg>
                  <div class="text-[#666]">
                    If you order within<span class="text-[#333] font-semibold">
                      {{countdown}}</span
                    >, it will be delivered<span
                      class="text-[#333] font-semibold"
                    >
                      tomorrow
                    </span>
                    at the latest!
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div class="text-[#333] text-base mb-2 font-semibold md:text-sm lg:text-base">
              Featured Information
            </div>
            <div class="description overflow-auto max-h-56 text-sm text-[#666] sm:max-h-72 md:max-h-48 md:text-xs md:text-[#333] lg:max-h-86 lg:text-sm">
              <ul>
                <li>
                  Free returns within 30 days. Click for detailed
                  <a class="underline" href="#"> information</a>.
                </li>
                <li>
                  This product will be sent by
                  <span class="underline font-semibold cursor-help"
                    >WooNuxt</span
                  >.
                </li>
                <div v-html="product.description"></div>
                <li>
                  A maximum of 10 orders can be placed for this product. WooNuxt
                  reserves the right to cancel orders over 10 units.
                </li>
                <li>
                  More than 50 stocks were offered to be sold at the campaign
                  price.
                </li>
                <li>
                  WooNuxt determines the sales price of the product you have
                  examined.
                </li>
                <li>The price listed is valid until 12 November 2022.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-24">
      <div class="font-semibold text-xl mb-4">Related Products</div>
      <ProductRow
        :products="product.related.nodes"
        class="grid-cols-2"
      />
    </div>
  </main>
</template>

<script>
import GET_PRODUCT from "~/gql/queries/getProduct";
import ADD_TO_CART from "~/gql/mutations/ADD_TO_CART";

function formatVariarionArrays(arr) {
  return arr.map(a => {
    // replace all dashes and spaces with underscores
    return { name: a.name.replace(/[-\s]/g, '_'), value: a.value.replace(/[-\s]/g, '_') }
  });
}

function arraysEqual(a1, a2) {
  let a1Formatted = formatVariarionArrays(a1);
  let a2Formatted = formatVariarionArrays(a2);
  return JSON.stringify(a1Formatted) == JSON.stringify(a2Formatted);
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
      countdown: null
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
    setInterval(() => { this.show() }, 1000);
    if (this.product.variations) {
      this.checkForVariationTypeOfAny();
    }
  },
  methods: {
    show: function() {
      let d = new Date();
      let h = 24 - d.getHours();
      let m = 60 - d.getMinutes();
      if((m + '').length == 1){
        m = '0' + m;
      }
      this.countdown = h + ' hours ' + m + ' minutes'
    },
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
      console.log('updateSelectedVariations', variations);
      if (!this.product.variations) {
        return;
      }

      this.attrValues = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
      let cloneArray = JSON.parse(JSON.stringify(variations));
      const activeVariation = this.product.variations.nodes.filter((variation) => {
        // If there is any variation of type ANY set the value to ''
        this.indexOfTypeAny.forEach((index) => (cloneArray[index].value = ""));

        return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray));
      });
      console.log('activeVariation', activeVariation);

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
        }, 4000);

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

<style lang="scss">
.description ul li {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxlbGxpcHNlIHJ5PSIzIiByeD0iMyIgY3k9IjMiIGN4PSIzIiBmaWxsPSIjYzljOWM5Ii8+PC9zdmc+)
    no-repeat 0 14px !important;
  padding-left: 0.938rem;
  line-height: 2rem;
}
.description::-webkit-scrollbar {
  width: 4px;
}
.description::-webkit-scrollbar-thumb {
  background: #e6e6e6;
  border-radius: 100px;
}
.description::-webkit-scrollbar-track {
  background: #f9f9f9;
  border-radius: 100px;
}
</style>