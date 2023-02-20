// defing refs outside of the component to keep there state
const theList = ref([] as any[]);

export function useWishlist() {
  // function to add to the list
  function addToList(item: any) {
    theList.value.push(item);
    storeInLocalStorage();
  }

  // function to remove from the list
  function removeFromList(databaseId: number) {
    theList.value = theList.value.filter(
      (item) => item.databaseId !== databaseId
    );
    storeInLocalStorage();
  }

  // function to check if an item is in the list
  function isInList(databaseId: number) {
    return theList.value.some((item) => item.databaseId === databaseId);
  }

  function isEmpty() {
    return theList.value.length === 0;
  }

  function storeInLocalStorage() {
    if (process.client)
      localStorage.setItem('wishlist', JSON.stringify(theList.value));
  }

  function getFromLocalStorage() {
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) theList.value = JSON.parse(wishlist);
  }

  onMounted(() => {
    getFromLocalStorage();
  });

  return { theList, addToList, removeFromList, isInList, isEmpty };
}
