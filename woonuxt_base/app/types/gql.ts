export type * from '#gql';
export type * from '#gql/default';

import type {
  CartFragment,
  CustomerFragment,
  ViewerFragment,
  PaymentGatewayFragment,
  OrderFragmentFragment,
  GetProductQuery,
  GetProductsQuery,
  ImageFragment as BaseImageFragment,
  SimpleProductFragment,
  VariableProductFragment,
  ExternalProductFragment,
  ProductWithAttributesFragment,
  ProductVariationFragment,
  ImageFragment,
  DownloadableItemFragment,
  ProductCategoryFragment,
  AddressFragment,
  TermsFragment,
  VariationAttributeFragment,
  CommentFragment,
  ProductAttributeFragment,
  LoginClientFragment,
} from '#gql';
import type { StockStatusEnum } from '#gql/default';

export type Cart = CartFragment;
export type Customer = CustomerFragment;
export type Viewer = ViewerFragment;
export type PaymentGateway = PaymentGatewayFragment;
export type Order = OrderFragmentFragment;
export type ImageWithSizes = BaseImageFragment & {
  cartSourceUrl?: string | null;
  producCardSourceUrl?: string | null;
};
export type ProductBase = GetProductQuery['product'];
export type ProductDetail = NonNullable<GetProductQuery['product']> &
  ProductImageFields &
  ProductPricingFields &
  ProductReviewFields &
  ProductDateFields &
  ProductVariationFields &
  ProductAttributeFields &
  ProductStockFields;
export type ProductListItem = NonNullable<NonNullable<GetProductsQuery['products']>['nodes'][number]> &
  ProductImageFields &
  ProductPricingFields &
  ProductReviewFields &
  ProductVariationFields & {
    description?: string | null;
    shortDescription?: string | null;
    date?: string | null;
  };
type ProductImageFields = {
  image?: ImageWithSizes | null;
  galleryImages?: { nodes?: BaseImageFragment[] | null } | null;
};

type ProductPricingFields = {
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  rawPrice?: string | null;
  rawRegularPrice?: string | null;
  rawSalePrice?: string | null;
  onSale?: boolean | null;
};

type ProductReviewFields = {
  averageRating?: number | null;
  reviewCount?: number | null;
};

type ProductDateFields = {
  date?: string | null;
};

type ProductVariationFields = {
  variations?: { nodes?: ProductVariationFragment[] | null } | null;
};

type ProductAttributeFields = {
  attributes?: { nodes?: ProductAttributeFragment[] | null } | null;
  defaultAttributes?: { nodes?: VariationAttributeFragment[] | null } | null;
};

type ProductStockFields = {
  stockStatus?: StockStatusEnum | null;
  stockQuantity?: number | null;
  lowStockAmount?: number | null;
};

export type Product = ProductDetail | ProductListItem;
export type SimpleProduct = SimpleProductFragment;
export type VariableProduct = VariableProductFragment;
export type ExternalProduct = ExternalProductFragment;
export type ProductWithAttributes = ProductWithAttributesFragment;
export type DownloadableItem = DownloadableItemFragment;
export type ProductCategory = ProductCategoryFragment;
export type Address = AddressFragment;
export type Terms = TermsFragment;
export type VariationAttribute = VariationAttributeFragment;
export type Comment = CommentFragment;
export type ProductAttribute = ProductAttributeFragment;
export type LoginClient = LoginClientFragment;

export interface ProductAttributeInput {
  attributeName: string;
  attributeValue: string;
}

export interface PaymentGateways {
  nodes: PaymentGateway[];
}

export interface Variation {
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

export interface ProductImage {
  sourceUrl?: string | null | undefined;
  cartSourceUrl?: string | null | undefined;
  altText?: string | null | undefined;
  title?: string | null | undefined;
}

export interface AppliedCoupon {
  description?: string | null;
  discountTax: string;
  discountAmount: string;
  code: string;
}

export interface ShippingMethodRate {
  cost?: string | null;
  id: string;
  label?: string | null;
}

export interface GeoLocation {
  code: string;
  name: string;
}

export interface LineItem {
  quantity?: number | null;
  total?: string | null;
  product?: Product | null;
  variation?: Variation | null;
}

export interface WooNuxtSEOItem {
  provider: string;
  url?: string;
  handle?: string;
}

export interface WooNuxtFilter {
  slug: string;
  label?: string;
  hideEmpty: boolean;
  showCount: boolean;
  openByDefault: boolean;
  terms: Terms;
}

export interface UserInfo {
  email: string;
  password: string;
  username: string;
}

// API Response Types
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface GQLError {
  message: string;
  extensions?: any;
  locations?: any[];
  path?: string[];
}
