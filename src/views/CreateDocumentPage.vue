<template>
  <main>
    <div class="space-y-16 py-16 xl:space-y-20">
      <div>
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold leading-6 text-gray-900">
                Upload New Document
              </h1>
            </div>
          </div>
          <div class="mt-8">
            <form @submit.prevent="handleUploadDocument">
              <div class="mb-4">
                <label class="block mb-1 font-medium">PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  @change="handleFileInput"
                  class="block border px-2 py-1 rounded w-full"
                  required
                />
              </div>

              <div class="mb-4">
                <label class="block mb-1 font-medium">Expires At (optional)</label>
                <!-- TODO: Use a proper date picker -->
                <input
                  type="date"
                  v-model="expiresAt"
                  class="w-full border px-2 py-1 rounded"
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ loading ? 'Uploading...' : 'Upload' }}
              </button>

              <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
              <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { documentsClient } from '../client.ts'

const file = ref<File | null>(null)
const expiresAt = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const handleUploadDocument = async () => {
  if (!file.value) {
    return
  }

  const formData = new FormData()
  formData.append('document', file.value)
  if (expiresAt.value) {
    formData.append('expires_at', expiresAt.value)
  }

  loading.value = true
  message.value = ''
  error.value = ''

  // TODO: Improve the success/fail message
  try {
    await documentsClient.createDocument(formData)
    message.value = 'Upload successful!'
    file.value = null
    expiresAt.value = ''
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Could not process your data. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
