import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SHOP_BACKEND_URL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 9 * 60 * 60, // 9 hours
  },
  providers: [
    CredentialsProvider({
      id: 'shop-login',
      name: 'Shop account',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const credentialDetails = {
          username: credentials.email,
          password: credentials.password,
        };
        const user = await axios.post('/auth/login', credentialDetails)
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            // TODO: Handle error
            return null
          });
        return user
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.userUrl = user.user.url;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      const profile = await axios.get(token.userUrl, {headers: {Authorization: 'Token ' + session.accessToken}})
        .then(function (response) {
          return response.data
        })
        .catch(function (error) {
          // TODO: Handle error
          return null
        });
      session.user = profile;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  events: {
    async signOut(message) {
      await axios.post('/auth/logout', {}, {
        headers: {'Content-Type': 'application/json', Authorization: 'Token ' + message.token.accessToken}
      })
        .catch(function (error) {
          console.info(error.response.data.detail);
        });
    },
  },
}

export default NextAuth(authOptions);
