# Prompt: Patient Experience Review Funnel (Innate Chiropractic)

Copy everything inside the box below and paste it into your AI funnel builder (GoHighLevel AI Builder, ChatGPT, Claude, etc.).

Before you paste it, replace these placeholders:

- `[NEW LONDON GOOGLE REVIEW LINK]` with the New London Google review link
- `[CLAREMONT GOOGLE REVIEW LINK]` with the Claremont Google review link
- `[LOGO URL]` with the Innate Chiropractic logo link (optional)

---

```
Build a 3-page patient feedback funnel for Innate Chiropractic, a chiropractic and functional medicine practice led by Dr. Thomas, with two locations: New London and Claremont.

GOAL
Collect patient experience ratings, send happy patients to the correct Google review page for their location, and give every patient an easy way to share private feedback with our team.

BRAND AND STYLE
- Clean, warm, calming wellness look. Lots of white space.
- Colors: soft white background, deep teal or navy for headings and buttons, light sage or sky blue accents.
- Font: modern sans serif (Montserrat or Poppins for headings, Open Sans or Inter for body).
- Mobile first. Most patients will open this from a text message on their phone.
- Large tap friendly buttons, minimum 48px tall.
- Logo at the top of every page: [LOGO URL]
- Do not use em dashes anywhere in the copy.

PAGE 1: EXPERIENCE SURVEY (main page)
Headline: "How was your visit with us?"
Subheadline: "Your feedback helps Dr. Thomas and our team take better care of you. It only takes 30 seconds."

Embed this survey form full width in the main section. Do not add any other form on this page, the survey handles the questions and the conditional routing:

<iframe src="https://api.leadconnectorhq.com/widget/survey/dz7PbKxDOUfq2GrC0ZY4" style="border:none;width:100%;" scrolling="no" id="dz7PbKxDOUfq2GrC0ZY4" title="survey" data-cookie-consent="true" data-cookie-consent-provider="auto"></iframe>
<script src="https://link.msgsndr.com/js/form_embed.js"></script>

The survey asks:
1. "How would you rate your experience today?" on a 1 to 5 scale (5 = excellent).
2. "Which office did you visit?" with options: New London, Claremont.

Small trust line under the form: "Your answers go directly to our team. Thank you for helping us grow."

ROUTING LOGIC (set inside the survey's conditional logic / redirect settings)
- Rating = 5 AND Location = New London -> redirect to the Page 2A "Thank You, New London" page.
- Rating = 5 AND Location = Claremont -> redirect to the Page 2B "Thank You, Claremont" page.
- Rating = 1, 2, 3, or 4 (either location) -> redirect to Page 3 "We'd Love to Hear More" page.

PAGE 2A: THANK YOU, NEW LONDON
Headline: "Thank you! We're so glad you had a great visit."
Body: "Would you take a moment to share your experience on Google? Your review helps other people in New London find natural, drug free care and helps our small practice grow."
Primary button: "Leave a Google Review" -> opens [NEW LONDON GOOGLE REVIEW LINK] in a new tab.
Optional: auto redirect to [NEW LONDON GOOGLE REVIEW LINK] after 5 seconds, with the button as a backup.
Small secondary line: "Have a suggestion for us too? Tell us here" -> links to Page 3.

PAGE 2B: THANK YOU, CLAREMONT
Same layout and copy as Page 2A, but:
- Reference Claremont instead of New London.
- Button and auto redirect go to [CLAREMONT GOOGLE REVIEW LINK].

PAGE 3: WE'D LOVE TO HEAR MORE (ratings 1 to 4)
Headline: "Thank you for your honesty."
Subheadline: "We want every visit to feel great. Please tell us what we could do better, and Dr. Thomas or a member of our team will personally follow up."

Message form fields:
- First Name (required)
- Last Name
- Phone (required)
- Email
- Office Visited (dropdown: New London, Claremont)
- "What could we have done better?" (long text, required)
- "Would you like us to contact you?" (Yes / No)
Submit button: "Send My Feedback"

Below the form, a small, neutral line: "You are also welcome to share a public review on Google:" with two text links, "New London" -> [NEW LONDON GOOGLE REVIEW LINK] and "Claremont" -> [CLAREMONT GOOGLE REVIEW LINK].

After submit, show: "Thank you. Your message has been sent to our team and we will be in touch soon."

AUTOMATIONS / NOTIFICATIONS
- On Page 3 form submit: send an internal email and SMS alert to the office manager with the patient's name, phone, office, rating, and message. Tag the contact "feedback-needs-followup" and the office tag ("new-london" or "claremont").
- On a 5 star rating: tag the contact "5-star-review-requested" and the office tag.
- Add the contact to a "Review Funnel" pipeline with stages: Survey Submitted, Sent to Google, Needs Follow Up, Resolved.

FOOTER (all pages)
Innate Chiropractic | New London | Claremont | Phone | Privacy Policy
```

---

## Important: Google review policy note

Google's review policy does not allow "review gating," meaning only sending happy customers to Google while hiding the review option from unhappy ones. A Google Business Profile caught doing this can have reviews removed or the listing suspended, and the FTC also watches for practices that suppress negative reviews.

That is why the prompt above keeps your routing (5 stars goes straight to Google, 1 to 4 goes to the private message form) but also puts a small "you are also welcome to leave a Google review" link on Page 3. Every patient still has a way to post publicly, while the funnel still focuses on fixing problems privately first. If you want to remove that link, check with Dr. Thomas first since it carries risk for both Google profiles.
