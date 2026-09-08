<script setup>

const emit = defineEmits([
  'edit',
  'delete',
])

const props = defineProps({
  semaine: {
    type: Object,
    required: true,
  },
})

const {
  addSession,
  updateSession,
  deleteSession,
  saving,
} = usePrograms()

const showAddSession = ref(false)
const editingSession = ref(null)

const handleAddSession = async (data) => {
  const saved = await addSession(props.semaine.id, data)

  if (saved) showAddSession.value = false
}

const handleEditSession = (session) => {
  editingSession.value = session
}

const handleUpdateSession = async (data) => {
  const saved = await updateSession(
    editingSession.value.id,
    props.semaine.id,
    data
  )

  if (saved) editingSession.value = null
}

const handleDeleteSession = async (session) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la session "${session.label}" ?`
  )

  if (!confirmed) return

  await deleteSession(session.id)
}
</script>

<template>
  <article class="week-card">
    <details>
      <summary class="week-summary">
        <span>
          Semaine {{ semaine.numero }}
        </span>

        <div class="week-summary__right">
          <span class="week-summary__info">
            {{ semaine.jours.length }} sessions
          </span>

          <div class="week-summary__actions">
            <button type="button" class="action-button" :disabled="saving" @click.stop.prevent="emit('edit', semaine)">
              Modifier
            </button>

            <button type="button" class="action-button action-button--delete" :disabled="saving"
              @click.stop.prevent="emit('delete', semaine)">
              Supprimer
            </button>
          </div>
        </div>
      </summary>

      <div class="week-content">
        <button type="button" class="add-session-button" :disabled="saving" @click="showAddSession = !showAddSession">
          + Ajouter une session
        </button>

        <AdminProgrammesSessionForm v-if="showAddSession" :saving="saving" @submit="handleAddSession" @cancel="showAddSession = false" />

        <div v-for="session in semaine.jours" :key="session.id">
          <AdminProgrammesSessionCard :session="session" @edit="handleEditSession" @delete="handleDeleteSession" />

          <AdminProgrammesSessionForm v-if="editingSession?.id === session.id" :session="editingSession" :saving="saving"
            class="edit-session-form" @submit="handleUpdateSession" @cancel="editingSession = null" />
        </div>
      </div>
    </details>
  </article>
</template>

<style scoped>
.week-card {
  margin-top: 10px;

  border-radius: 12px;

  background-color: #f7f8f5;

  overflow: hidden;
}

summary {
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.week-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  box-sizing: border-box;

  padding: 15px 16px;

  color: #022c4d;

  font-size: 1rem;
  font-weight: 700;
}

.week-summary::before {
  content: '›';

  display: inline-block;

  flex-shrink: 0;

  font-size: 1.2rem;
  font-weight: 800;

  transition: transform 0.2s ease;
}

details[open]>.week-summary::before {
  transform: rotate(90deg);
}

.week-summary:hover {
  background-color: #eef2ea;
}

.week-summary__right {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;
}

.week-summary__info {
  color: #70808b;

  font-size: 0.85rem;
  font-weight: 500;

  white-space: nowrap;
}

.week-summary__actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 7px 11px;

  border: 0;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;

  cursor: pointer;
}

.action-button--delete {
  background-color: #fff1f1;
  color: #b43b3b;
}

.action-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.week-content {
  padding: 0 12px 12px;
}

.add-session-button {
  margin: 10px 0 14px;
  padding: 9px 13px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;
}

.add-session-button:hover {
  background-color: #e7eedf;
}

.add-session-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.edit-session-form {
  margin-top: 8px;
}
</style>
