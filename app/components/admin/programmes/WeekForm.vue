<script setup>
const props = defineProps({
  week: {
    type: Object,
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

const form = ref({
  numero: '',
})

watch(
  () => props.week,
  (value) => {
    form.value = {
      numero: value?.numero ?? '',
    }
  },
  {
    immediate: true,
  }
)

const submitForm = () => {
  emit('submit', {
    numero: Number(form.value.numero),
  })
}
</script>

<template>
  <form
    class="week-form"
    @submit.prevent="submitForm"
  >

    <label>
      Numéro de semaine

      <input
        v-model="form.numero"
        type="number"
        min="1"
        required
      >
    </label>

    <div class="week-form__actions">
      <button type="submit" :disabled="saving">
        {{ saving ? 'Enregistrement...' : week ? 'Enregistrer' : 'Ajouter' }}
      </button>

      <button
        type="button"
        class="button-secondary"
        :disabled="saving"
        @click="emit('cancel')"
      >
        Annuler
      </button>
    </div>
  </form>
</template>

<style scoped>
.week-form {
  display: flex;
  flex-direction: column;
  gap: 14px;

  margin-bottom: 14px;
  padding: 16px;

  border-radius: 12px;

  background-color: #f7f8f5;
}

.week-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;
}

.week-form input {
  width: 100%;
  box-sizing: border-box;

  padding: 10px 11px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
}

.week-form input:focus {
  border-color: #85bc24;
  outline: none;
}

.week-form__actions {
  display: flex;
  gap: 10px;
}

.week-form__actions button {
  padding: 9px 14px;

  border: 0;
  border-radius: 8px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.week-form__actions .button-secondary {
  background-color: #eef1f2;
  color: #022c4d;
}

.week-form__actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
