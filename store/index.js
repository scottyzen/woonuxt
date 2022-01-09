import GET_PRODUCTS from '~/gql/queries/getProducts'

export const state = () => ({
  showCart: false,
  showMenu: false,
  cart: null,
  user: undefined,
  products: [],
  productCategories: [],
  page: 'index',
  filter: null,
  searchTags: [],
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  toggleMenu: (state, bool) => { state.showMenu = bool },
  updateCart: (state, cart) => (state.cart = cart),
  updateUser: (state, user) => (state.user = user),
  updateProducts: (state, products) => (state.products = products),
  updatePage(state, pageName) { state.page = pageName},
  setFilter(state, filter) {state.filter = filter ? {...filter} : null},
  clearFilter(state) { state.filter = null },
  setSearchTags(state, tags) { state.searchTags = [...tags] },
}

export const actions = {
  async nuxtServerInit({commit}) {
    let temperayArray = []

    // IF query had endCursor LOOP THROUGH PRODUCTS AND ADD TO ARRAY
    const addProductsToArray = async (after) => {
      const {products} = await this.$graphql.default.request(GET_PRODUCTS, { first: 20, after })
      temperayArray = [...temperayArray, ...products.nodes]
      return products.pageInfo.hasNextPage ? addProductsToArray(products.pageInfo.endCursor) : temperayArray
    }

    commit('updateProducts', await addProductsToArray())

    // const {products} = await this.$graphql.default.request(GET_PRODUCTS);
      // commit('updateProducts', products.nodes);
  },
}