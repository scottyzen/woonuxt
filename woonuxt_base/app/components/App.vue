<div class="flex flex-col min-h-screen">
  <AppHeader />
  <main class="flex-1">
    <slot />
  </main>
  <AppFooter />
  <SecurityAlert />
  <CookieControl />
  <BackToTop />
</div> 
