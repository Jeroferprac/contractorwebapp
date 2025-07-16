'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface SalesOrder {
  id: string;
  channel: string;
  status: string;
}

interface SalesOrderTableProps {
  salesOrders: SalesOrder[];
}

const STATUS_LIST = ["Draft", "Confirmed", "Packed", "Shipped", "Invoiced"];
const CHANNEL_COLORS: Record<string, string> = {
  'Direct Sales': 'from-blue-500 to-blue-400',
  'Wholesale': 'from-purple-500 to-purple-400',
  'Retail': 'from-green-500 to-green-400',
};

export default function SalesOrderTable({ salesOrders = [] }: SalesOrderTableProps) {
  // Group and count orders by channel and status
  const summary = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    salesOrders.forEach(order => {
      const channel = order.channel || 'Other';
      const status = order.status || 'Draft';
      if (!grouped[channel]) grouped[channel] = {};
      grouped[channel][status] = (grouped[channel][status] || 0) + 1;
    });
    return grouped;
  }, [salesOrders]);

  const channels = Object.keys(summary).length > 0 ? Object.keys(summary) : ['Direct Sales', 'Wholesale', 'Retail'];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-bold tracking-tight">Sales Orders</CardTitle>
          <Badge variant="secondary" className="ml-2">Last 7 Days</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur shadow-sm">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Channel</th>
                {STATUS_LIST.map(status => (
                  <th key={status} className="text-center p-3 font-semibold text-gray-700">
                    {status}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((channel, idx) => (
                <tr
                  key={channel}
                  className={cn(
                    'transition-all',
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                    'hover:bg-blue-50/60'
                  )}
                  style={{ boxShadow: idx % 2 === 0 ? '0 1px 0 0 #f3f4f6' : undefined }}
                >
                  <td className="p-3 font-semibold">
                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded-full text-white text-xs font-bold shadow',
                        'bg-gradient-to-r',
                        CHANNEL_COLORS[channel] || 'from-gray-400 to-gray-300'
                      )}
                    >
                      {channel}
                    </span>
                  </td>
                  {STATUS_LIST.map(status => (
                    <td key={status} className="text-center p-3">
                      {summary[channel]?.[status] ? (
                        <Badge
                          variant={
                            status === 'Draft' ? 'outline' :
                            status === 'Confirmed' ? 'default' :
                            status === 'Packed' ? 'secondary' :
                            status === 'Shipped' ? 'default' :
                            status === 'Invoiced' ? 'success' : 'secondary'
                          }
                          className={cn(
                            'px-2 py-1 text-xs font-semibold',
                            status === 'Draft' ? 'border-blue-300 text-blue-600' :
                            status === 'Confirmed' ? 'bg-blue-500 text-white' :
                            status === 'Packed' ? 'bg-purple-500 text-white' :
                            status === 'Shipped' ? 'bg-yellow-400 text-white' :
                            status === 'Invoiced' ? 'bg-green-500 text-white' : ''
                          )}
                        >
                          {summary[channel][status]}
                        </Badge>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 