import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ScanFace,
  ShieldCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', permission: 'dashboard' },
  { icon: UserPlus, label: 'Enrollment', path: '/dashboard/enrollment', permission: 'enrollment' },
  { icon: Users, label: 'Enrolled Users', path: '/dashboard/users', permission: 'enrollment' },
  { icon: ScanFace, label: 'Recognition', path: '/dashboard/recognition', permission: 'recognition' },
  { icon: ShieldCheck, label: 'Audit', path: '/dashboard/audit', permission: 'audit' },
  { icon: AlertTriangle, label: 'Attacks', path: '/dashboard/attacks', permission: 'audit' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports', permission: 'reports' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings', permission: 'settings' },
];

const DashboardSidebar = ({ collapsed, onToggle }: DashboardSidebarProps) => {
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const filteredNavItems = navItems.filter((item) => hasPermission(item.permission));

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'operator':
        return 'secondary';
      case 'auditor':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg whitespace-nowrap"
            >
              DeepAudit
            </motion.span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn('p-4 border-b border-sidebar-border', collapsed && 'flex justify-center')}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1 capitalize text-xs">
                  {user.role}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
