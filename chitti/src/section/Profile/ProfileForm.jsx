import React from 'react'
import { Camera } from '@phosphor-icons/react'
import SelectInput from '../../components/Form/SelectInput'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { updateProfile } from '../../utils/api'
import { updateUser } from '../../redux/slices/auth'
import { toast } from 'react-toastify'

export default function ProfileForm() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            name: user?.name || '',
            jobTitle: user?.jobTitle || '',
            bio: user?.bio || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await updateProfile(data);
            dispatch(updateUser(response.data.user));
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className='flex flex-col w-full p-4 space-y-6'>
            {/* Avatar */}
            <div className='relative z-30 w-full rounded-full p-1 backdrop-blur sm:max-w-36 sm:p-3'>
                <div className='relative drop-shadow-2'>
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=144`}
                        alt=''
                        className='rounded-full object-center object-cover w-36 h-36'
                    />
                    <label htmlFor='profile' className='absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2 p-2'>
                        <Camera size={20} />
                        <input type='file' name='profile' id='profile' className='sr-only' />
                    </label>
                </div>
            </div>

            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-5.5 p-6.5'>
                        <div>
                            <label className='mb-3 block text-black dark:text-white'>Name</label>
                            <input
                                type='text'
                                {...register('name')}
                                placeholder='Enter your name'
                                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            />
                        </div>
                        <div>
                            <label className='mb-3 block text-black dark:text-white'>Job Title</label>
                            <input
                                type='text'
                                {...register('jobTitle')}
                                placeholder='Enter your Job Title'
                                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            />
                        </div>
                        <div>
                            <label className='mb-3 block text-black dark:text-white'>Bio</label>
                            <input
                                type='text'
                                {...register('bio')}
                                placeholder='Enter your bio'
                                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            />
                        </div>
                        <SelectInput {...register('country')} />
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
