import { gql } from 'nuxt-graphql-request';

export const state = () => ({
  showCart: false,
  itemCount: null,
  products: [],
  productCategories: [],
})


export const mutations = {
  toggleCart: (state, bool) => { state.showCart = bool },
  updateItemCount: (state, itemCount) => (state.itemCount = itemCount),
}

export const actions = {
  async nuxtServerInit ({ dispatch, commit }) {
    
      const cartQuery = gql`query getCart {
        cart {
          total
          contents {
            itemCount
          }
        }
      }`;

      const { cart } = await this.$graphql.default.request(cartQuery)
      commit("updateItemCount", cart.contents.itemCount);

  },
}