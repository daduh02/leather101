"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  Clipboard,
  FileCheck2,
  FileText,
  Gavel,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const useCases = [
  "Summarising client intake notes and attendance notes",
  "Creating first drafts of client update emails",
  "Building children matter chronologies",
  "Extracting key dates from orders, statements and correspondence",
  "Reviewing Form E material for missing information",
  "Organising financial disclosure questions",
  "Preparing issue lists for financial remedy cases",
  "Summarising Cafcass letters, expert reports or school correspondence",
  "Comparing draft consent orders or parenting plan wording",
  "Turning court orders into plain English next steps",
  "Preparing without prejudice meeting notes for review",
  "Drafting internal case strategy notes for supervisor input",
];

const familyUseCases = [
  ["Divorce and dissolution", "Summarise procedural history, extract dates, prepare client-friendly updates and identify missing documents."],
  ["Financial remedies", "Organise Form E issues, disclosure gaps, asset schedules, questionnaires and draft position notes."],
  ["Children matters", "Build chronologies, summarise safeguarding material, compare proposed child arrangements and prepare neutral issue lists."],
  ["Domestic abuse and injunctions", "Structure incident timelines, flag evidence gaps and prepare careful first drafts for urgent review."],
  ["Pre-nuptial and post-nuptial agreements", "Summarise draft terms, compare versions and highlight points needing solicitor review."],
  ["Cohabitation and TOLATA-adjacent issues", "Organise factual history, contributions, correspondence and questions for further advice."],
];

const workflow = [
  ["Define the family law task", "Say whether the work concerns divorce, finances, children, injunctions, cohabitation or nuptial agreements."],
  ["Provide the right material", "Attach or paste only the relevant papers, depending on your firm’s setup and confidentiality rules."],
  ["Give client position and jurisdiction", "State the client’s role, current order or application, and whether the matter is in England and Wales or another jurisdiction."],
  ["Ask for structured output", "Request a chronology, issue list, disclosure table, client email, hearing note or supervisor questions."],
  ["Verify, refine and apply legal judgement", "Check the source papers, emotional nuance, safeguarding issues and legal analysis before using anything."],
];

const promptFormula = "Role + Task + Context + Materials + Output Format + Checks";

const examplePrompt =
  "You are assisting a family law solicitor in England and Wales. Review the attached financial disclosure from the client’s perspective. Identify missing documents, unclear entries, valuation issues, unusual transactions and points requiring follow-up. Return the output as a table with document/source reference, issue, risk or concern, why it matters and suggested next step. Do not invent facts or references. If something is not covered in the material, say ‘not covered’.";

