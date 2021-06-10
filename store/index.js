import getProducts from '../gql/queries/getProducts'

export const state = () => ({
  products: [],
})

export const mutations = {
  updateProducts: (state, products) => {
    state.products = products
  },
}

export const actions = {
  async nuxtServerInit({ state, commit, dispatch }) {
    const { products } = await this.$graphql.default.request(getProducts)
    commit('updateProducts', products.nodes)
  },
}
