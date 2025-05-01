<template>
  <div>
    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else-if="!userDocument">
      Not found
    </div>
    <div v-else>
      <div class="mb-8">
        <RouterLink to="/home">
          <button
            type="button"
            class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Back
          </button>
        </RouterLink>
      </div>

      <ul class="list-disc ml-6 mb-8">
        <li>ID: {{ userDocument.id }}</li>
        <li>Name: {{ userDocument.name }}</li>
        <li>Expiry: {{ formatExpiryDate(userDocument.expires_at) }}</li>
      </ul>

      <div>
        <DocumentArchiveButton
          :document="userDocument"
          @archived="handleDocumentArchived"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { documentsClient, Document } from '../client.ts'
import { useDocument } from '../composables/useDocument.ts'
import DocumentArchiveButton from '../components/Document/DocumentArchiveButton.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  documentId: string;
}>();

const router = useRouter()
const { formatExpiryDate } = useDocument()

const handleDocumentArchived = () => {
  router.replace('/home')
}

const isLoading = ref(false)
const userDocument = ref<Document | null>(null)

onMounted(async () => {
  const id = parseInt(props.documentId)

  isLoading.value = true

  try {
    const response = await documentsClient.getDocument(id)
    userDocument.value = response.data.data
  } catch (e) {
    // TODO: Handle the error properly
    console.log('----> e', e)
  }

  isLoading.value = false
})
</script>
