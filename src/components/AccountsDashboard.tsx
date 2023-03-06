import { Account } from './LoginForm';
import '../styles/containers/AccountsDashboard.scss';

interface AccountsDashboardProps {
  accounts: Account[];
}
const AccountsDashboard = ({ accounts }: AccountsDashboardProps) => {
  if (!accounts) {
    return <p>No accounts retrieved</p>;
  }
  return (
    <table className="accounts-dashboard">
      <tr>
        <th>Name</th>
        <th>ID</th>
        <th>Currency</th>
        <th>Amount</th>
      </tr>
      {accounts.map((account: Account) => (
        <tr key={`account-${account.id}`}>
          <td>{account.name}</td>
          <td>{account.id}</td>
          <td>{account.currency}</td>
          <td>{account.amount}</td>
        </tr>
      ))}
    </table>
  );
};

export default AccountsDashboard;
