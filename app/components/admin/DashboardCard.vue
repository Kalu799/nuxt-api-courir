<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="dashboard-card"
  >
    <h2>
      {{ title }}
    </h2>

    <p>
      {{ description }}
    </p>
  </NuxtLink>
</template>

<style scoped>
.dashboard-card {
  display: block;

  padding: 24px;

  border-radius: 16px;

  background-color: #ffffff;
  color: #022c4d;

  text-decoration: none;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 4px 10px rgb(2 44 77 / 7%),
    0 12px 30px rgb(2 44 77 / 9%);
}

.dashboard-card h2 {
  margin: 0 0 10px;

  font-size: 1.25rem;
}

.dashboard-card p {
  margin: 0;

  color: #66757f;

  line-height: 1.5;
}
</style>