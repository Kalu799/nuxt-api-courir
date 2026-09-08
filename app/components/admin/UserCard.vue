<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="user-card">
    <div>
      <strong>
        {{ user.login }}
      </strong>

      <p>
        Rôle : {{ user.role }}
      </p>
    </div>

    <NuxtLink
      :to="`/users/${user.id}`"
      class="user-card__link"
    >
      Voir le détail
    </NuxtLink>
  </article>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 14px;
  padding: 18px 20px;

  border-radius: 14px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);
}

.user-card strong {
  display: block;

  margin-bottom: 4px;

  font-size: 1.05rem;
  font-weight: 800;
}

.user-card p {
  margin: 0;

  color: #66757f;

  font-size: 0.9rem;
}

.user-card__link {
  flex-shrink: 0;

  padding: 9px 13px;

  border-radius: 10px;

  background-color: #f2f6ed;
  color: #022c4d;

  font-size: 0.85rem;
  font-weight: 700;

  text-decoration: none;
}
</style>