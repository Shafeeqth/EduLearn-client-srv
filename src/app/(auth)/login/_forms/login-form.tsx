'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLogin } from '../_hooks/use-login';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Icons } from '@/lib/utils/icons';
import { Checkbox } from '@/components/ui/checkbox';
// import ButtonAnimated from '@/components/shared/animated-button';
import { Button } from '@/components/ui/button';
import SpinnerAnimated from '@/components/shared/animated-spinner';
import { loginSchema, LoginSchemaType } from '../_schemas';

export default function LoginForm() {
  const { handleSubmit, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gamil.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              {showPassword ? (
                <Icons.eye
                  onClick={() => setShowPassword(false)}
                  size="1em"
                  className="absolute right-4 top-8 text-primary"
                />
              ) : (
                <Icons.eyeClosed
                  onClick={() => setShowPassword(true)}
                  size="1em"
                  className="absolute right-4 top-8 text-primary"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <ButtonAnimated className="w-full"> */}
        <Button
          className="w-full"
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Login
          <SpinnerAnimated isLoading={form.formState.isSubmitting || isLoading} />
        </Button>
        {/* </ButtonAnimated> */}
      </form>
    </Form>
  );
}
