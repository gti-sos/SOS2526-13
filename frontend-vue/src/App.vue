<script setup>
import { ref, onMounted } from 'vue';

let API = '/api/v2/conflict-stats';

if (location.hostname === 'localhost') {
  API = 'http://localhost:3000' + API;
}

// STATE
const data = ref([]);
const mensaje = ref('');

// GET
async function getData() {
  const res = await fetch(API);
  data.value = await res.json();
  updateSelectors();
}

// LOAD INITIAL DATA
async function loadData() {
  const res = await fetch(API + '/loadInitialData');

  if (res.status === 201) mensaje.value = 'Datos cargados';
  else if (res.status === 409) mensaje.value = 'Ya estaban cargados';
  else mensaje.value = `Error ${res.status}`;

  await getData();
}

// DELETE ALL
async function deleteData() {
  await fetch(API, { method: 'DELETE' });
  mensaje.value = 'Datos borrados';
  await getData();
}

// DELETE ONE
async function deleteRecurso(location, year) {
  await fetch(`${API}/${location}/${year}`, { method: 'DELETE' });
  mensaje.value = 'Recurso borrado';
  await getData();
}

// INSERT
const newLocation = ref('');
const newYear = ref('');
const newIntensity = ref('');
const newType = ref('');
const newPrecision = ref('');
const showNew = ref(false);

function abrirInsertar() {
  showNew.value = true;
  newLocation.value = '';
  newYear.value = '';
  newIntensity.value = '';
  newType.value = '';
  newPrecision.value = '';
}

async function insertConflict() {
  if (!newLocation.value || !newYear.value || !newIntensity.value || !newType.value || !newPrecision.value) {
    mensaje.value = 'Faltan campos';
    return;
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: newLocation.value,
      year: Number(newYear.value),
      intensity_level: Number(newIntensity.value),
      conflict_type: Number(newType.value),
      start_precision: Number(newPrecision.value)
    })
  });

  if (res.status === 201) {
    mensaje.value = 'Insertado';
    showNew.value = false;
    await getData();
  } else if (res.status === 409) {
    mensaje.value = 'Ya existe';
  } else {
    mensaje.value = `Error ${res.status}`;
  }
}

// FILTROS
const filterLocation = ref('');
const filterYear = ref('');
const filterIntensity = ref('');
const filterType = ref('');
const filterPrecision = ref('');

const locations = ref([]);
const years = ref([]);

function updateSelectors() {
  locations.value = [...new Set(data.value.map(d => d.location))];
  years.value = [...new Set(data.value.map(d => d.year))];
}

// SEARCH
async function searchData() {
  const params = new URLSearchParams();

  if (filterLocation.value) params.append('location', filterLocation.value);
  if (filterYear.value) params.append('year', filterYear.value);
  if (filterIntensity.value) params.append('intensity_level', filterIntensity.value);
  if (filterType.value) params.append('conflict_type', filterType.value);
  if (filterPrecision.value) params.append('start_precision', filterPrecision.value);

  const res = await fetch(API + '?' + params.toString());
  data.value = await res.json();
}

// RESET
function resetFilters() {
  filterLocation.value = '';
  filterYear.value = '';
  filterIntensity.value = '';
  filterType.value = '';
  filterPrecision.value = '';
  getData();
}

onMounted(getData);
</script>

<template>
  <h1>Conflict Stats</h1>

  <fieldset style="display:inline-block">
    <legend>Buscador</legend>

    <select v-model="filterLocation">
      <option value="">Todas</option>
      <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
    </select>

    <select v-model="filterYear">
      <option value="">Todos</option>
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>

    <input v-model="filterIntensity" type="number" placeholder="Intensity" />
    <input v-model="filterType" type="number" placeholder="Type" />
    <input v-model="filterPrecision" type="number" placeholder="Precision" />

    <br /><br />
    <button @click="searchData">Buscar</button>
    <button @click="resetFilters">Reset</button>
  </fieldset>

  <br /><br />

  <button @click="loadData">Cargar datos iniciales</button>

  <table border="1">
    <thead>
      <tr>
        <th>Location</th>
        <th>Year</th>
        <th>Intensity</th>
        <th>Type</th>
        <th>Precision</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="c in data" :key="c.location + c.year">
        <td>{{ c.location }}</td>
        <td>{{ c.year }}</td>
        <td>{{ c.intensity_level }}</td>
        <td>{{ c.conflict_type }}</td>
        <td>{{ c.start_precision }}</td>
        <td>
          <button @click="deleteRecurso(c.location, c.year)">Borrar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <button @click="abrirInsertar">Insertar</button>
  <button @click="deleteData">Borrar todo</button>

  <div v-if="showNew">
    <h2>Insertar</h2>

    <input v-model="newLocation" placeholder="Location" />
    <input v-model="newYear" type="number" placeholder="Year" />
    <input v-model="newIntensity" type="number" placeholder="Intensity" />
    <input v-model="newType" type="number" placeholder="Type" />
    <input v-model="newPrecision" type="number" placeholder="Precision" />

    <br /><br />
    <button @click="showNew = false">Cancelar</button>
    <button @click="insertConflict">Insertar</button>
  </div>

  <p><strong>{{ mensaje }}</strong></p>
</template>