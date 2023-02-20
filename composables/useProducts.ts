export function useProducts() {
  // Declare the state variables and the setter functions
  const products = useState<any[]>('products', () => []);
  const allProducts = useState<any[]>('allProducts', () => []);

  function setProducts(newProducts: any[]) {
    products.value = newProducts;
    allProducts.value = newProducts;
  }

  return { products, allProducts, setProducts };
}
