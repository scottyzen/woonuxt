<script setup lang="ts">
const route = useRoute();
let { formatURI, } = useHelpers();
const storedPageId = localStorage.getItem('pageId');
const pageId = JSON.parse(storedPageId) || [];
const pageNumber = route.params?.pageNumber_0 ?? "";

const changePageNext = () => {
  let pageIdValueNext = ""
  if (pageNumber) {
    pageIdValueNext = pageId.slice(-1);
  } else {
    pageIdValueNext = pageId.slice(0);
  }
  return formatURI(`/products/page/${pageIdValueNext}`);
};


const changePageBack = () => {
  /* 
  const pageId = {
  "0": "YXJyYXljb25uZWN0aW9uOjEzNDg5MQ==",
  "1": "YXJyYXljb25uZWN0aW9uOjEzNDQ2Ng==",
  "2": "YXJyYXljb25uZWN0aW9uOjEzNDI3MQ==",
  "3": "YXJyYXljb25uZWN0aW9uOjEzMzY4OA=="
};
const pageNumber = "YXJyYXljb25uZWN0aW9uOjEzNDI3MQ==";
  */
  const keys = Object.keys(pageId);
  const indexOfTarget = keys.findIndex(key => pageId[key] === pageNumber);
  if (indexOfTarget !== -1 && indexOfTarget > 0) {
    const keyBeforeTarget = keys[indexOfTarget - 1];
    const valueBeforeTarget = pageId[keyBeforeTarget];
    return formatURI(`/products/page/${valueBeforeTarget}`);
  } else {
    return formatURI(`/products/`);
  }

};


</script>

<template>
  <div class="flex justify-center mt-8 mb-16 col-span-full tabular-nums">
    <!-- Pagination -->
    <NuxtLink :to="changePageBack()" class="next mx-2" aria-label="Next">

      <Icon name="ion:arrow-back-circle-sharp" size="20" class="w-5 h-5 mx-2" /> Go Back to fisrt page
    </NuxtLink>
    <NuxtLink :to="changePageNext()" class="next mx-2" aria-label="Next">

      <Icon name="ion:arrow-forward-circle-sharp" size="20" class="w-5 h-5 mx-2" /> Next page
    </NuxtLink>


  </div>
</template>

<style lang="postcss" scoped>
.prev,
.next,
.page-number {
  @apply bg-white border font-medium border-gray-300 text-sm p-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-10;
}

.prev {
  @apply rounded-l-md;
}

.next {
  @apply rounded-r-md;
}

.page-number {
  @apply px-3;
}

.page-number[aria-current='page'] {
  @apply bg-primary border-primary border bg-opacity-10 text-primary z-10;
}
</style>
