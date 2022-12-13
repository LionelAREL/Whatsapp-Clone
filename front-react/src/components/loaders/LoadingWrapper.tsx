import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const LoadingWrapper = (props:any) => {
    if (!props.loading){
        return (
            <>
                {props.children}
            </>
        );
    }
    else{
        return(<Container>
            <LoadingLogo style={{'color': `${(props:any) => props.theme.colorMessageOutgoing}` }} />
        </Container>)
    }
};

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const LoadingLogo = styled(CircularProgress)`
    margin: 40px auto;
`;

export default LoadingWrapper;