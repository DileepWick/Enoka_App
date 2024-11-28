import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-center sm:text-right">
              <div>{currentTime.toLocaleDateString()}</div>
              <div>{currentTime.toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <UserCircle className="h-8 w-8" />
              <div className="text-sm">
                <div>John Doe</div>
                <div className="text-xs">Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
