export const usePrograms = () => {
  const auth = useAdminAuth()

  const saisons = useState('programs', () => [])
  const loading = useState('programsLoading', () => false)
  const saving = useState('programsSaving', () => false)
  const errorMessage = useState('programsError', () => '')

  const createProgramId = (slug) => {
    return `saison-${slug}`
  }

  const getSaisons = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
      saisons.value = await $fetch('/api/saisons')
    }
    catch (error) {
      errorMessage.value =
        error?.data?.statusMessage
        || error?.message
        || 'Impossible de récupérer les programmes'
    }
    finally {
      loading.value = false
    }
  }

  const addSaison = async (saison) => {
    return performMutation(() => $fetch('/api/admin/saisons', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${auth.token.value}`,
      },

      body: {
        id: createProgramId(saison.slug),
        label: saison.label,
        slug: saison.slug,
      },
    }))
  }

  const updateSaison = async (saisonId, saison) => {
    return performMutation(() => $fetch(
      `/api/admin/saisons/${saisonId}`,
      {
        method: 'PATCH',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },

        body: saison,
      }
    ))
  }

  const deleteSaison = async (saisonId) => {
    return performMutation(() => $fetch(
      `/api/admin/saisons/${saisonId}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    ))
  }

  const addWeek = async (saisonId, week) => {
    const weekId = `${saisonId}-semaine${week.numero}`

    return performMutation(() => $fetch('/api/admin/semaines', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${auth.token.value}`,
      },

      body: {
        id: weekId,
        saisonId,
        numero: Number(week.numero),
      },
    }))
  }

  const updateWeek = async (weekId, saisonId, week) => {
    return performMutation(() => $fetch(
      `/api/admin/semaines/${weekId}`,
      {
        method: 'PATCH',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },

        body: {
          saisonId,
          numero: Number(week.numero),
        },
      }
    ))
  }

  const deleteWeek = async (weekId) => {
    return performMutation(() => $fetch(
      `/api/admin/semaines/${weekId}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    ))
  }

  const addSession = async (weekId, session) => {
    return performMutation(() => $fetch('/api/admin/sessions', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${auth.token.value}`,
      },

      body: {
        semaineId: weekId,
        label: session.label,
        ordre: Number(session.ordre),
      },
    }))
  }

  const updateSession = async (sessionId, weekId, session) => {
    return performMutation(() => $fetch(
      `/api/admin/sessions/${sessionId}`,
      {
        method: 'PATCH',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },

        body: {
          semaineId: weekId,
          label: session.label,
          ordre: Number(session.ordre),
        },
      }
    ))
  }

  const deleteSession = async (sessionId) => {
    return performMutation(() => $fetch(
      `/api/admin/sessions/${sessionId}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    ))
  }

  const performMutation = async (mutation) => {
    // Toutes les mutations CMS partagent le même état : le formulaire se ferme
    // seulement si cette méthode renvoie true et conserve ses valeurs en erreur.
    saving.value = true
    errorMessage.value = ''

    try {
      await mutation()
      await getSaisons()

      return true
    }
    catch (error) {
      errorMessage.value = error?.data?.statusMessage
        || error?.message
        || 'Impossible d’enregistrer les modifications'

      return false
    }
    finally {
      saving.value = false
    }
  }

  const addExercise = async (sessionId, exercise) => {
    return performMutation(() => $fetch('/api/admin/exercices', {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${auth.token.value}`,
      },

      body: {
        sessionId,
        type: exercise.type,
        dureeMinutes: Number(exercise.dureeMinutes),
        ordre: Number(exercise.ordre),
      },
    }))
  }

  const updateExercise = async (exerciseId, sessionId, exercise) => {
    return performMutation(() => $fetch(
      `/api/admin/exercices/${exerciseId}`,
      {
        method: 'PATCH',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },

        body: {
          sessionId,
          type: exercise.type,
          dureeMinutes: Number(exercise.dureeMinutes),
          ordre: Number(exercise.ordre),
        },
      }
    ))
  }

  const deleteExercise = async (exerciseId) => {
    return performMutation(() => $fetch(
      `/api/admin/exercices/${exerciseId}`,
      {
        method: 'DELETE',

        headers: {
          Authorization: `Bearer ${auth.token.value}`,
        },
      }
    ))
  }

  return {
    saisons,
    loading,
    saving,
    errorMessage,

    getSaisons,

    addSaison,
    updateSaison,
    deleteSaison,

    addWeek,
    updateWeek,
    deleteWeek,

    addSession,
    updateSession,
    deleteSession,

    addExercise,
    updateExercise,
    deleteExercise,
  }
}
