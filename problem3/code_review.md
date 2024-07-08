# Task 2: Finding Computational Inefficiencies and Anti-Patterns

## Issues found and suggestions for improvement

### 1. Inefficient Data Fetching
**Issue**: 
The `useEffect` hook fetches data from the `Datasource` every time the component re-renders. This can lead to unnecessary network requests.

**Improvement**: 
Add a dependency array to `useEffect` to fetch data only once when the component mounts. This ensures that the data is fetched only once, reducing the number of network requests.

```typescript
useEffect(() => {
  const datasource = new Datasource("https://interview.switcheo.com/prices.json");
  datasource.getPrices().then(prices => {
    setPrices(prices);
  }).catch(error => {
    console.err(error);
  });
}, []); // Empty dependency array ensures this runs only once
```

### 2. Incorrect Conditional Check
**Issue**: 
The filter check uses `lhsPriority` without defining it, likely meant to use `balancePriority`.

**Improvement**: 
Correct the variable name to avoid reference errors. This ensures that the filtering logic works as intended.

```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (balancePriority > -99) {
       if (balance.amount <= 0) {
         return true;
       }
    }
    return false;
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
      return -1;
    } else if (rightPriority > leftPriority) {
      return 1;
    }
  });
}, [balances, prices]);
```

### 3. Unnecessary Filtering and Sorting
**Issue**: 
The filter and sort operations inside `useMemo` could be optimized to reduce redundant computations.

**Improvement**: 
Combine filtering and sorting in a single pass. This reduces the computational overhead by ensuring that the balances are processed in a more efficient manner.

```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    return balancePriority > -99 && balance.amount > 0;
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    return rightPriority - leftPriority;
  });
}, [balances, prices]);
```

### 4. Incorrect Property Access
**Issue**: 
The `getPriority` function and subsequent sorting rely on `blockchain` which is not a property of `WalletBalance`.

**Improvement**: 
Ensure the correct property is being accessed. This will prevent runtime errors and ensure that the priority calculation is performed correctly.

### 5. Repetitive Data Transformation
**Issue**: 
`sortedBalances` and `formattedBalances` transformations could be merged to reduce redundancy.

**Improvement**: 
Perform all necessary transformations in a single step. This reduces the need for multiple iterations over the balances array.

```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  };
});
```

### 6. Lack of Error Handling for Data Fetching
**Issue**: 
Minimal error handling for the data fetching process.

**Improvement**: 
Enhance error handling to improve robustness. This ensures that any issues during the data fetching process are properly managed.

```typescript
useEffect(() => {
  const datasource = new Datasource("https://interview.switcheo.com/prices.json");
  datasource.getPrices().then(prices => {
    setPrices(prices);
  }).catch(error => {
    console.error(error);
  });
}, []);
```

### 7. Missing Dependency for useMemo
**Issue**: 
`useMemo` depends on `balances` and `prices` but only has `balances` in the dependency array.

**Improvement**: 
Include `prices` in the dependency array. This ensures that the memoized values are updated whenever `prices` change.

```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    return balancePriority > -99 && balance.amount > 0;
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    return rightPriority - leftPriority;
  });
}, [balances, prices]);
```

### Conclusion
By addressing these inefficiencies and anti-patterns, the code will be more efficient and maintainable. Ensuring proper data fetching, handling errors, and optimizing computations are key aspects of improving React applications.