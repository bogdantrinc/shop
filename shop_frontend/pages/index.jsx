import Loader from '../components/loader';
import Failed from '../components/failed';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import useSWR, { SWRConfig } from 'swr';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SHOP_BACKEND_URL;

const searchSchema = yup.object().shape({
  search: yup.string()
    .max(25, "Must not exceed 25 characters."),
}).required();


function Search({ setPageID, setSearch }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(searchSchema),
  });
  const onSubmit = (data) => {
    setPageID(1);
    setSearch(data.search);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-12 px-10 sm:max-w-5xl m-auto">   
      <label htmlFor="search" className="mb-2 text-gray-900 sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input {...register("search")} type="search" placeholder="Search products..." className={`block w-full p-4 pl-10 pr-24 border rounded-lg ${ errors.search ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
        <button type="submit" className="text-white bg-neutral-800 hover:bg-neutral-950 absolute right-2.5 bottom-2 focus:ring-4 focus:outline-none focus:ring-neutral-700 font-medium rounded-lg px-4 py-2">Search</button>
      </div>
      <p className="mt-2 text-sm text-red-600">{errors.search?.message}</p>
    </form>
  );
};

function Pagination({ previous, next, setPageID }) {
  let previousButtonID = 1;
  let nextButtonID = 1;
  if (previous) {
    const id = new URL(previous).searchParams.get("page");
    previousButtonID = id ? id : 1;
  };
  if (next) {
    nextButtonID = new URL(next).searchParams.get("page");
  };

  return (
    <div className="flex flex-row justify-center pb-10">
      <button onClick={() => setPageID(previousButtonID)} className={ previous ? "inline-flex items-center px-4 py-2 m-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700" : "invisible"}>
        <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
        Previous
      </button>
      <button onClick={() => setPageID(nextButtonID)} className={ next ? "inline-flex items-center px-4 py-2 m-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700" : "invisible"}>
        Next
        <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

function Dashboard() {
  const [pageID, setPageID] = useState(1);
  const [search, setSearch] = useState("");
  const { data: products, error, isLoading } = useSWR({ url: "/products", args: [pageID, search] });
  
  if (error) return (<Failed />);
  if (isLoading) return (<Loader />);
  if (!products?.results?.length) return (
    <>
      <Search setPageID={setPageID} setSearch={setSearch} />
      <h1 className="font-bold text-4xl text-center sm:text-6xl px-10 py-52">No results found.</h1>
    </>
  );

  return (
    <>
      <Search setPageID={setPageID} setSearch={setSearch} />
      <div className="container m-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.results.map((product) => (
          <Link
            href={{
              pathname: "/product/[id]",
              query: { id: product?.id },
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="tile p-6 h-[470px] bg-white rounded-lg shadow"
            key={product?.id}
          >
            <Image
              src={product?.image}
              height={500}
              width={500}
              alt={product?.data?.model}
              className="mx-auto object-scale-down h-80 rounded-md"
            ></Image>
            <div className="self-baseline">
              <h1 className="p-4 text-center">{product?.name}</h1>
              <button className="w-full text-white bg-neutral-800 hover:bg-neutral-950 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg px-5 py-2.5 text-center">Learn more</button>
            </div>
          </Link>
        ))}
      </div>
      <Pagination previous={products?.previous} next={products?.next} setPageID={setPageID} />
    </>
  );
};

function Home() {
  const { data: session, status, update } = useSession();

  return (
    <SWRConfig 
      value={{
        fetcher: ({ url: url, args: [pageID, search] }) => axios
          .get(url + `?page=${pageID}&search=${search}`, {headers: {Authorization: "Token " + session?.accessToken}})
          .then(res => res.data)
      }}
    >
      <Head>
        <title>Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Dashboard />
    </SWRConfig>
  )
}

Home.auth = true;

export default Home;
