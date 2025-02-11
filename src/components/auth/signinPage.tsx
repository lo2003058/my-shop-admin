'use client';

import { signIn } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignInFormData } from '@/app/api/auth/signin/types';
import Swal from 'sweetalert2';

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (res?.error) {
        await Swal.fire({
          icon: 'error',
          title: 'Sign In Error',
          text: res.error || 'An error occurred during sign in',
          position: 'center',
          timer: 1500,
        });
      } else {
        await Swal.fire({
          position: 'center',
          icon: 'success',
          text: `Welcome back!`,
          showConfirmButton: false,
          timer: 1500,
        });
        router.push('/account'); // Redirect to account page
      }
    } catch (err: unknown) {
      let errorMessage = 'An error occurred during sign in';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Sign In Error',
        text: errorMessage,
        timer: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-lg shadow-lg"
          noValidate
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Sign In
          </h2>

          {/* Identifier  Field */}
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              {...register('identifier', {
                required: 'Identifier is required',
              })}
              placeholder="Enter your email or username"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.identifier
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="Enter your password"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
