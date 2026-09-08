<script setup>
definePageMeta({
  middleware: 'admin',
})
</script>

<template>
  <section class="dashboard-screen">
    <div class="dashboard-container">
      <h1>
        Dashboard
      </h1>

      <div class="dashboard-grid">
<AdminDashboardCard
  to="/programmes"
  title="Programmes"
  description="Gérer les saisons, semaines, sessions et exercices."
/>

<AdminDashboardCard
  to="/users"
  title="Coureurs"
  description="Voir les utilisateurs inscrits et leur progression."
/>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-screen {
  min-height: 100%;
  padding: 40px 16px 56px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.dashboard-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
}

.dashboard-container h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

@media (min-width: 700px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>