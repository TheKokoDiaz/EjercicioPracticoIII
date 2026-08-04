// Arreglo global para almacenar los gastos
const expenses = [];

// Colores por categoría (P3 - diseño)
const categoryColors = {
    'Comida': '#FF6384',
    'Transporte': '#36A2EB',
    'Entretenimiento': '#FFCE56',
    'Servicios': '#4BC0C0',
    'Salud': '#9966FF',
    'Otros': '#C9CBCF'
};

// Elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const expenseList = document.getElementById('expense-list');
const ctx = document.getElementById('expense-chart').getContext('2d');

// Inicialización de Chart.js
let expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Monto del Gasto ($)',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Poner la fecha de hoy por defecto al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// Lógica para agregar un nuevo gasto (P2 - Tarea 2, + categoría y fecha P3)
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (description === '' || isNaN(amount) || amount <= 0 || category === '' || date === '') return;

    // Crear el objeto del gasto
    const newExpense = {
        id: Date.now(),
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    // Guardar en el arreglo global
    expenses.push(newExpense);

    // Actualizar la interfaz y la gráfica
    renderExpenses();
    updateChart();

    // Limpiar el formulario (y volver a poner la fecha de hoy)
    expenseForm.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
});

// Función para dar formato legible a la fecha (dd/mm/yyyy)
function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

// Renderizar la lista de gastos en HTML (con categoría y fecha, P3)
function renderExpenses() {
    expenseList.innerHTML = '';

    // Ordenar del más reciente al más antiguo
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.classList.add('expense-item');

        li.innerHTML = `
            <span class="expense-category" style="background-color: ${categoryColors[expense.category]}">
                ${expense.category}
            </span>
            <span class="expense-desc">${expense.description}</span>
            <span class="expense-date">${formatDate(expense.date)}</span>
            <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
        `;

        expenseList.appendChild(li);
    });
}

// Actualizar el resumen gráfico (P2 - Tarea 4), con colores por categoría (P3)
function updateChart() {
    const labels = expenses.map(expense => expense.description);
    const data = expenses.map(expense => expense.amount);
    const colors = expenses.map(expense => categoryColors[expense.category]);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.data.datasets[0].borderColor = colors;
    expenseChart.update();
}