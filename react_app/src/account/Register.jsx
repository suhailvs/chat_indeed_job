import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { history } from '_helpers';
import { authActions, alertActions } from '_store';

export { Register };

function Register() {
    const dispatch = useDispatch();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        // first_name: Yup.string()
        //     .required('First Name is required'),
        // last_name: Yup.string()
        //     .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password1: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        password2: Yup.string()
            .required('Confirm Password is required')
            .min(6, 'Confirm Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    async function onSubmit(data) {
        dispatch(alertActions.clear());
        try {
            await dispatch(authActions.register(data)).unwrap();

            // redirect to login page and display success alert
            history.navigate('/account/login');
            dispatch(alertActions.success({ message: 'Registration successful', showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error));
        }
    }

    return (
        <div className="card m-3">
            <h4 className="card-header">Register</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input name="first_name" type="text" {...register('first_name')} className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.first_name?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input name="last_name" type="text" {...register('last_name')} className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.last_name?.message}</div>
                    </div> */}
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.username?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input name="password1" type="password" {...register('password1')} className={`form-control ${errors.password1 ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password1?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input name="password2" type="password" {...register('password2')} className={`form-control ${errors.password2 ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password2?.message}</div>
                    </div>
                    <button disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Register
                    </button>
                    <Link to="../login" className="btn btn-link">Cancel</Link>
                </form>
            </div>
        </div>
    )
}
