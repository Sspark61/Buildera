
import loginImg from '/src/assets/login.jpg'
import { Mail, Lock } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FcGoogle } from "react-icons/fc";
export default function login() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-[#12151c]">
            <div className="hidden lg:block relative h-full bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${loginImg})` }}>
                <div className="bottom-12 left-12 absolute">
                    <h1 className='text-3xl font-bold font-heading'>Engineer <br /> Your Reality.</h1>
                    <p className='text-sm'>Build the machine of your dreams with Buildera.</p>
                </div>
            </div>
            <div className="login grid place-content-center text-center ">
                <a href="" className='logo inline-flex items-center justify-center gap-2 mb-4'><img className='w-1/10' src="/src/assets/buildera-logo.png" alt="" /><span className='font-heading text-bold'>Buildera</span></a>
                <h3 className='text-xl font-heading'>Welcome back</h3>
                <p className='text-sm text-gray-400 pb-4'>Log in to your account</p>
                <div>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={values => {
                            const errors = {};
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
                            else if (values.password.length < 8) {
                                errors.password = "*Password must be at least 8 characters"
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 400);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className='space-y-4 pt-4 w-5/6 grid mx-auto'>
                                <div className='flex items-center bg-(--background) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-[#4e78da] focus-within:shadow-lg focus-within:[#4e78da] transition '>
                                    <Mail size={18} strokeWidth={1.5} color="gray" />
                                    <Field type="email" name="email" placeholder="Email address" className="ps-2 bg-transparent outline-none w-full text-white placeholder:text-slate-500 text-sm" />
                                </div>
                                <ErrorMessage name="email" component="div" className='text-start text-red-700 text-sm' />
                                <div className='flex items-center bg-(--background) border border-(--border) rounded-md px-3 py-2 sm:py-3 focus-within:border-[#4e78da] focus-within:shadow-lg focus-within:[#4e78da] transition '>
                                    <Lock size={18} strokeWidth={1.5} color="gray" />
                                    <Field type="password" name="password" placeholder="Password" className="ps-2 bg-transparent outline-none w-full text-white placeholder:text-slate-500 text-sm" />

                                </div>
                                <ErrorMessage name="password" component="div" className='text-start text-red-700 text-sm ' />
                                <button type="submit" disabled={isSubmitting} className='border w-full rounded-md py-2 text-sm text-bold bg-(--primary) hover:bg-[#395cae] cursor-pointer transition-all'>
                                    Log in
                                </button>
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-px flex-1 bg-white/10"></div>

                                    <span className="text-gray-400 text-xs">or</span>

                                    <div className="h-px flex-1 bg-white/10"></div>
                                </div>
                                <button type="submit" className='flex justify-center items-center mx-auto text-center border w-full rounded-md py-2 hover:bg-gray-800 cursor-pointer transition-all'>
                                    <FcGoogle size={16} />
                                    <span className='ps-2 text-sm'>Google</span>
                                </button>
                                <p className='text-xs text-gray-500'>Don't have an account? <a href="" className="text-blue-500">Sign up</a></p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}
