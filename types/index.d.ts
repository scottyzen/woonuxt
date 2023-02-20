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

// // CustomerAddress
// declare interface CustomerAddress {
//   address1: string;
//   address2: string;
//   city: string;
//   company: string;
//   country: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   postcode: string;
//   state: string;
// }

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
}

// // CustomerAddressInput
// declare interface CustomerAddressInput {
//   address1: string;
//   address2?: string;
//   city: string;
//   company?: string;
//   country: string;
//   email?: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   postcode: string;
//   state?: string;
//   overwrite?: boolean;
// }

// // CheckoutInput
// declare interface CheckoutInput {
//   clientMutationId?: string;
//   customerNote?: string;
//   isPaid?: boolean;
//   metaData?: MetaDataInput[];
//   paymentMethod?: string;
//   shipToDifferentAddress?: boolean;
//   shippingMethod?: string[];
//   transactionId?: string;
//   account?: CreateAccountInput;
//   billing?: CustomerAddressInput;
//   shipping?: CustomerAddressInput;
// }

// declare interface Customer {
//   lastName: string;
//   email: string;
//   firstName: string;
//   username: string;
//   databaseId: number;
//   sessionToken: string;
//   billing: CustomerAddress;
//   shipping: CustomerAddress;
// }

// declare interface Viewer {
//   lastName: string;
//   email: string;
//   databaseId: number;
//   id: string;
//   firstName: string;
//   username: string;
//   nicename: string;
//   wooSessionToken: string;
// }

// interface Image {
//   sourceUrl?: string;
//   altText?: string;
//   title?: string;
// }
// interface ProductCategory {
//   databaseId?: number;
//   slug?: string;
//   name?: string;
//   count?: number;
// }

// interface Terms {
//   nodes?: Array<{
//     taxonomyName?: string;
//     slug?: string;
//   }>;
// }

// interface Product {
//   name?: string;
//   slug?: string;
//   onSale?: boolean;
//   date?: string;
//   price?: string;
//   rawPrice?: string;
//   regularPrice?: string;
//   rawRegularPrice?: string;
//   salePrice?: string;
//   rawSalePrice?: string;
//   totalSales?: number;
//   databaseId?: number;
//   averageRating?: number;
//   reviewCount?: number;
//   image?: Image | null | undefined;
//   productCategories?: {
//     nodes?: ProductCategory[] | null | undefined;
//   };
//   terms?: {
//     nodes?: Terms[] | null | undefined;
//   };
// }

// interface SimpleProduct extends Product {
//   stockStatus?: string | null | undefined;
//   stockQuantity?: number | null | undefined;
//   description?: string | null | undefined;
//   shortDescription?: string | null | undefined;
//   averageRating?: number | null | undefined;
//   weight?: number | null | undefined;
//   length?: number | null | undefined;
//   width?: number | null | undefined;
//   height?: number | null | undefined;
//   reviewCount?: number | null | undefined;
// }
