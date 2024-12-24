
import { Button } from "@nextui-org/react";

export function Header() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-f1 text-black">Enoka Motors</h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800 text-2xl ">
            🔔
          </button>
          <div className="relative">
            <Button className="flex items-center space-x-2 text-black hover:text-gray-800 font-f1 bg-white">
              <span>John Doe</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

