import React from 'react';
import { createClient, createMicrophoneAndCameraTracks, IAgoraRTCClient } from "agora-rtc-react";
import Controls from './Controls';
import Video from './Video';
import styled from 'styled-components';



const VideoCalling = (props:{client:IAgoraRTCClient,config:any}) => {
    const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
    const [users, setUsers] = React.useState<any>([]);
    const [start, setStart] = React.useState(true);
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const { client,config } = props;
    console.log("######### ", config)
    console.log("########### Video Calling #############")
    React.useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
        console.log("############## INIT ##########", name);
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log("subscribe success");
          if (mediaType === "video") {
            setUsers((prevUsers:any) => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });
  
        client.on("user-unpublished", (user, type) => {
          console.log("unpublished", user, type);
          if (type === "audio") {
            user.audioTrack?.stop();
          }
          if (type === "video") {
            setUsers((prevUsers:any) => {
              return prevUsers.filter((User:any) => User.uid !== user.uid);
            });
          }
        });
  
        client.on("user-left", (user) => {
          console.log("leaving", user);
          setUsers((prevUsers:any) => {
            return prevUsers.filter((User:any) => User.uid !== user.uid);
          });
        });
  
        await client.join(config.appId, name, config.token, null);
        if (tracks) await client.publish([tracks[0], tracks[1]]);
        setStart(true);
  
      };
  
      if (ready && tracks) {
        console.log("init ready");
        init(config.channel);
        console.log("################ USERS #########",users)
      }

      return(
         () => {
            client.leave();
            client.removeAllListeners();
            if(tracks){
                tracks[0].close();
                tracks[1].close();
            }
        }
      )
  
    }, [config, client, ready, tracks]);
  
    return (
      <Container style={{ height: "100%" }}>
          {start && tracks && <Video tracks={tracks} users={users} />}
          {ready && tracks && (
            <Controls tracks={tracks} setStart={setStart} />
          )}
      </Container>
    );
};

const Container = styled.div`
        background-color: ${(props) => props.theme.backgroundColor2};
`

export default VideoCalling;