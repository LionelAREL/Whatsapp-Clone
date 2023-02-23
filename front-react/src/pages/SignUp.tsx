import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthService from '../services/authentification';
import logo from './../assets/logo.png'
import background from './../assets/background.png'
import AuthForm from '../components/forms/AuthForm';

const SignUp = () => {
    const [error,setError] = React.useState<{username:String[]} | undefined>(undefined)
    const [showRedirection,setShowRedirection] = React.useState<boolean>(false)
    const dispatch = useDispatch();

    React.useEffect(() => {
        AuthService.getCSRFToken();
    },[]);

    const onSubmitRegister = (data:any) => {
        setError(undefined);
        AuthService.signUp(data.username,data.password).then(
            (user) => {
                setShowRedirection((showRedirection) => !showRedirection)           
            }
        ).catch(
            async error => {
                setError((await error));
            }
        );
    };
    
    return (
        <Container>
        <Elements>  
        <Logo src={logo}/>
        <Title>Register</Title>
        <AuthForm onSubmit={onSubmitRegister} buttonText={"create an account"}>
            {error?.username[0]}
            {showRedirection ? 
                <Already style={{color:"#209f14"}} to="/login">You successfully create your account, click here to login</Already>
            : 
                null
            }
        </AuthForm>
        <p>
            <Already to="/login">You already have an account ? Click here</Already>
        </p>
        </Elements>
        </Container>
        );
};

const Title = styled.h1`
    color:${(props) => props.theme.fontColor} !important;

`

const Already = styled(Link)`
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

export default SignUp;