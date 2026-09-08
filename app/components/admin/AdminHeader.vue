<script setup>
const route = useRoute()
const auth = useAdminAuth()

const logout = async () => {
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <header class="admin-header">
    <NuxtLink
      v-if="auth.isAuthenticated && route.path !== '/'"
      to="/"
      class="admin-header__back"
    >
      ← Dashboard
    </NuxtLink>

    <h1 class="admin-header__title">
      Admin — Je cours pour ma forme
    </h1>

    <button
      v-if="auth.isAuthenticated"
      class="admin-header__logout"
      type="button"
      @click="logout"
    >
      Se déconnecter
    </button>
  </header>
</template>

<style scoped>
.admin-header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 64px;
  padding: 0 16px;

  border-bottom: 1px solid #e4e8ea;

  background-color: #ffffff;
  color: #022c4d;
}

.admin-header__title {
  margin: 0;

  font-size: 1.05rem;
  font-weight: 800;
  text-align: center;
}

.admin-header__back,
.admin-header__logout {
  position: absolute;
  top: 50%;

  transform: translateY(-50%);
}

.admin-header__back {
  left: 16px;

  padding: 8px 11px;

  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font-size: 0.85rem;
  font-weight: 700;

  text-decoration: none;
}

.admin-header__logout {
  right: 16px;

  padding: 8px 11px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;
}

@media (max-width: 650px) {
  .admin-header {
    min-height: 80px;
  }

  .admin-header__title {
    max-width: 180px;

    font-size: 0.9rem;
  }

  .admin-header__back,
  .admin-header__logout {
    font-size: 0.75rem;
  }
}
</style>