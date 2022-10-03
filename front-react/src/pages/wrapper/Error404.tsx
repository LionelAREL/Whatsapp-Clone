import { useRouteError } from "react-router-dom";
import styled from "styled-components";

export default function Error404() {
  const error:any = useRouteError();
  console.error(error);

  return (
    <Container>
      <div>
        <p>Sorry, there some issue with this page : {error.statusText || error.message}</p>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;