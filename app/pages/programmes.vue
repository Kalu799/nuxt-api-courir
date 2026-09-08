<script setup>
definePageMeta({
  middleware: 'admin',
})

const {
  saisons,
  loading,
  saving,
  errorMessage,
  getSaisons,
  addSaison,
  updateSaison,
  deleteSaison,
} = usePrograms()

const showAddForm = ref(false)
const editingSaison = ref(null)

const handleAdd = async (data) => {
  const saved = await addSaison(data)

  if (saved) showAddForm.value = false
}

const handleEdit = (saison) => {
  editingSaison.value = saison
}

const handleUpdate = async (data) => {
  const saved = await updateSaison(
    editingSaison.value.id,
    {
      label: data.label,
      slug: data.slug,
    }
  )

  if (saved) editingSaison.value = null
}

const handleDelete = async (saison) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le programme "${saison.label}" ?`
  )

  if (!confirmed) return

  await deleteSaison(saison.id)
}

onMounted(() => {
  getSaisons()
})
</script>

<template>
  <section class="programmes-screen">
    <div class="programmes-container">
      <h1>
        Programmes
      </h1>

      <button type="button" class="add-button" :disabled="saving" @click="showAddForm = !showAddForm">
        + Ajouter un programme
      </button>

      <AdminProgrammesProgramForm v-if="showAddForm" class="main-form" :saving="saving" @submit="handleAdd"
        @cancel="showAddForm = false" />

      <p v-if="loading">
        Chargement...
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div v-for="saison in saisons" :key="saison.id">
        <AdminProgrammesProgramCard :saison="saison" @edit="handleEdit" @delete="handleDelete" />

        <AdminProgrammesProgramForm v-if="editingSaison?.id === saison.id" :saison="editingSaison" class="edit-form"
          :saving="saving" @submit="handleUpdate" @cancel="editingSaison = null" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 20px;
  padding: 10px 14px;

  border: 0;
  border-radius: 9px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.15s ease,
    transform 0.15s ease;
}

.add-button:hover {
  background-color: #e7eedf;
}

.add-button:active {
  transform: scale(0.98);
}

.add-button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
