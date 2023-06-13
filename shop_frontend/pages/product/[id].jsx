import Loader from '../../components/loader';
import Failed from '../../components/failed';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SHOP_BACKEND_URL;


function Dashboard() {
  const router = useRouter();
  const { data: product, error, isLoading } = useSWR(`/products/${ router.query?.id }`);
  
  if (error?.response?.status === 404) {
    router.push("/?error=InvalidProductID");
    return (<Loader />);
  };
  if (error) return (<Failed />);
  if (isLoading) return (<Loader />);

  const data_table = [];
  if (product?.data) {
    let {datasheet, ...clean_data} = product?.data
    Object.entries(clean_data).forEach(([key, value]) => {
      data_table.push(
        <tr key={key} className="group bg-white hover:text-white hover:bg-neutral-950">
          <th scope="row" className="capitalize text-gray-900 group-hover:text-white rounded-l-lg px-6 py-4 font-medium whitespace-nowrap">
            { key.replaceAll("_", " ") }
          </th>
          <td className="px-6 py-4 rounded-r-lg">
            { value }
          </td>
        </tr>
      );
    });
};

  return (
    <div className="flex flex-row min-h-screen justify-center items-center px-6 py-8">
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-5xl xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6">
          <Image
            src={product?.image}
            width={500}
            height={500}
            alt={product?.data?.model}
            className="object-scale-down h-96 rounded-md m-auto"
          ></Image>
          <div className="space-y-4 md:space-y-6">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm md:text-base text-left text-gray-500">
                <thead className="uppercase bg-neutral-600 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-lg">
                      Specifications
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-r-lg">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-semibold text-gray-900">
                    <th scope="row" className="px-6 py-3">
                      Product
                    </th>
                    <td className="px-6 py-6 text-center">
                      {product?.name}
                    </td>
                  </tr>
                  <tr className="font-semibold text-gray-900">
                    <th scope="row" className="px-6 py-3">
                      Datasheet
                    </th>
                    <td className="px-6 py-6 text-center">
                      <Link
                        href={product?.data?.datasheet ? product?.data?.datasheet : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-white bg-neutral-800 hover:bg-neutral-950 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg px-5 py-2.5 text-center"
                      >
                        Download
                      </Link>
                    </td>
                  </tr>
                  { data_table }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Product() {
  const { data: session, status, update } = useSession();

  return (
    <SWRConfig 
      value={{
        fetcher: (url) => axios
          .get(url, {headers: {Authorization: "Token " + session?.accessToken}})
          .then(res => res.data)
      }}
    >
      <Head>
        <title>Shop | Product</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Dashboard />
    </SWRConfig>
  )
}

Product.auth = true;

export default Product;
