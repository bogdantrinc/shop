import 'shop_frontend/styles/globals.css';
import Loader from '../components/loader';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';


function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  if (status === 'loading') return (<Loader />);
  
  return children;
}

function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  )
}

export default App;
