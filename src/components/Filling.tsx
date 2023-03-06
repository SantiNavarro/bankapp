import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';

import '../styles/containers/Filling.scss';

import helpers from '../helpers';

export interface Account {
  name: string;
  amount: string;
  currency: 'UY' | 'EUR' | 'USD';
  id: string;
}
interface User {
  name: string;
  surname: string;
  accountsList: Account[];
}
export interface LoginResponse {
  token: string;
  user: User;
}

export type ExternalTargetedAccount = Omit<Account, 'amount'>;

export interface Currency {
  tag: 'UY' | 'EUR' | 'USD';
  conversionToUsd: string;
}

interface TransferData {
  originAccount: Account;
  targetedAccount: ExternalTargetedAccount;
  amount: string;
  comment: string;
}

interface FillingProps {
  accounts: Account[];
  setTransferData: (data: TransferData) => void;
  handleFillingSubmit: () => void;
}

const Filling = ({
  accounts,
  setTransferData,
  handleFillingSubmit,
}: FillingProps) => {
  const [selectedOriginAccountId, setSelectedOriginAccountId] = useState<
    string | undefined
  >(undefined);
  const [targetedAccount, setTargetedAccount] = useState<string>('');
  const [targetedAccountData, setTargetedAccountData] =
    useState<ExternalTargetedAccount>();
  const [amountToTransfer, setAmountToTransfer] = useState<string>('');
  const [commentInput, setCommentInput] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>();

  const authInfo: LoginResponse = JSON.parse(
    localStorage.getItem('auth') || '{}'
  );
  const { token } = authInfo;

  // The idea here is to fetch the state of the currencies in order to do the parsings between origin and destine accounts
  const handleFetchCurrencies = async (): Promise<Currency[]> => {
    const response: AxiosResponse<Currency[]> = await axios.get(
      'https://my-json-server.typicode.com/SantiNavarro/myjsonserver-bank/currencies',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };
  const { mutateAsync: fetchCurrencies } = useMutation<Currency[], Error>(
    handleFetchCurrencies,
    {
      onSuccess: (data) => {
        console.log('Fetch currencies data successful', data);
        setCurrencies(data);
      },
      onError: (error) => {
        console.log('Fetch currencies data failed', error);
      },
    }
  );

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleFetchTargetedAccountData =
    async (): Promise<ExternalTargetedAccount> => {
      const response: AxiosResponse<ExternalTargetedAccount> = await axios.get(
        'https://my-json-server.typicode.com/SantiNavarro/myjsonserver-bank/accounts',
        {
          data: { accountId: targetedAccount },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    };

  const handleSelectedOriginAccount = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOriginAccountId(event.target.value);
  };

  const { mutate: fetchTargetedAccountData } = useMutation<
    ExternalTargetedAccount,
    Error
  >(handleFetchTargetedAccountData, {
    onSuccess: (data) => {
      console.log('Fetch targeted acc data successful', data);
      setTargetedAccountData(data);
    },
    onError: (error) => {
      console.log('Fetch targeted acc data failed', error);
    },
  });

  const handleTargetedAccountInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setTargetedAccount(value);
    const data = await fetchTargetedAccountData();
    setTargetedAccountData(data as unknown as ExternalTargetedAccount);
  };

  const handleAmountToTransferInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    setAmountToTransfer(value);
  };

  const handleCommentInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value.slice(0, 255);
    setCommentInput(value);
  };

  const getSelectedAccountInfo = (): Account =>
    accounts.find(
      (account: Account) => account.id === selectedOriginAccountId
    ) as Account;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataOfTransfer: TransferData = {
      originAccount: getSelectedAccountInfo(),
      targetedAccount: targetedAccountData as ExternalTargetedAccount,
      amount: amountToTransfer,
      comment: commentInput,
    };
    setTransferData(dataOfTransfer);
    handleFillingSubmit();
  };

  const getMaxAmountToTransfer = () => {
    const selectedAccount = getSelectedAccountInfo();

    return parseFloat(selectedAccount?.amount || '0');
  };

  const exceededingTransferLimits =
    parseFloat(amountToTransfer) > getMaxAmountToTransfer();

  const readyToSubmit =
    !!selectedOriginAccountId &&
    !!amountToTransfer &&
    !!targetedAccount &&
    !exceededingTransferLimits;
  console.log('readyToSubmit', readyToSubmit);
  return (
    <form className="Form" onSubmit={handleSubmit}>
      <label className="Form__label" htmlFor="account">
        Account:
        <select
          value={selectedOriginAccountId}
          onChange={handleSelectedOriginAccount}
        >
          <option value="">Please select an origin account</option>
          {accounts.map((account: Account) => (
            <option key={account.id} value={account.id}>
              {`${account.name} | ${account.currency} | ${account.amount}`}
            </option>
          ))}
        </select>
      </label>
      <label className="Form__label" htmlFor="targeted account">
        Targeted account:
        <input
          type="text"
          value={targetedAccount}
          onChange={handleTargetedAccountInputChange}
          maxLength={8}
          disabled={!selectedOriginAccountId}
        />
      </label>
      <label className="Form__label" htmlFor="amount">
        Amount:
        <input
          type="text"
          value={amountToTransfer}
          onChange={handleAmountToTransferInputChange}
          disabled={!selectedOriginAccountId}
          max={getMaxAmountToTransfer()}
          placeholder={`Max: ${getMaxAmountToTransfer()}`}
        />
        {targetedAccountData && amountToTransfer && currencies && (
          <p>{`After conversion, you are sending: ${helpers.parseAmountFromTargetedToOriginAccoutCurrency(
            getSelectedAccountInfo(),
            targetedAccountData,
            amountToTransfer,
            currencies
          )} in ${targetedAccountData.currency}`}</p>
        )}
        {exceededingTransferLimits && (
          <p className="warning">{`Your limit in ${
            getSelectedAccountInfo().currency
          } is  ${getSelectedAccountInfo().amount}`}</p>
        )}
      </label>
      <label className="Form__label" htmlFor="comment">
        Comment(optional):
        <textarea
          value={commentInput}
          onChange={handleCommentInputChange}
          maxLength={255}
        />
      </label>
      <button
        disabled={!readyToSubmit}
        className={readyToSubmit ? 'submit-btn' : 'disabled-btn'}
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default Filling;
