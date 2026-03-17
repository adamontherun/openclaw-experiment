import { Fragment } from '@revealjs/react';

const steps = [
  {
    num: '1',
    title: 'Pick the Idea',
    desc: "Pull the next unused idea from Adam\u2019s bank \u2014 or use the AI-sourced topic from the social scan.",
    accent: 'cyan',
  },
  {
    num: '2',
    title: 'Generate Copy',
    desc: 'The LLM writes platform-specific scripts: a punchy tweet for X, a full caption for Instagram, and a Threads version.',
    accent: 'purple',
  },
  {
    num: '3',
    title: 'Create the Image',
    desc: 'Ideogram V3 generates a branded visual tailored to each platform\u2019s aspect ratio.',
    accent: 'green',
  },
  {
    num: '4',
    title: 'Publish Everywhere',
    desc: 'Buffer API pushes the finished package to Instagram, Threads, and X simultaneously.',
    accent: 'orange',
  },
];

export function ContentWorkflowSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <p className="kicker">Content Generation</p>
      <h2 style={{ marginBottom: 24 }}>From Idea to Published Post</h2>

      <div className="contentPipeline">
        {steps.map((step, i) => (
          <Fragment key={step.num} animation="fade-up">
            <div className="contentPipelineStage">
              {i > 0 && <div className="contentPipelineArrow" />}
              <div className={`contentPipelineCard accent-${step.accent}`}>
                <div className="contentPipelineNum">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      <Fragment animation="fade-up">
        <div style={{ display: 'flex', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
          <div className="contentToolTag">Ideogram V3</div>
          <div className="contentToolTag">Buffer API</div>
          <div className="contentToolTag">SQLite</div>
          <div className="contentToolTag">OpenAI</div>
        </div>
      </Fragment>
    </div>
  );
}
