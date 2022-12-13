import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthService from '../services/authentification';
import logo from './../assets/logo.png';
import background from './../assets/background.png';
import AuthForm from '../components/forms/AuthForm';

const Login = () => {
    const [error,setError] = React.useState<String>("")
    const navigate = useNavigate();

    React.useEffect(() => {
        AuthService.getCSRFToken();
    },[]);

    const onSubmitLogin = (data:any) => {
        AuthService.login(data.username,data.password).then((_) => {navigate("/chat",{replace:false})}).catch(async error => {setError((await error)?.detail)});
    };
    
    return (
        <Container>
            <Elements>  
            <Logo src={logo}/>
            <Title>Login</Title>
            <AuthForm onSubmit={onSubmitLogin} buttonText={"login"}>
                { error }
            </AuthForm>
            <p>
                <NotAccount to="/sign-up">You don't have an account ? Click here</NotAccount>
            </p>
            </Elements>
        </Container>
        );
};

const Title = styled.h1`
    color:${(props) => props.theme.fontColor} !important;

`

const NotAccount = styled(Link)`
    list-style: none;
    text-decoration: none;
    color:black;
`;
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
const Logo = styled.img`
    width:150px;
    margin-bottom: 20px;
`

export default Login;