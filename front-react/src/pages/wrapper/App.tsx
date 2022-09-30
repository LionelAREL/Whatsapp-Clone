import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { RootState } from '../../redux/Store';
import { dark, light } from '../../style/variable';

const App = (props:any) => {
    const session = useSelector((state: RootState) => state.session);
    React.useEffect(() => {
    },[session])
    return (
        <ThemeProvider theme={session.isDark ? dark : light}>
            {props.children}
        </ThemeProvider>

    );
};

export default App;