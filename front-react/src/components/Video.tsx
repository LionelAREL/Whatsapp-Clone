import React from 'react';
import { AgoraVideoPlayer } from "agora-rtc-react";
import styled from 'styled-components';
import { Grid, Cell } from "styled-css-grid";

const Video = (props:any) => {
    const { users, tracks } = props;
    
    return (
        <Container>
            <Grid columns={users.length > 0 ? users.length * 2 : 2} style={{height:"100%"}}>
                <Cell width={1} style={{display:"flex",justifyContent:"center",alignItems:"center"}}> 
                    <AgoraVideoPlayer
                        videoTrack={tracks[1]}
                        style={{ height: "200px", width: "200px" }}
                    />
                </Cell>
                {users.length > 0 &&
                    users.map((user:any) => {
                        if (user.videoTrack) {
                            return (
                        <Cell width={1}>
                            <div>
                                <AgoraVideoPlayer
                                    videoTrack={user.videoTrack}
                                    key={user.uid}
                                    style={{ height: "100%", width: "100%" }}
                                />
                            </div>
                        </Cell>
                        );
                    } else return null;
                    })}
            </Grid>
           
        </Container>
    );
};

const Container = styled.div`
    height: 350px;
`

export default Video;