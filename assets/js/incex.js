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
const filterButtons = document.querySelectorAll('.filter-button');
const ctx = document.getElementById('expense-chart').getContext('2d');

let activeFilter = 'week';

// Inicialización de Chart.js (con estilo mejorado)
let expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Monto del Gasto ($)',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 48,
            hoverBackgroundColor: [],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
            duration: 800,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: (context) => `$${context.parsed.y.toFixed(2)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.06)',
                    drawBorder: false
                },
                ticks: {
                    callback: (value) => `$${value}`,
                    font: { size: 12 }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: { size: 12, weight: '600' },
                    color: '#555'
                }
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

    // Actualizar la lista filtrada de gastos (y la gráfica, dentro de renderExpenses)
    renderExpenses();

    // Limpiar el formulario (y volver a poner la fecha de hoy)
    expenseForm.reset();
    dateInput.value = new Date().toISOString().split('T')[0];
});

// Función para dar formato legible a la fecha (dd/mm/yyyy)
function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function isExpenseInFilter(expense, filter) {
    const expenseDate = parseLocalDate(expense.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'today') {
        return expenseDate.getTime() === today.getTime();
    }

    if (filter === 'week') {
        const weekStart = new Date(today);
        const dayOfWeek = today.getDay();
        weekStart.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
        return expenseDate >= weekStart && expenseDate <= today;
    }

    if (filter === 'month') {
        return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear();
    }

    return true;
}

function setActiveFilterButton(selectedButton) {
    filterButtons.forEach(button => button.classList.toggle('active', button === selectedButton));
}

// Inicializar botón activo en la lista de filtros
setActiveFilterButton(document.querySelector('.filter-button.active') || filterButtons[0]);

// Renderizar la lista de gastos en HTML (con categoría y fecha, P3)
// y actualizar la gráfica con los MISMOS datos filtrados (evita el bug de que no coincidían)
function renderExpenses() {
    expenseList.innerHTML = '';

    const filteredExpenses = expenses
        .filter(expense => isExpenseInFilter(expense, activeFilter))
        .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date));

    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = '<li class="expense-item empty-message">No hay gastos para este filtro.</li>';
    } else {
        filteredExpenses.forEach(expense => {
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

    updateChart(filteredExpenses);
}

// Actualizar el resumen gráfico (P2 - Tarea 4), con colores por categoría (P3)
// Ahora recibe los gastos ya filtrados, para que coincida con la lista visible
function updateChart(filteredExpenses) {
    const labels = filteredExpenses.map(expense => expense.description);
    const data = filteredExpenses.map(expense => expense.amount);
    const colors = filteredExpenses.map(expense => categoryColors[expense.category]);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.data.datasets[0].borderColor = colors;
    expenseChart.data.datasets[0].hoverBackgroundColor = colors.map(c => c + 'cc');
    expenseChart.update();
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        setActiveFilterButton(button);
        renderExpenses();
    });
});

renderExpenses();