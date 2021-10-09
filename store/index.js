import getProducts from '../gql/queries/getProducts'

export const state = () => ({
  showCart: false,
  cart: null,
  user: null,
  products: [],
  productCategories: [],
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  updateCart: (state, cart) => (state.cart = cart),
  updateUser: (state, user) => (state.user = user),
  updateProducts: (state, products) => (state.products = products),
}

export const actions = {
  async nuxtServerInit({commit}) {
    const {products} = await this.$graphql.default.request(getProducts);
      commit('updateProducts', products.nodes);
  },
}