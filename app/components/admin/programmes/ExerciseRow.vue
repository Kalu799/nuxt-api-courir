<script setup>
defineProps({
  exercise: {
    type: Object,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'edit',
  'delete',
])

const exerciseLabels = {
  echauffement: 'Échauffement',
  trotte: 'Trotte',
  marche: 'Marche',
  etirement: 'Étirement',
  sprint: 'Sprint',
  deboule: 'Déboulé',
  cours: 'Course',
}

const formatDuration = (duration) => {
  return `${Number(duration).toLocaleString('fr-BE')} min`
}
</script>

<template>
  <div class="exercise-row">
    <span class="exercise-row__order">{{ exercise.ordre }}</span>

    <span class="exercise-row__type">
      {{ exerciseLabels[exercise.type] || exercise.type }}
    </span>

    <span class="exercise-row__duration">
      {{ formatDuration(exercise.dureeMinutes) }}
    </span>

    <div class="exercise-row__actions">
      <button type="button" class="action-button" :disabled="saving" @click="emit('edit', exercise)">
        Modifier
      </button>

      <button type="button" class="action-button action-button--delete" :disabled="saving" @click="emit('delete', exercise)">
        Supprimer
      </button>
    </div>
  </div>
</template>

<style scoped>
.exercise-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 10px;

  padding: 10px 0;

  border-top: 1px solid #e8edef;

  color: #022c4d;
}

.exercise-row__order {
  display: grid;
  place-items: center;

  width: 24px;
  height: 24px;

  border-radius: 50%;

  background-color: #f2f6ed;

  font-size: 0.78rem;
  font-weight: 800;
}

.exercise-row__type {
  font-size: 0.9rem;
  font-weight: 700;
}

.exercise-row__duration {
  color: #70808b;

  font-size: 0.85rem;
  white-space: nowrap;
}

.exercise-row__actions {
  display: flex;
  gap: 7px;
}

.action-button {
  padding: 6px 9px;

  border: 0;
  border-radius: 7px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.76rem;
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

@media (max-width: 560px) {
  .exercise-row {
    grid-template-columns: 28px minmax(0, 1fr) auto;
  }

  .exercise-row__actions {
    grid-column: 2 / -1;
  }
}
</style>
