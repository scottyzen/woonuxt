type Cart = import('#gql').GetCartQuery['cart'];
type Customer = import('#gql').GetCartQuery['customer'];
type Viewer = import('#gql').GetCartQuery['viewer'];
type PaymentGateways = import('#gql').GetCartQuery['paymentGateways'];
type ProductBase = import('#gql').GetProductQuery['product'];
type Order = import('#gql').OrderFragmentFragment;
type SimpleProduct = import('#gql').SimpleProductFragment;
type VariableProduct = import('#gql').VariableProductFragment;
type DownloadableItem = import('#gql').DownloadableItemFragment;
type ProductCategory = import('#gql').ProductCategoryFragment;
type Product = ProductBase & SimpleProduct & VariableProduct;
type Address = import('#gql').AddressFragment;
type LoginClients = import('#gql').GetLoginClientsQuery['loginClients'];

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

interface ProductTerm {
  taxonomyName?: string | null;
  slug?: string | null;
}

interface Author {
  name?: string | null;
  avatar?: { url?: string | null } | null;
}

interface Review {
  rating?: number | null;
  content?: string | null;
  id?: string | null;
  date?: string | null;
  author?: { node?: Author | null } | null;
}

interface Reviews {
  averageRating?: number | null;
  edges?: Array<{ rating?: number | null; node?: Review | null }> | null;
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

interface CartItem {
  quantity?: number | null;
  key: string;
  product?: Product | null;
  variation?: { node: Variation } | null;
}

interface CartContents {
  itemCount?: number | null;
  productCount?: number | null;
  nodes?: CartItem[];
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
