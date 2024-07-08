document.addEventListener('DOMContentLoaded', () => {
    const tokenSelects = document.querySelectorAll('select');
    const fromAmount = document.getElementById('from-amount');
    const toAmount = document.getElementById('to-amount');
    const swapForm = document.getElementById('swap-form');
    const errorMessage = document.getElementById('error-message');

    const tokens = [
        { symbol: 'ETH', name: 'Ethereum' },
        { symbol: 'BTC', name: 'Bitcoin' },
        { symbol: 'USDT', name: 'Tether' },
        // to add more tokens as needed
    ];

    const tokenPrices = {}; // To be fetched from API

    // Populate the token select options
    tokenSelects.forEach(select => {
        tokens.forEach(token => {
            const option = document.createElement('option');
            option.value = token.symbol;
            option.textContent = token.name;
            select.appendChild(option);
        });
    });

    // Fetch token prices
    fetch('https://interview.switcheo.com/prices.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(token => {
                tokenPrices[token] = data[token];
            });
            console.log(tokenPrices); // Added this line to log fetched prices

        })
        .catch(error => {
            console.error('Error fetching token prices:', error);
            errorMessage.textContent = 'Failed to fetch token prices. Please try again later.';
        });

    // Calculate exchange rate and update toAmount
    fromAmount.addEventListener('input', () => {
        calculateToAmount();
    });

    tokenSelects.forEach(select => {
        select.addEventListener('change', () => {
            calculateToAmount();
        });
    });

    swapForm.addEventListener('submit', event => {
        event.preventDefault();
        // Handle the swap action
        if (fromAmount.value && tokenPrices[fromToken.value] && tokenPrices[toToken.value]) {
            alert('Swap successful!');
        } else {
            errorMessage.textContent = 'Please fill in all fields correctly.';
        }
    });

    function calculateToAmount() {
        const fromToken = document.getElementById('from-token').value;
        const toToken = document.getElementById('to-token').value;

        if (fromAmount.value && tokenPrices[fromToken] && tokenPrices[toToken]) {
            const exchangeRate = tokenPrices[fromToken] / tokenPrices[toToken];
            toAmount.value = (fromAmount.value * exchangeRate).toFixed(2);
            errorMessage.textContent = '';
        } else {
            toAmount.value = '';
        }
    }
});
