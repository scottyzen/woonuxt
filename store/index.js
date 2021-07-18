export const state = () => ({
  showCart: false,
  products: [],
  productCategories: [],
})

export const mutations = {
  toggleCart: (state, bool) => {
    state.showCart = bool
  },
}
