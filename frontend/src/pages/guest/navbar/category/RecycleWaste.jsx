import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RecycleWaste() {
  document.title = "DoiTung Zero-Waste";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories,] = useState([
    {
      id: 'plastic',
      name: 'พลาสติก',
      image: '/images/plastic.jpg',
      items: ['ขวดพลาสติก PET ใส',
        'ขวดพลาสติกขุ่น',
        'ช้อนไฟเบอร์',
        'พลาสติกด',
        'พลาสติกเนื้อไฟเบอร์',
        'พลาสติกรวม',
        'ช้อนส้อมพลาสติกอ่อน',
        'ถุงพลาสติกสะอาด',
        'ช้อน/พลาสติกกรอบ/ถ้วยกาแฟ',
        'เสื่อนน้ำมัน',
        'เชือกพลาสจิกแพ็คกล่อง',
        'กระสอบฟาง',
        'ท่อ PVC',
        'สายไฟฟ้า'],
    },
    {
      id: 'glass',
      name: 'ขวดแก้ว',
      image: '/images/glass.jpg',
      items: ['ขวดใส (ขวดเหล้า, ขวดสปอนเซอร์)',
        'ขวดสีเขียว (สไปร์ท, เบียร์ช้าง)',
        'ขวดสีน้ำตาล (เอ็ม 150, เบียร์)',
        'ขวดแก้วแตก',
        'ขวดพลาสติก PET ใส',
        'ขวดรวม'],
    },
    {
      id: 'paper',
      name: 'กระดาษ',
      image: '/images/paper.jpg',
      items: ['กระดาษแข็งสีน้ำตาล (กระดาษลูกฟูก)',
        'กระดาษย่อย ขาว/ดำ',
        'กระดาษย่อยรวม (เศษกระดาษ)'],
    },
    {
      id: 'metal',
      name: 'โลหะ',
      image: '/images/metal.jpg',
      items: ['กระป๋องอลูมิเนียม',
        'กระป๋องเหล็ก',
        'เหล็กย่อย',
        'เหล็กหนา',
        'ทองแดง',
        'ทองเหลือง',
        'กระป๋องเหล็ก',
        'สแตนเลส'],
    },
  ]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/sellwaste`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
    {/* Header */}
    <Header type="menu" />
  
    {/* Main content */}
    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start">
    {selectedCategory ? (
        <CategoryDetail
          category={categories.find(cat => cat.id === selectedCategory)}
          onBackClick={() => setSelectedCategory(null)}
        />
      ) : (
        <MainScreen
          categoryData={categories}
          onCategoryClick={setSelectedCategory}
        />
      )}
    </div>
  
    {/* Footer */}
    <Footer />
  </div>
  
  );
}

function MainScreen({ categoryData, onCategoryClick }) {
  return (
    <div className="bg-orange-100 rounded-lg overflow-hidden">
      <div className="bg-yellow-400 text-center py-2 font-bold text-lg">ขยะขายได้</div>
      <div className="bg-orange-200 p-3 text-sm">
        <p>ขยะขายได้ คือ ขยะประเภทที่สามารถนำกลับมาแปรรูป และได้รับค่าตอบแทนจากการนำไปขาย</p>
        <p className="text-red-500 font-semibold mt-2">ท่านสามารถเลือกชนิดขยะได้</p>
        <p className="text-gray-700">ตามต้องการ ด้านล่างนี้</p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {categoryData && categoryData.map(category => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onCategoryClick(category.id)}
          >
            <div className="rounded-full bg-white p-2 w-32 h-32 flex items-center justify-center">
              <img src={category.image} alt={category.name} className="w-24 h-24 object-cover rounded-full" />
            </div>
            <p className="text-center mt-2">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryDetail({ category, onBackClick }) {
  return (
    <div className="bg-orange-100 rounded-lg overflow-hidden">
      <div className="bg-yellow-400 text-center py-2 font-bold text-lg flex items-center">
        <button
          onClick={onBackClick}
          className="bg-blue-500 text-white rounded px-2 py-1 ml-2"
        >
          ย้อนกลับ
        </button>
        <span className="flex-grow">{category.name}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-3">ประเภทของ {category.name} ที่รับซื้อ:</h3>
        <ul className="space-y-2">
          {(category.items || []).map((item, index) => (
            <li key={index} className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-yellow-100 p-3 rounded-lg border border-yellow-400">
          <p className="text-sm">
            ราคารับซื้อขึ้นอยู่กับปริมาณและคุณภาพของวัสดุรีไซเคิล กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามราคาปัจจุบัน
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecycleWaste;