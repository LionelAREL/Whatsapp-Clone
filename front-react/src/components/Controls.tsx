import { createClient } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { setIsCalling } from '../redux/CounterSlice';


const Controls = (props:any) => {
    const dispatch = useDispatch();
    const { tracks, setStart, config } = props;
    const useClient = createClient(config);
    const client = useClient();
    const [trackState, setTrackState] = React.useState({ video: true, audio: true });
    const session = useSelector((state: RootState) => state.session)
  
    const mute = async (type: "audio" | "video") => {
        if (type === "audio") {
          await tracks[0].setEnabled(!trackState.audio);
          setTrackState((ps) => {
            return { ...ps, audio: !ps.audio };
          });
        } else if (type === "video") {
          await tracks[1].setEnabled(!trackState.video);
          setTrackState((ps) => {
            return { ...ps, video: !ps.video };
          });
        }
      };
  
    const leaveChannel = async () => {
        dispatch(setIsCalling(false))
        console.log("false")
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        console.log("######### FALSE ############")
    };
  
    return (
        <Container>
            <IconClick>
                <MicIcon
                    color={trackState.audio ? "primary" : "error"}
                    onClick={() => mute("audio")}
                    sx={{ fontSize: 33 }}
                    >
                </MicIcon>
            </IconClick>

            <IconClick>
                <VideocamIcon
                    color={trackState.video ? "primary" : "error"}
                    onClick={() => mute("video")}
                    sx={{ fontSize: 33 }}
                    >
                </VideocamIcon>
            </IconClick>

            <IconClick>
                <HighlightOffIcon
                    color={"error"}
                    onClick={() => leaveChannel()}
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