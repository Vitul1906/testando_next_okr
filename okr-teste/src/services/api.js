
const API_BASE_URL = 'http://localhost:8080'; 

async function callApi(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`; 
  const options = {
    method,
    headers: {},
  };

  if (data !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    if (typeof data === 'number') {
      options.body = String(data); 
      options.headers['Content-Type'] = 'application/json'; 
    } else {
      options.body = JSON.stringify(data); 
      options.headers['Content-Type'] = 'application/json'; 
    }
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro detalhado do backend:", errorText);
      throw new Error(`Erro na requisição: ${response.status} - ${errorText || 'Sem mensagem de erro do backend'}`);
    }

    if (response.status === 204) {
      return null;
    }

    try {
      return await response.json();
    } catch (e) {
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição (Failed to fetch ou outro):', error);
    throw error; 
  }
}

export const objectiveService = {
  getAll: async () => callApi('/objetivos'),
  getById: async (id) => callApi(`/objetivos/${id}`),
  create: async (objective) => callApi('/objetivos', 'POST', objective),
  update: async (id, objective) => callApi(`/objetivos/${id}`, 'PUT', objective),
  updatePercentage: async (id, percentage) => callApi(`/objetivos/${id}/porcentagem`, 'PUT', percentage),
  delete: async (id) => callApi(`/objetivos/${id}`, 'DELETE'),
};

export const keyResultService = {
  getAll: async () => callApi('/krs'),
  getById: async (id) => callApi(`/krs/${id}`),
  create: async (objectiveId, kr) => callApi(`/krs/${objectiveId}`, 'POST', kr),
  update: async (id, kr) => callApi(`/krs/${id}`, 'PUT', kr),
  updatePercentage: async (id, percentage) => callApi(`/krs/${id}/porcentagem`, 'PUT', percentage),
  delete: async (id) => callApi(`/krs/${id}`, 'DELETE'),
};

export const initiativeService = {
  getAll: async () => callApi('/iniciativas'),
  getById: async (id) => callApi(`/iniciativas/${id}`),
  create: async (krId, initiative) => callApi(`/iniciativas/${krId}`, 'POST', initiative),
  update: async (id, initiative) => callApi(`/iniciativas/${id}`, 'PUT', initiative),
  updatePercentage: async (id, percentage) => callApi(`/iniciativas/${id}/porcentagem`, 'PUT', percentage),
  delete: async (id) => callApi(`/iniciativas/${id}`, 'DELETE'),
};