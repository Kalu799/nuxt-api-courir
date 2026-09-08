<script setup>
const props = defineProps({
  session: {
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
  label: '',
  ordre: '',
})

watch(
  () => props.session,
  (value) => {
    form.value = {
      label: value?.label ?? '',
      ordre: value?.ordre ?? '',
    }
  },
  {
    immediate: true,
  }
)

const submitForm = () => {
  emit('submit', {
    label: form.value.label,
    ordre: Number(form.value.ordre),
  })
}
</script>

<template>
  <form
    class="session-form"
    @submit.prevent="submitForm"
  >
    <label>
      Nom de la session

      <input
        v-model="form.label"
        type="text"
        placeholder="Ex : Jour 1"
        required
      >
    </label>

    <label>
      Ordre

      <input
        v-model="form.ordre"
        type="number"
        min="1"
        required
      >
    </label>

    <div class="session-form__actions">
      <button type="submit" :disabled="saving">
        {{ saving ? 'Enregistrement...' : session ? 'Enregistrer' : 'Ajouter' }}
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
.session-form {
  display: flex;
  flex-direction: column;
  gap: 14px;

  margin-bottom: 12px;
  padding: 16px;

  border-radius: 10px;

  background-color: #ffffff;
}

.session-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;
}

.session-form input {
  width: 100%;
  box-sizing: border-box;

  padding: 10px 11px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  font: inherit;
}

.session-form input:focus {
  border-color: #85bc24;
  outline: none;
}

.session-form__actions {
  display: flex;
  gap: 10px;
}

.session-form__actions button {
  padding: 9px 14px;

  border: 0;
  border-radius: 8px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.session-form__actions .button-secondary {
  background-color: #eef1f2;
  color: #022c4d;
}

.session-form__actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
