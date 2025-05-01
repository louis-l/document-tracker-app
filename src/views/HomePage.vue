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
                <table class="min-w-full text-left">
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
                      <td class="px-6 py-4">{{ document.expires_at }}</td>
                      <td class="px-6 py-4">
                        <DocumentArchiveButton
                          :document="document"
                          @archived="handleDocumentArchived"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { documentsClient, Document } from '../client.ts'
import DocumentArchiveButton from '../components/Document/DocumentArchiveButton.vue'

const handleDocumentArchived = (document: Document) => {
  const documentIndex = userDocuments.value.findIndex(({ id }) => id === document.id)

  if (documentIndex >= 0) {
    userDocuments.value.splice(documentIndex, 1)
  }
}

const userDocuments = ref<Document[]>([])

onMounted(async () => {
  const response = await documentsClient.getDocuments()

  userDocuments.value = response.data.data
})
</script>
