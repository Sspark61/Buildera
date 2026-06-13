

import loginImg from '/src/assets/images/login.jpg'
import builderaLogo from "@/assets/images/buildera-new-logo.png";
import builderalight from "@/assets/images/buildera_logo_whitemode.png";
import { Mail } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import { useTheme } from "@/hooks/use-theme";
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { useState } from 'react';

export default function ForgotPassword() {
    const [resetError, setReseterror] = useState('');
    const [successError, setSuccessError] = useState('');
    const { mutate: Forgot, isPending } = useForgotPassword();
    const { theme } = useTheme()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-(--background)">
            <div className="hidden lg:block relative h-full bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${loginImg})` }}>
                <div className="bottom-12 left-12 absolute">
                    <h1 className='text-3xl font-bold font-heading'>Engineer <br /> Your Reality.</h1>
                    <p className='text-sm text-(--muted-foreground)'>Build the machine of your dreams with Buildera.</p>
                </div>
            </div>
            <div className="login grid place-content-center text-center ">
                <Link to="/" className='logo inline-flex items-center justify-center gap-2'><img className='w-40 rounded-lg shrink-0 object-contain' src={theme === 'dark' ? builderaLogo : builderalight} alt="Buildera logo" /></Link>
                <h3 className='text-xl font-heading'>Forgot Password?</h3>
                <div>
                    <Formik
                        initialValues={{ email: '' }}
                        validate={values => {
                            setReseterror('')
                            setSuccessError('')
                            const errors: any = {};
                            if (!values.email) {
                                errors.email = '*This field is required';
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = '*Invalid email address';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            Forgot(
                                { email: values.email },
                                {
                                    onSuccess: () => {
                                        console.log('Email Sent Successfully');
                                        setSuccessError('Email sent successfully')
                                    },
                                    onError: () => {
                                        setReseterror('*Invalid email')
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
                                    <div className='flex items-center bg-(--ring-offset) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-(--ring) focus-within:shadow-lg transition'>
                                        <Mail size={18} strokeWidth={1.5} color="gray" />

                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Email address"
                                            className="ps-2 bg-transparent outline-none w-full  placeholder:text-(--muted-foreground) text-sm"
                                        />
                                    </div>

                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className='text-start text-(--destructive) text-sm mt-1'
                                    />
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
                                    {isPending ? 'Checking Your Account' : 'Reset Password'}
                                </button>
                                <Link to='/login' className='text-sm text-(--primary)'>Back to login</Link>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

