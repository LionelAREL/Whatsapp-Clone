import React from 'react';
import { createClient, createMicrophoneAndCameraTracks, IAgoraRTCClient } from "agora-rtc-react";
import Controls from './Controls';
import Video from './Video';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';


const VideoCalling = (props:{client:IAgoraRTCClient,config:any}) => {
    const session = useSelector((state: RootState) => state.session)
    const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
    const [users, setUsers] = React.useState<any>([]);
    const [start, setStart] = React.useState(true);
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const { client,config } = props;
    const [trackState, setTrackState] = React.useState({ video: true, audio: true });

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
              if(!prevUsers.some((u:any) => u.uid === user.uid)){
                return [...prevUsers, user];
              }
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
        console.log("#########", session.user.id)
        await client.join(config.appId, name, config.token, session.user.id);
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
        }
      )
  
    }, [config, client, ready, tracks]);
  
    return (
      <Container style={{ height: "100%" }}>
          {start && tracks && <Video tracks={tracks} users={users} trackState={trackState} />}
          {ready && tracks && (
            <Controls tracks={tracks} setStart={setStart} details={config} trackState={trackState} setTrackState={setTrackState} />
          )}
      </Container>
    );
};

const Container = styled.div`
        background-color: ${(props) => props.theme.backgroundColor2};
`

export default VideoCalling;