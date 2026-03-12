import React from 'react'
import { useForm } from 'react-hook-form'
import { updatePassword } from '../../utils/api'
import { toast } from 'react-toastify'

export default function UpdatePasswordForm() {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            await updatePassword(data);
            toast.success('Password updated successfully!');
            reset();
        } catch (error) {
            toast.error(error?.message || 'Failed to update password');
        }
    };

    return (
        <div className='flex flex-col w-full p-4 space-y-6'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-5.5 p-6.5'>
                        <div>
                            <label className='mb-3 block text-black dark:text-white'>Current Password</label>
                            <input
                                type='password'
                                {...register('currentPassword', { required: true })}
                                placeholder='Enter your current password'
                                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            />
                        </div>
                        <div>
                            <label className='mb-3 block text-black dark:text-white'>New Password</label>
                            <input
                                type='password'
                                {...register('newPassword', { required: true, minLength: 6 })}
                                placeholder='Choose new password'
                                className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
