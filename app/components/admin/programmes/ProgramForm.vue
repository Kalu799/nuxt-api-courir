<script setup>
const props = defineProps({
  saison: {
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
  slug: '',
})

watch(
  () => props.saison,
  (value) => {
    if (value) {
      form.value = {
        label: value.label,
        slug: value.slug,
      }
    }
    else {
      form.value = {
        label: '',
        slug: '',
      }
    }
  },
  {
    immediate: true,
  }
)

const submitForm = () => {
  emit('submit', {
    label: form.value.label,
    slug: form.value.slug,
  })
}
</script>

<template>
  <form
    class="program-form"
    @submit.prevent="submitForm"
  >

    <label>
      Nom du programme

      <input
        v-model="form.label"
        type="text"
        placeholder="Ex : 15 kms"
        required
      >
    </label>

    <label>
      Slug

      <input
        v-model="form.slug"
        type="text"
        placeholder="Ex : 15-kms"
        required
      >
    </label>

    <div class="program-form__actions">
      <button type="submit" :disabled="saving">
        {{ saving ? 'Enregistrement...' : saison ? 'Enregistrer' : 'Ajouter' }}
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
.program-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 20px;

  border-radius: 14px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);
}

.program-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;
}

.program-form input {
  width: 100%;
  box-sizing: border-box;

  padding: 11px 12px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
}

.program-form input:focus {
  border-color: #85bc24;
  outline: none;
}

.program-form__actions {
  display: flex;
  gap: 10px;
}

.program-form__actions button {
  padding: 10px 15px;

  border: 0;
  border-radius: 8px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.program-form__actions .button-secondary {
  background-color: #eef1f2;
  color: #022c4d;
}

.program-form__actions button:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
