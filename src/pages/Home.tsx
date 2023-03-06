import { useState } from 'react';
import AccountsDashboard from '../components/AccountsDashboard';
import Layout from '../components/Layout';
import { LoginResponse } from '../components/LoginForm';
import TransferModal from '../components/TransferModal';
import '../styles/containers/Home.scss';

type TransferStep = 'Filling' | 'Confirmation' | 'Receipt';

const Home = () => {
  const [transferStep, setTransferStep] = useState<TransferStep>('Filling');
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);

  const authInfo: LoginResponse = JSON.parse(
    localStorage.getItem('auth') || '{}'
  );

  const handleCloseModal = () => {
    setTransferStep('Filling');
    setIsTransferModalOpen(false);
  };
  const { user } = authInfo;
  console.log('user', user);
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
          title={transferStep}
          isOpen={isTransferModalOpen}
          onClose={handleCloseModal}
        >
          {transferStep === 'Filling' && <p>Filling step</p>}
          {transferStep === 'Confirmation' && <p>Confirmation step</p>}
          {transferStep === 'Receipt' && <p>Receipt step</p>}
        </TransferModal>
      </div>
    </Layout>
  );
};

export default Home;
