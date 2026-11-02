import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik'
import * as yup from 'yup';
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import { User } from "../types"

interface OutletContext {
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

function Signup() {

    const [signup, setSignup] = useState(false)
    const [formError, setFormError] = useState('')
    const { setUser } = useOutletContext<OutletContext>()

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
            setFormError('')
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
                } else if (signup) {
                    setFormError('Username or email already in use. Please use another one')
                } else {
                    setFormError('Incorrect username or password. Please try again')
                }
            } catch (error) {
                console.error("Error submitting form:", error)
                setFormError('Could not reach the server. Please try again.')
            }
        }
    })

    function toggleSignup() {
        setSignup(current => !current)
        setFormError('')
        formik.setTouched({}, false)
    }

    const usernameError = formik.touched.username && formik.errors.username
    const emailError = formik.touched.email && formik.errors.email
    const passwordError = formik.touched.password && formik.errors.password
    const confirmError = formik.touched.passwordConfirmation && formik.errors.passwordConfirmation

    return (
        <Box sx={{ maxWidth: 440, mx: 'auto', mt: 6, px: 2 }}>
            <Paper variant="outlined" sx={{ p: 3, borderColor: 'primary.dark' }}>
                <Typography variant="h5" component="h1">
                    {signup ? 'Create an account' : 'Log in'}
                </Typography>

                <Stack component="form" spacing={2} onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        id="username"
                        name="username"
                        label="Username"
                        autoComplete="username"
                        required
                        error={Boolean(usernameError)}
                        helperText={usernameError}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {signup && <TextField
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        required
                        error={Boolean(emailError)}
                        helperText={emailError}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />}
                    <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete={signup ? 'new-password' : 'current-password'}
                        required
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {signup && <TextField
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        label="Re-enter password"
                        type="password"
                        autoComplete="new-password"
                        required
                        error={Boolean(confirmError)}
                        helperText={confirmError}
                        value={formik.values.passwordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />}

                    {formError ? <Alert severity="error">{formError}</Alert> : null}

                    <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
                        {signup ? 'Register' : 'Log in'}
                    </Button>
                    <Button onClick={toggleSignup}>
                        {signup ? 'Already have an account? Log in' : 'New here? Create an account'}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Signup