defineNuxtRouteMiddleware((to, from) => {
  return navigateTo('/' + to.params.slug, { replace: true })
})
