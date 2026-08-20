import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { supabase } from '../lib/supabase';

interface WalletManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

export const WalletManagerModal: React.FC<WalletManagerModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName
}) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchWalletData();
    }
  }, [isOpen, userId]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // Fetch balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('userId', userId)
        .single();
        
      if (walletError && walletError.code !== 'PGRST116') { // Ignore not found error
        throw walletError;
      }
      
      setBalance(walletData ? walletData.balance : 0);

      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(10);
        
      if (txError) throw txError;
      setTransactions(txData || []);
      
    } catch (err: any) {
      alert('Failed to load wallet data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!userId || !topUpAmount || topUpAmount <= 0) return;
    
    if (!window.confirm(`Are you sure you want to add ${new Intl.NumberFormat('vi-VN').format(Number(topUpAmount))}đ to this wallet?`)) {
      return;
    }
    
    setSubmitting(true);
    try {
      const tokenResult = await supabase.auth.getSession();
      const token = tokenResult.data.session?.access_token;
      
      if (!token) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại!');
      }

      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}/wallet/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: Number(topUpAmount),
          description: 'Admin Top-up'
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to top up wallet: ${res.status} ${errText}`);
      }
      
      setTopUpAmount('');
      await fetchWalletData();
      alert('Wallet topped up successfully!');
    } catch (err: any) {
      alert('Error topping up: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Wallet - ${userName || 'User'}`}>
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Balance</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
            {new Intl.NumberFormat('vi-VN').format(balance)}đ
          </h2>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-base)' }}>
            Top Up Wallet
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount (VNĐ)</label>
              <input 
                type="number" 
                min="1000" 
                step="1000"
                value={topUpAmount} 
                onChange={e => setTopUpAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                placeholder="Enter amount..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-base)' }} 
              />
            </div>
            <button 
              onClick={handleTopUp}
              disabled={submitting || !topUpAmount || topUpAmount <= 0}
              style={{ 
                padding: '0.75rem 1.5rem', 
                borderRadius: 'var(--radius-md)', 
                border: 'none', 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-bg-base)', 
                fontWeight: '600', 
                cursor: (submitting || !topUpAmount || topUpAmount <= 0) ? 'not-allowed' : 'pointer',
                opacity: (submitting || !topUpAmount || topUpAmount <= 0) ? 0.7 : 1
              }}
            >
              {submitting ? 'Processing...' : 'Top Up'}
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-base)' }}>
            Recent Transactions
          </h3>
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No transactions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {transactions.map(tx => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--color-text-base)' }}>{tx.description || tx.type}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ fontWeight: '700', color: tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '#10b981' : '#ef4444' }}>
                    {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'}
                    {new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
