import { useEffect, useState } from 'react';

function Header() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark'));
  const toggleDarkMode = () => {
    if (localStorage.getItem('mode')) {
      localStorage.removeItem('mode');
    } else {
      localStorage.setItem('mode', true);
    }
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <header className='text-gray-600 body-font dark:bg-slate-800'>
      <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
        <a className='flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='w-10 h-10 text-white p-2 bg-indigo-500 rounded-full'
            viewBox='0 0 24 24'>
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>
          <span className='ml-3 text-xl dark:text-white'>Audio Master</span>
        </a>
        <nav className='md:ml-auto flex flex-wrap items-center text-base justify-center' />
        <button
          id='theme-toggle'
          type='button'
          className='text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5'
          onClick={toggleDarkMode}>
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
}

export default Header;
