import Link from 'next/link';
import Image from 'next/image';
import shopLogo from '../public/shop_logo.svg';


const Navbar = () => {
  return (
  <>
    <nav className="flex flex-row items-center justify-between bg-dark-theme px-4 py-2">
      <Link href="/logout">
        <Image
          src="/shop_logout_icon.svg"
          height={30}
          width={30}
          alt="Project repository"
        ></Image>
      </Link>
      <a href="/">
        <Image
          src={shopLogo}
          height={30}
          alt="Home"
        ></Image>
      </a>
      <Link href="/profile">
        <Image
          src="/shop_user_icon.svg"
          height={30}
          width={30}
          alt="Profile"
        ></Image>
      </Link>
    </nav>
  </>
  );
};

export default Navbar;
