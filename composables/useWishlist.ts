// defing refs outside of the component to keep there state
const theList = ref([] as Product[]);

export function useWishlist() {
  // function to add to the list
  function addToList(item: any): void {
    theList.value.push(item);
    localStorage.setItem('wishlist', JSON.stringify(theList.value));
  }

  // function to remove from the list
  function removeFromList(databaseId: number): void {
    theList.value = theList.value.filter((item) => item.databaseId !== databaseId);
    localStorage.setItem('wishlist', JSON.stringify(theList.value));
  }

  // function to check if an item is in the list
  function isInList(databaseId: number): boolean {
    return theList.value.some((item) => item.databaseId === databaseId);
  }

  function isEmpty(): boolean {
    return theList.value.length === 0;
  }

  function getFromLocalStorage(): void {
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) theList.value = JSON.parse(wishlist);
  }

  onMounted(() => {
    getFromLocalStorage();
  });

  return { theList, addToList, removeFromList, isInList, isEmpty };
}
