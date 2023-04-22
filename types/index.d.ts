// ProductAttributeInput
declare interface ProductAttributeInput {
  attributeName: string;
  attributeValue: string;
}

// AddToCartInput
declare interface AddToCartInput {
  clientMutationId?: string;
  extraData?: string;
  productId: number;
  quantity?: number;
  variation?: ProductAttributeInput[];
  variationId?: number;
}

// MetaDataInput
declare interface MetaDataInput {
  key: string;
  value: string;
  id?: string;
}

// CreateAccountInput
declare interface CreateAccountInput {
  password: string;
  username: string;
  email: string;
}

declare interface Customer {
  lastName?: string | null;
  email?: string | null;
  firstName?: string | null;
  username?: string | null;
  databaseId?: number | null;
  sessionToken?: string | null;
  billing?: Address | null;
  shipping?: Address | null;
}

declare interface Address {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  country?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  postcode?: string | null;
  state?: string | null;
}

declare interface Viewer {
  lastName?: string | null;
  email?: string | null;
  databaseId: number;
  id: string;
  firstName?: string | null;
  username?: string | null;
  nicename?: string | null;
  wooSessionToken?: string | null;
}

declare enum StockStatusEnum {
  IN_STOCK = 'IN_STOCK',
  ON_BACKORDER = 'ON_BACKORDER',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

declare enum ProductTypesEnum {
  EXTERNAL = 'EXTERNAL',
  GROUPED = 'GROUPED',
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
  VARIATION = 'VARIATION',
}

interface CartContents {
  itemCount?: number | null;
  productCount?: number | null;
  nodes: CartItem[];
}

interface CartItem {
  quantity?: number | null;
  key: string;
  product?: Product | null;
  variation?: { node: Variation } | null;
}

interface Product {
  node: SimpleProduct | VariableProduct;
}

interface SimpleProduct {
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  databaseId: number;
  type?: ProductTypesEnum | null;
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
  slug?: string | null;
  sku?: string | null;
  databaseId: number;
  type?: ProductTypesEnum | null;
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
  attributes?: {
    nodes: Array<
      | { name?: string | null; options?: Array<string | null> | null; variation?: boolean | null; visible?: boolean | null }
      | { name?: string | null; options?: Array<string | null> | null; variation?: boolean | null; visible?: boolean | null }
    >;
  } | null;
  defaultAttributes?: { nodes: Array<{ name?: string | null; attributeId?: number | null }> } | null;
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
  attributes?: { nodes: Array<{ value?: string | null; name?: string | null }> } | null;
}

interface ProductImage {
  sourceUrl?: string | null;
  altText?: string | null;
  title?: string | null;
  cartSourceUrl?: string | null;
}

interface ProductAttributes {
  name?: string | null;
  options?: Array<string | null> | null;
  variation?: boolean | null;
  visible?: boolean | null;
}

interface ProductVariation {
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
  attributes?: Array<ProductAttributes> | null;
}

interface Product {
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  databaseId?: number;
  type?: ProductTypesEnum | null;
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
  galleryImages?: Array<{ sourceUrl?: string | null }> | null;
  attributes?: Array<ProductAttributes> | null;
  defaultAttributes?: Array<{ name?: string | null; attributeId?: number | null }> | null;
  variations?: Array<ProductVariation> | null;
}

interface CartItem {
  quantity?: number | null;
  key: string;
  product?: Product | null;
  variation?: { node: { name?: string | null; price?: string | null; image?: ProductImage | null } } | null;
}

interface CartContents {
  itemCount?: number | null;
  productCount?: number | null;
  nodes: Array<CartItem>;
}

interface ShippingMethodRate {
  cost?: string | null;
  id: string;
  label?: string | null;
}

interface ShippingMethod {
  rates?: Array<ShippingMethodRate | null> | null;
}

interface AppliedCoupon {
  description?: string | null;
  discountTax: string;
  discountAmount: string;
  code: string;
}

interface Cart {
  total?: string | null;
  subtotal?: string | null;
  totalTax?: string | null;
  discountTotal?: string | null;
  shippingTotal?: string | null;
  chosenShippingMethods?: Array<string | null> | null;
  isEmpty?: boolean | null;
  availableShippingMethods?: Array<ShippingMethod | null> | null;
  appliedCoupons?: Array<AppliedCoupon | null> | null;
  contents?: CartContents | null;
}
