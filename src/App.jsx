import { Deck, Slide } from '@revealjs/react';
import { Hello } from './slides/Hello';
import { World } from './slides/World';

export default function App() {
  return (
    <Deck>
      <Slide>
        <Hello />
      </Slide>
      <Slide>
        <World />
      </Slide>
    </Deck>
  );
}
