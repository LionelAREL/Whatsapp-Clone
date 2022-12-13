import { createClient } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/Store';
import { setIsCalling } from '../../redux/CounterSlice';


const Controls = (props:any) => {
    const dispatch = useDispatch();
    const { tracks, setStart, details, trackState, setTrackState, config } = props;
    const useClient = createClient(config);
    const client = useClient();
    
    const session = useSelector((state: RootState) => state.session)
  
    const mute = async (type: "audio" | "video") => {
        if (type === "audio") {
          await tracks[0].setMuted(trackState.audio);
          setTrackState({ ...trackState, audio: !trackState.audio });
        } else if (type === "video") {
          await tracks[1].setMuted(trackState.video);
          setTrackState({ ...trackState, video: !trackState.video });
        }
      };
  
    const leaveChannel = async () => {
        dispatch(setIsCalling(false))
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
    };

    React.useEffect(() => {
        if(details.callingType == "audio"){
            mute("video")
        }
    },[]);
  
    return (
        <Container>
            <IconClick onClick={() => mute("audio")}>
                <MicIcon
                    color={trackState.audio ? "primary" : "error"}
                    sx={{ fontSize: 33 }}
                    >
                </MicIcon>
            </IconClick>

            <IconClick onClick={() => mute("video")}>
                <VideocamIcon
                    color={trackState.video ? "primary" : "error"}
                    sx={{ fontSize: 33 }}
                    >
                </VideocamIcon>
            </IconClick>

            <IconClick onClick={() => leaveChannel()}>
                <HighlightOffIcon
                    color={"error"}
                    sx={{ fontSize: 33 }}
                    >
                </HighlightOffIcon>
            </IconClick>
        </Container>
    );
};

const Container = styled.div`
display: flex;
justify-content: center;
`

const IconClick = styled(IconButton)`
`;


export default Controls;