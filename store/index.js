import GET_PRODUCTS from '~/gql/queries/getProducts'

export const state = () => ({
  showCart: false,
  cart: null,
  user: undefined,
  products: [],
  productCategories: [],
  page: 'index'
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  updateCart: (state, cart) => (state.cart = cart),
  updateUser: (state, user) => (state.user = user),
  updateProducts: (state, products) => (state.products = products),
  updatePage(state, pageName) { state.page = pageName}
}

export const actions = {
  async nuxtServerInit({commit}) {
    const {products} = await this.$graphql.default.request(GET_PRODUCTS);
      commit('updateProducts', products.nodes);
  },
}