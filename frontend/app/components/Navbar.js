'use client'

import { useState } from "react";
import { useUser  } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal"; 
import AuthForm from "../components/AuthForm"; 

const Navbar = () => {
  const { user, logout } = useUser ();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLogin, setIsLogin] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  // Function to open modal with the appropriate form (login or signup)
  const openModal = (isLoginForm) => {
    setIsLogin(isLoginForm);
    setIsModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening modal
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

   // Logout and reload the page
   const handleLogout = () => {
    logout();
    router.reload(); // Reload the page to reset state
  };

  return (
    <nav className="bg-blue-600 fixed w-full top-0 left-0 z-50 p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Seat Booking</h1>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal(true)} // Show login modal
                className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => openModal(false)} // Show signup modal
                className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Signup
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={toggleDropdown}
            className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Menu
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
              {user ? (
                <>
                  <span className="block px-4 py-2 text-gray-800">Welcome, {user.username}!</span>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openModal(true)} // Show login modal
                    className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openModal(false)} // Show signup modal
                    className="block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-200"
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Login/Signup */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AuthForm isLogin={isLogin} onSuccess={closeModal} />
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;