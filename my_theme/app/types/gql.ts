export type * from '#gql/default';

import type {
  AddressFragment,
  CartFragment,
  CommentFragment,
  CustomerFragment,
  DownloadableItemFragment,
  ExternalProductFragment,
  GetCartQuery,
  GetProductCategoriesQuery,
  GetProductQuery,
  GetProductsQuery,
  ImageFragment,
  LineItemFragment,
  LoginClientFragment,
  LoginMutation,
  LoginWithProviderMutation,
  OrderFragmentFragment,
  PaymentGatewayFragment,
  ProductAttributeFragment,
  ProductVariationFragment,
  ProductWithAttributesFragment,
  SimpleProductFragment,
  TermsFragment,
  VariationAttributeFragment,
  VariableProductFragment,
  ViewerFragment,
} from '#gql/default';

type ArrayItem<T> = NonNullable<T> extends ReadonlyArray<infer Item> ? NonNullable<Item> : never;
type ConnectionNode<T> = NonNullable<T> extends { nodes: ReadonlyArray<infer Node> } ? NonNullable<Node> : never;
type OptionalConnection<TNode> = { nodes?: TNode[] | null } | null;
type Nullable<T> = T | null | undefined;

export type Cart = CartFragment;
export type Customer = CustomerFragment;
export type Viewer = ViewerFragment;
export type PaymentGateway = PaymentGatewayFragment;
export type PaymentGateways = NonNullable<GetCartQuery['paymentGateways']>;
export type Order = OrderFragmentFragment;
export type Address = AddressFragment;
export type DownloadableItem = DownloadableItemFragment;
export type ProductCategory = ConnectionNode<NonNullable<GetProductCategoriesQuery['productCategories']>>;
export type Comment = CommentFragment;
export type LoginClient = LoginClientFragment;
export type LoginSession = NonNullable<LoginMutation['login']> | NonNullable<LoginWithProviderMutation['login']>;

export type ImageWithSizes = ImageFragment & {
  cartSourceUrl?: string | null;
  productCardSourceUrl?: string | null;
};

export type ProductImage = {
  sourceUrl?: string | null;
  cartSourceUrl?: string | null;
  productCardSourceUrl?: string | null;
  altText?: string | null;
  title?: string | null;
  databaseId?: number | null;
};

export type ProductImageFields = {
  image?: ImageWithSizes | null;
  galleryImages?: OptionalConnection<ImageFragment> | null;
};

export type ProductPricingFields = {
  price?: string | null;
  regularPrice?: string | null;
  salePrice?: string | null;
  rawPrice?: string | null;
  rawRegularPrice?: string | null;
  rawSalePrice?: string | null;
  onSale?: boolean | null;
};

export type ProductReviewFields = {
  averageRating?: number | null;
  reviewCount?: number | null;
};

export type ProductDateFields = {
  date?: string | null;
};

export type ProductStockFields = {
  stockStatus?: ProductVariationFragment['stockStatus'];
  stockQuantity?: number | null;
  lowStockAmount?: number | null;
};

export type ProductVariationFields = {
  variations?: OptionalConnection<Variation> | null;
};

export type ProductAttributeFields = {
  attributes?: OptionalConnection<ProductAttribute> | null;
  defaultAttributes?: OptionalConnection<VariationAttribute> | null;
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
export type ProductListItem = ConnectionNode<NonNullable<GetProductsQuery['products']>> &
  ProductImageFields &
  ProductPricingFields &
  ProductReviewFields &
  ProductVariationFields & {
    description?: string | null;
    shortDescription?: string | null;
    date?: string | null;
  };
export type Product = ProductDetail | ProductListItem;

export type SimpleProduct = SimpleProductFragment;
export type VariableProduct = VariableProductFragment;
export type ExternalProduct = ExternalProductFragment;
export type ProductWithAttributes = ProductWithAttributesFragment;
export type ProductAttribute = ProductAttributeFragment;
export type VariationAttribute = VariationAttributeFragment;
export type Variation = ProductVariationFragment & {
  rawRegularPrice?: string | null;
  node?: SimpleProduct | VariableProduct;
};
export type Terms = TermsFragment;

export type AppliedCoupon = ArrayItem<Cart['appliedCoupons']>;
export type ShippingMethodRate = ArrayItem<ArrayItem<Cart['availableShippingMethods']>['rates']>;
export type LineItem = LineItemFragment;

export interface GeoLocation {
  code: string;
  name: string;
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

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type AuthResponse = ApiResponse;

export interface GQLError {
  message: string;
  extensions?: Record<string, unknown>;
  locations?: Array<{ line?: number; column?: number }>;
  path?: Array<string | number>;
  response?: unknown;
  cause?: unknown;
  gqlErrors?: GQLError[];
  data?: unknown;
  networkError?: unknown;
  graphQLErrors?: GQLError[];
  statusCode?: number;
}

export type Maybe<T> = Nullable<T>;
