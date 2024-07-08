import React, { useEffect, useMemo, useState } from 'react';

// Define BoxProps or import it if it's from a library
interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
}

// Mock implementation of the useWalletBalances hook
// This hook should return the user's wallet balances
const useWalletBalances = (): WalletBalance[] => {
  // Mock data, replace with actual implementation
  return [
    { currency: 'Ethereum', amount: 1.23, blockchain: 'Ethereum' },
    { currency: 'Osmosis', amount: 4.56, blockchain: 'Osmosis' },
  ];
};

// Mock implementation of the WalletRow component
// This component will be used to display individual wallet rows
const WalletRow: React.FC<{ className: string; amount: number; usdValue: number; formattedAmount: string }> = ({
  className,
  amount,
  usdValue,
  formattedAmount,
}) => (
  <div className={className}>
    <span>{formattedAmount}</span>
    <span>{usdValue.toFixed(2)}</span>
  </div>
);

// Interface definitions for wallet balances
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// Interface for formatted wallet balances, extending WalletBalance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Datasource class implementation
// This class is responsible for fetching prices from a given URL
class Datasource {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  // Method to fetch prices from the provided URL
  async getPrices(): Promise<Record<string, number>> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error('Network response error');
    }
    return response.json();
  }
}

// Props interface extending BoxProps
interface Props extends BoxProps {
  children?: React.ReactNode; // Added children to Props interface
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; // Destructure props, separating children and rest
  const balances = useWalletBalances(); // Get wallet balances using the custom hook
  const [prices, setPrices] = useState<Record<string, number>>({}); // State for storing prices

  // useEffect hook to fetch prices when the component mounts
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        const fetchedPrices = await datasource.getPrices();
        setPrices(fetchedPrices);
      } catch (error) {
        console.error(error); // Log any errors during fetching
      }
    };
    fetchPrices();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to get priority based on blockchain
  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // useMemo hook to memoize the sorted balances calculation
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]); // Recompute only when balances change

  // Mock classes object for styling
  const classes = {
    row: 'wallet-row'
  };

  // Create rows for displaying wallet balances
  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed(2)} // Format amount to two decimal places
      />
    );
  });

  return <div {...rest}>{rows}</div>; // Render the wallet rows
};

export default WalletPage;
