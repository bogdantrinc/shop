import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const profileSchema = yup.object().shape({
  email: yup.string()
    .required("Email required.")
    .email("Must be a valid email."),
  full_name: yup.string()
    .required("Name required.")
    .matches(/^[\p{Letter}\p{Mark}\s-]+$/gu, "Only letters, spaces and hyphens allowed.")
    .min(2, "Must have at least 2 characters.")
    .max(25, "Must not exceed 25 characters."),
  avatar: yup.mixed()
    .test("type", "File type not allowed.", (files) => {
      const file_types = ["image/jpg", "image/jpeg", "image/png"];
      return files[0] ? file_types.includes(files[0].type) : true;
    })
    .test("fileSize", "The file is too large.", (files) => {
      return files[0] ? files[0].size <= 2100000 : true;
    }),
  delete_avatar: yup.boolean(),
}).required();


function Form({ session, update }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(profileSchema),
    values: {
      email: session?.user?.email,
      full_name: session?.user?.full_name,
    },
  });
  const onSubmit = async (data) => {
    const profileDetails = {
      email: data.email,
      full_name: data.full_name,
      avatar: data.delete_avatar ? "" : data.avatar[0],
    };
    await axios.patchForm(session?.user?.url, profileDetails, {headers: {Authorization: "Token " + session.accessToken}})
      .catch(function (error) {
        // TODO: Show an error message on UI
      });
    reset();
    update();
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="block mb-2">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">Your email</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>
          <fieldset disabled>
            <input type="email" {...register("email")} placeholder="Enter your email here..." className={`cursor-not-allowed text-gray-500 pl-10 block w-full p-2.5 rounded-lg border focus:ring-1 focus:outline-none ${ errors.email ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
          </fieldset>
        </div>
        <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
      </div>
      <div>
        <label htmlFor="full_name" className="block mb-2">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block">Your full name</span>
        </label>
        <input type="text" {...register("full_name")} placeholder="Enter your name here..." className={`block w-full p-2.5 rounded-lg border focus:ring-1 focus:outline-none ${ errors.full_name ? "text-red-800 bg-red-50 border-red-500 focus:ring-red-500 focus:border-red-500" : "bg-gray-50 border-gray-300 focus:ring-neutral-700 focus:border-neutral-700" }`} />
        <p className="mt-2 text-sm text-red-600">{errors.full_name?.message}</p>
      </div>
      <div>
        <div>
          <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900">Upload file</label>
          <input type="file" {...register("avatar")} aria-describedby="file_input_help" className="block w-full border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
          <p id="file_input_help" className="mt-1 text-sm text-gray-500">JPG, JPEG or PNG (MAX. 2MB).</p>
        </div>
        <p className="mt-2 text-sm text-red-600">{errors.avatar?.message}</p>
      </div>
      <div>
        <label className="relative inline-flex items-center mb-4 cursor-pointer">
          <input type="checkbox" {...register("delete_avatar")} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-zinc-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-950"></div>
          <span className="ml-3">Delete profile picture</span>
        </label>
      </div>
      <button type="submit" className="w-full text-white bg-neutral-800 hover:bg-neutral-950 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg px-5 py-2.5 text-center">Update</button>
    </form>
  );
}

function Profile() {
  const { data: session, status, update } = useSession();
  return (
  <>
    <Head>
      <title>Shop | Profile</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main>
      <div className="flex flex-col min-h-screen justify-center items-center px-6 py-8">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Image
              priority
              src={session?.user?.avatar ? session?.user?.avatar : "/shop_user_avatar.png"}
              height={300}
              width={300}
              alt="Profile picture"
              className="m-auto rounded-full"
            ></Image>
            <Form session={session} update={update} />
          </div>
        </div>
      </div>
    </main>
  </>
  );
}

Profile.auth = true;

export default Profile;
