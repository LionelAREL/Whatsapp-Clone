import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Form } from 'react-router-dom';

type Props = {
    onSubmit: any,
    buttonText:string,
    children?:React.ReactNode,
  };

const AuthForm = ({onSubmit,children,buttonText}:Props) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    function handleClickShowPassword() {
        setShowPassword((password) => !password);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const { register, handleSubmit, formState: { errors } } = useForm<any>();

    return (
        <Forms onSubmit={handleSubmit(onSubmit)}>
            <InputUsername error={errors.username && true} label="username" variant="outlined" {...register("username",{required:true})} helperText={errors.username && "username required"} />
            <InputPassword type={showPassword ? 'text' : 'password'} error={errors.password && true} label="password" variant="outlined" {...register("password",{required:true})} helperText={errors.password && "password required"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword()}
                      aria-label="toggle password visibility"
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
                {children}
            </Error>
            <Button type="submit" variant="contained">{buttonText}</Button>
        </Forms>
    );
};

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
const InputUsername = styled(TextField)`
    width:250px;
`
const InputPassword = styled(TextField)`
    width:250px;
    margin:10px 0 !important;
`

export default AuthForm;