import Navbar from './navbar';


const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen justify-center items-center bg-gray-50 text-gray-900 text-base font-sans font-medium">
        {children}
      </main>
    </>
  );
}

export default Layout;
