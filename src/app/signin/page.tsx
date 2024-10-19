
import getCurrentUser from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import React from 'react'
import SigninPage from './SigninPage';

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    return redirect("/profile");
  }
  return <SigninPage />;
}

export default page