const prompts = [
  {
    title: "Financial disclosure review",
    use: "Use when reviewing Form E, bank statements or supporting disclosure.",
    prompt:
      "You are assisting a family law solicitor in England and Wales. Review the attached financial disclosure from the client’s perspective. Identify missing documents, unclear entries, valuation issues, unusual transactions and points requiring follow-up. Return a table with document/source reference, issue, risk or concern, why it matters and suggested next step. Do not invent facts or references. Flag anything uncertain.",
  },
  {
    title: "Form E issue list",
    use: "Use when preparing a first-pass list of financial remedy issues.",
    prompt:
      "You are assisting a family law solicitor in England and Wales. Review the Form E and supporting documents provided. Create an issue list covering assets, income, liabilities, pensions, housing needs, business interests, trusts, tax, disclosure gaps and questions for the other party. Return the answer as a table. Do not assume facts that are not in the documents.",
  },
  {
    title: "Client email draft",
    use: "Use when you need a plain English first draft for a family client.",
    prompt:
      "You are assisting a family law solicitor drafting a client update. Based only on the information provided, draft a clear, calm and professional email explaining the key points, next steps, deadlines and any decisions needed from the client. Use plain English. Do not give unverified legal conclusions. Flag any wording that should be checked by the solicitor before sending.",
  },
  {
    title: "Children matter chronology",
    use: "Use when organising statements, correspondence and safeguarding material.",
    prompt:
      "You are assisting a family law solicitor in a children matter in England and Wales. Create a neutral chronology from the attached material. Return a table with date, event, source reference, people involved, child impact and relevance. If a date is unclear or missing, flag it rather than guessing. Do not make findings of fact.",
  },
  {
    title: "Safeguarding summary",
    use: "Use when reviewing allegations, risk indicators or welfare concerns.",
    prompt:
      "You are assisting a family law solicitor in England and Wales. Review the material provided and summarise any safeguarding or welfare concerns that appear in the documents. Return a table with source reference, concern, who is affected, what evidence is cited, what is unclear and suggested follow-up. Use neutral language. Do not decide whether an allegation is true.",
  },
  {
    title: "Research preparation",
    use: "Use to frame legal research before checking primary sources.",
    prompt:
      "You are assisting a family law solicitor preparing legal research in England and Wales. Based on the issue described, identify the legal questions that need to be researched, relevant search terms, possible legislation, rules, practice directions or case law areas to check, and assumptions to verify. Do not present the answer as final legal advice.",
  },
  {
    title: "Draft order comparison",
    use: "Use when comparing versions of a consent order, recital or parenting plan.",
    prompt:
      "You are assisting a family law solicitor comparing two versions of draft order wording. Identify the differences, explain the possible legal or practical impact, and flag any changes that may increase risk or ambiguity for the client. Return the answer as a table. Do not treat the comparison as final advice.",
  },
  {
    title: "Plain English explanation",
    use: "Use when explaining an order, direction or proposed term to a client.",
    prompt:
      "You are assisting a family law solicitor preparing a client-friendly explanation. Explain the following order, direction or proposed term in plain English. Include what it means, why it matters, risks for the client, practical next steps and questions the client may want to consider. Do not change the legal meaning.",
  },
  {
    title: "Supervisor questions",
    use: "Use when preparing points for partner or supervisor input.",
    prompt:
      "You are assisting a junior family law solicitor preparing questions for a supervising solicitor. Based on the matter summary and documents provided, list the key points that require supervisor input. Group them by urgency and explain why each point matters. Include any safeguarding, disclosure, jurisdiction, limitation, costs or client-care concerns.",
  },
  {
    title: "FDR preparation note",
    use: "Use when preparing a structured internal note before an FDR.",
    prompt:
      "You are assisting a family law solicitor preparing for a Financial Dispute Resolution hearing in England and Wales. Create a concise internal note with background, assets and liabilities summary, disclosure gaps, open offers, main issues, strengths and weaknesses, possible settlement options, client objectives and next steps. Flag any information that must be verified.",
  },
  {
    title: "Questionnaire drafting",
    use: "Use when drafting questions after Form E exchange.",
    prompt:
      "You are assisting a family law solicitor in England and Wales. Based on the Form E and disclosure provided, draft proportionate questionnaire points for the other party. Group questions by topic, explain why each question is relevant, and identify the source document where possible. Avoid oppressive or speculative questions.",
  },
  {
    title: "Child arrangements options",
    use: "Use when structuring options for client discussion.",
    prompt:
      "You are assisting a family law solicitor in a child arrangements matter in England and Wales. Based only on the information provided, summarise possible practical arrangements, issues for discussion, welfare considerations to explore and questions for the client. Do not recommend a final outcome or make findings of fact.",
  },
  {
    title: "Position statement outline",
    use: "Use when creating a first outline for solicitor review.",
    prompt:
      "You are assisting a family law solicitor preparing a short position statement outline. Based only on the facts provided, create headings and bullet points covering background, issues, client position, orders sought, evidence relied on and matters for the court. Keep it neutral, concise and suitable for solicitor review. Do not invent facts.",
  },
  {
    title: "Bundle index checker",
    use: "Use when checking whether a hearing bundle index is coherent.",
    prompt:
      "You are assisting a family law solicitor checking a draft hearing bundle index. Review the index and identify duplicate entries, missing obvious categories, unclear document descriptions, date inconsistencies and documents that may need better source labels. Return a table with issue, page or reference if provided, and suggested fix.",
  },
  {
    title: "Attendance note summary",
    use: "Use when turning a long client meeting note into actions.",
    prompt:
      "You are assisting a family law solicitor. Summarise the attendance note provided into client instructions, key facts, legal issues to consider, documents requested, deadlines, emotional or safeguarding concerns, and next actions. Do not add facts that are not in the note.",
  },
  {
    title: "Without prejudice meeting prep",
    use: "Use when organising negotiation preparation for solicitor review.",
    prompt:
      "You are assisting a family law solicitor preparing for a without prejudice negotiation meeting. Based only on the provided material, create a preparation note with client objectives, likely issues, possible concessions, information gaps, risks, settlement options and questions for supervisor input. Do not present settlement recommendations as final advice.",
  },
  {
    title: "Order compliance tracker",
    use: "Use when converting an order into deadline-driven tasks.",
    prompt:
      "You are assisting a family law solicitor. Review the order or directions provided and create a compliance tracker with obligation, responsible party, deadline, source paragraph, documents needed and risk if missed. Do not invent deadlines. If a date is unclear, flag it.",
  },
];

