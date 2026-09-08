<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'delete',
])
</script>

<template>
  <article class="user-detail-card">
    <NuxtLink
      to="/users"
      class="user-detail__back"
    >
      ← Retour aux coureurs
    </NuxtLink>

    <h1>
      {{ user.login }}
    </h1>

    <p>
      Rôle : {{ user.role }}
    </p>

    <p v-if="user.currentSeasonLabel">
      Programme : {{ user.currentSeasonLabel }}
    </p>

    <p v-if="user.currentWeekNumber">
      Semaine {{ user.currentWeekNumber }}
    </p>

    <p v-if="user.currentSessionLabel">
      Prochaine séance : {{ user.currentSessionLabel }}
    </p>

    <p v-if="!user.currentSessionId">
      Aucun programme en cours
    </p>

    <button
      v-if="user.role !== 'admin'"
      type="button"
      class="user-detail__delete"
      :disabled="deleting"
      @click="emit('delete')"
    >
      {{ deleting ? 'Suppression...' : 'Supprimer ce coureur' }}
    </button>
  </article>
</template>

<style scoped>
.user-detail-card {
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;

  margin: 0 auto;
  padding: 28px;

  border-radius: 18px;

  background-color: #ffffff;
  color: #022c4d;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 6%),
    0 12px 32px rgb(2 44 77 / 8%);
}

.user-detail__back {
  display: inline-block;

  margin-bottom: 24px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;

  text-decoration: none;
}

.user-detail__back:hover {
  text-decoration: underline;
}

.user-detail-card h1 {
  margin: 0 0 20px;

  font-size: 1.8rem;
  font-weight: 800;
}

.user-detail-card p {
  margin: 0 0 10px;

  color: #52616c;
}

.user-detail__delete {
  margin-top: 28px;
  padding: 12px 16px;

  border: 1px solid #d95c5c;
  border-radius: 10px;

  background-color: #ffffff;
  color: #b43b3b;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.user-detail__delete:disabled {
  cursor: wait;
  opacity: 0.65;
}
</style>
