import { Account } from './LoginForm';
import '../styles/containers/Receipt.scss';

export type ExternalTargetedAccount = Omit<Account, 'amount'>;

interface ReceiptProps {
  transferData: TransferData;
}
export interface TransferData {
  originAccount: Account;
  targetedAccount: ExternalTargetedAccount;
  amount: string;
  comment: string;
}
const Receipt = ({ transferData }: ReceiptProps) => {
  return (
    <div>
      <h4>Transfer completed! Here is your receipt:</h4>

      <div className="receipt-details">
        <h5>{`You sent: ${transferData.amount} ${transferData.originAccount.currency}`}</h5>
        <h5>{`To: ${transferData.targetedAccount.name}`}</h5>
        <h5>{`Date: ${new Date()}`}</h5>
      </div>
    </div>
  );
};

export default Receipt;
