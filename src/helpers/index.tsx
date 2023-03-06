interface Account {
  name: string;
  amount: string;
  currency: 'UY' | 'EUR' | 'USD';
  id: string;
}

type ExternalTargetedAccount = Omit<Account, 'amount'>;

interface Currency {
  tag: 'UY' | 'EUR' | 'USD';
  conversionToUsd: string;
}

// The idea behind this is, first: if currencies origin-target match, just return amount
// Then retrieve the conversion value to USD since is our bridge and start point
// Then if the targeted account currency is not USD, do a last conversion from USD to the targeted currency
const parseAmountFromTargetedToOriginAccoutCurrency = (
  originAccount: Account,
  targetedAccount: ExternalTargetedAccount,
  amount: string,
  currencies: Currency[]
): string => {
  if (originAccount.currency === targetedAccount.currency) return amount;

  const conversionToUsdMultiplier =
    currencies.find((curr: Currency) => curr.tag === originAccount.currency)
      ?.conversionToUsd || '1';

  if (!conversionToUsdMultiplier) {
    console.log('Error finding conversion to USD');
  }
  const amountToUsd = (
    parseFloat(amount.replace(',', '.')) *
    parseFloat(conversionToUsdMultiplier.replace(',', '.'))
  ).toFixed(2);

  if (targetedAccount.currency === 'USD') {
    return amountToUsd;
  }

  const conversionFromUsdToTargetedCurrency =
    currencies.find((curr: Currency) => curr.tag === targetedAccount.currency)
      ?.conversionToUsd || '1';
  if (!conversionFromUsdToTargetedCurrency) {
    console.log('Error finding conversion to targeted currency');
  }

  return (
    parseFloat(amountToUsd.replace(',', '.')) /
    parseFloat(conversionFromUsdToTargetedCurrency.replace(',', '.'))
  ).toFixed(2);
};

export default { parseAmountFromTargetedToOriginAccoutCurrency };
