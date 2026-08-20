# -*- coding: utf-8 -*-
"""Generate 15 original O-NET English practice sets (round 1183).

Blueprint source: NIETS O-NET academic year 2569.
P.6: 32 four-choice items / 60 min.
M.3: 31 four-choice + 1 sequencing item / 90 min.
M.6: 53 five-choice + 7 sequencing items / 90 min.

The content is newly written for Vocab World. It follows the official item forms
and competency mix without copying released examination questions.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "js" / "data" / "exam"


def item(prompt, answer, wrong, choices=4, tag="", ref=""):
    opts = [answer] + list(wrong)[: choices - 1]
    if len(opts) != choices or len(set(opts)) != choices:
        raise ValueError((prompt, opts))
    return {
        "q": prompt, "c": opts, "a": 0, "tag": tag, "ref": ref,
        "ex": f"ตอบ {answer} — คำตอบนี้สอดคล้องกับบริบทและโครงสร้างภาษาที่โจทย์กำหนด ส่วนตัวเลือกอื่นทำให้ความหมาย กาล หรือเจตนาของผู้พูดคลาดเคลื่อน"
    }


def section(name, desc, items, passage=None):
    out = {"n": name, "d": desc, "items": items}
    if passage:
        out["p"] = passage
    return out


P6 = [
    dict(name="Mali", friend="Ben", place="library", day="Tuesday", time="3:30 p.m.", club="Science Club", weather="rainy", food="sandwiches", festival="Christmas"),
    dict(name="Nina", friend="Tom", place="school garden", day="Wednesday", time="2:45 p.m.", club="Art Club", weather="sunny", food="noodles", festival="New Year"),
    dict(name="Ploy", friend="Sam", place="sports hall", day="Thursday", time="4:00 p.m.", club="Badminton Club", weather="cloudy", food="fruit salad", festival="Halloween"),
    dict(name="Kwan", friend="Leo", place="computer room", day="Friday", time="3:15 p.m.", club="Coding Club", weather="windy", food="fried rice", festival="Thanksgiving"),
    dict(name="Mint", friend="Dan", place="music room", day="Monday", time="4:15 p.m.", club="Music Club", weather="cool", food="vegetable soup", festival="Easter"),
]


def p6_set(i, d):
    story = {"t": f"{d['name']}'s School Day", "x": [
        f"{d['name']} is in Grade 6. On {d['day']}, {d['name']} meets {d['friend']} at the {d['place']} at {d['time']}.",
        f"They join the {d['club']}. The weather is {d['weather']}, so they stay at school and share {d['food']} after the activity."
    ]}
    reading = [
        item(f"Where do {d['name']} and {d['friend']} meet?", f"At the {d['place']}", ["At the bus station", "At the market", "At home"], ref="Paragraph 1"),
        item("When do they meet?", f"On {d['day']} at {d['time']}", ["On Sunday at noon", "On Saturday morning", "Every day at six"], ref="Paragraph 1"),
        item("What do they do together?", f"They join the {d['club']}.", ["They visit a hospital.", "They clean the beach.", "They take a train."], ref="Paragraph 2"),
        item("Why do they stay at school?", f"Because the weather is {d['weather']}.", ["Because the school bus is full.", "Because they lose their bags.", "Because the shop is closed."], ref="Paragraph 2"),
        item("What do they eat after the activity?", d["food"].capitalize(), ["Ice cream", "Pizza", "Cereal"], ref="Paragraph 2"),
        item("Which sentence is TRUE?", f"{d['name']} is a Grade 6 student.", [f"{d['friend']} is the teacher.", "The activity is at midnight.", "They go home before the club."], ref="Both paragraphs"),
    ]
    comm_specs = [
        (f"{d['friend']}: Good morning, {d['name']}! How are you?", "I'm fine, thank you.", ["Good night.", "You're welcome.", "Here you are."]),
        (f"{d['name']}: May I borrow your pencil?", "Yes, of course.", ["It is a pencil.", "I am eleven.", "See you yesterday."]),
        (f"{d['friend']}: Thank you for helping me.", "You're welcome.", ["I'm sorry to hear that.", "Never ask me.", "It is raining."]),
        ("Teacher: Please close the door.", "Certainly.", ["The door is blue.", "I closed tomorrow.", "No, it isn't a door."]),
        (f"{d['name']}: Would you like some {d['food']}?", "Yes, please.", ["I like yesterday.", "It is at school.", "No, I am food."]),
        (f"{d['friend']}: I'm sorry I stepped on your foot.", "That's all right.", ["Congratulations!", "Happy birthday!", "Good appetite!"]),
        ("A: Excuse me. Where is the restroom?", "It is next to the office.", ["It is half past nine.", "It is very delicious.", "It is ten baht."]),
        ("A: Can you help me carry these books?", "Sure. I'd be happy to.", ["They are storybooks.", "I carried them yesterday.", "The books are on sale."]),
        ("A: What does your father do?", "He is a nurse.", ["He is tall and kind.", "He likes mangoes.", "He is at seven o'clock."]),
        ("A: Why do you like English?", "Because it is useful.", ["At the language room.", "Twice a week.", "With my classmates."]),
    ]
    communication = [item(q, a, w, tag="Communication") for q, a, w in comm_specs]
    info_pass = {"t": f"{d['club']} Notice", "x": [
        f"Meeting: {d['day']}, {d['time']} | Place: {d['place']} | Bring: a notebook and a water bottle | Fee: Free"
    ]}
    info = [
        item("Which item should a student bring?", "A notebook", ["A frying pan", "A pillow", "A passport"], ref="Club notice"),
        item("How much is the club fee?", "There is no fee.", ["Ten baht", "Fifty baht", "One hundred baht"], ref="Club notice"),
        item("Which word tells us about the sky and air?", d["weather"], ["hungry", "careful", "expensive"]),
        item(f"{d['name']} has 24 pencils and gives 6 away. Which sentence is correct?", f"{d['name']} has eighteen pencils left.", [f"{d['name']} has thirty pencils left.", f"{d['name']} has six pencils left.", f"{d['name']} has twelve pencils left."]),
        item("Choose the sentence with correct punctuation.", f"Where is {d['friend']}?", [f"Where is {d['friend']}.", f"where is {d['friend']}?", f"Where is {d['friend']},"]),
        item("Which sentence gives an opinion?", f"I think the {d['club']} is fun.", [f"The club meets on {d['day']}.", f"The meeting is at {d['time']}.", f"The club is at the {d['place']}."], tag="Opinion"),
    ]
    culture = [
        item(f"What do many people usually say at {d['festival']}?", "Best wishes!", ["Turn left now!", "Keep the change!", "Mind the gap!"]),
        item("Which action is polite when receiving a gift?", "Say 'Thank you.'", ["Throw it away.", "Walk away silently.", "Complain about it."]),
    ]
    compare = [
        item("Which sentence has the correct English word order?", f"{d['name']} usually walks to school.", [f"Usually {d['name']} to school walks.", f"Walks school {d['name']} usually to.", f"To usually school walks {d['name']}."], tag="Word order"),
        item("Which sentence is a question?", "Do you like music?", ["I like music.", "Please play music.", "What beautiful music!"]),
        item("Choose the sentence with a capital letter used correctly.", "Thailand is in Asia.", ["thailand is in Asia.", "Thailand is in asia.", "thailand is in asia."]),
        item("Which pair has the same meaning?", "big — large", ["hot — cold", "fast — slow", "old — new"]),
    ]
    school = [
        item("Teacher: Work in pairs. What should students do?", "Work with one classmate.", ["Work alone.", "Leave the classroom.", "Stop writing forever."], tag="Classroom"),
        item("A sign says 'KEEP QUIET'. What should you do?", "Speak softly.", ["Shout loudly.", "Run quickly.", "Play drums."], tag="Sign"),
        item("Your friend looks ill. What should you say?", "You should see the school nurse.", ["You should run in the sun.", "You must eat more candy.", "You can skip all meals."], tag="Advice"),
        item("The fire alarm rings. What is the safest action?", "Follow the teacher to the exit.", ["Hide under a locked desk.", "Go back for every toy.", "Use the lift alone."], tag="Safety"),
    ]
    secs = [section("Part 1 · Reading", "Read the text and answer 6 questions.", reading, story),
            section("Part 2 · Communication", "Choose the best response.", communication),
            section("Part 3 · Information", "Read the notice and use language in context.", info, info_pass),
            section("Part 4 · Language and Culture", "Use English politely and appropriately.", culture),
            section("Part 5 · English and Thai", "Compare word order, punctuation, and meaning.", compare),
            section("Part 6 · School Situations", "Choose suitable English for school situations.", school)]
    return {"id": f"onetp6_{i+1}", "exam": "onetp6", "label": f"O-NET ป.6 · ชุดที่ {i+1}", "total": 32, "sections": secs}


M3 = [
    dict(name="Arun", project="a bottle-refill station", place="the school canteen", result="plastic cup use fell by 38 percent", issue="single-use plastic"),
    dict(name="Fah", project="a bicycle-sharing corner", place="the community library", result="short car trips fell by 24 percent", issue="traffic and air pollution"),
    dict(name="Mek", project="a food-waste compost bin", place="the school garden", result="general waste fell by 31 percent", issue="food waste"),
    dict(name="Dao", project="a peer-reading programme", place="the language room", result="weekly reading rose by 42 percent", issue="limited reading habits"),
    dict(name="Pim", project="a rainwater collection tank", place="the sports building", result="tap-water use fell by 29 percent", issue="water conservation"),
]


def m3_set(i, d):
    passage = {"t": f"A Student Project: {d['project'].title()}", "x": [
        f"{d['name']} noticed that {d['issue']} was becoming a problem. Instead of waiting for adults to solve it, the class designed {d['project']} at {d['place']}.",
        f"Students collected information for four weeks before and after the change. Their report showed that {d['result']}. The team said clear instructions and regular reminders were more useful than punishment."
    ]}
    read_specs = [
        ("What problem did the class try to solve?", d["issue"], ["a lack of uniforms", "late school buses", "expensive textbooks"]),
        ("What did the class design?", d["project"], ["a new examination", "a private car park", "a school uniform"]),
        ("Where was the project located?", d["place"], ["at the airport", "inside a hospital", "beside a factory"]),
        ("How long did students collect information?", "Four weeks before and after the change", ["Only one morning", "Exactly one year", "During a single lunch break"]),
        ("What did the report show?", d["result"], ["nothing changed at all", "the problem doubled", "students stopped attending school"]),
        ("What did the team consider more useful than punishment?", "Clear instructions and regular reminders", ["Longer homework and tests", "Closing the project", "Ignoring the problem"]),
        ("The word 'it' in paragraph 1 refers to", d["issue"], [d["place"], "the class", "an adult"]),
        ("Which statement is an inference from the passage?", "Students used evidence to evaluate their idea.", ["The project was paid for by tourists.", "Every adult opposed the project.", "The school cancelled all classes."]),
        ("What is the best title for the passage?", "Students Turn an Idea into Measurable Change", ["Why Punishment Is Always Best", "A Holiday without Teachers", "The Most Expensive School in Town"]),
        ("Which source would best confirm the reported result?", "The class's before-and-after records", ["A fictional story", "A restaurant menu", "An old weather forecast"]),
        ("Which sentence is in the passive voice?", "The information was collected by students.", ["Students collected the information.", "Students are careful researchers.", "The class likes the project."]),
        ("Choose the correct order of the project steps.", "notice the problem → design a solution → collect data → report the result", ["report → notice → collect → design", "collect → report → notice → design", "design → report → collect → notice"], "Sequencing"),
    ]
    reading = [item(q, a, w, tag=(tag if len(x) == 4 else "Reading"), ref="Project article") for x in read_specs for q, a, w, *tagx in [x] for tag in [tagx[0] if tagx else "Reading"]]
    comm_specs = [
        ("A: Would you mind opening the window?", "Not at all.", ["Yes, I am a window.", "It opened tomorrow.", "The window is expensive."]),
        ("A: I didn't win the speech contest.", "I'm sorry to hear that.", ["That's your receipt.", "Turn right at the bank.", "Here is the menu."]),
        ("A: Could you explain this instruction again?", "Certainly. Which part is unclear?", ["The instruction costs fifty baht.", "I explained next week.", "No, it is not an instruction."]),
        ("A: Shall we present our project on Friday?", "That sounds like a good plan.", ["Friday is the fifth day.", "The project is made of paper.", "I presented it yesterday morning only."]),
        ("A: May I interrupt for a moment?", "Of course. What would you like to add?", ["The moment is very heavy.", "I may be at home.", "Interruptions are blue."]),
        ("A: Can I help you carry that box?", "Thanks. That's very kind of you.", ["The box is square.", "I carried it last month.", "No one is a box."]),
        ("A: I think schools should reduce waste.", "I agree because it benefits everyone.", ["The school is near my house.", "Waste is a noun.", "I reduced at six o'clock."]),
    ]
    communication = [item(q, a, w, tag="Communication") for q, a, w in comm_specs]
    presentation = [
        item(f"{d['name']} ____ the project results at assembly yesterday.", "presented", ["presents", "will present", "has presenting"], tag="Past simple"),
        item("If students follow the instructions, the project ____ more effective.", "will become", ["became yesterday", "becoming", "has became"], tag="First conditional"),
        item("The class collected data ____ it could compare the results.", "so that", ["although", "unless", "despite"], tag="Connector"),
        item("There were ____ plastic cups after the project than before.", "fewer", ["less", "much", "the most"], tag="Comparison"),
        item("Which sentence reports a fact rather than an opinion?", d["result"].capitalize() + ".", ["The project is wonderful.", "I believe the team is brilliant.", "It may be the best idea ever."], tag="Fact and opinion"),
        item("Choose the most suitable conclusion for a project report.", "The evidence suggests that the solution should continue.", ["Once upon a time there was a dragon.", "Buy one today and get one free.", "Dear Mum, I will be home late."], tag="Report writing"),
        item("Which sentence is grammatically correct?", "Neither the teacher nor the students were late.", ["Neither the teacher nor the students was late.", "Neither teacher or students were late.", "Neither the teacher nor students is late yesterday."], tag="Agreement"),
    ]
    culture = [
        item("At a formal school event, which greeting is most appropriate?", "Good morning, ladies and gentlemen.", ["Hey, you guys!", "What do you want?", "Move out of my way."], tag="Register"),
        item("A British friend says, 'Would you like some tea?' How can you accept politely?", "Yes, please. That would be lovely.", ["Give it to me now.", "Tea is a plant.", "I accepted yesterday."], tag="Culture"),
        item("Which action commonly shows polite turn-taking in English conversation?", "Waiting for a speaker to finish", ["Speaking over everyone", "Ignoring every question", "Walking away mid-sentence"], tag="Social etiquette"),
    ]
    language = [
        item("Choose the sentence with correct English word order.", "The students carefully recorded the results.", ["The students recorded carefully the results.", "Carefully the results students recorded.", "Recorded the students the results carefully."], tag="Word order"),
        item("Which punctuation correctly introduces a list?", "We need three things: paper, tape, and scissors.", ["We need three things? paper, tape, and scissors.", "We need three things! paper, tape, and scissors.", "We need three things; because paper, tape, and scissors."], tag="Punctuation"),
        item("Which sentence is suitable in a formal report?", "The survey indicates a reduction in waste.", ["Wow! The rubbish totally disappeared!", "You know, stuff got way better.", "Hey everyone, the bins are cool!"], tag="Register"),
    ]
    secs = [section("Part 1 · Reading and Instructions", "Read, interpret, and sequence information.", reading, passage),
            section("Part 2 · Communication", "Choose an appropriate response.", communication),
            section("Part 3 · Presenting Information", "Use grammar and evidence to present ideas.", presentation),
            section("Part 4 · Language and Culture", "Use English appropriately in social settings.", culture),
            section("Part 5 · Language Comparison", "Apply English word order, punctuation, and register.", language)]
    return {"id": f"onetm3_{i+1}", "exam": "onetm3", "label": f"O-NET ม.3 · ชุดที่ {i+1}", "total": 32, "sections": secs}


M6 = [
    dict(city="Nakhon Green", school="Sirin School", project="cool-roof programme", metric="indoor afternoon temperatures fell by 2.8°C", species="mudskipper", habitat="mangrove forest", tech="AI study assistants", person="Dr. Ladda Arun", field="community medicine"),
    dict(city="Riverstone", school="Panya College", project="food-rescue network", metric="edible waste fell by 41 percent", species="hornbill", habitat="lowland rainforest", tech="facial recognition in schools", person="Kiet Wong", field="renewable engineering"),
    dict(city="Ban Mai", school="Thammasat Learning Centre", project="solar-library project", metric="electricity use from the grid fell by 34 percent", species="seagrass", habitat="coastal meadow", tech="fully digital textbooks", person="Naree Chai", field="marine conservation"),
    dict(city="Cloud Valley", school="Witthaya Academy", project="safe-cycle corridor", metric="student car journeys fell by 27 percent", species="Asian elephant", habitat="forest corridor", tech="cashless school payments", person="Somchai Dee", field="public transport planning"),
    dict(city="Lotus Bay", school="Ananda School", project="rain-garden system", metric="storm-water runoff fell by 36 percent", species="firefly", habitat="wetland edge", tech="automated essay feedback", person="Mayura Int", field="language education"),
]


def m6_reading_sections(d):
    p1 = {"t": f"The {d['project'].title()} in {d['city']}", "x": [
        f"When {d['school']} proposed a {d['project']}, supporters expected a quick improvement. The team first gathered baseline data, however, because enthusiasm alone could not establish whether the plan worked.",
        f"Six months later, {d['metric']}. The authors cautioned that seasonal changes may have influenced the figures, so the programme will be monitored for another year before permanent funding is approved."
    ]}
    a1 = [
        item("Why did the team gather baseline data?", "To compare conditions before and after the project", ["To advertise the school abroad", "To avoid collecting later evidence", "To replace every teacher", "To guarantee permanent funding"], 5, ref="Passage 1"),
        item("What does the reported metric suggest?", "The project was associated with a measurable improvement.", ["The project certainly caused every change.", "The project failed immediately.", "No measurements were taken.", "Funding had already become permanent."], 5, ref="Passage 1"),
        item("Why are the authors cautious?", "Seasonal changes could also have affected the result.", ["They dislike all school projects.", "The baseline data were destroyed.", "Students refused to participate.", "The city has no seasons."], 5, ref="Passage 1"),
        item("The word 'establish' is closest in meaning to", "demonstrate", ["hide", "postpone", "decorate", "guess randomly"], 5, ref="Paragraph 1"),
        item("Which statement best describes the passage?", "It reports promising evidence while acknowledging a limitation.", ["It proves the project can never work.", "It is a fictional adventure story.", "It gives instructions for an examination.", "It demands funding without evidence."], 5, ref="Both paragraphs"),
    ]
    p2 = {"t": f"A Small Species with a Large Role: The {d['species'].title()}", "x": [
        f"In the {d['habitat']}, the {d['species']} is easy to overlook. Yet its behaviour affects feeding relationships and can reveal subtle changes in water, soil, and vegetation.",
        "Scientists therefore combine direct observation with environmental measurements. A falling count is treated as a warning, not as proof of a single cause, because weather, food supply, and human disturbance may change at the same time."
    ]}
    a2 = [
        item(f"Why is the {d['species']} important to researchers?", "It can help indicate environmental change.", ["It controls the weather.", "It is the largest animal in Asia.", "It lives in every habitat.", "It removes the need for measurements."], 5, ref="Passage 2"),
        item("What method do scientists use?", "They combine observation with environmental measurements.", ["They rely on guesses alone.", "They measure only the animal's colour.", "They avoid visiting the habitat.", "They count tourists instead of wildlife."], 5, ref="Paragraph 2"),
        item("Why is a falling count not proof of one cause?", "Several factors may change simultaneously.", ["Counts are always meaningless.", "The species cannot be observed.", "Weather never affects habitats.", "Researchers already know the only cause."], 5, ref="Paragraph 2"),
        item("The phrase 'easy to overlook' means", "easy not to notice", ["easy to train", "too dangerous to approach", "impossible to count", "ready to disappear instantly"], 5, ref="Paragraph 1"),
        item("Which conclusion is best supported?", "Indicators are most useful when interpreted with other evidence.", ["One animal count explains an entire ecosystem.", "Human disturbance is always the sole cause.", "Direct observation should be abandoned.", "Environmental data never change."], 5, ref="Both paragraphs"),
    ]
    p3 = {"t": f"Debating {d['tech'].title()}", "x": [
        f"Advocates of {d['tech']} argue that the technology can save time and make services more responsive. They also say a carefully designed trial can reveal problems before large-scale adoption.",
        "Critics reply that convenience should not outweigh privacy, fairness, or the ability to challenge an automated decision. Both sides increasingly agree on one point: rules must specify what data are collected, who can access them, and when they will be deleted."
    ]}
    a3 = [
        item("What benefit do advocates emphasize?", "Greater efficiency and responsiveness", ["The end of all school rules", "Guaranteed perfect decisions", "Unlimited data storage", "Removal of human responsibility"], 5, ref="Passage 3"),
        item("What concerns critics?", "Privacy, fairness, and avenues for appeal", ["The colour of the devices", "The length of the school day only", "The absence of any technology", "The price of paper notebooks alone"], 5, ref="Paragraph 2"),
        item("What do both sides increasingly agree on?", "Clear rules for collecting, accessing, and deleting data", ["A permanent ban on discussion", "Secret storage without limits", "Immediate nationwide adoption", "Letting machines write all rules"], 5, ref="Paragraph 2"),
        item("The phrase 'outweigh' is closest in meaning to", "be more important than", ["be identical to", "be hidden beneath", "be measured in kilograms", "be delayed until later"], 5, ref="Paragraph 2"),
        item("What is the writer's approach?", "Balanced, presenting benefits and risks", ["Entirely promotional", "Completely hostile without evidence", "Humorous and fictional", "Focused only on device prices"], 5, ref="Both paragraphs"),
    ]
    p4 = {"t": f"The Work of {d['person']}", "x": [
        f"{d['person']} began a career in {d['field']} after noticing that technically sound plans often failed when local people were consulted too late. Rather than treating communication as the final stage, the team invited residents to define the problem at the beginning.",
        "Some early meetings were slow and occasionally uncomfortable. Nevertheless, later projects required fewer expensive revisions because practical concerns had already been identified. The approach did not eliminate disagreement; it made disagreement useful evidence for design."
    ]}
    a4 = [
        item(f"What influenced {d['person']}'s approach?", "Seeing good technical plans fail after late consultation", ["Winning a school sports contest", "Avoiding all contact with residents", "Reading a fictional travel diary", "Receiving unlimited project funding"], 5, ref="Passage 4"),
        item("How did the team change the planning process?", "Residents helped define the problem from the start.", ["Residents saw the plan only after completion.", "The team removed every meeting.", "Only foreign experts could comment.", "Communication was postponed indefinitely."], 5, ref="Paragraph 1"),
        item("What was a later benefit of the slower early meetings?", "Projects needed fewer costly revisions.", ["All disagreement disappeared.", "No practical concerns were identified.", "Projects became entirely free.", "Residents stopped attending meetings."], 5, ref="Paragraph 2"),
        item("What does 'it' in the final sentence refer to?", "the approach", ["the career", "the final stage", "an expensive revision", "technical soundness"], 5, ref="Paragraph 2"),
        item("Which principle best summarizes the passage?", "Early participation can improve practical design.", ["Fast decisions are always the best decisions.", "Technical knowledge has no value.", "Disagreement should always be hidden.", "Residents should approve every detail alone."], 5, ref="Both paragraphs"),
    ]
    return [section("Section 1 · Reading 1", "Read the project report.", a1, p1),
            section("Section 2 · Reading 2", "Read the science article.", a2, p2),
            section("Section 3 · Reading 3", "Read the discussion of technology.", a3, p3),
            section("Section 4 · Reading 4", "Read the profile.", a4, p4)]


def m6_set(i, d):
    comm = [
        item("A: I may have misunderstood your point. Could you clarify it?", "B: Certainly. I mean that the trial should continue, but with stronger safeguards.", ["B: The point is made of metal.", "B: I clarified it next year.", "B: Safeguards are usually blue.", "B: You must never ask questions."], 5, tag="Clarification"),
        item("A: Would you be available to review my application?", "B: I'd be glad to. When is the deadline?", ["B: The application is available.", "B: I reviewed tomorrow.", "B: Deadlines are unnecessary words.", "B: Your application has five pages."], 5, tag="Formal request"),
        item("A: I'm afraid the seminar has been postponed.", "B: Thanks for letting me know. Has a new date been set?", ["B: The seminar is a noun.", "B: I postpone every table.", "B: Afraid is an adjective.", "B: No date can exist."], 5, tag="Response to news"),
        item("A: In my view, the evidence is not yet conclusive.", "B: I see your point, although the early results are encouraging.", ["B: Evidence is expensive.", "B: I conclude at noon.", "B: Views come from windows.", "B: Encouragement is impossible."], 5, tag="Polite disagreement"),
        item("A: Could I add something before we move on?", "B: Of course. Please go ahead.", ["B: We moved last year.", "B: Addition is mathematics.", "B: Something is on the shelf.", "B: Never speak in a meeting."], 5, tag="Turn-taking"),
        item("A: I apologise for sending the report late.", "B: Thank you for explaining. Please send the final version by noon.", ["B: Reports cannot be late.", "B: Noon was yesterday.", "B: Explanations are green.", "B: I am a final version."], 5, tag="Professional response"),
        item("A: Shall we divide the research tasks among the group?", "B: Good idea. That should make the workload manageable.", ["B: Research has four letters.", "B: The group is divided by three.", "B: Workloads are buildings.", "B: I managed yesterday only."], 5, tag="Suggestion"),
        item("A: The survey response rate was lower than expected.", "B: Perhaps a shorter questionnaire would encourage more replies.", ["B: Surveys are always perfect.", "B: Rates are paid at a bank only.", "B: Expectations have no meaning.", "B: Questionnaires cannot be shortened."], 5, tag="Problem solving"),
        item("A: Thank you for recommending me for the programme.", "B: You're welcome. Your work made you a strong candidate.", ["B: Programmes are on television only.", "B: Recommendations are heavy.", "B: Candidates never work.", "B: I recommend yesterday."], 5, tag="Thanks"),
        item("A: Would it be possible to reschedule our interview?", "B: Let me check the calendar and suggest another time.", ["B: Interviews have no schedules.", "B: The calendar is circular.", "B: Possibility is impossible.", "B: I interviewed next week ago."], 5, tag="Negotiation"),
    ]
    subjects = ["committee", "research team", "school board", "volunteer group", "student council"]
    s = subjects[i]
    grammar_specs = [
        (f"By the time the {s} met, the analyst ____ the revised figures.", "had checked", ["checks", "has checking", "will checked", "is check"]),
        ("If the pilot project succeeds, it ____ to three more districts next year.", "will be expanded", ["expanded yesterday", "has expanding", "would expand last year", "is expand"]),
        ("The survey, ____ was completed by 800 students, revealed a clear preference.", "which", ["who", "where", "what", "whose students"]),
        ("Not only ____ energy, but it also reduces maintenance costs.", "does the system save", ["the system saves", "the system save", "saves the system", "is the system save"]),
        ("The proposal was rejected ____ it did not include a realistic budget.", "because", ["despite", "unless", "whereas of", "in spite"]),
        ("Researchers recommend that every response ____ anonymous.", "remain", ["remains", "remained yesterday", "is remaining always", "to remained"]),
        ("There is ____ evidence to justify a permanent policy change.", "insufficient", ["insufficiency many", "too insufficiently", "few evidence", "an evidence"]),
        ("The new process is considerably ____ than the previous one.", "more efficient", ["efficiently", "most efficiency", "more efficiently process", "efficiest"]),
        ("No sooner had the announcement been made ____ questions began to arrive.", "than", ["when", "that", "because of", "despite"]),
        ("Students are expected ____ their sources accurately.", "to cite", ["citing to", "cite to", "to cited", "have cite"]),
        ("The data should be interpreted cautiously, ____ the sample was relatively small.", "given that", ["even though of", "in order to", "unless of", "as if to"]),
        ("Neither the cost nor the technical limitations ____ fully addressed in the report.", "were", ["was", "has", "is being yesterday", "be"]),
        ("Having ____ the alternatives, the panel selected the least disruptive option.", "considered", ["consider", "considering to", "been consider", "considers"]),
    ]
    grammar = [item(q, a, w, 5, tag="Grammar and usage") for q, a, w in grammar_specs]
    critical = [
        item("A graph rises from 42% to 57%. Which description is accurate?", "The value increased by 15 percentage points.", ["The value increased by exactly 15 percent.", "The value fell by 15 percentage points.", "The value more than doubled.", "The graph shows no change."], 5, tag="Data literacy"),
        item("Which source is most reliable for the current examination schedule?", "The official examination authority's website", ["An anonymous post from five years ago", "A fictional novel", "An undated advertisement", "A friend's guess"], 5, tag="Source evaluation"),
        item("An article reports correlation between screen time and sleep. Which conclusion is justified?", "The variables are associated, but the report alone does not prove causation.", ["Screen time is proven to be the only cause.", "Sleep certainly causes all screen use.", "The variables cannot be measured.", "Correlation and causation mean the same thing."], 5, tag="Reasoning"),
        item("Which statement is written in the most objective style?", "Survey participation rose from 420 to 510 students.", ["The amazing survey was a huge triumph.", "Everyone obviously loved the brilliant survey.", "The survey was totally awesome.", "Only a fool would question the survey."], 5, tag="Register"),
        item("A notice says 'Applications received after 4 p.m. on 30 June will not be considered.' What follows?", "An application sent at 4:10 p.m. on 30 June is late.", ["Every application is accepted.", "The deadline is 4 a.m.", "Applications close in July.", "Late applications receive priority."], 5, tag="Interpretation"),
        item("Which revision removes ambiguity from 'Students told teachers they needed more time'?", "The students said, 'We need more time,' to the teachers.", ["They told them about time.", "Students and teachers needed it.", "More time was told.", "Teachers students told time."], 5, tag="Clarity"),
        item("Which claim requires the strongest supporting evidence?", "This programme improves examination scores for every student nationwide.", ["The meeting began at nine.", "The room has twenty chairs.", "The report contains four tables.", "Some students asked questions."], 5, tag="Claims and evidence"),
        item("A sample includes only volunteers from one high-achieving school. What is the main limitation?", "The findings may not represent all students.", ["The sample is automatically fraudulent.", "No volunteer can answer questions.", "High achievement cannot be measured.", "All schools are identical."], 5, tag="Research methods"),
        item("Which sentence correctly paraphrases 'The policy was implemented gradually'?", "The policy was introduced in stages.", ["The policy was cancelled immediately.", "The policy was hidden permanently.", "The policy was copied word for word.", "The policy had no implementation."], 5, tag="Paraphrase"),
        item("Which email subject line is clearest for a formal request?", "Request to reschedule interview — 12 September", ["Hello!!!", "A thing I need", "READ THIS NOW", "No subject"], 5, tag="Professional writing"),
    ]
    seq_specs = [
        ("Arrange the research process logically.", "define the question → collect data → analyse results → report findings", ["report → define → analyse → collect", "collect → report → define → analyse", "analyse → collect → report → define", "report → analyse → collect → define"]),
        ("Arrange the steps for submitting an online application.", "create an account → complete the form → upload documents → submit", ["submit → create → upload → complete", "upload → submit → create → complete", "complete → submit → create → upload", "submit → upload → complete → create"]),
        ("Arrange the paragraph structure logically.", "topic sentence → supporting evidence → explanation → concluding sentence", ["conclusion → topic → explanation → evidence", "evidence → conclusion → topic → explanation", "explanation → topic → conclusion → evidence", "conclusion → evidence → explanation → topic"]),
        ("Arrange the emergency response steps.", "identify danger → alert others → move to safety → contact emergency services", ["contact → ignore danger → alert → return", "move → identify → return → alert", "alert → contact → enter danger → identify", "return → identify → move → alert"]),
        ("Arrange the meeting follow-up process.", "record decisions → assign responsibilities → set deadlines → review progress", ["review → record → set → assign", "set → review → record → assign", "assign → review → record → set", "review → assign → set → record"]),
        ("Arrange the source-evaluation steps.", "identify the author → check the evidence → compare other sources → reach a judgment", ["judge → identify → compare → check", "compare → judge → identify → check", "check → judge → compare → identify", "judge → check → identify → compare"]),
        ("Arrange the problem-solving cycle.", "describe the problem → generate options → choose and test one → evaluate the outcome", ["evaluate → describe → test → generate", "test → evaluate → describe → generate", "generate → evaluate → describe → test", "evaluate → generate → test → describe"]),
    ]
    sequencing = [item(q, a, w, 5, tag="Sequencing") for q, a, w in seq_specs]
    secs = m6_reading_sections(d) + [section("Section 5 · Communication", "Choose the most appropriate response.", comm),
                                     section("Section 6 · Grammar and Usage", "Complete each sentence accurately.", grammar),
                                     section("Section 7 · Critical Language Use", "Evaluate evidence, register, and meaning.", critical),
                                     section("Section 8 · Sequencing", "Choose the correctly ordered process.", sequencing)]
    return {"id": f"onetm6_{i+1}", "exam": "onetm6", "label": f"O-NET ม.6 · ชุดที่ {i+1}", "total": 60, "sections": secs}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    packs = [p6_set(i, d) for i, d in enumerate(P6)]
    packs += [m3_set(i, d) for i, d in enumerate(M3)]
    packs += [m6_set(i, d) for i, d in enumerate(M6)]
    for pack in packs:
        path = OUT / f"{pack['id']}.json"
        path.write_text(json.dumps(pack, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"✅ Generated {len(packs)} O-NET sets / {sum(p['total'] for p in packs)} questions")


if __name__ == "__main__":
    main()
