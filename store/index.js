import GET_PRODUCTS from '~/gql/queries/getProducts'

export const state = () => ({
  showCart: false,
  showMenu: false,
  cart: null,
  user: undefined,
  products: [],
  productCategories: [],
  filter: null,
  searchTags: [],
  wishlist: [],
  orderBy: 'Latest',
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  toggleMenu: (state, bool) => { state.showMenu = bool },
  updateCart: (state, cart) => (state.cart = cart),
  updateUser: (state, user) => (state.user = user),
  // updateUser(state, user) { state.user = [...user] },
  updateProducts: (state, products) => (state.products = products),
  updatePage(state, pageName) { state.page = pageName},
  setFilter(state, filter) {state.filter = filter ? {...filter} : null},
  clearFilter(state) { state.filter = null },
  setSearchTags(state, tags) { state.searchTags = [...tags] },
  updateWishlist: (state, wishlist) => (state.wishlist = wishlist),
  addToWishlist: (state, product) => {
    if (!state.wishlist.find(p => p.databaseId === product.databaseId)) {
      state.wishlist.push(product)
    }
  },
  removeFromWishlist: (state, product) => {
    state.wishlist = state.wishlist.filter(p => p.databaseId !== product.databaseId)
  },
  clearWishlist(state) { state.wishlist = [] },
  updateOrderBy(state, orderBy) { state.orderBy = orderBy },
}

export const actions = {
  async nuxtServerInit({commit}) {
    let temperayArray = []

    // IF query had endCursor LOOP THROUGH PRODUCTS AND ADD TO ARRAY
    const addProductsToArray = async (after) => {
      const {products} = await this.$graphql.default.request(GET_PRODUCTS, { first: 50, after })
      temperayArray = [...temperayArray, ...products.nodes]
      return products.pageInfo.hasNextPage ? addProductsToArray(products.pageInfo.endCursor) : temperayArray
    }

    commit('updateProducts', await addProductsToArray())

    // const {products} = await this.$graphql.default.request(GET_PRODUCTS);
      // commit('updateProducts', products.nodes);
  },
}