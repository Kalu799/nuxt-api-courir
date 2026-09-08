<script setup>
const auth = useAdminAuth()

const login = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const submitLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    await auth.login(login.value, password.value)

    await navigateTo('/')
  }
  catch (error) {
    errorMessage.value =
      error?.data?.statusMessage
      || error?.message
      || 'Impossible de se connecter'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-screen">
    <div class="auth-card">
      <h1>Administration</h1>

      <form
        class="auth-form"
        @submit.prevent="submitLogin"
      >
        <label class="auth-field">
          Identifiant

          <input
            v-model="login"
            type="text"
            required
          >
        </label>

        <label class="auth-field">
          Mot de passe

          <input
            v-model="password"
            type="password"
            required
          >
        </label>

        <p
          v-if="errorMessage"
          class="auth-error"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.auth-screen {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  padding: 20px;

  box-sizing: border-box;

  background-color: #f7f8f5;
}

.auth-card {
  width: 100%;
  max-width: 420px;

  padding: 28px;

  box-sizing: border-box;

  border-radius: 18px;

  background-color: #ffffff;
  color: #022c4d;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 6%),
    0 12px 32px rgb(2 44 77 / 8%);
}

.auth-card h1 {
  margin: 0 0 24px;

  text-align: center;

  font-size: 1.8rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  font-size: 0.9rem;
  font-weight: 700;
}

.auth-field input {
  padding: 11px 12px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  color: #022c4d;

  font: inherit;
}

.auth-field input:focus {
  border-color: #85bc24;
  outline: none;
}

.auth-form button {
  padding: 12px 16px;

  border: 0;
  border-radius: 10px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.auth-form button:disabled {
  opacity: 0.6;
  cursor: default;
}

.auth-error {
  margin: 0;

  color: #b43b3b;

  font-size: 0.9rem;
  font-weight: 600;
}
</style>