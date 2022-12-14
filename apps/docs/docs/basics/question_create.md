---
id: question_create
title: Create a Question
---

Upon clicking the "Create Question" button on the question pool, you will be redirected to the following view:

![Create Question](/img/question_create.png)

Before preparing a session, all questions that are to be contained need to be created. Every one of these questions has the following attributes:

1. **Question Title:** A short title that summarizes the question for your later recollection.

2. **Question Type:** Determines how a question can be answered by the audience as well as the available charts for evaluation:

   - _Single Choice (SC):_ Only one of the given answers may be selected.
   - _Multiple Choice (MC):_ Multiple of the given answers may be selected.
   - _Free Text (FT):_ The input is unrestricted (text answers).
   - _Numerical (NR):_ A number within a given range may be chosen (or any number, if no range is provided).

3. **Tags:** To group questions and simplify filtering, tags are used. Type in one or multiple tags or start typing and select an existing tag. Confirm by pressing Enter. Every question needs to have at least one tag.

4. **Question:** The question to be answered by the audience. The rich text editor allows you to highlight parts by using bold/italic text, include code, insert quotes and even use numbered or unnumbered lists. As KlickerUZH is frequently used in university lectures, there is also an option to add formulas (both inline and as centered formulas) using the common LaTeX syntax (simply press the corresponding button). Please note that the single $-sign notation for inline formulas is disabled here to avoid confusions with text $-signs in questions (just use $$formula$$ for inline formulas).

   4.1 **Audience Preview:** A preview of how the audience sees the question including all parsed formulas and other rich text formatting.

   4.2 **Attached Images:** Images can be attached to a question and will be shown to the audience and on the evaluation screen. An additional image title can be added as auxiliary information.

5. **Available Choices (SC / MC only):** The available answers the audience may choose from. Click the plus sign to add a new answer and type in the answer. Then click the red cross or green tick (5.1 or 5.2) to select whether the answer is correct or not. If there is no correct answer just skip this step and save the answer. Delete answers with the button on the left (5.3). All answering options **include full markdown and LaTeX support** and can render most common markdown notations as well as inline LaTeX Fomulas enclosed by two $-signs on each side. Please check the preview at the top to ensure a correct rendering of all formulas and formatting. <br/>
In case of Number Range questions you have the possiblity to choose your **Input Restrictions (Number Range only):** The range the answer needs to be in. Either provide a lower and upper limit, only one of the said limits or no limit at all.

6. **Save** Press the save button on the bottom to save the question and add it to the [Question Pool](question_pool.md) (see next section).

To continue with the tutorial, fill out the form completely and click on "Save". You will then be redirected to the question pool and can continue with [session creation](session_create.md).
