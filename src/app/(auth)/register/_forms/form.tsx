'use client';

import { useForm } from 'react-hook-form';
import { registerSchema, RegisterSchemaType } from '../_schemas/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRegister } from '../_hooks/use-register';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Icons } from '@/lib/utils/icons';
import { Checkbox } from '@/components/ui/checkbox';
// import ButtonAnimated from '@/components/shared/animated-button';
import { Button } from '@/components/ui/button';
import SpinnerAnimated from '@/components/shared/animated-spinner';
import useEmailCheck from '../_hooks/use-email-check';

export default function SignUpForm() {
  const { handleSubmit, isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const { emailCheck, emailStatus, isCheckingEmail, setEmailStatus } = useEmailCheck();

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailStatus(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [emailStatus, emailStatus?.status, setEmailStatus]);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      // confirmPassword: '',
      acceptTerms: true,
      // avatar: '',
    },
    mode: 'onTouched',
  });

  // Trigger email validation when the email changes
  useEffect(() => {
    const email = form.watch('email');
    if (email && form.formState.errors.email === undefined) {
      emailCheck(email);
    } else {
      setEmailStatus(null);
    }
  }, [form.watch('email'), form.formState.errors.email, emailCheck, form, setEmailStatus]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  {...field}
                  disabled={isCheckingEmail}
                />
              </FormControl>
              <FormMessage>
                {isCheckingEmail ? (
                  <span className="text-primary text-center">Checking email..</span>
                ) : (
                  emailStatus && (
                    <span
                      className={`lowercase font-normal ${emailStatus.status === 'available' && 'text-primary/80'}`}
                    >
                      {emailStatus.message}
                    </span>
                  )
                )}
              </FormMessage>
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
        {/* <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="confirm password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={!!field.value} onCheckedChange={field.onChange} />
                <FormLabel
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
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
          Submit
          <SpinnerAnimated isLoading={form.formState.isSubmitting || isLoading} />
        </Button>
        {/* </ButtonAnimated> */}
      </form>
    </Form>
  );
}
