import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faUserShield, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { NavigationLink } from '../types/types';

//** This file uses the navbar template from Tailwind */

interface NavbarProps {
  userRole: 'doctor' | 'admin' | null; // Based on logged-in role
  isLoggedIn: boolean; // Tracks whether the user is logged in
  onLogout: () => void; // Logout function
}

// Helper function to join CSS class names conditionally
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Helper function to conditionally render different icons according to the user role
const getUserRoleIcon = (userRole: 'doctor' | 'admin' | null) => {
  switch (userRole) {
    case 'doctor':
      return faUserMd;
    case 'admin':
      return faUserShield;
    default:
      return faUserMd;
  }
};

// Predefined navigation links for doctor and admin roles
const getNavigationLinks: Record<'doctor' | 'admin', NavigationLink[]> = {
  doctor: [
    {name: 'Home', href: '/', current: false},
    {name: 'Doctor Page', href: '/doctors/12', current: false},
  ],
  admin: [
    {name: 'Home', href: '/', current: false},
    {name: 'Admin Page', href: '/doctors', current: false},
  ]
}

// Default navigation for the null case
const defaultNavigation: NavigationLink[] = [
  { name: 'Home', href: '/', current: false },
];

export default function Navbar({ userRole, isLoggedIn, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  // Function to handle logout
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  // Determine the navigation links based on the user role, or use default if the role is null
  const navigation : NavigationLink[] = userRole ? getNavigationLinks[userRole] : defaultNavigation;

  return (
    <Disclosure as="nav" className="bg-indigo-800 bg-opacity-80 fixed top-0 w-full z-10 border border-indigo-200/20">
      {({ open }) => (
        <>
          {/* Container for centering the navbar content */}
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              {/* Main logo and navigation links container */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 text-white items-center">
                    Codiologist
                </div>
                {/* Navigation links for larger screens (hidden on small screens) */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* Login button/User menu on the right side of the navbar */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isLoggedIn ? (
                  <>
                    {/* Dropdown menu for logged-in users */}
                    <Menu as="div" className="relative">
                      <div>
                      <MenuButton className="flex items-center text-white bg-indigo-900 rounded-md px-2 py-1 hover:bg-indigo-800 focus:outline-none focus:ring-1 focus:ring-indigo-800">
                      {userRole && (
                        <FontAwesomeIcon icon={getUserRoleIcon(userRole)} className="h-5 w-4 mr-2" aria-hidden="true" />
                        )}
                        <span className="hidden sm:inline">{userRole}</span>
                        <ChevronDownIcon className="h-5 w-5 ml-1" aria-hidden="true" />
                      </MenuButton>
                      </div>
                      {/* Dropdown items for the user menu */}
                      <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <MenuItem
                        as="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full text-left px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-4 mr-2" aria-hidden="true" />
                          Log Out
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  // Login button shown when not logged in
                  <Link to="/login" className="flex w-full text-white bg-green-500 px-3 py-2 rounded-md text-sm font-medium">
                    <FontAwesomeIcon icon={faSignInAlt} className='h-5 w-4 mr-2' aria-hidden='true' />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu panel, shown when the menu button is clicked */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}

