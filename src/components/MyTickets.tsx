import React from 'react';

interface MyTicketsProps {
  tickets: any[];
  onRefresh: () => void;
}

const MyTickets: React.FC<MyTicketsProps> = ({ tickets, onRefresh }) => {
  if (tickets.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Tickets</h2>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No tickets yet</p>
          <p className="text-gray-500">
            Purchase your first lottery ticket to get started!
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: 'bg-blue-900 text-blue-200',
      active: 'bg-green-900 text-green-200',
      completed: 'bg-gray-700 text-gray-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-700 text-gray-300'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Tickets</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-white font-semibold">
                  Draw: {formatDate(ticket.draw_date)}
                </p>
                <p className="text-gray-400 text-sm">
                  Purchased: {formatDate(ticket.purchase_date)}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(ticket.status)}
                {ticket.is_winner && (
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded-full text-xs font-bold">
                      🎉 WINNER!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-2">Your Numbers:</p>
              <div className="flex space-x-2">
                {ticket.numbers.map((number: number, index: number) => (
                  <span
                    key={index}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>

            {ticket.winning_numbers && ticket.status === 'completed' && (
              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-2">Winning Numbers:</p>
                <div className="flex space-x-2">
                  {ticket.winning_numbers.map((number: number, index: number) => {
                    const isMatch = ticket.numbers.includes(number);
                    return (
                      <span
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isMatch 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {number}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Ticket Price:</span>
              <span className="text-green-400 font-semibold">${ticket.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
