import loginImg from '/src/assets/images/login.jpg'
import builderaLogo from "@/assets/images/buildera-new-logo.png";
import builderalight from "@/assets/images/buildera_logo_whitemode.png";
import { Mail, Lock, Eye } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin'
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from "@/hooks/use-theme";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('')
    const { mutate: login, isPending } = useLogin()
    const navigate = useNavigate()
    const location = useLocation() // 1. Access the location context to check for state metadata
    const { theme } = useTheme()

    // 2. Check where they came from, default back to home ('/') if they navigated directly to login
    const from = location.state?.from?.pathname || '/';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-(--background)">
            <div className="hidden lg:block relative h-full bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${loginImg})` }}>
                <div className="bottom-12 left-12 absolute">
                    <h1 className='text-3xl font-bold font-heading'>Engineer <br /> Your Reality.</h1>
                    <p className='text-sm text-(--muted-foreground)'>Build the machine of your dreams with Buildera.</p>
                </div>
            </div>
            <div className="login grid place-content-center text-center ">
                <Link to="/" className='logo inline-flex items-center justify-center gap-2'><img className='w-40 pb-0 rounded-lg shrink-0 object-contain' src={theme === 'dark' ? builderaLogo : builderalight} alt="Buildera logo" /></Link>
                <h3 className='text-xl font-heading'>Welcome back</h3>
                <p className='text-sm text-(--muted-foreground) pb-4'>Log in to your account</p>
                <div>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={values => {
                            setLoginError('')
                            const errors: {
                                email?: string;
                                password?: string;
                            } = {};
                            if (!values.email) {
                                errors.email = '*This field is required';
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = '*Invalid email address';
                            }
                            if (!values.password) {
                                errors.password = '*This field is required';
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            login(
                                { email: values.email, password: values.password },
                                {
                                    onSuccess: () => {
                                        // 3. Redirect back to the dynamic 'from' path instead of a static target
                                        navigate(from, { replace: true })
                                    },
                                    onError: () => {
                                        setLoginError('*Invalid email or password')
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
                                </div>
                                <div>
                                    <div className='flex items-center bg-(--ring-offset) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-(--ring) focus-within:shadow-lg transition '>
                                        <Lock size={18} strokeWidth={1.5} color="gray" />
                                        <Field id="show" type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="ps-2 bg-transparent outline-none w-full  placeholder:text-(--muted-foreground) text-sm" />
                                        <Eye size={18} strokeWidth={1} className='cursor-pointer' onClick={() => setShowPassword(prev => !prev)} />
                                    </div>
                                    <ErrorMessage name="password" component="div" className='text-start text-(--destructive) text-sm mt-1' />
                                    {loginError &&
                                        (<p className='text-sm text-(--destructive) text-start mt-1'>
                                            *Invalid email or password
                                        </p>
                                        )}
                                    <Link className='text-(--muted-foreground) text-xs text-start underline *:underline-offset-4 cursor-pointer' to="/forgotPassword">Forgot Password?</Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || isPending}
                                    className='border w-full rounded-md py-2 text-sm text-bold bg-(--ring) hover:bg-(--hover-blue) cursor-pointer transition-all'
                                >
                                    {isPending ? 'Logging in...' : 'Log in'}
                                </button>
                                <p className='text-xs text-(--muted-foreground)'>Don't have an account? <Link to="/signup" className="text-(--ring) hover:underline">Sign up</Link></p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}