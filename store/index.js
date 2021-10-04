import { gql } from 'nuxt-graphql-request'

export const state = () => ({
  showCart: false,
  cart: null,
  products: [],
  productCategories: [],
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  updateCart: (state, cart) => (state.cart = cart),
}

export const actions = {
  // async nuxtServerInit({commit}) {
  // },
}