import { useState } from 'react';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import AccountsDashboard from '../components/AccountsDashboard';
import Confirmation from '../components/Confirmation';
import Filling from '../components/Filling';
import Layout from '../components/Layout';
import { Account, LoginResponse } from '../components/LoginForm';
import Receipt from '../components/Receipt';
import TransferModal from '../components/TransferModal';
import '../styles/containers/Home.scss';
import '../styles/containers/Loader.scss';

type TransferStep = 'Filling' | 'Confirmation' | 'Receipt';

interface TransferData {
  originAccount: Account;
  targetedAccount: ExternalTargetedAccount;
  amount: string;
  comment: string;
}

// This is necessary since when fetching the targeted/destination account, we wont get the amount of money that it has, just basic public values
type ExternalTargetedAccount = Omit<Account, 'amount'>;

interface TransferResponse {
  status: string;
}

const Home = () => {
  const [transferStep, setTransferStep] = useState<TransferStep>('Filling');
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);

  const handleTransfer = async (): Promise<TransferResponse> => {
    const response: AxiosResponse<TransferResponse> = await axios.post(
      'https://my-json-server.typicode.com/SantiNavarro/myjsonserver-bank/transfers',
      { data: { transferData } }
    );
    return response.data;
  };

  const { mutate: makeTransfer, isLoading } = useMutation<
    TransferResponse,
    Error
  >(handleTransfer, {
    onSuccess: (data) => {
      console.log('Login successful', data);
    },
    onError: (error) => {
      console.log('Login failed', error);
    },
  });

  const authInfo: LoginResponse = JSON.parse(
    localStorage.getItem('auth') || '{}'
  );
  const { user } = authInfo;

  const handleCloseModal = () => {
    setTransferStep('Filling');
    setIsTransferModalOpen(false);
  };

  const handleFillingSubmit = () => {
    setTransferStep('Confirmation');
  };

  const handleConfirmationSubmit = async () => {
    await makeTransfer();

    setTransferStep('Receipt');
  };

  return (
    <Layout>
      <div className="home">
        <h3>{`Welcome, ${user?.name}`}</h3>
        <div className="title">
          <h2>Accounts</h2>
          <button
            type="submit"
            className="transfer-btn"
            onClick={() => setIsTransferModalOpen(true)}
          >
            Transfer
          </button>
        </div>
        <AccountsDashboard accounts={user.accountsList} />
        <TransferModal
          title={isLoading ? '' : transferStep}
          isOpen={isTransferModalOpen}
          onClose={handleCloseModal}
        >
          {!isLoading && transferStep === 'Filling' && (
            <Filling
              setTransferData={setTransferData}
              accounts={user.accountsList}
              handleFillingSubmit={handleFillingSubmit}
            />
          )}
          {!isLoading && transferData && transferStep === 'Confirmation' && (
            <Confirmation
              transferData={transferData}
              handleConfirmationSubmit={handleConfirmationSubmit}
              handleCancel={() => setTransferStep('Filling')}
            />
          )}
          {!isLoading && transferData && transferStep === 'Receipt' && (
            <Receipt transferData={transferData} />
          )}
          {isLoading && (
            <div className="loader">
              <div>&nbsp;</div>
              <div>&nbsp;</div>
            </div>
          )}
        </TransferModal>
      </div>
    </Layout>
  );
};

export default Home;
