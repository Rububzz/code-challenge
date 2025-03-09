/**
 * missing blockchain in WalletBalance
 */
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: any
}

/**
 * better to just grab everything through wallet then to manually grab
 * each component from WalletBalance
 */
interface FormattedWalletBalance {
    wallet: WalletBalance;
    formatted: string;
}

class Datasource {
    // TODO: Implement datasource class
    url: string;
    constructor(url: string) {
        this.url = url;
    }
    async getPrices(): Promise<Record<string, number>> {
       const response = await fetch(this.url);
       if (!response.ok) {
           throw new Error(response.statusText);
       }
       return response.json();
    }
}


/**
 * if assuming BoxProps is from an imported library eg. @chakra-ui/react there is no issues,
 * however, if not the case, custom properties have to be added so walletPage can destructure the properties
 */
interface Props extends BoxProps {

}


/**
 * - console.err is wrong => should be console.error
 *
 * - if children is not required, it does not need to be used
 */
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const datasource = new Datasource("https://interview.switcheo.com/prices.json");
        datasource.getPrices().then(prices => {
            setPrices(prices);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    /**
     * This is inefficient, there should be a api or a website where this can be fetched and used,
     * doing this will cause a need to constantly add more cases to the switch statement any time a new
     * walletBalance is added
     */
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    /**
     * the filter is wrong, to get the correct balance amount it has to be balance.amount > 0
     * and lhsPriority does not exist, it is balancePriority instead
     */
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            //changed lhsPriority to balancePriority
            if (balancePriority > -99) {
                // changed balance.amount <= 0 to balance.amount > 0
                if (balance.amount > 0) {
                    return true;
                }
            }
            return false
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

    /**
     * - formattedBalance should be used in this case as we need the formatted property. Putting formatted balances in the rows during
     * iteration would also help the efficiency of the webpage especially if the sortedBalances become very large
     * made the appropriate changes from balances to formattedBalances
     *
     * - Assuming WalletRow is an imported component with the specified perimeters the rest of this would be correct.
     * If WalletRow is in fact not an imported component, the closest would be walletPage
     */
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const formattedBalances = {
            ...balance,
            formatted: balance.amount.toFixed(),
        }
        const usdValue = prices[formattedBalances.currency] * formattedBalances.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={formattedBalances.amount}
                usdValue={usdValue}
                formattedAmount={formattedBalances.formatted}
        />
    )
    })

    return (
        <div {...rest}>
        {rows}
        </div>
    )
}