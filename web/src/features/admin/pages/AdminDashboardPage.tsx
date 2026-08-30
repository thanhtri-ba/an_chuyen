import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';
import { Card } from '../../../design-system/components/Card';

export const AdminDashboardPage = () => {
  const stats = [
    { title: 'Tổng Doanh Thu', value: '45,231,000đ', icon: DollarSign, change: '+20.1%' },
    { title: 'Lượt Đặt Vé', value: '+2,350', icon: CreditCard, change: '+180.1%' },
    { title: 'Khách Hàng Mới', value: '+12,234', icon: Users, change: '+19%' },
    { title: 'Người Dùng Hoạt Động', value: '+573', icon: Activity, change: '+201' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tổng Quan</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6">
              <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change} so với tháng trước
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-sm">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
        </Card>
        
        <Card className="col-span-3 p-6 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Giao dịch gần đây</h3>
          <div className="space-y-4 flex-1 flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-sm">Chưa có dữ liệu giao dịch.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
