import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks/store';

// Import icons
import {
  HomeIcon,
  ChartBarIcon,
  LightningBoltIcon,
  CogIcon,
  UserGroupIcon,
  DocumentReportIcon,
  DatabaseIcon,
  SupportIcon,
  LogoutIcon,
} from '../../icons';

interface SidebarProps {
  mobile?: boolean;
}

const Sidebar = ({ mobile = false }: SidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Lead Scoring', to: '/lead-scoring', icon: ChartBarIcon },
    { name: 'Predictive Analytics', to: '/predictive-analytics', icon: LightningBoltIcon },
    { name: 'CRM Integration', to: '/crm-integration', icon: DatabaseIcon },
    { name: 'Conversations', to: '/conversations', icon: UserGroupIcon },
    { name: 'Reports', to: '/reports', icon: DocumentReportIcon },
    { name: 'Settings', to: '/settings', icon: CogIcon },
  ];

  const secondaryNavigation = [
    { name: 'Support', to: '/support', icon: SupportIcon },
    { name: 'Logout', to: '/logout', icon: LogoutIcon },
  ];

  return (
    <div className={`flex flex-col w-64 bg-primary-900 ${mobile ? 'h-full' : 'min-h-screen'}`}>
      <div className="flex items-center h-16 px-4 bg-primary-950">
        <div className="flex items-center">
          <img
            className="h-8 w-8"
            src="/logo.svg"
            alt="RevAI Logo"
          />
          <span className="ml-2 text-white text-lg font-semibold">RevAI</span>
        </div>
      </div>

      {user && (
        <div className="flex flex-col items-center py-4 px-4 border-b border-primary-800">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-medium">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-900 bg-success-500"></div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-primary-300">{user.company}</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-4 space-y-1 border-t border-primary-800">
          {secondaryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-800 hover:text-white"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
