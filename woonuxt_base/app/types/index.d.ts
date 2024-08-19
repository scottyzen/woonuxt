type Cart = import('#gql').CartFragment;
type Customer = import('#gql').CustomerFragment;
type Viewer = import('#gql').ViewerFragment;
type PaymentGateways = import('#gql').PaymentGatewaysFragment;
type Order = import('#gql').OrderFragmentFragment;
type ProductBase = import('#gql').GetProductQuery['product'];
type SimpleProduct = import('#gql').SimpleProductFragment;
type VariableProduct = import('#gql').VariableProductFragment;
type DownloadableItem = import('#gql').DownloadableItemFragment;
type ProductCategory = import('#gql').ProductCategoryFragment;
type Product = ProductBase & SimpleProduct & VariableProduct;
type Address = import('#gql').AddressFragment;
type Terms = import('#gql').TermsFragment;

interface ProductAttributeInput {
  attributeName: string;
  attributeValue: string;
}
interface Attribute {
  value: string;
  name: string;
}

interface ProductAttribute {
  name: string;
  label: string;
  options?: Array<string> | null;
  variation?: boolean | null;
  visible?: boolean | null;
}

interface Variation {
  name?: string | null;
  databaseId?: number;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  slug?: string | null;
  stockQuantity?: number | null;
  stockStatus: StockStatusEnum | null;
  hasAttributes?: boolean | null;
  image?: ProductImage | null;
  attributes?: { nodes: Attribute[] } | null;
  node?: SimpleProduct | VariableProduct;
}

interface ProductImage {
  sourceUrl?: string | null | undefined;
  cartSourceUrl?: string | null | undefined;
  altText?: string | null | undefined;
  title?: string | null | undefined;
}

interface PaymentGateway {
  title?: string | null;
  id?: string | null;
  description?: string | null;
}

interface AppliedCoupon {
  description?: string | null;
  discountTax: string;
  discountAmount: string;
  code: string;
}

interface ShippingMethodRate {
  cost?: string | null;
  id: string;
  label?: string | null;
}

interface LineItem {
  quantity?: number | null;
  total?: string | null;
  product?: Product | null;
  variation?: Variation | null;
}

interface WooNuxtSEOItem {
  provider: string;
  url?: string;
  handle?: string;
}
