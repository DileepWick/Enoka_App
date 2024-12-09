import { useState, useEffect } from 'react';

const menuItems = [
  { icon: '🏠', label: 'Dashboard', href: '#' },
  { icon: '🚗', label: 'Vehicles', href: '#' },
  { icon: '📊', label: 'Analytics', href: '#' },
  { icon: '👥', label: 'Customers', href: '#' },
  { icon: '📄', label: 'Reports', href: '#' },
  { icon: '⚙️', label: 'Settings', href: '#' },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-black text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          fixed md:static inset-y-0 left-0 z-20 w-64 bg-black text-white p-4
          transition-transform duration-300 ease-in-out overflow-y-auto
        `}
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
