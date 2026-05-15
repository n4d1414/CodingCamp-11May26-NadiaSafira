const form = document.getElementById('transaction-form');

const itemName = document.getElementById('item-name');

const amount = document.getElementById('amount');

const category = document.getElementById('category');

const transactionList = document.getElementById('transaction-list');

const balance = document.getElementById('balance');

const totalTransaction = document.getElementById('total-transaction');

const totalExpense = document.getElementById('total-expense');

const sortSelect = document.getElementById('sort-select');

const themeToggle = document.getElementById('theme-toggle');

let transactions = JSON.parse(
    localStorage.getItem('transactions')
) || [];

const ctx = document
    .getElementById('expenseChart')
    .getContext('2d');

const expenseChart = new Chart(ctx, {
    type: 'pie',

    data: {
        labels: [],

        datasets: [{
            data: [],

            backgroundColor: [
                '#4CAF50',
                '#2196F3',
                '#FF9800',
                '#9C27B0',
                '#E91E63'
            ]
        }]
    }
});

function saveToLocalStorage() {

    localStorage.setItem(
        'transactions',
        JSON.stringify(transactions)
    );
}

function updateSummary() {

    const total = transactions.reduce(
        (acc, item) => acc + item.amount,
        0
    );

    balance.innerText = `Rp ${total.toLocaleString()}`;

    totalExpense.innerText = `Rp ${total.toLocaleString()}`;

    totalTransaction.innerText = transactions.length;
}

function renderTransactions() {

    transactionList.innerHTML = '';

    let sortedTransactions = [...transactions];

    if (sortSelect.value === 'highest') {

        sortedTransactions.sort(
            (a, b) => b.amount - a.amount
        );
    }

    if (sortSelect.value === 'lowest') {

        sortedTransactions.sort(
            (a, b) => a.amount - b.amount
        );
    }

    sortedTransactions.forEach(transaction => {

        const div = document.createElement('div');

        div.classList.add('transaction-item');

        if (transaction.amount > 500000) {

            div.classList.add('highlight');
        }

        div.innerHTML = `
      <div class="transaction-info">

        <h4>${transaction.name}</h4>

        <p>${transaction.category}</p>

      </div>

      <div>

        <p class="transaction-amount">

          Rp ${transaction.amount.toLocaleString()}

        </p>

        <button
          class="delete-btn"
          onclick="deleteTransaction(${transaction.id})"
        >
          Hapus
        </button>

      </div>
    `;

        transactionList.appendChild(div);
    });
}

function updateChart() {

    const categories = {};

    transactions.forEach(transaction => {

        if (categories[transaction.category]) {

            categories[transaction.category] += transaction.amount;

        } else {

            categories[transaction.category] = transaction.amount;
        }
    });

    expenseChart.data.labels = Object.keys(categories);

    expenseChart.data.datasets[0].data =
        Object.values(categories);

    expenseChart.update();
}

function addTransaction(e) {

    e.preventDefault();

    if (
        itemName.value === '' ||
        amount.value === '' ||
        category.value === ''
    ) {

        alert('Semua field wajib diisi!');

        return;
    }

    const transaction = {

        id: Date.now(),

        name: itemName.value,

        amount: Number(amount.value),

        category: category.value
    };

    transactions.push(transaction);

    saveToLocalStorage();

    renderTransactions();

    updateSummary();

    updateChart();

    form.reset();
}

function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveToLocalStorage();

    renderTransactions();

    updateSummary();

    updateChart();
}

sortSelect.addEventListener(
    'change',
    renderTransactions
);

form.addEventListener(
    'submit',
    addTransaction
);

themeToggle.addEventListener(
    'click',
    () => {

        document.body.classList.toggle(
            'dark-mode'
        );
    }
);

renderTransactions();

updateSummary();

updateChart();