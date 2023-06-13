import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SHOP_BACKEND_URL;

const registerSchema = yup.object().shape({
  email: yup.string()
    .required("Email required.")
    .matches(/[@]/, "Must have one @ character.")
    .email("Must be a valid email."),
  password: yup.string()
    .required("Password  required.")
    .matches(/[0-9]/, "Must have at least one digit.")
    .matches(/[a-z]/, "Must have at least one lower case letter.")
    .matches(/[A-Z]/, "Must have at least one upper case letter.")
    .matches(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/, "Must have at least one special character.")
    .min(8, "Must have at least 8 characters.")
    .max(25, "Must not exceed 25 characters."),
  passwordConfirm: yup.string()
    .required("Confirm your password.")
    .oneOf([yup.ref("password")], "Passwords do not match."),
  terms: yup.boolean()
    .required()
    .oneOf([true], "Accept terms and conditions to create an account."),
}).required();


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return {
    props: {},
  }
}

function Register() {
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const onSubmit = async (data) => {
    const registerDetails = {
      email: data.email,
      password: data.password,
    };
    await axios.post("/auth/register", registerDetails)
      .then(function (response) {
        router.push("/login");
      })
      .catch(function (error) {
        if (error.response.data?.email) {
          setError("email", { message: error.response.data?.email })
        }
        if (error.response.data?.password) {
          setError("password", { message: error.response.data?.password })
          setError("passwordConfirm")
        }
        // TODO: Show error message on UI if it fails for other reasons
      });
  };
  
  return (
    <>
      <Head>
          <title>Shop | Register</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col min-h-screen justify-center items-center px-6 py-8">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">Create your account</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block mb-2">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">Your email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  </div>
                  <input type="email" placeholder="person.doe@email.com" {...register("email")} className={`block w-full pl-10 p-2.5 rounded-lg border focus:ring-1 focus:outline-none ${ errors.email ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
                </div>
                <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="password" className="block mb-2">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">Password</span>
                </label>
                <input type="password" placeholder="••••••••" {...register("password")} className={`block w-full p-2.5 rounded-lg border focus:ring-1 focus:outline-none ${ errors.password ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
                <p className="mt-2 text-sm text-red-600">{errors.password?.message}</p>
              </div>
              <div>
                <label htmlFor="passwordConfirm" className="block mb-2">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">Confirm password</span>
                </label>
                <input type="password" placeholder="••••••••" {...register("passwordConfirm")} className={`block w-full p-2.5 rounded-lg border focus:ring-1 focus:outline-none ${ errors.passwordConfirm ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
                <p className="mt-2 text-sm text-red-600">{errors.passwordConfirm?.message}</p>
              </div>
              <div>
                <div className="flex items-start">
                  <input type="checkbox" aria-describedby="terms" {...register("terms")} className="w-5 h-5 accent-neutral-950" />
                  <label htmlFor="terms" className="ml-2 text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500">I agree with the <Link href="https://github.com/bogdantrinc/shop" target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-950 hover:underline">terms and conditions</Link></label>
                </div>
                <p className="mt-2 text-sm text-red-600">{errors.terms?.message}</p>
              </div>
              <button type="submit" className="w-full text-white bg-neutral-800 hover:bg-neutral-950 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg px-5 py-2.5 text-center">Create new account</button>
              <p>Already have an account? <Link href="/login" className="font-bold text-neutral-950 hover:underline mx-auto">Sign in</Link></p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
