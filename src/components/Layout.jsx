import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LoginModal from './LoginModal';
import CartOffcanvas from './CartOffcanvas';

export default function Layout() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'register', or null

  return (
    <>
      <Navbar 
        onOpenLogin={() => setActiveModal('login')} 
        onOpenRegister={() => setActiveModal('register')} 
      />
      
      <main>
        <Outlet />
      </main>

      <Footer />
      
      <LoginModal 
        activeModal={activeModal} 
        setActiveModal={setActiveModal} 
      />
      
      <CartOffcanvas />
    </>
  );
}