const checklist = [
  "Have I checked the source document?",
  "Have I checked paragraph numbers, page references and order dates?",
  "Have I checked names, dates of birth, parties and children’s details?",
  "Have I verified any legal authorities?",
  "Have I checked the relevant UK jurisdiction and court process?",
  "Have I removed unnecessary personal data?",
  "Have I applied my own legal judgement?",
  "Have I checked safeguarding, vulnerability and capacity issues?",
  "Have I checked whether the material is privileged, confidential or without prejudice?",
  "Would I be comfortable explaining this output to a client or supervising partner?",
];

const mistakes = [
  ["Asking vague questions", "Give role, task, context and output format"],
  ["Forgetting jurisdiction", "State England and Wales, Scotland, Northern Ireland, or other relevant jurisdiction"],
  ["Trusting citations", "Verify all cases, legislation and references"],
  ["Uploading too much irrelevant material", "Provide the most relevant bundle sections first"],
  ["Ignoring children’s details", "Check names, dates of birth, schools, arrangements and any anonymisation requirements"],
  ["Using AI output directly with clients", "Review, edit and verify before use"],
  ["Asking for a conclusion too early", "Start with issue spotting, then refine"],
  ["Losing neutrality in children matters", "Ask for neutral language and avoid findings of fact"],
  ["Mixing open and without prejudice material", "Label the status of material clearly and follow firm policy"],
];

const safeRules = [
  "Follow firm policy",
  "Protect confidentiality and privilege",
  "Avoid unnecessary personal data",
  "Check whether client consent is required",
  "Verify legal authorities",
  "Check source references",
  "Treat safeguarding concerns with particular care",
  "Keep without prejudice and privileged material clearly labelled",
  "Keep solicitor judgement central",
  "Escalate uncertainty to a supervisor or risk/compliance contact",
];

const starterPath = [
  "Start with an approved, non-sensitive family law document",
  "Ask for a short neutral summary",
  "Ask for an issue or risk table",
  "Ask follow-up questions",
  "Compare the output to the source document",
  "Save useful family law prompts into a personal prompt bank",
];

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      aria-label={`${label} prompt`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Clipboard className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {children ? <p className="mt-4 text-lg leading-8 text-slate-600">{children}</p> : null}
    </div>
  );
}

