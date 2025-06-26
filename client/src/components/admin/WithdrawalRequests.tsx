import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWithdrawalRequests, processWithdrawalRequest } from '../../redux/thunks/adminThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

const WithdrawalRequests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { withdrawalRequests, loading, error } = useSelector((state: RootState) => state.admin);
  
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  
  useEffect(() => {
    dispatch(getWithdrawalRequests());
  }, [dispatch]);
  
  const handleAction = (id: string, action: 'approve' | 'reject' | 'complete') => {
    setSelectedRequest(id);
    setAction(action);
    setAdminNotes('');
    setIsModalOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!selectedRequest || !action) return;
    
    const status = 
      action === 'approve' ? 'approved' :
      action === 'reject' ? 'rejected' :
      action === 'complete' ? 'completed' : null;
    
    if (!status) return;
    
    {withdrawalRequests.map((request) => (
  <div key={request._id} className="request-item">
    <p>{request.user.name} - {request.amount}</p>
    <button
      onClick={() =>
        dispatch(processWithdrawalRequest({
          requestId: request._id,
          status: 'approved',
          adminNotes: 'Processed manually'
        }))
      }
    >
      Approve
    </button>
  </div>
))}


    
    setIsModalOpen(false);
    setSelectedRequest(null);
    setAction(null);
    setAdminNotes('');
  };
  
  const getActionTitle = () => {
    if (action === 'approve') return 'Approve Withdrawal Request';
    if (action === 'reject') return 'Reject Withdrawal Request';
    if (action === 'complete') return 'Complete Withdrawal Request';
    return '';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="info">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card title="Withdrawal Requests">
        {withdrawalRequests?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No withdrawal requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requested At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
                {withdrawalRequests?.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {typeof request.user === 'object' ? request.user.name : 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {typeof request.user === 'object' ? request.user.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(request.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {request.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(request.requestedAt, true)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleAction(request._id, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleAction(request._id, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAction(request._id, 'complete')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={getActionTitle()}
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={action === 'reject' ? 'danger' : action === 'approve' ? 'success' : 'primary'}
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {action === 'approve' && 'Are you sure you want to approve this withdrawal request?'}
            {action === 'reject' && 'Are you sure you want to reject this withdrawal request? This will return the funds to the user\'s wallet.'}
            {action === 'complete' && 'Are you sure you want to mark this withdrawal request as completed? This indicates that the funds have been sent to the user.'}
          </p>
          
          <Input
            label="Admin Notes"
            type="text"
            name="adminNotes"
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add notes for this action (optional)"
          />
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawalRequests;