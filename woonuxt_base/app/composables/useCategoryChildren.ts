import getCategoryChildren from '~/graphql/queries/getCategoryChildren.gql'

export async function useCategoryChildren(slug: string) {
  const { data, error } = await useAsyncGql({
    query: getCategoryChildren,
    variables: { slug }
  })

  if (error.value) {
    console.error('Error fetching category children:', error.value)
  }

  const category = computed(() => data.value?.category)
  const children = computed(() => category.value?.children?.nodes || [])

  return { category, children }
}
