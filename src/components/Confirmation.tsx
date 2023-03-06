import { Account } from './LoginForm';
import '../styles/containers/Confirmation.scss';

export type ExternalTargetedAccount = Omit<Account, 'amount'>;

export interface TransferData {
  originAccount: Account;
  targetedAccount: ExternalTargetedAccount;
  amount: string;
  comment: string;
}

interface ConfirmationProps {
  transferData: TransferData;
  handleCancel: () => void;
  handleConfirmationSubmit: () => void;
}
const Confirmation = ({
  transferData,
  handleCancel,
  handleConfirmationSubmit,
}: ConfirmationProps) => {
  return (
    <div>
      <h4>Please review the transfer details:</h4>

      <div>
        <p>{`You are sending: ${transferData.amount} ${transferData.originAccount.currency}`}</p>
        <p>{`From your Account: ${transferData.originAccount.name} | Account number: ${transferData.originAccount.id}`}</p>
        <p>{`To: ${transferData.targetedAccount.name}`}</p>
        {transferData.comment && <p>{`Comment: ${transferData.comment}`}</p>}
      </div>

      <div className="actions-container">
        <button
          type="submit"
          className="cta-button-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cta-button"
          onClick={handleConfirmationSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
