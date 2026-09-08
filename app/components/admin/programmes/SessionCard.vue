<script setup>
const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'edit',
  'delete',
])

const {
  addExercise,
  updateExercise,
  deleteExercise,
  saving,
} = usePrograms()

const showAddExercise = ref(false)
const editingExercise = ref(null)

const exercises = computed(() => props.session.exercices || [])

const nextExerciseOrder = computed(() => {
  return exercises.value.reduce(
    (highestOrder, exercise) => Math.max(highestOrder, Number(exercise.ordre) || 0),
    0
  ) + 1
})

const handleAddExercise = async (data) => {
  const saved = await addExercise(props.session.id, data)

  if (saved) showAddExercise.value = false
}

const handleEditExercise = (exercise) => {
  editingExercise.value = exercise
}

const handleUpdateExercise = async (data) => {
  const saved = await updateExercise(editingExercise.value.id, props.session.id, data)

  if (saved) editingExercise.value = null
}

const handleDeleteExercise = async (exercise) => {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer cet exercice ?'
  )

  if (!confirmed) return

  await deleteExercise(exercise.id)
}
</script>

<template>
  <article class="session-card">
    <details>
      <summary class="session-summary">
        <span>
          {{ session.label }}
        </span>

        <div class="session-summary__right">
          <span class="session-summary__info">
            {{ exercises.length }} exercices
          </span>

          <div class="session-summary__actions">
            <button
              type="button"
              class="action-button"
              :disabled="saving"
              @click.stop.prevent="emit('edit', session)"
            >
              Modifier
            </button>

            <button
              type="button"
              class="action-button action-button--delete"
              :disabled="saving"
              @click.stop.prevent="emit('delete', session)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </summary>

      <div class="session-content">
        <button type="button" class="add-exercise-button" :disabled="saving" @click="showAddExercise = !showAddExercise">
          + Ajouter un exercice
        </button>

        <AdminProgrammesExerciseForm
          v-if="showAddExercise"
          :initial-order="nextExerciseOrder"
          :saving="saving"
          @submit="handleAddExercise"
          @cancel="showAddExercise = false"
        />

        <p v-if="exercises.length === 0" class="empty-exercises">
          Aucun exercice dans cette session.
        </p>

        <ol v-else class="exercise-list">
          <li v-for="exercise in exercises" :key="exercise.id" class="exercise-list__item">
            <AdminProgrammesExerciseRow
              :exercise="exercise"
              :saving="saving"
              @edit="handleEditExercise"
              @delete="handleDeleteExercise"
            />

            <AdminProgrammesExerciseForm
              v-if="editingExercise?.id === exercise.id"
              :exercise="editingExercise"
              :saving="saving"
              @submit="handleUpdateExercise"
              @cancel="editingExercise = null"
            />
          </li>
        </ol>
      </div>
    </details>
  </article>
</template>

<style scoped>
.session-card {
  margin-top: 8px;

  border-radius: 10px;

  background-color: #ffffff;

  overflow: hidden;
}

summary {
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.session-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  box-sizing: border-box;

  padding: 13px 14px;

  color: #022c4d;

  font-size: 0.95rem;
  font-weight: 700;
}

.session-summary::before {
  content: '›';

  font-size: 1.2rem;
  font-weight: 800;

  transition: transform 0.2s ease;
}

details[open] > .session-summary::before {
  transform: rotate(90deg);
}

.session-summary__right {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;
}

.session-summary__info {
  color: #70808b;

  font-size: 0.85rem;
  font-weight: 500;

  white-space: nowrap;
}

.session-summary__actions {
  display: flex;
  gap: 8px;
}

.action-button {
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

.action-button--delete {
  background-color: #fff1f1;
  color: #b43b3b;
}

.action-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.session-content {
  padding: 0 12px 12px;
}

.add-exercise-button {
  margin: 10px 0 6px;
  padding: 8px 11px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;

  cursor: pointer;
}

.add-exercise-button:hover {
  background-color: #e7eedf;
}

.add-exercise-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.empty-exercises {
  margin: 8px 0 2px;

  color: #70808b;

  font-size: 0.88rem;
}

.exercise-list {
  margin: 4px 0 0;
  padding: 0;

  list-style: none;
}

.exercise-list__item {
  margin: 0;
}
</style>
