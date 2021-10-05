import { gql } from 'nuxt-graphql-request'

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
}

export const actions = {
  // async nuxtServerInit({commit}) {
  // },
}