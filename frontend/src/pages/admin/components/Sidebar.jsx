import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-64 bg-gray-200 p-4 h-full">
    <nav className="flex flex-col gap-4">
      <Link to="/" className="hover:underline">แดชบอร์ด</Link>
      <Link to="/upload" className="hover:underline">อัปโหลดข้อมูล Excel</Link>
    </nav>
  </aside>
);

export default Sidebar;