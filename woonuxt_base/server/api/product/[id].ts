import { defineEventHandler, getRouterParam } from 'h3'
import { woocommerce } from '~/server/utils/woocommerce'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID ontbreekt' })
  }

  try {
    const product = await woocommerce.get(`products/${id}`)
    return product.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Fout bij ophalen product',
    })
  }
})
