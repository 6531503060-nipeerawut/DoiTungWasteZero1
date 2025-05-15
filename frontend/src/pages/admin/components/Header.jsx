import React from 'react';

export default function Header({ adminId, adminName, toggleSidebar }) {
    return (
      <header className="flex items-center justify-between p-4 bg-white shadow">
        {/* Hamburger menu สำหรับ mobile */}
        <button
          id="hamburger-toggle"
          className="p-2 md:p-3 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
  
        {/* ชื่อแอปหรือโลโก้ */}
        <h1 className="text-xl font-bold">DoiTung Zero-Waste</h1>
  
        {/* ข้อมูลผู้ใช้ */}
        <div className="flex items-center space-x-4">
          {/* รูปโปรไฟล์ */}
          <img
            src="/path/to/avatar.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
  
          {/* ชื่อผู้ใช้งาน */}
          <span className="font-semibold">{adminName || `Admin ID: ${adminId}`}</span>
  
          {/* ปุ่ม logout */}
          <button
            onClick={() => {
              // ตัวอย่าง logout handler
              // logout function ที่ส่งมาจาก props หรือ context
              alert('Logout clicked');
            }}
            className="text-sm text-red-500 hover:underline"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>
    );
  }