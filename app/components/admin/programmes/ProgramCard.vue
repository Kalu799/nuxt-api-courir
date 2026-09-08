<script setup>
const props = defineProps({
  saison: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'edit',
  'delete',
])

const {
  addWeek,
  updateWeek,
  deleteWeek,
  saving,
} = usePrograms()

const showAddWeek = ref(false)
const editingWeek = ref(null)

const handleAddWeek = async (data) => {
  const saved = await addWeek(props.saison.id, data)

  if (saved) showAddWeek.value = false
}

const handleEditWeek = (semaine) => {
  editingWeek.value = semaine
}

const handleUpdateWeek = async (data) => {
  const saved = await updateWeek(
    editingWeek.value.id,
    props.saison.id,
    data
  )

  if (saved) editingWeek.value = null
}

const handleDeleteWeek = async (semaine) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la semaine ${semaine.numero} ?`
  )

  if (!confirmed) return

  await deleteWeek(semaine.id)
}
</script>

<template>
  <article class="program-card">
    <details>
      <summary class="program-summary">
        <span class="program-summary__label">
          {{ saison.label }}
        </span>

        <div class="program-summary__right">
          <span class="program-summary__info">
            {{ saison.semaines.length }} semaines
          </span>

          <div class="program-summary__actions">
            <button type="button" class="action-button" :disabled="saving" @click.stop.prevent="emit('edit', saison)">
              Modifier
            </button>

            <button type="button" class="action-button action-button--delete" :disabled="saving"
              @click.stop.prevent="emit('delete', saison)">
              Supprimer
            </button>
          </div>
        </div>
      </summary>

      <div class="program-content">
        <button type="button" class="add-week-button" :disabled="saving" @click="showAddWeek = !showAddWeek">
          + Ajouter une semaine
        </button>

        <AdminProgrammesWeekForm v-if="showAddWeek" :saving="saving" @submit="handleAddWeek" @cancel="showAddWeek = false" />

        <div v-for="semaine in saison.semaines" :key="semaine.id">
          <AdminProgrammesWeekCard :semaine="semaine" @edit="handleEditWeek" @delete="handleDeleteWeek" />

          <AdminProgrammesWeekForm v-if="editingWeek?.id === semaine.id" :week="editingWeek" :saving="saving" class="edit-week-form"
            @submit="handleUpdateWeek" @cancel="editingWeek = null" />
        </div>
      </div>
    </details>
  </article>
</template>

<style scoped>
.program-card {
  margin-bottom: 16px;

  border-radius: 16px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);

  overflow: hidden;
}

summary {
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.program-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  box-sizing: border-box;

  padding: 20px 22px;

  color: #022c4d;

  font-size: 1.2rem;
  font-weight: 800;
}

.program-summary::before {
  content: '›';

  display: inline-block;

  flex-shrink: 0;

  font-size: 1.3rem;
  font-weight: 800;

  transition: transform 0.2s ease;
}

details[open]>.program-summary::before {
  transform: rotate(90deg);
}

.program-summary:hover {
  background-color: #fafbf8;
}

.program-summary__right {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;
}

.program-summary__info {
  color: #70808b;

  font-size: 0.85rem;
  font-weight: 500;

  white-space: nowrap;
}

.program-summary__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button {
  flex-shrink: 0;

  padding: 7px 11px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;

  cursor: pointer;
}

.action-button:hover {
  background-color: #e7eedf;
}

.action-button--delete {
  background-color: #fff1f1;
  color: #b43b3b;
}

.action-button--delete:hover {
  background-color: #ffe2e2;
}

.action-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.program-content {
  padding: 0 18px 18px;
}

.add-week-button {
  margin: 10px 0 14px;
  padding: 9px 13px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;
}

.add-week-button:hover {
  background-color: #e7eedf;
}

.add-week-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.edit-week-form {
  margin-top: 8px;
}
</style>
