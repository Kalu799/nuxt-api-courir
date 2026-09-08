<script setup>
definePageMeta({
  middleware: 'admin',
})

const route = useRoute()
const auth = useAdminAuth()

const user = ref(null)
const loading = ref(true)
const deleting = ref(false)
const errorMessage = ref('')

const getUser = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    user.value = await $fetch(
      `/api/admin/users/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    )
  }
  catch (error) {
    errorMessage.value =
      error?.data?.statusMessage
      || error?.message
      || 'Impossible de récupérer le coureur'
  }
  finally {
    loading.value = false
  }
}

const deleteUser = async () => {
  if (!user.value || deleting.value) return

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer l'utilisateur "${user.value.login}" ?`
  )

  if (!confirmed) return

  errorMessage.value = ''
  deleting.value = true

  try {
    await $fetch(
      `/api/admin/users/${user.value.id}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    )

    await navigateTo('/users')
  }
  catch (error) {
    errorMessage.value =
      error?.data?.statusMessage
      || error?.message
      || 'Impossible de supprimer ce coureur'
  }
  finally {
    deleting.value = false
  }
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <section class="user-detail-screen">
    <p v-if="loading">
      Chargement...
    </p>

    <p
      v-if="errorMessage"
      class="error-message"
    >
      {{ errorMessage }}
    </p>

    <AdminUserDetailCard
      v-if="user"
      :user="user"
      :deleting="deleting"
      @delete="deleteUser"
    />
  </section>
</template>

<style scoped>
.user-detail-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
}

.error-message {
  width: 100%;
  max-width: 600px;

  margin: 0 auto 20px;

  color: #b43b3b;

  font-weight: 600;
}
</style>
