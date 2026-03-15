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

const BG = {
  hero: 'radial-gradient(ellipse at 20% 50%, #0c1445 0%, #080b1a 70%)',
  hook: 'radial-gradient(ellipse at 70% 30%, #12084a 0%, #080b1a 70%)',
  timeline: 'radial-gradient(ellipse at 50% 80%, #0a1a3a 0%, #080b1a 70%)',
  sectionA: 'radial-gradient(ellipse at 30% 40%, #0e1340 0%, #080b1a 65%)',
  contentA1: 'linear-gradient(160deg, #0a0e24 0%, #0d1230 100%)',
  contentA2: 'linear-gradient(160deg, #0b1028 0%, #0e1435 100%)',
  contentA3: 'linear-gradient(160deg, #0c1130 0%, #0a0f28 100%)',
  codeA: 'linear-gradient(160deg, #060914 0%, #0a0d1e 100%)',
  sectionB: 'radial-gradient(ellipse at 70% 40%, #140e42 0%, #080b1a 65%)',
  contentB1: 'linear-gradient(160deg, #0e0c28 0%, #0b1035 100%)',
  contentB2: 'linear-gradient(160deg, #0d0b2a 0%, #0c1038 100%)',
  contentB3: 'linear-gradient(160deg, #0f0d2e 0%, #0a0e30 100%)',
  contentB4: 'linear-gradient(160deg, #100e32 0%, #0b0f2c 100%)',
  codeB: 'linear-gradient(160deg, #07081a 0%, #0a0c20 100%)',
  sectionC: 'radial-gradient(ellipse at 50% 50%, #15103a 0%, #080b1a 65%)',
  good: 'linear-gradient(160deg, #081420 0%, #0a1228 100%)',
  bad: 'linear-gradient(160deg, #140a1a 0%, #0e0c22 100%)',
  alts: 'linear-gradient(160deg, #0c0e30 0%, #10082a 100%)',
  takeaway: 'radial-gradient(ellipse at 50% 40%, #1a1060 0%, #080b1a 70%)',
  end: 'radial-gradient(ellipse at 50% 60%, #0c1450 0%, #080b1a 70%)',
};

export default function App() {
  return (
    <Deck
      config={{
        hash: true,
        transition: 'slide',
        backgroundTransition: 'fade',
        controlsLayout: 'bottom-right',
        slideNumber: 'c/t',
        width: 1280,
        height: 720,
        center: false,
      }}
      plugins={[RevealHighlight]}
    >
      <Slide autoAnimate backgroundGradient={BG.hero}>
        <TitleSlide />
      </Slide>
      <Slide autoAnimate transition="fade" backgroundGradient={BG.hook}>
        <HookSlide />
      </Slide>
      <Slide transition="slide" backgroundGradient={BG.timeline}>
        <TimelineSlide />
      </Slide>

      <Stack>
        <Slide backgroundGradient={BG.sectionA}>
          <PersonalHeaderSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentA1}>
          <DailyBriefSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentA2}>
          <KidsSportsSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentA3}>
          <BuildingEmailSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.codeA}>
          <SkillsCodeSlide />
        </Slide>
      </Stack>

      <Stack>
        <Slide backgroundGradient={BG.sectionB}>
          <VolleyIntelHeaderSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentB1}>
          <WhatIsItSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentB2}>
          <EmailAutomationsSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentB3}>
          <SocialEngineSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentB4}>
          <ContentGenSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.codeB}>
          <AutomationCodeSlide />
        </Slide>
      </Stack>

      <Slide backgroundGradient={BG.sectionC}>
        <HonestHeaderSlide />
      </Slide>
      <Slide backgroundGradient={BG.good}>
        <TheGoodSlide />
      </Slide>
      <Slide backgroundGradient={BG.bad}>
        <TheProblemsSlide />
      </Slide>

      <Slide backgroundGradient={BG.alts}>
        <AlternativesSlide />
      </Slide>
      <Slide transition="fade" backgroundGradient={BG.takeaway}>
        <TakeawaySlide />
      </Slide>
      <Slide transition="fade" backgroundGradient={BG.end}>
        <EndSlide />
      </Slide>
    </Deck>
  );
}
