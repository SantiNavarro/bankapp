import { Currency } from '../components/Filling';
import { Account } from '../components/LoginForm';
import { ExternalTargetedAccount } from '../components/Receipt';
import helpers from '../helpers/index';

describe('parseAmountFromTargetedToOriginAccoutCurrency', () => {
  const currencies: Currency[] = [
    { tag: 'UY', conversionToUsd: '0.032' },
    { tag: 'EUR', conversionToUsd: '1.18' },
    { tag: 'USD', conversionToUsd: '1' },
  ];

  it('returns amount if origin and targeted currencies match', () => {
    const originAccount: Account = {
      name: 'Account1',
      amount: '100',
      currency: 'UY',
      id: '1',
    };
    const targetedAccount: ExternalTargetedAccount = {
      name: 'Account2',
      currency: 'UY',
      id: '2',
    };
    const amount = '100';
    const result = helpers.parseAmountFromTargetedToOriginAccoutCurrency(
      originAccount,
      targetedAccount,
      amount,
      currencies
    );
    expect(result).toEqual(amount);
  });

  it('returns converted amount if targeted currency is USD', () => {
    const originAccount: Account = {
      name: 'Account1',
      amount: '100',
      currency: 'UY',
      id: '1',
    };
    const targetedAccount: ExternalTargetedAccount = {
      name: 'Account2',
      currency: 'USD',
      id: '2',
    };
    const amount = '100';
    const result = helpers.parseAmountFromTargetedToOriginAccoutCurrency(
      originAccount,
      targetedAccount,
      amount,
      currencies
    );
    expect(result).toEqual('3.20');
  });

  it('returns converted amount if currencies are different and targeted currency is not USD', () => {
    const originAccount: Account = {
      name: 'Account1',
      amount: '100',
      currency: 'UY',
      id: '1',
    };
    const targetedAccount: ExternalTargetedAccount = {
      name: 'Account2',
      currency: 'EUR',
      id: '2',
    };
    const amount = '100';
    const result = helpers.parseAmountFromTargetedToOriginAccoutCurrency(
      originAccount,
      targetedAccount,
      amount,
      currencies
    );
    expect(result).toEqual('2.71');
  });
});
