interface ProductAttributeInput {
  attributeName: string;
  attributeValue: string;
}

interface AddToCartInput {
  clientMutationId?: string;
  extraData?: string;
  productId: number;
  quantity: number;
  variation?: ProductAttributeInput[];
  variationId?: number | null | undefined;
}

interface MetaDataInput {
  key: string;
  value: string;
  id?: string;
}

interface CreateAccountInput {
  password: string;
  username: string;
  email: string;
}

interface Customer {
  lastName?: string | null;
  email?: string | null;
  firstName?: string | null;
  username?: string | null;
  databaseId?: number | null;
  sessionToken?: string | null;
  billing?: Address | null;
  shipping?: Address | null;
}

interface Address {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  country?: CountriesEnum | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  postcode?: string | null;
  state?: string | null;
  company?: string | null;
}

interface Viewer {
  lastName?: string | null;
  email?: string | null;
  databaseId: number;
  id: string;
  firstName?: string | null;
  username?: string | null;
  nicename?: string | null;
  wooSessionToken?: string | null;
}

interface ProductCategory {
  databaseId: number;
  slug: string;
  name: string;
  count: number;
}

interface Attribute {
  value?: string | null;
  name?: string | null;
}

interface ProductAttribute {
  name?: string | null;
  options?: Array<string | null> | null;
  variation?: boolean | null;
  visible?: boolean | null;
}

interface ProductTerm {
  taxonomyName?: string | null;
  slug?: string | null;
}

interface Product {
  name?: string | null;
  databaseId?: number | null;
  slug?: string | null;
  sku?: string | null;
  onSale?: boolean | null;
  type?: ProductTypesEnum | null;
  price?: string | null;
  date?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus?: StockStatusEnum | null;
  stockQuantity?: number | null;
  description?: string | null;
  shortDescription?: string | null;
  averageRating?: number | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  reviewCount?: number | null;
  rawPrice?: string | null;
  rawRegularPrice?: string | null;
  rawSalePrice?: string | null;
  image?: ProductImage | null;
  terms?: { nodes: Array<ProductTerm> } | null;
  galleryImages?: Array<{ sourceUrl?: string | null }> | null;
  attributes?: { nodes: Array<Attribute> } | null;
  productCategories?: { nodes: Array<ProductCategory> } | null;
  defaultAttributes?: Array<{ name?: string | null; attributeId?: number | null }> | null;
  variations?: { nodes: Variation[] } | null;
  node: SimpleProduct | VariableProduct;
  related?: { nodes: Array<Product> } | null;
}

interface SimpleProduct {
  name?: string | null;
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus?: StockStatusEnum | null;
  stockQuantity?: number | null;
  description?: string | null;
  shortDescription?: string | null;
  averageRating?: number | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  reviewCount?: number | null;
  rawPrice?: string | null;
  rawRegularPrice?: string | null;
  rawSalePrice?: string | null;
  image?: ProductImage | null;
  galleryImages?: { nodes: Array<{ sourceUrl?: string | null }> } | null;
}

interface VariableProduct {
  name?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  stockStatus?: StockStatusEnum | null;
  totalSales?: number | null;
  stockQuantity?: number | null;
  rawPrice?: string | null;
  rawRegularPrice?: string | null;
  rawSalePrice?: string | null;
  image?: ProductImage | null;
  attributes?: { nodes: Array<ProductAttribute> } | null;
  defaultAttributes?: { nodes: Array<Attribute> } | null;
  variations?: {
    nodes: Variation[];
  } | null;
  galleryImages?: { nodes: Array<{ sourceUrl?: string | null }> } | null;
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
  attributes?: { nodes: Attribute[] } | null;
  node?: SimpleProduct | VariableProduct;
}

interface ProductImage {
  sourceUrl?: string | null;
  altText?: string | null;
  title?: string | null;
  cartSourceUrl?: string | null;
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

interface Cart {
  total?: string | null;
  subtotal?: string | null;
  totalTax?: string | null;
  discountTotal?: string | null;
  shippingTotal?: string | null;
  chosenShippingMethods?: Array<string | null> | null;
  isEmpty?: boolean | null;
  appliedCoupons?: Array<AppliedCoupon | null> | null;
  availableShippingMethods?: Array<{ rates?: Array<ShippingMethodRate | null> | null } | null> | null;
  contents?: CartContents | null;
}

interface LineItem {
  quantity?: number | null;
  total?: string | null;
  product?: Product | null;
  variation?: Variation | null;
}

interface Order {
  needsPayment?: boolean | null;
  needsProcessing?: boolean | null;
  status?: OrderStatusEnum | null;
  databaseId?: number | null;
  orderKey?: string | null;
  subtotal?: string | null;
  total?: string | null;
  totalTax?: string | null;
  shippingTotal?: string | null;
  paymentMethodTitle?: string | null;
  paymentMethod?: string | null;
  date?: string | null;
  customer?: Customer | null;
  lineItems?: { nodes?: LineItem[] } | null;
}
