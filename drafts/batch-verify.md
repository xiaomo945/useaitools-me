<<<POST
title: How to Check AI Output Without Redoing the Work
slug: how-to-check-ai-output
category: Productivity
description: AI output fails in predictable ways. A practical system for catching the errors that matter without reading every word the way you would check a human's work.
# How to Check AI Output Without Redoing the Work

The failure mode of AI assistance is not that it is usually wrong. It is that it is usually right, which means checking it thoroughly feels like wasted effort right up until the time it is not.

Checking AI output properly does not mean redoing the work. It means knowing where errors concentrate, and putting your attention there.

---

## Where Errors Actually Concentrate

In roughly descending order of risk:

**Specific facts it was not given.** Names, dates, numbers, citations, prices, statistics. A model will produce a plausible figure rather than say it does not know. Anything that appears as a hard fact and was not in your input is unverified until you check it.

**Claims about things that changed recently.** Pricing, availability, feature lists, laws, personnel. Training data has a cutoff and the world does not stop.

**Anything with a hidden dependency.** "Update the other call sites" — a model may update two of four and not mention the ones it skipped. Code, data transformations and multi-file edits all fail this way.

**Length-dependent drift.** Errors cluster in the middle of long outputs. The first paragraph usually reflects your prompt closely; paragraph nine has drifted.

**Confident summaries of things you have not read.** Summarising is useful precisely because you have not read the source — which also means you cannot tell if the summary is faithful. This is the highest-risk, highest-value category.

---

## A Checking System That Scales

**1. Separate claims from structure.** Structure — the outline, the formatting, the argument shape — you can review quickly by skimming. Claims need verification. Doing these as two passes is faster than one careful read.

**2. Verify the load-bearing facts only.** Not every fact deserves a check. Check the ones that would change a decision. In a market summary, that is the market size and the competitor names; it is not the adjectives.

**3. Ask for sources, then open them.** Asking a model to cite its sources helps, and is not sufficient — citations can be plausible and wrong. [[link:/tools/10|Perplexity AI]] is built around this and returns links you can actually open, which is why it is the better tool for research specifically.

**4. Use a second model on the important things.** Two models make correlated errors, but not identical ones. Asking a different model to critique output — rather than regenerate it — surfaces a surprising number of problems cheaply. [[link:/tools/20|Claude]] and [[link:/tools/6|ChatGPT]] disagree often enough to be worth the extra minute.

**5. Spot-check the middle.** If you read one section carefully, read the section you are most likely to skim.

---

## By Output Type

**Code.** Tests are the answer, not reading. AI-generated code is only trustworthy when something catches its mistakes automatically, which is why review tooling like [[link:/tools/1557|Greptile]] matters more than careful reading. Keep diffs small enough to actually review.

**Research and facts.** Trace every load-bearing number to a source you opened. If a claim has no source, treat it as a hypothesis.

**Summaries.** Check the summary against the source's conclusion and any numbers it quotes. Skim the sections of the original that the summary treats as most important.

**Data transformation.** Check row counts and totals before and after. Most transformation errors are silent — the output looks fine and lost 3% of the rows.

**Anything going to a client or the public.** Full read, no shortcuts. The cost of one embarrassing error exceeds the time saved on a hundred careful reads.

---

## Prompting That Reduces Checking

Cheaper than catching errors is producing fewer:

- **Give the source material.** A model summarising a document you supplied makes far fewer factual errors than one recalling from training.
- **Ask for uncertainty explicitly.** "Flag anything you are not confident about" measurably improves what comes back.
- **Constrain the scope.** "Only use the information in the attached document" prevents the model from filling gaps with plausible invention.
- **Ask for the count.** "List all seven" invites padding; "list them, and say if there are fewer than seven" does not.

---

## What Checking Cannot Fix

Some output cannot be verified cheaply, and pretending otherwise is its own risk:

- **Strategic judgements** — the reasoning may be sound and the conclusion still wrong
- **Creative work** — there is no ground truth, only your judgement
- **Anything where you lack the domain knowledge** — you cannot check what you do not understand, and no tool fixes that

In those cases the honest position is to treat output as input to your own thinking rather than as an answer.

More tools worth comparing are in our [[link:/category/Productivity|Productivity category]].

---

## Frequently Asked Questions

**How much should I check AI output?**
In proportion to what is at stake. Internal drafts need a skim; anything with a number a decision depends on needs that number traced to a source; anything client-facing needs a full read.

**Is asking for citations enough?**
No, though it helps considerably. Models produce plausible but incorrect citations, so a citation is a lead to follow, not a verification. Open the source.

**Does using a second model really help?**
Yes, for critique rather than regeneration. Two models share training biases but make different specific errors, so asking one to check the other catches things a single pass misses.

**Why do errors cluster in the middle of long outputs?**
Attention degrades over long generations — the opening follows your prompt closely and later sections drift from it. If you only check one part of a long output, check the part you would normally skim.

**Can I trust generated code if it runs?**
Running is necessary and not sufficient. Code can pass tests and still be wrong about edge cases, or solve the problem you described instead of the one you have. Tests plus a reviewable diff is the workable standard.
