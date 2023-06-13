import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';


function Logout() {
  return (
    <>
      <Head>
        <title>Shop | Logout</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col min-h-screen justify-center items-center px-6 py-8">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">Are you sure you want to sign out?</h1>
            <div className="space-y-4 md:space-y-6">
              <button onClick={() => signOut()} className="w-full text-white bg-neutral-800 hover:bg-neutral-950 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg px-5 py-2.5 text-center">Sign out</button>
              <p>Changed your mind? <Link href="/" className="font-bold text-neutral-950 hover:underline">Go home</Link></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

Logout.auth = true;

export default Logout;
