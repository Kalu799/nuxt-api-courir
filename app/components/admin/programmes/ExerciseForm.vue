<script setup>
const props = defineProps({
  exercise: {
    type: Object,
    default: null,
  },
  initialOrder: {
    type: Number,
    default: null,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'submit',
  'cancel',
])

const exerciseTypes = [
  { value: 'echauffement', label: 'Échauffement' },
  { value: 'trotte', label: 'Trotte' },
  { value: 'marche', label: 'Marche' },
  { value: 'etirement', label: 'Étirement' },
  { value: 'sprint', label: 'Sprint' },
  { value: 'deboule', label: 'Déboulé' },
  { value: 'cours', label: 'Course' },
]

const form = ref({
  type: 'echauffement',
  dureeMinutes: '',
  ordre: '',
})

watch(
  () => props.exercise,
  (value) => {
    form.value = {
      type: value?.type ?? 'echauffement',
      dureeMinutes: value?.dureeMinutes ?? '',
      ordre: value?.ordre ?? props.initialOrder ?? '',
    }
  },
  { immediate: true }
)

const submitForm = () => {
  emit('submit', {
    type: form.value.type,
    dureeMinutes: Number(form.value.dureeMinutes),
    ordre: Number(form.value.ordre),
  })
}
</script>

<template>
  <form class="exercise-form" @submit.prevent="submitForm">
    <label>
      Type d'exercice

      <select v-model="form.type" required>
        <option v-for="exerciseType in exerciseTypes" :key="exerciseType.value" :value="exerciseType.value">
          {{ exerciseType.label }}
        </option>
      </select>
    </label>

    <label>
      Durée (minutes)

      <input v-model="form.dureeMinutes" type="number" min="0.1" step="0.1" required>
    </label>

    <label>
      Ordre

      <input v-model="form.ordre" type="number" min="1" step="1" required>
    </label>

    <div class="exercise-form__actions">
      <button type="submit" :disabled="saving">
        {{ saving ? 'Enregistrement...' : exercise ? 'Enregistrer' : 'Ajouter' }}
      </button>

      <button type="button" class="button-secondary" :disabled="saving" @click="emit('cancel')">
        Annuler
      </button>
    </div>
  </form>
</template>

<style scoped>
.exercise-form {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) minmax(120px, 0.7fr) minmax(90px, 0.45fr);
  gap: 12px;

  margin: 10px 0;
  padding: 14px;

  border-radius: 9px;

  background-color: #f7f8f5;
}

.exercise-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #022c4d;

  font-size: 0.85rem;
  font-weight: 700;
}

.exercise-form input,
.exercise-form select {
  width: 100%;
  box-sizing: border-box;

  padding: 9px 10px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
}

.exercise-form input:focus,
.exercise-form select:focus {
  border-color: #85bc24;
  outline: none;
}

.exercise-form__actions {
  display: flex;
  grid-column: 1 / -1;
  gap: 10px;
}

.exercise-form__actions button {
  padding: 8px 12px;

  border: 0;
  border-radius: 8px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.exercise-form__actions .button-secondary {
  background-color: #eef1f2;
  color: #022c4d;
}

.exercise-form__actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}

@media (max-width: 560px) {
  .exercise-form {
    grid-template-columns: 1fr;
  }
}
</style>
