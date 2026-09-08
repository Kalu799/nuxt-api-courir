<script setup>
definePageMeta({
  middleware: 'admin',
})

const auth = useAdminAuth()

const users = ref([])
const loading = ref(true)
const errorMessage = ref('')

const getUsers = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    users.value = await $fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${auth.token.value}`,
      },
    })
  }
  catch (error) {
    errorMessage.value =
      error?.data?.statusMessage
      || error?.message
      || 'Impossible de récupérer les coureurs'
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <section class="users-screen">
    <div class="users-container">
      <h1>Coureurs</h1>

      <p v-if="loading">
        Chargement...
      </p>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <AdminUserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
  </section>
</template>

<style scoped>
.users-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.users-container {
  width: 100%;
  max-width: 900px;

  margin: 0 auto;
}

.users-container h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}
</style>