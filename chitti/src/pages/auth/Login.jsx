import React from 'react'
import Logo from '../../components/Logo'
import { Link, useNavigate } from 'react-router-dom'
import LoginIllustration from "../../images/auth/chat-login.svg"
import { EnvelopeSimple, Lock } from '@phosphor-icons/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser } from '../../redux/slices/auth'

// Validation Schema
const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is requried'),
    password: yup.string().min(6, 'Password must be atleast 6 charcaters').required('Password is requried'),
})

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: ''

        }
    })

    const onSubmit = async (data) => {
        console.log(data, 'From Data: Login');

        await dispatch(LoginUser(data, navigate));
    };

    return (
        <div className='border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen'>
            <div className='flex flex-wrap items-center h-full '>
                <div className='hidden w-full xl:block xl:w-1/2'>
                    <div className='py-17.5 px-26 text-center'>
                        <Link to='/' className='mb-5.5 inline-block'>
                            <Logo />
                        </Link>

                        <p className='2xl:px-20'>
                            Hey there 👋, Welcome Back. Login to chat with your friends
                        </p>
                        <span className='mt-15 inline-block'>
                            <img src={LoginIllustration} alt='login' className='h-115 w-auto object-cover object-center ' />
                        </span>

                    </div>
                </div>

                <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 xl:px-44'>
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <span className='mb-1.5 block font-medium'>Start for free

                        </span>

                        <h2 className='mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl4'>
                            Sign In to Chati
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} action=''>

                            <div className='mb-4' >
                                <label htmlFor='' className='mb-2.5 block font-medium text-black dark:text-white'>Email

                                </label>
                                <div className='relative'>

                                    <input
                                        type='email'
                                        {...register('email')}
                                        placeholder='Enter your email'
                                        className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none
                                        focus:border-primary dark:border-form-strokedark
                                        dark:bg-form-input dark:text-white ${errors.email ? 'border-red focus:border-red' : 'border-stroke'
                                            }`} />

                                    <span className='absolute right-4 top-4'>
                                        <EnvelopeSimple size={24} />
                                    </span>
                                </div>
                                {errors.email && (
                                    <p className='text-red text-sm'>{errors.email.message}</p>
                                )}
                            </div>
                            <div className='mb-6' >
                                <label htmlFor='' className='mb-2.5 block font-medium text-black dark:text-white'>Password

                                </label>
                                <div className='relative'>

                                    <input
                                        type='password'
                                        {...register('password')}
                                        placeholder='6+ characters, 1 Capital Letter'
                                        className={`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none
                                        focus:border-primary 
                                        dark:border-form-strokedark
                                        dark:bg-form-input dark:text-white ${errors.password ? 'border-red focus:border-red' : 'border-stroke'
                                            }`} />

                                    <span className='absolute right-4 top-4'>
                                        <Lock size={24} />
                                    </span>
                                </div>
                                {errors.password && (
                                    <p className='text-red text-sm'>{errors.password.message}</p>
                                )}
                            </div>

                            <div className='mb-5'>
                                <button
                                    type='Submit'
                                    disabled={isSubmitting || isLoading}
                                    className='w-full cursor-pointer border border-primary bg-primary p-4 rounded-lg text-white transition hover:bg-opacity-90'
                                >
                                    {isSubmitting || isLoading ? 'Submitting...' : 'Sign In'}
                                </button>
                            </div>



                            <div className='mt-6 text-center'>
                                <p>
                                    Don't have any account? {''}
                                    <Link to='/auth/signup' className='text-primary'>
                                        Sign up
                                    </Link>
                                </p>
                            </div>


                        </form>

                    </div>
                </div>

            </div >

        </div >
    );
}
