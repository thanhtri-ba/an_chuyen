import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, Settings, Menu, LogOut, Bell } from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', title: 'Bảng Điều Khiển', url: '/admin', icon: LayoutDashboard },
  { id: 'users', title: 'Người Dùng', url: '/admin/users', icon: Users },
  { id: 'roles', title: 'Phân Quyền', url: '/admin/roles', icon: Shield },
  { id: 'settings', title: 'Cài Đặt', url: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Thêm logic đăng xuất ở đây
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-white">
          <span className="text-xl font-bold text-primary">Hệ thống Quản trị</span>
        </div>
        
        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.url}
                end={item.url === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 md:px-6">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 hidden md:block">Bảng điều khiển</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
