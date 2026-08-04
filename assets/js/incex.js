// Arreglo global para almacenar los gastos
const expenses = [];

// Elementos del DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
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
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
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

// Lógica para agregar un nuevo gasto (P2 - Tarea 2)
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (description === '' || isNaN(amount) || amount <= 0) return;

    // Crear el objeto del gasto
    const newExpense = {
        id: Date.now(),
        description: description,
        amount: amount
    };

    // Guardar en el arreglo global
    expenses.push(newExpense);

    // Actualizar la interfaz y la gráfica
    renderExpenses();
    updateChart();

    // Limpiar el formulario
    expenseForm.reset();
});

// Renderizar la lista de gastos en HTML
function renderExpenses() {
    expenseList.innerHTML = '';
    
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        expenseList.appendChild(li);
    });
}

// Actualizar el resumen gráfico (P2 - Tarea 4)
function updateChart() {
    const labels = expenses.map(expense => expense.description);
    const data = expenses.map(expense => expense.amount);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}