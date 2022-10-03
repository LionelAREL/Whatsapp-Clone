import { Button, FormControl, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import React, { FunctionComponent} from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Form, Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import AuthService from "../services/authentification";
import {setSession} from './../redux/CounterSlice'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from 'styled-components'
import logo from './../assets/logo.png'
import background from './../assets/background.png'

const Login:FunctionComponent<any> = () => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [error,setError] = React.useState(null)

    const dispatch = useDispatch();
    let navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    React.useEffect(() => {
        AuthService.getCSRFToken();
    },[]);

    const onSubmitLogin = (data:any)  =>  {
            console.log(data)
            AuthService.login(data.username,data.password).then((user) => dispatch(setSession(user))).then((_) => {navigate("/chat")}).catch(async error => {setError((await error)?.detail)});
        };

    const handleClickShowPassword = () => {
            setShowPassword(true);
        };
    
        const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        };

    const cookie = new Cookies();

      return (
        <Container>
        <Elements>
        <Logo src={logo}/>
        <Forms onSubmit={handleSubmit(onSubmitLogin)}>
            <InputUsername error={errors.username && true} label="username" variant="outlined" {...register("username",{required:true})} helperText={errors.username && "username required"} />
            <InputPassword type={showPassword ? 'text' : 'password'} error={errors.password && true} label="password" variant="outlined" {...register("password",{required:true})} helperText={errors.password && "password required"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} 
            />
            <Error>
                {error}
            </Error>
            <Button type="submit" variant="contained">login</Button>
        </Forms>
        <p>
            <NotAccount to="/sign-up">You don't have an account ? Click here</NotAccount>
        </p>
        </Elements>
        </Container>
        );

}

const Error = styled.div`
    color:red;
    font-size: 18px;
    margin-bottom: 10px;
`
const Forms = styled(Form)`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Elements = styled.div`
    display:flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`
const Container = styled.div`
    display: grid;
    place-items: center;
    height:100vh;
    background:repeat url(${background})
`
const InputUsername = styled(TextField)`
    width:250px;
`
const Logo = styled.img`
    width:150px;
    margin-bottom: 20px;
`
const InputPassword = styled(TextField)`
    width:250px;
    margin:10px 0 !important;
`

const NotAccount = styled(Link)`
    list-style: none;
    text-decoration: none;
    color:black;
`;

export default Login;