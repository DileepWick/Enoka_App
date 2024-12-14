import { useState, useEffect } from 'react';

const menuItems = [
  { 
    label: 'Inventory Management', 
    href: '/inventory', 
    subItems: [
      { label: 'View Inventory', href: '/inventory/view' },
      { label: 'Add Item', href: '/inventory/add' },
      { label: 'Edit Item', href: '/inventory/edit' },
      { label: 'Delete Item', href: '/inventory/delete' },
      { label: 'Manage Categories', href: '/inventory/categories' },
    ] 
  },
  { 
    label: 'Delivery Management', 
    href: '/deliveryManagement',
    subItems: [
      { label: 'View Deliveries', href: '/deliveryManagement/view' },
      { label: 'Add Delivery', href: '/deliveryManagement/add' },
      { label: 'Track Delivery', href: '/deliveryManagement/track' },
      { label: 'Edit Delivery', href: '/deliveryManagement/edit' },
      { label: 'Manage Recipients', href: '/deliveryManagement/recipients' },
    ]
  },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // To track which dropdown is open

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index); // Toggle dropdown open state
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-black text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '' : '☰'}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } fixed md:static inset-y-0 left-0 z-20 w-64 bg-black text-white p-4 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-f1">Enoka Motors</h2>
          {isMobile && (
            <button
              className="p-2 rounded-md hover:bg-black"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>
        <nav>
          <ul className="space-y-2 font-f1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-black transition-colors duration-200"
                  onClick={isMobile ? toggleMobileMenu : undefined}
                >
                  <span className="flex-1">{item.label}</span>
                </a>
                {/* Dropdown */}
                {item.subItems && (
                  <ul className={`${openDropdown === index ? 'block' : 'hidden'} pl-4 space-y-1`}>
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.href}
                          className="block p-2 rounded-md hover:bg-black transition-colors duration-200"
                          onClick={isMobile ? toggleMobileMenu : undefined}
                        >
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}
