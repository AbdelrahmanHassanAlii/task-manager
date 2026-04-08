const DEFAULT_LOCAL_API_URL = 'http://localhost:4000/tasks'
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_LOCAL_API_URL

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function fetchTasks() {
  return request(API_URL)
}

export function createTask(task) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask({ id, updates }) {
  return request(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteTask(id) {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}
