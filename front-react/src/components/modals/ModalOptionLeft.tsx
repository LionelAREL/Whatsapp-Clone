import React from 'react';
import styled, { useTheme } from 'styled-components';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Modal } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setDark } from '../../redux/CounterSlice';

const ModalOptionLeft = ({openModal,handleCloseModal,handleClose}:any) => {
    const theme:any = useTheme();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(true);

    function handleChange (event: React.ChangeEvent<HTMLInputElement>){
        setValue((event.target as any).value);
        dispatch(setDark((event.target as any).value == 'true' ? true : false))
    }
    
    return (
        <Modal
        open={openModal}
        onClose={()=>{handleCloseModal();handleClose()}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <ModalContainer>
            <div>
            <FormControl>
            <FormLabel style={{color:theme.fontColor}}>Theme</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value={true} control={<Radio />} label="Darkmode" />
                <FormControlLabel value={false} control={<Radio />} label="LightMode" />
            </RadioGroup>
            </FormControl>
            </div>
        </ModalContainer>
    </Modal>
    );
};

const ModalContainer = styled.div`
    position: absolute ;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${(props) => props.theme.backgroundColor};
    padding:30px;
    border-radius: 20px;
    color:${(props) => props.theme.fontColor};
`;

export default ModalOptionLeft;