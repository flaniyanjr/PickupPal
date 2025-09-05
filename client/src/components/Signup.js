import { Box, Button, FormControl, TextField, InputLabel } from '@mui/material';
import { useFormik } from 'formik'
import * as yup from 'yup';
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom';

function Signup() {

    const [signup, setSignup] = useState(true)
    const [badLogin, setBadLogin] = useState(false)
    const [badSignup, setBadSignup] = useState(false)
    const { setUser } = useOutletContext()

    const signupSchema = yup.object().shape({
        username: yup.string().min(5, 'Username is too short!').max(15, 'Username is too Long!').required('Username Required'),
        email: yup.string().email('Invalid email').required('Email Required'),
        password: yup.string().min(5, 'Password is too short!').required('Password Required'),
        passwordConfirmation: yup.string().required('Confirm Password').oneOf([yup.ref('password')], 'Password must match')
    })

    const loginSchema = yup.object().shape({
        username: yup.string(),
        password: yup.string()
    })


    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        validationSchema: signup ? signupSchema : loginSchema,
        onSubmit: async (values) => {
            const endpoint = signup ? '/users' : '/login'
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                if (response.ok) {
                    const { user } = await response.json()
                    setUser(user)
                } else {
                    if (endpoint === '/login') {
                        setBadLogin(true)
                        setBadSignup(false)
                    } else if (endpoint === '/users') {
                        setBadSignup(true)
                        setBadLogin(false)
                    }
                }
            } catch (error) {
                console.error("Error submitting form:", error)
            }
        }
    })

    function toggleSignup() {
        setSignup(current => !current)
    }

    return (
        <Box className='signup-container'>

            <div className='signup-field form'>
                <Button onClick={toggleSignup} id='signup-button'>{signup ? 'Click to Login' : 'CLick to Register'}</Button>

                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        error={!!formik.errors.username}
                        helperText={formik.errors.username}
                        required
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        className='signup-input'
                    />
                    {signup && <TextField
                        id="email"
                        label="email"
                        variant="outlined"
                        color='secondary'
                        error={!!formik.errors.email}
                        helperText={formik.errors.email}
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        className='signup-input'
                    />}
                    <TextField
                        id="password"
                        label="password"
                        type="password"
                        variant="outlined"
                        error={!!formik.errors.password}
                        helperText={formik.errors.password}
                        required
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className='signup-input'
                    />
                    {signup && <TextField
                        id="passwordConfirmation"
                        label="re-enter password"
                        type="password"
                        variant="outlined"
                        error={!!formik.errors.passwordConfirmation}
                        helperText={formik.errors.passwordConfirmation}
                        required
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        className='signup-input'
                    />}
                    <div id='signup-submit' >
                        <Button id='signup-submit' variant='contained' type='submit'>Submit</Button>
                    </div>
                    {badLogin ? <h2 id='login-error-message'>Incorrent username or password. Please try again</h2> : null}
                    {badSignup ? <h2 id='login-error-message'> Username or email already in use. Please use another one</h2> : null}
                </form>
            </div>
        </Box>
    )
}

export default Signup