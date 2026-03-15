import { Deck, Slide, Stack } from '@revealjs/react';
import RevealHighlight from 'reveal.js/plugin/highlight';
import { TitleSlide } from './slides/01-Title';
import { HookSlide } from './slides/02-Hook';
import { TimelineSlide } from './slides/03-Timeline';
import { PersonalHeaderSlide } from './slides/04-PersonalHeader';
import { DailyBriefSlide } from './slides/05-DailyBrief';
import { KidsSportsSlide } from './slides/06-KidsSports';
import { BuildingEmailSlide } from './slides/07-BuildingEmail';
import { SkillsCodeSlide } from './slides/08-SkillsCode';
import { VolleyIntelHeaderSlide } from './slides/09-VolleyIntelHeader';
import { WhatIsItSlide } from './slides/10-WhatIsIt';
import { EmailAutomationsSlide } from './slides/11-EmailAutomations';
import { SocialEngineSlide } from './slides/12-SocialEngine';
import { ContentGenSlide } from './slides/13-ContentGen';
import { AutomationCodeSlide } from './slides/14-AutomationCode';
import { HonestHeaderSlide } from './slides/15-HonestHeader';
import { TheGoodSlide } from './slides/16-TheGood';
import { TheProblemsSlide } from './slides/17-TheProblems';
import { AlternativesSlide } from './slides/18-Alternatives';
import { TakeawaySlide } from './slides/19-Takeaway';
import { EndSlide } from './slides/20-EndSlide';

export default function App() {
  return (
    <Deck
      config={{
        hash: true,
        transition: 'slide',
        backgroundTransition: 'fade',
        controlsLayout: 'bottom-right',
        slideNumber: 'c/t',
      }}
      plugins={[RevealHighlight]}
    >
      <Slide
        autoAnimate
        backgroundGradient="radial-gradient(circle at 15% 20%, #3e1eff 0%, #101129 40%, #090816 100%)"
      >
        <TitleSlide />
      </Slide>
      <Slide
        autoAnimate
        transition="fade"
        backgroundGradient="radial-gradient(circle at 80% 10%, #ff43e0 0%, #2a1464 40%, #090816 100%)"
      >
        <HookSlide />
      </Slide>
      <Slide
        transition="convex"
        backgroundGradient="linear-gradient(140deg, #0f1739 0%, #2f216d 45%, #0f1739 100%)"
      >
        <TimelineSlide />
      </Slide>

      <Stack>
        <Slide backgroundGradient="linear-gradient(135deg, #1f1457 0%, #0d2446 100%)">
          <PersonalHeaderSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #0d1f47 0%, #202f77 100%)">
          <DailyBriefSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #1a1a53 0%, #0f3867 100%)">
          <KidsSportsSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #201549 0%, #11345b 100%)">
          <BuildingEmailSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient="linear-gradient(130deg, #0a1639 0%, #2f2b7a 100%)">
          <SkillsCodeSlide />
        </Slide>
      </Stack>

      <Stack>
        <Slide backgroundGradient="linear-gradient(130deg, #1b0b2b 0%, #1d1b5f 45%, #073a62 100%)">
          <VolleyIntelHeaderSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #2b1348 0%, #0a2f5b 100%)">
          <WhatIsItSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #2b183f 0%, #143a68 100%)">
          <EmailAutomationsSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #13195f 0%, #2f1559 100%)">
          <SocialEngineSlide />
        </Slide>
        <Slide backgroundGradient="linear-gradient(130deg, #321e6e 0%, #0d3460 100%)">
          <ContentGenSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient="linear-gradient(130deg, #0a1e45 0%, #3c1c82 100%)">
          <AutomationCodeSlide />
        </Slide>
      </Stack>

      <Slide backgroundGradient="linear-gradient(140deg, #340f39 0%, #11163d 100%)">
        <HonestHeaderSlide />
      </Slide>
      <Slide backgroundGradient="linear-gradient(140deg, #123548 0%, #0f1f4a 100%)">
        <TheGoodSlide />
      </Slide>
      <Slide backgroundGradient="linear-gradient(140deg, #441a33 0%, #22104a 100%)">
        <TheProblemsSlide />
      </Slide>

      <Slide backgroundGradient="linear-gradient(140deg, #1b275f 0%, #421850 100%)">
        <AlternativesSlide />
      </Slide>
      <Slide transition="fade" backgroundGradient="radial-gradient(circle at 50% 20%, #4939f6 0%, #151544 45%, #090816 100%)">
        <TakeawaySlide />
      </Slide>
      <Slide transition="convex" backgroundGradient="radial-gradient(circle at 45% 20%, #ff52e5 0%, #2a1464 45%, #090816 100%)">
        <EndSlide />
      </Slide>
    </Deck>
  );
}