function PromptCard({ title, use, prompt }: { title: string; use: string; prompt: string }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{use}</p>
        </div>
        <MessageSquareText className="mt-1 h-5 w-5 shrink-0 text-slate-500" />
      </div>
      <p className="flex-1 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{prompt}</p>
      <div className="mt-4">
        <CopyButton text={prompt} />
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-40 hidden border-b border-slate-200 bg-white/95 backdrop-blur md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
            <a href="#top" className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Scale className="h-5 w-5 text-slate-700" />
            Family Law Legora Guide
            </a>
            <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <a className="hover:text-slate-950" href="#family-law">Family law</a>
            <a className="hover:text-slate-950" href="#workflow">Workflow</a>
            <a className="hover:text-slate-950" href="#prompts">Prompts</a>
            <a className="hover:text-slate-950" href="#quality">Quality control</a>
            <a className="hover:text-slate-950" href="#safe-use">Safe use</a>
          </div>
        </div>
      </nav>

      <header id="top" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                <ShieldCheck className="h-4 w-4" />
                Practical safe-use guide for UK family law
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                A Family Law Solicitor’s Practical Guide to Legora
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">
                A simple, safe-use guide for family law professionals using AI to review, summarise, draft and organise divorce, finance and children matter work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#prompts"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  View prompt library
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#quality"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Check output safely
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <Gavel className="h-6 w-6 text-slate-700" />
                <p className="font-semibold text-slate-950">Core principle</p>
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Use Legora as a legal work assistant, not as the final decision-maker. Always verify output before relying on it, especially where the matter involves children, safeguarding, vulnerable clients or financial disclosure.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-600">
                <p className="rounded-md bg-white p-3">Careful prompts improve usefulness.</p>
                <p className="rounded-md bg-white p-3">Source checking and neutral language remain essential.</p>
                <p className="rounded-md bg-white p-3">Firm policy, privilege and client confidentiality come first.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="what-is-legora" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="01" title="What is Legora?">
            Legora is an AI platform designed for legal professionals. Depending on your firm’s setup, Legora can assist family law solicitors with reviewing documents, summarising material, drafting first versions, comparing documents, extracting key information, supporting research preparation and helping organise legal workflows.
          </SectionHeading>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-lg leading-8 text-slate-700">
            It should be treated as an assistant, not a substitute for solicitor judgement. The solicitor remains responsible for checking sources, legal analysis, confidentiality, privilege, safeguarding sensitivity and the final work product.
          </div>
        </div>
      </section>

      <section id="family-law" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="02" title="Family law use cases">
            In family work, Legora is most useful for organising messy information into something a solicitor can check, refine and apply judgement to.
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {familyUseCases.map(([title, detail]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <FileCheck2 className="mb-4 h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="when-to-use" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="03" title="Specific tasks to try">
            Good uses are bounded, document-led and capable of being checked against the source material.
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <FileText className="mb-4 h-5 w-5 text-slate-600" />
                <p className="font-medium leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="limits" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-semibold text-slate-950">When not to rely on Legora alone</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Final legal advice",
                "Unverified legal research",
                "Complex points of law without human review",
                "Strategy decisions or settlement advice",
                "Privileged or highly sensitive material unless approved by firm policy",
                "Safeguarding conclusions or findings of fact",
                "Advice on child welfare outcomes without solicitor review",
                "Final Form E, order or court document drafting without checking",
                "Anything requiring professional judgement",
              ].map((item) => (
                <p key={item} className="rounded-md bg-white p-4 font-medium leading-6 text-slate-800">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="04" title="Basic workflow">
            A simple five-step pattern for practical, reviewable work.
          </SectionHeading>
          <div className="grid gap-4 lg:grid-cols-5">
            {workflow.map(([title, detail], index) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prompt-formula" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="05" title="Prompt formula">
            Build prompts from the same parts each time, then refine based on what you receive back.
          </SectionHeading>
          <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <p className="font-mono text-lg leading-8 sm:text-2xl">{promptFormula}</p>
          </div>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-950">Example prompt</h3>
              <CopyButton text={examplePrompt} />
            </div>
            <p className="text-base leading-8 text-slate-700">{examplePrompt}</p>
          </div>
        </div>
      </section>

      <section id="prompts" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="06" title="Family law prompt library">
            Copy, adapt and check these prompts against the matter, jurisdiction, client position and firm policy.
          </SectionHeading>
          <div className="grid gap-5 md:grid-cols-2">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.title} {...prompt} />
            ))}
          </div>
        </div>
      </section>

      <section id="quality" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="07" title="Quality control checklist">
            Before relying on output, run through the same checks you would apply to any supervised work product.
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {checklist.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <SearchCheck className="mb-4 h-5 w-5 text-emerald-700" />
                <p className="font-medium leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mistakes" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="08" title="Common mistakes">
            Small prompt changes can make the output easier to check and safer to use.
          </SectionHeading>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-2 bg-slate-950 text-sm font-semibold uppercase tracking-[0.14em] text-white">
              <div className="p-4">Mistake</div>
              <div className="border-l border-slate-700 p-4">Better approach</div>
            </div>
            {mistakes.map(([mistake, better]) => (
              <div key={mistake} className="grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2">
                <div className="bg-slate-50 p-4 font-medium text-slate-800">{mistake}</div>
                <div className="p-4 text-slate-700 sm:border-l sm:border-slate-200">{better}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="safe-use" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="rounded-lg border border-slate-300 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <LockKeyhole className="h-6 w-6 text-slate-200" />
              <h2 className="text-3xl font-semibold tracking-tight">Safe use rules</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {safeRules.map((rule) => (
                <p key={rule} className="rounded-md border border-white/10 bg-white/[0.08] p-4 leading-6 text-slate-100">
                  {rule}
                </p>
              ))}
            </div>
            <p className="mt-8 border-t border-white/15 pt-6 text-sm leading-7 text-slate-300">
              This guide is for training and internal support only. It is not legal advice and does not replace your firm’s policies, professional obligations, or solicitor judgement.
            </p>
          </div>
        </div>
      </section>

      <section id="first-ten-minutes" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="09" title="First 10 minutes with Legora">
            Start with a low-risk exercise and learn how the output compares to the documents.
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {starterPath.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-800">
                  {index + 1}
                </div>
                <p className="font-medium leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <BookOpenCheck className="h-4 w-4" />
            A Family Law Solicitor’s Practical Guide to Legora
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Verify sources</span>
            <span className="inline-flex items-center gap-2"><ListChecks className="h-4 w-4" /> Follow policy</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Use judgement</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
