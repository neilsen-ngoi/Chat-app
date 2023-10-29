'use client'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import Input from '@/app/components/inputs/Input'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, FieldValues, useForm } from 'react-hook-form'
import Button from '@/app/components/Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
  const session = useSession()
  // import from next/navigation not next/router
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  //use the session hook
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  // toggle between the login and register view
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // relates to api/register/routes
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    // axios reg with user creds
    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('something went wrong'))
        .finally(() => setIsLoading(false))
    }

    // auth signIN with creds
    if (variant === 'LOGIN') {
      signIn('credentials', { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invaild credentials')
          }
          if (callback?.ok && !callback?.error) {
            toast.success('Logged in')
            router.push('/users')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }
  // auth signIn with github or google
  const socialAction = (action: string) => {
    setIsLoading(true)
    // nextAuth social sign in
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid creddentials')
        }
        if (callback?.ok && !callback?.error) {
          toast.success('logged in')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    // sign-in input
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              errors={errors}
              register={register}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="password"
            type="password"
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} type="submit" fullwidth>
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        {/* login and create account button */}
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to messenger?'
              : 'Already have an account'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthForm
