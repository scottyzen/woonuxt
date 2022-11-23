import VuexPersistence from 'vuex-persist'
 
export default ({ store }) => {
    new VuexPersistence({
        reducer: (state) => ({
            wishlist: state.wishlist,
        }),
    }).plugin(store);
}