'use client';

import Container from '@/components/layout/container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import LoginForm from './_forms/login-form';
import Link from 'next/link';
import SocialAuthOptions from '@/components/shared/social-auth';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Login Page',
//   description: 'Login to access your account and explore EduLearn.',
// };

export default function LoginPage() {
  return (
    <main className="gradient-to-tr from-[rgb(235,233,241)] from-0% via-blue  to-[#4f20fb] to-100% flex items-center justify-center px- sm:px-6 lg:px-8">
      <Container className="mx-auto w-full max-w-md sm:max-w-md p-6 sm:px-1 lg:px-2">
        <Card className="w-full border-none shadow-lg  rounded-lg bg-white/10 backdrop-blur-md p-6 sm:p-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
            <p className="mt-2 text-sm text-black-300">
              Login to access your account and explore EduLearn.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="flex justify-end pt-2 pe-2">
              <small className=" text-gray-400 ">
                Don&apos;t have an account?
                <Link href="/register" className=" font-bold text-primary underline ml-2">
                  Signup
                </Link>
              </small>
            </div>
            <SocialAuthOptions />
          </CardContent>
          <CardFooter className="text-center"></CardFooter>
        </Card>
      </Container>
    </main>
  );
}
