import React from 'react';

const LoadingWrapper = (props:any) => {
    if (!props.loading){
        return (
            <>
                {props.children}
            </>
        );
    }
    else{
        return(<div>loading</div>)
    }
};

export default LoadingWrapper;