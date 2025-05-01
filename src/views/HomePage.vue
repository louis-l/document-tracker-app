<template>
  <main>
    <div class="space-y-16 py-16 xl:space-y-20">
      <div>
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold leading-6 text-gray-900">
                Documents Expiring Soon
              </h1>
              <p class="mt-2 text-sm text-gray-700">
                A list of documents that will expire within the next 7 days
              </p>
            </div>
          </div>
          <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="mb-8">
                  <select v-model="filterDocumentsBy">
                    <option
                      v-for="option in documentFilterOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <table class="min-w-full text-left mb-8">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th class="px-6 py-3">ID</th>
                      <th class="px-6 py-3">Name</th>
                      <th class="px-6 py-3">Expiry</th>
                      <th class="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr
                      v-for="document in userDocuments"
                      :key="document.id"
                      class="bg-white border-b border-gray-200"
                    >
                      <td class="px-6 py-4">{{ document.id }}</td>
                      <td class="px-6 py-4">{{ document.name }}</td>
                      <td class="px-6 py-4">{{ document.expires_at ? formatDatetime(document.expires_at) : 'Never' }}</td>
                      <td class="px-6 py-4">
                        <DocumentArchiveButton
                          :document="document"
                          :disabled="isLoading"
                          @archived="handleDocumentArchived"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div class="flex items-center justify-center">
                  <!-- Previous Button -->
                  <button
                    :disabled="!hasPreviousPage || isLoading"
                    type="button"
                    class="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    @click="handleGoToPreviousPage"
                  >
                    <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                    </svg>
                    Previous
                  </button>
                  <button
                    :disabled="!hasNextPage || isLoading"
                    type="button"
                    class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    @click="handleGoToNextPage"
                  >
                    Next
                    <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { documentsClient, Document, DocumentPagination, DocumentFilterValue } from '../client.ts'
import DocumentArchiveButton from '../components/Document/DocumentArchiveButton.vue'

type DocumentFilterOption = {
  label: string;
  value: DocumentFilterValue;
}

const handleDocumentArchived = (document: Document) => {
  const documentIndex = userDocuments.value.findIndex(({ id }) => id === document.id)

  if (documentIndex >= 0) {
    userDocuments.value.splice(documentIndex, 1)
  }
}

const fetchUserDocuments = async (page: number) => {
  isLoading.value = true

  const response = await documentsClient.getDocuments({
    filter: filterDocumentsBy.value,
    page,
    per_page: documentPagination.value.per_page,
  })

  userDocuments.value = response.data.data
  documentPagination.value = response.data.meta

  isLoading.value = false
}

const handleGoToPreviousPage = async () => {
  if (!hasPreviousPage.value) {
    return
  }

  await fetchUserDocuments(documentPagination.value.current_page - 1)
}

const handleGoToNextPage = async () => {
  if (!hasNextPage.value) {
    return
  }

  await fetchUserDocuments(documentPagination.value.current_page + 1)
}

const formatDatetime = (input: string) => {
  const date = new Date(input)
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

const isLoading = ref(false)
const userDocuments = ref<Document[]>([])
const documentPagination = ref<DocumentPagination>({
  current_page: 1,
  per_page: 10,
  from: 1,
  to: 1,
  total: 0,
  last_page: 0,
  path: '',
})
const hasPreviousPage = computed(() => documentPagination.value.current_page >= 2)
const hasNextPage = computed(() => documentPagination.value.current_page < documentPagination.value.last_page)
const filterDocumentsBy = ref<DocumentFilterValue>('all')
const documentFilterOptions: DocumentFilterOption[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Expiring soon',
    value: 'expiring_soon',
  },
  {
    label: 'Expired',
    value: 'already_expired',
  },
]

watch(filterDocumentsBy, () => {
  // When changing the filter, we need to fetch from 1st page again.
  fetchUserDocuments(1)
})
onMounted(() => {
  fetchUserDocuments(documentPagination.value.current_page)
})
</script>
