import { Deck, Slide, Stack } from '@revealjs/react';
import RevealHighlight from 'reveal.js/plugin/highlight';
import { TitleSlide } from './slides/01-Title';
import { HookSlide } from './slides/02-Hook';
import { TimelineSlide } from './slides/03-Timeline';
import { PersonalHeaderSlide } from './slides/04-PersonalHeader';
import { DailyBriefSlide } from './slides/05-DailyBrief';
import { HeatherJokeExamplesSlide, HeatherJokeSlide } from './slides/06-HeatherJoke';
import { HeatherJokeCodeSlide } from './slides/07-HeatherJokeCode';
import { KidsSportsSlide } from './slides/08-KidsSports';
import { PersonalCronsSlide } from './slides/10-PersonalCrons';
import { VolleyIntelHeaderSlide } from './slides/11-VolleyIntelHeader';
import { GmailTriageSlide } from './slides/13-GmailTriage';
import { GmailDraftScreenshotSlide } from './slides/13a-GmailDraftScreenshot';
import { ThreadsEngageVideoSlide } from './slides/14a-ThreadsEngageVideo';
import { ContentIdeaSlide } from './slides/15a-ContentIdea';
import { ContentWorkflowSlide } from './slides/15b-ContentWorkflow';
import { ContentResultSlide } from './slides/15c-ContentResult';
import { VolleyIntelBriefSlide } from './slides/16-VolleyIntelBrief';
import { VolleyIntelCronsSlide } from './slides/17-VolleyIntelCrons';
import { HonestHeaderSlide } from './slides/18-HonestHeader';
import { TheGoodSlide } from './slides/19-TheGood';
import { TheProblemsSlide } from './slides/20-TheProblems';
import { AlternativesSlide } from './slides/21-Alternatives';
import { TakeawaySlide } from './slides/22-Takeaway';

const BG = {
  hero: 'radial-gradient(ellipse at 20% 50%, #0c1445 0%, #080b1a 70%)',
  hook: 'radial-gradient(ellipse at 70% 30%, #12084a 0%, #080b1a 70%)',
  timeline: 'radial-gradient(ellipse at 50% 80%, #0a1a3a 0%, #080b1a 70%)',
  sectionA: 'radial-gradient(ellipse at 30% 40%, #0e1340 0%, #080b1a 65%)',
  contentA1: 'linear-gradient(160deg, #0a0e24 0%, #0d1230 100%)',
  contentA2: 'linear-gradient(160deg, #0b1028 0%, #0e1435 100%)',
  contentA3: 'linear-gradient(160deg, #0c1130 0%, #0a0f28 100%)',
  contentA4: 'linear-gradient(160deg, #0a0f2a 0%, #0d1232 100%)',
  contentA5: 'linear-gradient(160deg, #0b0e26 0%, #0c112e 100%)',
  codeA: 'linear-gradient(160deg, #060914 0%, #0a0d1e 100%)',
  cronA: 'linear-gradient(160deg, #080c1c 0%, #0b0f24 100%)',
  sectionB: 'radial-gradient(ellipse at 70% 40%, #140e42 0%, #080b1a 65%)',
  contentB1: 'linear-gradient(160deg, #0e0c28 0%, #0b1035 100%)',
  contentB2: 'linear-gradient(160deg, #0d0b2a 0%, #0c1038 100%)',
  contentB3: 'linear-gradient(160deg, #0f0d2e 0%, #0a0e30 100%)',
  contentB4: 'linear-gradient(160deg, #100e32 0%, #0b0f2c 100%)',
  contentB5: 'linear-gradient(160deg, #0e0c2a 0%, #0c1034 100%)',
  cronB: 'linear-gradient(160deg, #07081a 0%, #0a0c20 100%)',
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
          <HeatherJokeSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentA2}>
          <HeatherJokeExamplesSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.codeA}>
          <HeatherJokeCodeSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentA3}>
          <KidsSportsSlide />
        </Slide>
        <Slide backgroundGradient={BG.cronA}>
          <PersonalCronsSlide />
        </Slide>
      </Stack>

      <Stack>
        <Slide backgroundGradient={BG.sectionB}>
          <VolleyIntelHeaderSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB2}>
          <GmailTriageSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB2}>
          <GmailDraftScreenshotSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB3}>
          <ThreadsEngageVideoSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB4}>
          <ContentIdeaSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB4}>
          <ContentWorkflowSlide />
        </Slide>
        <Slide transition="fade" backgroundGradient={BG.contentB5}>
          <ContentResultSlide />
        </Slide>
        <Slide backgroundGradient={BG.contentB5}>
          <VolleyIntelBriefSlide />
        </Slide>
        <Slide backgroundGradient={BG.cronB}>
          <VolleyIntelCronsSlide />
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
    </Deck>
  );
}
