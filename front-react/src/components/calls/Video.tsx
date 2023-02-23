import React from 'react';
import { AgoraVideoPlayer } from "agora-rtc-react";
import styled from 'styled-components';
import { Grid, Cell } from "styled-css-grid";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Video = (props:any) => {
    const { users, tracks, trackState } = props;

    const [gridSpacing, setGridSpacing] = React.useState(12);

    React.useEffect(() => {
      setGridSpacing(users.length > 0 ? users.length * 2 : 2);
    }, [users, tracks]);
    
    return (
        <Container>
            <Grid columns={gridSpacing} style={{height:"100%"}}>
                <Cell width={gridSpacing/2} style={{display:"flex",justifyContent:"center",alignItems:"center"}}> 
                    {trackState.video ?
                    <AgoraVideoPlayer
                        videoTrack={tracks[1]}
                        style={{ height: "100%", width: "100%" }}
                    />
                     :
                     <ProfilImage/>
                     }
                        </Cell>
                {users.length > 0 &&
                    users.map((user:any) => {
                        if (user.videoTrack) {
                            if (user.videoTrack.muted) {
                                return (
                                     <ProfilImage/>
                                    );
                            } 
                            else {
                                   return(
                                   <Cell width={1}>
                                        <AgoraVideoPlayer
                                            videoTrack={user.videoTrack}
                                            key={user.uid}
                                            style={{ height: "100%", width: "100%" }}
                                        />
                                    </Cell>);
                            }
                        }
                        else{
                            return (
                                <ProfilImage/>
                               );
                        }
                    })}
            </Grid>
           
        </Container>
    );
};

const Container = styled.div`
    height: 350px;
`

const ProfilImage = styled(AccountCircleIcon)`
    color:${(props) => props.theme.colorProfilDefault};
    background-size:1000px !important;
    border-radius: 50px;
    background-image: #ffffff;
    width: 70% !important;
    height: 70% !important;
`;

export default Video;