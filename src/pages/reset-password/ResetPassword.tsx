

import loginImg from '/src/assets/images/login.jpg'
import builderaLogo from "@/assets/images/buildera-new-logo.png";
import builderalight from "@/assets/images/buildera_logo_whitemode.png";
import { Lock, Eye } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "@/hooks/use-theme";
import { useResetPassword } from '../../hooks/useResetPassword';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from "framer-motion";
export default function ResetPassword() {

    const [showPassword, setShowPassword] = useState(false);
    const [resetError, setReseterror] = useState('');
    const [successError, setSuccessError] = useState('');
    const { mutate: Reset, isPending } = useResetPassword();
    const { theme } = useTheme()
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const navigateToLogin = () => {
        setTimeout(() => {
            navigate('/login')
        }, 2000);
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-(--background)">
            <div className="hidden lg:block relative h-full">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loginImg})` }} />
                <div className="bottom-12 left-12 absolute z-10">
                    <h1 className='text-3xl font-bold text-white/80'>Engineer <br /> Your Reality.</h1>
                    <p className='text-sm text-(--muted-foreground)'>Build the machine of your dreams with Buildera.</p>
                </div>
            </div>
            <div className="login grid place-content-center text-center ">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
                    <Link to="/" className='logo inline-flex items-center justify-center gap-2'><img className='w-40 rounded-lg shrink-0 object-contain' src={theme === 'dark' ? builderaLogo : builderalight} alt="Buildera logo" /></Link>
                    <h3 className='text-xl font-heading'>Reset Password</h3>
                    <div>
                        <Formik
                            initialValues={{ password: '', confirmPassword: '' }}
                            validate={values => {
                                setReseterror('')
                                setSuccessError('')
                                const errors: any = {};
                                if (!values.password) {
                                    errors.password = '*This field is required';
                                }
                                if (!values.confirmPassword) {
                                    errors.confirmPassword = '*This field is required'
                                } else if (values.password !== values.confirmPassword) {
                                    errors.confirmPassword = "*Password doesn't match"
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                Reset(
                                    { token: token!, password: values.password, cPassword: values.confirmPassword },
                                    {
                                        onSuccess: () => {
                                            setSuccessError('Password reset successfully redirecting to login page ...');
                                            navigateToLogin();
                                        },
                                        onError: () => {
                                            setReseterror('*Invalid or expired reset token')
                                            setSubmitting(false)
                                        },
                                        onSettled: () => {
                                            setSubmitting(false)
                                        }
                                    }
                                )
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className='space-y-4 pt-4 w-7/8 md:w-full grid mx-auto'>
                                    <div>
                                        <div className='mb-3'>
                                            <div className='flex items-center bg-(--ring-offset) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-(--ring) focus-within:shadow-lg transition '>
                                                <Lock size={16} strokeWidth={2} color="gray" />
                                                <Field id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="ps-2 bg-transparent outline-none w-full text-white placeholder:text-(--muted-foreground) text-sm" />
                                                <Eye size={18} strokeWidth={1} className='cursor-pointer' onClick={() => setShowPassword(prev => !prev)} />
                                            </div>
                                            <ErrorMessage name="password" component="div" className='text-start text-(--destructive) text-sm mt-1' />
                                        </div>
                                        <div>
                                            <div className='flex items-center bg-(--ring-offset) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-(--ring) focus-within:shadow-lg transition '>
                                                <Lock size={16} strokeWidth={2} color="gray" />
                                                <Field id="confirmPassword" type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm password" className="ps-2 bg-transparent outline-none w-full  placeholder:text-(--muted-foreground) text-sm" />
                                                <Eye size={18} strokeWidth={1} className='cursor-pointer' onClick={() => setShowPassword(prev => !prev)} />
                                            </div>
                                            <ErrorMessage name="confirmPassword" component="div" className='text-start text-(--destructive) text-sm mt-1' />
                                        </div>
                                        {resetError &&
                                            (<p className='text-sm text-(--destructive) text-start mt-1'>
                                                {resetError}
                                            </p>
                                            )}
                                        {successError &&
                                            (<p className='text-sm text-green-400 text-start mt-1'>
                                                {successError}
                                            </p>
                                            )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isPending}
                                        className='border w-full rounded-md py-2 text-sm text-bold bg-(--ring) hover:bg-(--hover-blue) cursor-pointer transition-all'
                                    >
                                        {isPending ? 'Reseting your password' : 'Reset Password'}
                                    </button>
                                    <Link to='/login' className='text-sm text-(--primary)'>Back to login</Link>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

