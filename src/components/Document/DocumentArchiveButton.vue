<template>
  <button
    :disabled="isLoading"
    type="button"
    class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 disabled:cursor-not-allowed disabled:opacity-50"
    @click="handleButtonClicked"
  >
    Archive
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Document, documentsClient } from '../../client.ts'

const props = defineProps<{
  document: Document;
  disabled?: boolean;
}>()
const emit = defineEmits<{
  archived: [Document];
}>()

const handleButtonClicked = async () => {
  if (props.disabled) {
    return
  }

  isLoading.value = true

  try {
    await documentsClient.archiveDocument(props.document.id)

    emit('archived', props.document)

    alert('Document archived.')
  } catch (e) {
    console.log('-------> e', e)
  }

  isLoading.value = false
}

const isLoading = ref(false)
</script>
