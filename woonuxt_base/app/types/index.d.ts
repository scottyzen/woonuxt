type Cart = import('#gql').CartFragment;
type Customer = import('#gql').CustomerFragment;
type Viewer = import('#gql').ViewerFragment;
type PaymentGateway = import('#gql').PaymentGatewayFragment;
type Order = import('#gql').OrderFragmentFragment;
type ProductBase = import('#gql').GetProductQuery['product'];
type SimpleProduct = import('#gql').SimpleProductFragment;
type VariableProduct = import('#gql').VariableProductFragment;
type ExternalProduct = import('#gql').ExternalProductFragment;
type DownloadableItem = import('#gql').DownloadableItemFragment;
type ProductCategory = import('#gql').ProductCategoryFragment;
type Product = ProductBase & SimpleProduct & VariableProduct & ExternalProduct;
type Address = import('#gql').AddressFragment;
type Terms = import('#gql').TermsFragment;
type VariationAttribute = import('#gql').VariationAttributeFragment;
type Comment = import('#gql').CommentFragment;
type ProductAttribute = import('#gql').ProductAttributeFragment;
type LoginClients = import('#gql').GetLoginClientsQuery['loginClients'];

interface ProductAttributeInput {
  attributeName: string;
  attributeValue: string;
}

interface PaymentGateways {
  nodes: PaymentGateway[];
}

interface Variation {
  name?: string | null;
  databaseId?: number;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  slug?: string | null;
  stockQuantity?: number | null;
  stockStatus?: StockStatusEnum | null;
  hasAttributes?: boolean | null;
  image?: ProductImage | null;
  attributes?: { nodes?: VariationAttribute[] } | null;
  node?: SimpleProduct | VariableProduct;
}

interface ProductImage {
  sourceUrl?: string | null | undefined;
  cartSourceUrl?: string | null | undefined;
  altText?: string | null | undefined;
  title?: string | null | undefined;
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

interface GeoLocation {
  code: string;
  name: string;
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

interface WooNuxtFilter {
  slug: string;
  label?: string;
  hideEmpty: boolean;
  showCount: boolean;
  openByDefault: boolean;
  terms: Terms;
}

interface UserInfo {
  email: string;
  password: string;
  username: string;
}
