import { LIFE_AND_TIMES } from "./books";

// "A Legacy That Lives On" on the founder page (further instructions, 20 November 2026, §2): The Life
// & Times, the Photo Gallery, Words on Marble (two interviews) and the Burial Tributes. Everything here
// is taken from Destiny Fulfilled: The Life & Times (books/destiny-fulfilled.pdf), the publication
// prepared for his state burial in November 2023. The interview texts were transcribed from its pages
// 25–36; spelling and wording are the publication's own, with only scanning errors corrected.

export const readerPage = (page: number) => `/read/${LIFE_AND_TIMES.slug}#page=${page}`;

/** A paragraph, or an interviewer's question (shown in bold). */
type Block = string | { q: string };

export type Interview = {
  slug: string;
  dateline: string;
  title: string;
  date: string;
  source: string;
  intro: string;
  pages: [number, number];
  body: Block[];
};

export const interviews: Interview[] = [
  {
    slug: "dateline-1995",
    dateline: "Dateline 1995",
    title: "Interview with Chief (Dr) C. C. Mbadinuju (Odera)",
    date: "1995",
    source: "Goldlink Awards Production, Ihiala LGA Who Is Who",
    intro:
      "Before he entered elective politics, a team from Goldlink Awards Production visited Dr Mbadinuju at his law chambers on Oguta Road, Onitsha, for a profile in Ihiala LGA Who Is Who. They found a lawyer and Christian author who traced his journey from a village primary school to the State University of New York, Cornell and Southampton, and who spoke about the legal profession, the rulership crisis in Uli, faith and destiny, and his hopes for Ihiala.",
    pages: [25, 30],
    body: [
      "“A man who is self-reliant, positive, optimistic, and undertakes his work with the assurance of success magnetizes his condition. He draws to himself the creative powers of the universe.” (Anon)",
      "The encounter with Dr C. C. Mbadinuju was very overwhelming. He is a curious character, a reporter’s dilemma. We had gone with the knowing arrogance of all pressmen hunting their quarry for the kill, but we were defeated. It was like that of the cockroach that went to lick a little bit of red palm oil and got itself swallowed by oil, like touching a sleeping tiger by the tail.",
      "Dr C. C. Mbadinuju is a real genius of his time, with a mind as fertile as a virgin forest. He had answers for every question presented to him, answers that are so different from the general trend. Interviewing him leaves you with a clear-cut impression that lack of education is a crime against development. Yet having the education without versatility is another crime as monumental as not having it at all.",
      "But our defeat did not end with the encounter alone. We waded through spiritual matters without realizing that he is quite an authority in the field, with many books written and published in that direction. It was as deep as the Pacific Ocean.",
      "Our personality was born into a poor background where he could not afford a secondary education although his parents tried for him. Like Luther, the church he went to in his youthful days was actually in a sad state spiritually, and had been getting worse by the day. And like Luther, he is attacking the indolence and state of inertia of the minds of the present-day Christian through his books.",
      "We can therefore say with certainty that the success story of Dr C. C. Mbadinuju is a tribute to industry of mind. For a man who had little or no opportunity at birth, to now rise to the present position of eminence leaves one with no other objective except industry of mind, a persevering spirit and a trust in his God. Of course, he attributed his secret of success to absolute reliance on God. He has a deep conviction in the concept of destiny, nay, that whatever a man shall be has been written in the beginning. The very reason the people of Uli gave him the traditional title of Odera 1 of Uli.",
      "So, for those who hunger daily to be important and as learned as our personality, the road is clear. The secret has been revealed in his resume presented below, which will buttress everything and point the touch of understanding through the many steps he trudged to become what he is today, in spite of all the difficulties of life. He is a teacher, a lawyer, a political scientist, a social commentator, author and publisher, and a religious commentator. Jesus Christ said it: “Whoever will come after me must be ready to carry his own cross.”",
      "Thus, if you want to be like Dr C. C. Mbadinuju then you must be ready to suffer the flesh, you must be willing to endure the numerous pains of his life. He was born in 1945 at Uli to the Mbadinuju family of Ndikpo Umuaku, Uli. He began his primary school at Uli around 1951. In 1957, when he got out of primary school, he was unable to proceed, like others, into the college. It was due to financial problem. There was none, and his immediate society was basically subsistent farmers. However, there was this inner, most unwillingness in his parents and well-wishers not to waste the intellectual potential in the young lad, whereby he was advised to go straight for the teacher’s education programme.",
      "This decision took him through Bishop Lasbrey College, Irete, Owerri between 1959 and 1962 for the teacher’s certificate. His hunger for knowledge saw him obtaining his G.C.E. O’ Level and A’ Level papers between 1964 and 1966. Thereafter he got admission into the University of Ibadan, but he knew it was a pipe dream because of financial constraints. What he did instead was to write an application for further studies to the United States of America. Fortunately, he was offered a place at the State University of New York on scholarship. Nobody has ever done this before, but his courage and faith made it possible. The Holy Book said it: “If thou canst believe, all things are possible to him that believeth” (Mark 9:23). Yes, he believed, he relied on God completely and his life changed.",
      "Nevertheless, he found it hard to transport himself to America. The fare was not much, but at the time in question, it was a mission impossible to put together such kind of money. It was not until Late Chief S. B. C. Ohuoha (one of his mentors), who was a headmaster, came into the scene, did he find salvation. God works in mysterious ways; most often he uses people to perform miracles.",
      "Chief Ohuoha immediately arranged for our personality to get a loan from the mission. Late Chief Agbasoga from Oguta was the man in charge of the school system then and he quickly granted the loan. This was of course repaid within the first few months abroad after he had finished a summer job.",
      "Be that as it may, on getting to America, Dr C. C. Mbadinuju realized that only the sky was his limit. America has great prospects for those who are willing to work hard enough. Dr C. C. Mbadinuju was very willing, even eager to work. He was like the thirsty man in the desert who suddenly discovered an oasis. Within a period of two and a half years’ sojourn in New York, he was already through with his Bachelor of Arts in Political Science at the State University of New York, New Paltz. That was in June 1969. A year later, he was a proud holder of a master’s degree in Government (International Affairs) at Ohio University, Athens, Ohio, working at the same time in the University as a teaching assistant in the Government Department. From 1971 to 1974, he was an Assistant Professor, State University of New York at Cortland, New York; a visiting Professor at Upper College of the State University of New York, Utica/Rome, New York; and at the same time, he studied for his Doctor of Philosophy (PhD) in International Law and Relations, Cornell University, Ithaca, New York.",
      "Ordinarily, one should be satisfied with this achievement but our personality was not. From 1975 to 1977, he took a study leave to study law at the University of Southampton, England. When he got back to the country in 1977, he later got into the Nigerian Law School, finishing in 1979, while working at the same time in the Daily Times as Editor of Times International and as the General Manager, Star Printing and Publishing Company Ltd., Enugu, between 1979 and 1980.",
      "Reflecting on his achievement so far in life, Dr C. C. Mbadinuju, in a humble voice, saw a visible hand of God in all his undertakings. And he was most sincere. No one from his type of background could really have attained such a height in life if God was not with him. A glimpse at his curriculum vitae here will buttress this claim better.",
      "He went through Bishop Lasbrey College, Irete, Owerri; State University of New York at New Paltz, USA; Ohio University, Athens, Ohio, USA; Cornell University, Ithaca, New York, USA; University of Southampton, England; and the Nigerian Law School, Victoria Island, Lagos. For these academic journeys, he has the following results to show: 6 O’ Level papers; 3 A’ Level papers; B.A. (Cum Laude) in Political Science; M.A. in Government; Ph.D. in Government (International Law and Relations); LL.B. and B.L.",
      "Dr Mbadinuju has held a series of academic and non-academic appointments as a teacher; Administrative Intern; Assistant Professor; Visiting Professor; Faculty Research Associate; Associate Professor; International Affairs Correspondent; Editor, Times International; General Manager, Star Printing and Publishing Co. Ltd; Director of Planning and Research; Special Assistant to the President of Nigeria in the 2nd Republic; and a Legal Practitioner.",
      "And for this intelligence and perseverance of mind, he garnered a lot of academic honours. He has equally published various articles in different journals: “The Ideological Framework of Africa’s Opposition to South Africa’s Apartheid Policy”, “Elective Politics and the Hope of Black Americans” and others. He has a lot of books in his name, such as False Men and True Christians (1986); Living by Every Word of God (1986); Israel in the Policy of Nations (1987); God’s Kind of Leader (1988); Law and Religion in Nigeria (1987); The Voice (1990); Perfection (1992) and the Visitation of God (1993).",
      "He is also credited with numerous articles published in various newspapers, more than 30 of such articles. We can therefore describe him as exceptional among the most prolific writers in Nigeria. He is a member of various professional and non-professional organizations in and outside Nigeria.",
      "Based on the above complex nature of our personality, the staff of Goldlink Awards who visited his law chambers along Oguta Road in Onitsha could not help firing a few questions at him, convinced that his opinions will provide the much needed answers on the various issues affecting us in Ihiala L.G.A. and in the country.",
      { q: "On the legal profession" },
      "The first questions we raised before him centred on the relevance of the law profession in the scheme of things in present Nigeria. Until we met him, we were convinced that the legal profession had been dragged to the mud and soiled extensively, and that in the interim it had outlived its usefulness, considering the fact that most lawyers were now content to be only “charge” and “bail lawyers”, the younger members being so inexperienced due to the high cost of legal books, and the evident contempt with which most leaders manipulate the legal practitioners in Nigeria. We were equally convinced that much harm had already been done to the legal profession because of the selfish and greedy personalized interest of the Bench.",
      "It was like touching a live wire. Dr C. C. Mbadinuju came up with reasons upon reasons in defending the legal practice and the lawyers in Nigeria, emphasizing each point like a teacher who was in charge of a couple of dullards, and who now and then questioned himself as to why he was taking this trouble at all. Democracy, he explained, is a very patient process which applies to governance. It calls for continuous learning processes. The military, which has ruled the country more years than the civilians since independence, has its own version of democracy. Some feel that the military, with its autocratic system and process, should not be seen or heard to operate democracy. But in fairness to the military, through a process of trial and error, they have so far managed to hold the nation together, not because they are democratic, but in spite of it.",
      "The fact that every military regime since 1966 had always appointed a civilian Attorney General goes to show the indispensability of lawyers in our national socio-political life, Dr Mbadinuju said. Although democratic privileges are said to be observed by the military, freedom has however been curtailed in military tradition. Still, people are walking freely in Nigeria largely owing to the untiring efforts of the lawyers to check and speak out against government excesses.",
      { q: "On the rulership crisis in Uli" },
      "Talking on the rulership crisis in Uli, Dr C. C. Mbadinuju made us believe that man’s greatest problem is his ego, otherwise a lot of unpleasantness in our lives would be avoided. For instance, as the legal adviser to Uli Progressive Union, a misunderstanding on who should be the next Igwe of Uli demanded intervention. He had called the different camps together, about seven times in his house, for settlement, at which time he explained to them that whoever should unilaterally install himself the Igwe of Uli would be stopped by court injunction, which would mark the beginning of many troubles ahead.",
      "Unfortunately, at the end of the day, his peace overtures did not sail through. However, before the final peace overtures, one camp installed themselves as Igwe of Uli and the other camp came to him with a request that he represent them in court. But he declined to take the brief; he rather initiated meetings in his house to find out-of-court solutions.",
      "The constitution which he personally approved stipulated that the next Igwe be from Ihite quarters, but the man who installed himself as the Igwe came from Umuaku, with the explanation that traditionally, Umuaku is vested with the rights and privileges of producing the Igwe of Uli perpetually. This was wrong, because the constitution was written in the first place to check the tendency among individuals in the future who might try to lean on tradition for the satisfaction of personal ambitions.",
      { q: "On faith and destiny" },
      "The world is indeed like a mystery book, with a lot of complexities. You’ll be pushed to wonder why some people are seen to be better off than others. Invariably, you will begin to doubt the impartiality of our Creator, seeing that the law of “Sowing and Reaping” is contradicted. However, the concept of reincarnation seems to hold a better explanation to this riddle of life.",
      "Understandably, Dr C. C. Mbadinuju, perhaps by virtue of his strong views, believes in God’s pre-ordination in all things. The fingers, he pointed out, are all useful, yet they are not equal in size. God is not partial. Everything is for a purpose.",
      "Dr C. C. Mbadinuju believes strongly that if everybody should perform his or her function, the world will be a better place to live. He classified mankind into two groups: “Those created in the image of God and others who came after the multiplicity of conception.” This latter group will perish. Examples of men who were created in God’s image, he disclosed, are: Adam and Eve; Abraham, Isaac and Jacob, Joseph (the Patriarchs). Jacob was created in God’s image while Esau was not. Even in the womb, God told the mother: “Esau I hate, Jacob I love.”",
      "He gave another example with the disciples of Jesus Christ. One of them, the betrayer, Judas, was not created in the image of God. Rahab, though a harlot, was saved because she was created in God’s image. He quoted: “It is not by your good works that you can be saved.” Again, “Not everyone who says to me ‘Lord, Lord’ shall enter the kingdom of Heaven” (Matt 7:21).",
      "In his own words: “Unless you are created on the 6th day, you cannot be in the image of God. Only God can tell people whether they are created on the 6th day, through His messengers in every generation.”",
      "Of course, Dr C. C. Mbadinuju believes that he was created on the 6th day. And by the law of “Like Attracting Like”, it should have been expected that he would bring into life children who are equally created on the 6th day. But Dr Mbadinuju disagreed, saying unless his children obey him, they cannot possibly be in his group.",
      { q: "Family, and his hopes for Ihiala" },
      "A Christian, Dr Mbadinuju is married to Nnebuogo Mbadinuju (née Okezie, from Ihiala) and they have six children. Both of them lived in the United States, where his wife studied and received the degree of B.A. in Sociology. She is now a senior Administration/Personnel Officer in the N.N.P.C. Depot at Emene, Enugu.",
      "He would wish to see Ihiala Local Government Area rise to a stature we shall all be proud of. In other words, he wants a place of progress, of equal opportunities, less crime, inhabited by people who are interested in development, with enough qualified personnel and manpower in various human endeavours.",
      "He wants a local government area that can produce the next governor of the state, and eventually the President of Nigeria. A local government area with a viable political frame, not given to issues of narrow interest like religious bigotry. A local government area that guarantees all her indigenes equal opportunities politically, irrespective of religious association. A local government area where the young ones are interested in positions of authority, young people who will take up leadership responsibilities with the help and advice of the elders.",
      "To this end, he subscribed to a system of joint or co-operative endeavours with the sole aim of developing the local government area. “Ihiala L.G.A. is obviously neglected in terms of government appointments and contract awards, because as a group, we cannot exert any meaningful pressure. Government understands the language of pressure groups,” he said.",
      "Dr C. C. Mbadinuju is a music lover and a football enthusiast.",
    ],
  },
  {
    slug: "dateline-2016",
    dateline: "Dateline 2016",
    title: "“My Government Did Its Best Under Very Challenging Circumstances”",
    date: "2016",
    source: "Interview by Sir Paul Nwosu, for the 25th anniversary of Anambra State",
    intro:
      "In 2016, as part of the activities marking the 25th anniversary of Anambra State, Paul Nwosu interviewed every past governor of the state. In these excerpts Dr Mbadinuju, governor from 29 May 1999 to 29 May 2003, speaks about his vision, the state he inherited, Monday morning prayers, political godfatherism, the Anambra Vigilante Service and his ordeal after the killing of Barrister Igwe and his wife.",
    pages: [31, 36],
    body: [
      "Dr Chinwoke Mbadinuju was the Governor of Anambra State from May 29, 1999 to May 29, 2003. He was elected on the platform of the Peoples’ Democratic Party (PDP).",
      "As the first Governor of Anambra State upon the return of civil rule in 1999, he had to confront many teething challenges, especially security, which he decided to tackle by setting up the controversial Vigilante Boys.",
      "In 2016, as part of the activities marking the 25th anniversary of Anambra State, Paul Nwosu had an insightful interview with Dr Mbadinuju, including all the other past governors of the new Anambra State. In the interview Odera bared his mind on all the pivotal issues he had to confront. We bring you excerpts of that interview in fond memory of the man whose prayer and wish is that “It shall be well with Anambra State”.",
      { q: "What were your priorities and vision at the time you became governor of Anambra State?" },
      "During the governorship campaigns of 1998, my Odera Campaign Organisation ensured that we toured all the wards and local governments in Anambra State to appreciate their peculiar issues and to guide us in developing strategies to solve their problems when we won the elections.",
      "The level of political apathy among Nigerians was high. Remember, this was a time that no one believed that democracy would survive, given the history of truncated civil rule that Nigerians had witnessed in the past.",
      "The challenges facing Anambra State during that period seemed pretty enormous and peculiar in nature. We should remember that right from the creation of the current Anambra State in 1991, it had always been at a disadvantage when compared to its fellow newly created states. While the new state retained the old name of the state first created in 1976, all the major state institutions and infrastructures were located in the “new” Enugu State.",
      "Personally, I was convinced of my pedigree to contest for the position of Anambra State Governor and tackle the state’s problems head on. In the 60s and 70s, I was fortunate to have studied widely in the US on scholarships, where I obtained my Bachelors and Masters degrees and a Ph.D. in Government from Cornell University, and also rose to become an Associate Professor in the State University of New York by 1975. I obtained an LLB degree in Law from the University of Southampton, UK in 1977, completing my law degree with honours in just 2 years. In my pupillage years as a young lawyer in 1979/80, I served under the legendary FRA Williams.",
      "Dr Dele Cole engaged me together with the late Stanley Macebuh, Tony Momoh and co to make Daily Times the number one newspaper in Nigeria at the time. I served as the Editor-in-Chief of Times International, their international news magazine. I was then invited by Governor Jim Nwobodo to help resuscitate the ailing state-owned Star Printing and Publishing Company under Cyprian Ekwensi. From Anambra State, I was appointed to serve in President Shagari’s Government attached to the Vice President, Dr Alex Ekwueme, as a Personal Assistant.",
      "At the end of the Second Republic, I relocated to Onitsha and set up a law office, and later became the first National President of the Christian Lawyers Fellowship of Nigeria (CLASFON) and later the first National Legal Adviser of the Full Gospel Business Men’s Fellowship International (FGBMFI).",
      "My Christian upbringing, academic and work exposure over the decades preceding 1999 opened my eyes to the extent of life deficits being experienced by our people in Anambra State in terms of security, living standards and infrastructural development. I became committed to counting in public service whenever the opportunity arose to utilize my experiences to make life better for as many of my people as I could.",
      "With the myriad of problems in the state as at 1998, I focused on God because the state needed divine intervention in every facet of life at that time. We actively campaigned and invited Anambrarians to vote for a God-fearing Government that would focus on developing our new state’s infrastructure, especially in the state capital Awka, focus on the people’s welfare and secure the people’s lives and property.",
      "In the end, Anambra believed in us and our policies and I was elected as Governor under PDP with a landslide victory over my nearest opponent in APP.",
      { q: "What were your challenges and constraints at the time and how did you surmount them?" },
      "In 1999, my new Government inherited a state lacking in both physical infrastructure and security. As I mentioned earlier, we had a 7-year-old state with a “Big” name but hardly any significant Government presence in terms of infrastructure and development. The new state capital Awka wore the look of a glorified local government headquarters. There were acute housing shortages in the state capital, which meant that civil servants had to travel every day from Enugu and Ebonyi States to come to work in Anambra, with the resultant lateness to work, low productivity and low morale among workers. At the time, Anambra had no Government House and Government business was undertaken in shabby containers littered all over the place. The State Assembly building had to be rebuilt and the State Judiciary Complex was inadequate and totally unbefitting.",
      "We were committed to moving the new state forward but our primary challenge was the acute lack of funds at the time. When I hear of the billions that my current colleague Governors receive these days as allocation, I marvel, because we were in serious financial wilderness during my days as Governor. The state government received under N800m a month as our total monthly allocation, due to source deductions for several contentious projects awarded by previous administrations. The developmental and infrastructural grants given to Anambra as a new state had been frittered away by past contractors, and on our assumption of office, these same people constituted themselves as godfathers and friends of the powers in Abuja, demanding payments for unidentifiable projects executed! The new minimum wage initiated by the Federal Government meant that the state had a monthly wage bill of N582m a month, leaving the Government with little over N200 million a month to solve the rest of the state’s pressing problems.",
      "But it was the issue of security that posed the greatest challenge. The pervading insecurity of life and property was so great that it threatened to kill off all social and business prospects and investment opportunities in the state. Aguleri, Umuleri and Umuoba Anam were particularly no-go areas due to the incessant communal clashes that led to destruction of lives and properties. There was a serious need for peace in the state.",
      "To surmount these daunting challenges, we felt that there had to be a total re-engineering of our people’s psyche and beliefs. I started my administration by leading the state to God, presiding over the popular weekly Monday morning prayers with civil servants, traders and everybody. I recall today that in those days, prayers endued me with inner strength and spiritual wisdom not to adopt an eye-for-an-eye approach, in order to ensure the sanctity of peace in the state.",
      "Throughout my tenure as Governor, I continued to promote peace and reconciliation with God and man. Through prayer, there was a gradual re-awakening and the people began to believe in God and in their Government. Hope returned as the state prayed, and at the same time we devised a new slogan based on faith: “IT SHALL BE WELL WITH ANAMBRA STATE”.",
      { q: "One of the challenges you had was from your political godfathers who stifled governance. What is now your view on political godfatherism in Nigerian politics, having been a victim yourself?" },
      "Political mentorship, sponsorship or godfatherism, as many would want to describe the phenomenon, has come to stay in Nigerian politics and is a good thing as long as both parties share common political objectives to the benefit of the state. My colleague, Tinubu, succeeded in installing his successors as Governors of Lagos State because he and his political godsons continue to share the same vision and ideology of Lagos State as the hub of cosmopolitan Nigeria, with all the benefits the title entails.",
      "However, where the godson is confronted with a situation where his political mentor or sponsor has conflicting objectives concerning the way forward for the state, then serious problems develop. This was the unfortunate situation in which we found ourselves at the inception of my administration. Many influential contractors who worked with the previous regimes were not happy with our decision to enhance transparency and accountability by liberalizing the contract bidding and award processes for state contracts to all competent parties rather than a selected privileged few. These individuals, due to their influence and connections with the federal government in Abuja, constituted themselves into godfathers and stakeholders with the sole purpose of making the Government work according to their frivolous whims or suffer maximum political inconvenience.",
      "It is quite amazing to recall that long after the opposition went into their different trenches, determined to fight my government to a stand-still, I was still suing for peace. I reached out to elders, statesmen and clergy, pleading with them to intervene. I did not want to fight back because no theatre of war remains the same. I was elected to keep watch over the state and not to balkanize it. Therefore, I swallowed every pride and went for peace.",
      { q: "You used the ‘Bakassi Boys’ to fight crime but their method created more controversies than solutions. Do you regret using the ‘Bakassi Boys’?" },
      "Recall that Anambra was ranked amongst the unsafest states in the country due to the constant threats which armed robbers and hooligans posed to lives and property in the state. The situation in Onitsha was particularly dire, as thugs, ritualists, marauders, armed robbers and assassins effectively took over the city. Our people were being killed every day and even passengers in luxury buses were not spared. The level of criminal audacity was dumbfounding. The Government could not stand aside and watch as the whole state was wiped out of existence by these hoodlums, and something drastic had to be done.",
      "On assumption of office, we were committed to uprooting these evil doers and sanitizing the state. And we accomplished this objective through the establishment of the Anambra Vigilante Service Law, to provide for the registration of vigilante groups in the various communities of the state and to make it an offence to obstruct any of the groups from carrying out their functions as provided by law.",
      "The “Vigilante Boys” (which our opponents called “Bakassi Boys”) was an abnormal but ingenious creation which, with inter-disciplinary training in political science and law, I understood. Their methods, though unorthodox, were constrained to adapt the outfit to meet the exigencies of the time. I believed that unorthodox times and events demand also unorthodox solutions.",
      "As a political scientist, I understood the principles of Mutually Agreed Deterrence as a potential tool for a balance of terror, and also I knew that when terror is squared between the predator and the prey, peace results. For the state to become free of criminals, terror must be squared between the agents of state and the hoodlums. The situation in Anambra was beyond the ordinary and only extra-ordinary measures could sanitize it.",
      "The evil “emperors” were out-numbered, out-classed and completely overwhelmed. They were pursued and fished out from churches, temples, shrines, creeks and forests. The “Vigilante Boys” turned them into gold fishes and there was no place safe enough to hide. The hunter became the hunted, and when hunted down, they sang the names of their paymasters and the “Vigilante Boys” went after them too.",
      "Businessmen opened shops again. Fleeing indigenes returned. Churches re-started night vigils and everything just became fine again. Night life was no longer an anathema. Christmas celebrations became blissful again. Car snatching ceased. Rape and other crimes became things of the past. Anambra was back to civilization. As long as the Anambra Vigilante Service lasted, anyone could forget a bag of money on a street in Onitsha and return to find it intact.",
      { q: "But the “Bakassi Boys” were banned because of their excesses." },
      "Political opponents were envious of the success we recorded. So, working together with their cronies in the Presidency, my opponents, who were becoming intimidated and overwhelmed by my soaring popularity, convinced President Obasanjo to order me to disband the “Vigilante Boys”.",
      "In ordering the disbandment of the Anambra Vigilante Services (AVS), the President gave two hilarious but inexcusable reasons, which may be extended to expose the Presidency’s degree of scorn and insensitivity towards the welfare of the people of Anambra State. First, he told me that my political opponents were complaining that I was using the outfit to terrorize them. Secondly, that I was using the “Vigilante Boys” to revive Biafra.",
      "These two Presidency reasons did not represent the truth in any way. They were like a bad name given to a dog to hang it. So many states at that time had their own vigilante services and none of them was disbanded on the recommendation of political opponents of the various State Governors. The accusation of Biafranism was entirely mischievous, because the Anambra Vigilante Service restricted its operations to the state and the majority of the criminals they were after were of Igbo stock. How can one revive Biafra by hunting down criminals?",
      "So I did not disband the AVS but amended their operations and collaboration with the Police and other security forces. The AVS continued to do service to Anambra people, not minding the activities of fifth columnists deriving their power from Abuja.",
      "It took the unfortunate assassination of the NBA Chairman Igwe and his wife for the FG to deploy troops to the state, carry away all the “Vigilante Boys” and haul them all into detention, indefinitely, at Abuja. Thanks to the timely intervention of Barrister Prince Nwafor-Orizu, who came to the aid of the boys after every person’s patience had been exhausted.",
      "The assassination of Barrister Igwe and his wife perhaps represents the major downside to our successes in security during that trying period in our state’s history. My personal ordeal has been well chronicled in various media. Knowing this to be a criminal matter, and despite my immunity as Governor of the state, I still waived the immunity and submitted myself to investigation and possible prosecution if anything was found against me. I was thoroughly investigated and the Police in their own report stated that I couldn’t have killed anyone in Onitsha, as I was in Houston, USA at the time. The same report also said that to date, no one had mentioned my name as a co-conspirator in that crime.",
      "Nevertheless, I was still unjustly dragged to different courts on this matter. The Hon. Justice of the High Court, Onitsha, in discharging and acquitting me, regretted my ordeal, stating that it was a breach of my rights under the constitution to be treated in the manner in which I was being treated. The Federal Attorney-General and Minister of Justice finally wrote me a letter of final discharge based upon all the evidence, or lack of it, in the Police report files.",
      "It is instructive to note that a Vanguard editorial of July 2003 makes it explicit that the assassination plot against the Igwes was hatched by the same people who fanatically opposed my Government and who engineered the subsequent abduction of my successor, Dr Ngige, and that the evil was hatched to finally discredit my administration and foreclose my chances of re-election as Governor of Anambra State, amongst other landmines and obstacles that were placed in my Government’s path to progress. Be it as it may, I have forgiven them all, because despite all the inconveniences I went through, my ordeals cannot be worse than that of our Lord Jesus Christ, who was betrayed and crucified by his own people despite being blameless in all things.",
      "My one consolation is that despite all the furore about the Vigilante Services, my successors have come to see wisdom in direct community policing and have continued to adopt the AVS model, which we established into law for the first time, although with variations. Today, Anambra State continues to be rightly regarded as one of the safest and most conducive states in the country.",
      "Sir Paul Nwosu is currently the Hon. Commissioner for Information, Anambra State.",
    ],
  },
];

export const getInterview = (slug: string) => interviews.find((i) => i.slug === slug);

/** `notice` marks pages listed for completeness that are not tributes (the register list, the family's thanks). */
export type Tribute = { name: string; role?: string; date?: string; page: number; notice?: true };
export type TributeGroup = { id: string; title: string; note?: string; items: Tribute[] };

// Every tribute and condolence letter in the publication (pages 45–150), grouped, with the page it
// starts on. Names and roles are as the letters give them (or, for a few public figures, as publicly known).
export const tributeGroups: TributeGroup[] = [
  {
    id: "family",
    title: "From the family",
    items: [
      { name: "Dr Ada Mbadinuju Okwara", role: "Daughter", page: 46 },
      { name: "Mrs Loveline Nwachukwu (née Mbadinuju)", role: "Sister", page: 92 },
      { name: "Mrs Adaorah Amaechi-Stephen Adibe", role: "“A tribute to my late uncle Chinwoke”", page: 92 },
      { name: "Mrs Uwumangbe Ann Ojiugo (née Mbadinuju)", role: "For his sisters", page: 93 },
      { name: "Dr Idahosa A. Osaretin", role: "On behalf of his nephews", page: 94 },
      { name: "Mrs Patience", role: "Sister", page: 94 },
      { name: "Uzoma Nnaemeka Okezie", role: "Brother-in-law", page: 95 },
      { name: "Patrick H. Iwara Esq. and family", role: "In-laws", page: 128 },
      { name: "Dr Sylvjohnson C. Ezekwere", role: "On behalf of the Mr I. C. I. Ezekwerre family, his baptismal godfather’s family", page: 144 },
      { name: "Chetachi Chinwoke Mbadinuju, Esq.", role: "“A tribute to my father”", page: 149 },
      { name: "The Mbadinuju Family", role: "Appreciation", page: 150, notice: true },
    ],
  },
  {
    id: "public-life",
    title: "Leaders in public life",
    note: "Presidents, governors, legislators and public officers.",
    items: [
      { name: "Olusegun Obasanjo", role: "Former President of Nigeria", date: "12 September 2023", page: 54 },
      { name: "Atiku Abubakar, GCON", role: "Vice President of Nigeria (1999–2007)", date: "2 May 2023", page: 55 },
      { name: "Sen. George Akume", role: "Secretary to the Government of the Federation", date: "6 November 2023", page: 47 },
      { name: "Sen. George Akume", role: "Then Honourable Minister of Special Duties and Inter-Governmental Affairs", date: "16 May 2023", page: 97 },
      { name: "Dr Onyekachukwu Ibezim", role: "Deputy Governor, Anambra State", date: "6 November 2023", page: 48 },
      { name: "Sen. Hope Uzodimma, CON", role: "Governor, Imo State", date: "14 November 2023", page: 49 },
      { name: "Peter Mbah", role: "Governor, Enugu State", date: "31 August 2023", page: 51 },
      { name: "Dr Alex Otti, OFR", role: "Governor, Abia State", date: "9 September 2023", page: 52 },
      { name: "Rt. Hon. Francis Ogbonna Nwifuru", role: "Governor, Ebonyi State", date: "25 August 2023", page: 53 },
      { name: "Chief Willie Obiano", role: "Former Governor, Anambra State", page: 70 },
      { name: "Dr Ikedi Ohakim", role: "Former Governor, Imo State", page: 73 },
      { name: "Dame (Dr) Virgy Etiaba, CON", role: "Former Governor, Anambra State", date: "5 November 2023", page: 74 },
      { name: "Sen. Rochas Okorocha", role: "Former Governor, Imo State", date: "6 November 2023", page: 78 },
      { name: "Anyim Pius Anyim, GCON", role: "Former President of the Senate", date: "17 May 2023", page: 76 },
      { name: "Senator Dr Orji Uzor Kalu", role: "Chief Whip of the Senate", date: "2 June 2023", page: 77 },
      { name: "Sen. Uche Ekwunife, PhD, CON", role: "Chairman, Senate Committee on Science and Technology", date: "7 June 2023", page: 68 },
      { name: "Senator Christopher Ekpenyong", role: "Akwa Ibom North-West Senatorial District", date: "9 June 2023", page: 75 },
      { name: "Senator Emmanuel Andy Uba", date: "7 November 2023", page: 72 },
      { name: "Mrs Aishah N. Ahmad, CFA", role: "Deputy Governor, Central Bank of Nigeria", date: "20 July 2023", page: 69 },
      { name: "Amb. Frank Nchita Ogbuewu", role: "Former Minister of Culture and Tourism", date: "30 October 2023", page: 100 },
      { name: "Rt. Hon. Uche Victor Okafor", role: "Speaker, Anambra State House of Assembly", date: "25 May 2023", page: 98 },
      { name: "Hon. (Barr.) Jude Chimezie Ngobili", role: "Member for Ihiala 1 and Chief Whip, Anambra State House of Assembly", date: "5 September 2023", page: 99 },
      { name: "Rt. Hon. Onyebuchi Offor", role: "Former Minority Leader, Anambra State House of Assembly", date: "3 September 2023", page: 101 },
      { name: "Hon. (Barr.) Chidi Livinus Udemadu", role: "Former Member for Ihiala 1, Anambra State House of Assembly", date: "2 October 2023", page: 102 },
      { name: "Rt. Hon. Chuma Nzeribe", role: "“An ode to my master”", date: "2 November 2023", page: 80 },
      { name: "Chief Dr George N. Moghalu", role: "Managing Director, National Inland Waterways Authority", date: "12 May 2023", page: 116 },
      { name: "Air Vice Marshal Walter A. Ogujiofor (rtd)", date: "10 October 2023", page: 123 },
      { name: "CP Echeng E. Echeng", role: "Commissioner of Police, Anambra State Command", date: "3 May 2023", page: 58 },
      { name: "Prof. Nkechi Ikediugwu", role: "Chairman, Post Primary Schools Service Commission, Anambra State", date: "19 August 2023", page: 125 },
      { name: "Vin Ifeanyi Ezeaka, Esq.", role: "Chairman, Anambra State Local Government Service Commission", date: "5 October 2023", page: 132 },
      { name: "Engr. Anayochukwu Charles Orjiako", role: "Transition Committee Chairman, Ihiala Local Government Area", page: 84 },
      { name: "All Progressives Congress (APC)", role: "National Working Committee", date: "25 May 2023", page: 56 },
      { name: "All Progressives Grand Alliance (APGA)", role: "Anambra South Senatorial Zone", date: "5 September 2023", page: 57 },
    ],
  },
  {
    id: "his-government",
    title: "Those who served with him",
    note: "Members of his administration, 1999–2003.",
    items: [
      { name: "Victor Ositadinma Ezenwa", role: "Secretary to the State Government, 1999–2003", page: 140 },
      { name: "Ody Chukwube", role: "Chief Press Secretary: “Odera and his uncommon spirituality”", page: 133 },
      { name: "DCP Sylvester Uzoefuna Jr", role: "Deputy Commissioner of Police, his former aide-de-camp", page: 91 },
      { name: "Assoc. Prof. Rose Nwankwo", role: "Former Executive Chairman, State Primary Education Board", page: 130 },
      { name: "Hon. (Mrs) Chinenye Okongwu", role: "“Tribute to my own Excellency”", page: 124 },
      { name: "Former Board of Directors, Tracas Anambra State (1999–2003)", role: "Signed by Onowu Frank Igwe", date: "5 September 2023", page: 119 },
      { name: "Hon. Japhet Chuks Ngobili", role: "“A tribute to my brother, boss and mentor”", page: 142 },
      { name: "Chief (Sir) Emma Ossy Igbonwelundu, KSJI", role: "Chairman, Finance Committee of the Odera Campaign Organisation", page: 138 },
    ],
  },
  {
    id: "faith",
    title: "Church and ministry",
    items: [
      { name: "The Most Revd Alexander C. Ibezim, PhD", role: "Archbishop, Ecclesiastical Province of the Niger, and Bishop of Awka", date: "4 August 2023", page: 59 },
      { name: "Bishop Dr Paul C. Nwachukwu Snr", role: "Presiding Bishop, Grace of God Mission International", date: "2 May 2023", page: 60 },
      { name: "Joshua Hamashiak Ministry", role: "Signed by Pastor Olisa Modebe, Secretary", page: 61 },
      { name: "Very Rev. Fr. Dr Thom Obiatuegwu", page: 62 },
      { name: "Rev. Msgr. Dr Felix C. Ojimba", page: 93 },
      { name: "Elder Philip N. Ohamadike", role: "Field Representative for West Africa (1979–1987), Full Gospel Business Men’s Fellowship", page: 145 },
    ],
  },
  {
    id: "uli",
    title: "Uli, Ihiala and community",
    items: [
      { name: "Mbadinuju Mausoleum, Uli", role: "Graveside inspection and condolence register: special appreciation", date: "24–25 November 2023", page: 45, notice: true },
      { name: "Uli Progressive Union", role: "Signed by Engr. Tobias C. Obiagazie, President General", date: "9 June 2023", page: 103 },
      { name: "Umuaku General Assembly", page: 104 },
      { name: "Nkwado-Odimma Uli Forum", date: "9 October 2023", page: 127 },
      { name: "Ihiala L.G.A. Political Class", role: "Signed by Hon. (Ichie) Ohajianya Simeon, Co-ordinator", page: 85 },
      { name: "Oluoha A. C. Mbanude", role: "Dara Ezedinaobi I, traditional head of Ihite, Uli", page: 131 },
      { name: "Ogbuehi Ezechimahubere Frank Igwe", role: "Onowu Uli", date: "5 September 2023", page: 105 },
      { name: "Henrietta & Bryant Orjiako", page: 63 },
      { name: "Sir Chinedu Nelson Orjiako, KSJI", page: 109 },
      { name: "Ichie Ifeanyi Orjiako", role: "“Heaven gains a Clement”", page: 121 },
      { name: "Dr Donald Chideha Ohuoha", role: "For the late Ichie S. B. C. Ohuoha family", page: 112 },
      { name: "Amb. (Ichie) Ifeanyi Omeokachie, MFR", role: "Ichie Okowu N’Ukpo", date: "18 October 2023", page: 113 },
      { name: "Prince Arthur Igwe and family", page: 146 },
    ],
  },
  {
    id: "friends",
    title: "Friends, colleagues and organisations",
    items: [
      { name: "Prince Orji Nwafor-Orizu", role: "“Odera-Odego: a misunderstood hero”", page: 110 },
      { name: "Prof. Paul David Chukwudi Obianaso, PhD", page: 108 },
      { name: "Hon. Elder Godwin Onyejekwulum", role: "His legal counsel and associate from the 1980s", page: 122 },
      { name: "Chief Patrick T. Chidolue", date: "15 May 2023", page: 107 },
      { name: "Adamu Usman Mohammed", date: "4 May 2023", page: 106 },
      { name: "Chief (Sir) M. E. A. Nwakalor, KSC", role: "Omelora 1 of Nteje", date: "1 June 2023", page: 126 },
      { name: "Chinedu G. Udora", role: "Chinedu G. Udora & Co.", date: "23 October 2023", page: 147 },
      { name: "Nnaemeka Okereke, PMP", role: "“Odera lives on”", page: 114 },
      { name: "Dr M. U. Igbonazobi", role: "The New Era Specialist Clinics", date: "20 October 2023", page: 115 },
      { name: "Hon. Chinenye Kryss Okoro, JP", role: "Kryss Group", page: 117 },
      { name: "Chief Festus Ugwoegbu", role: "Goplaces Travel & Tours", date: "14 November 2023", page: 118 },
      { name: "V-tals Integrated Business Nig. Ltd", date: "15 June 2023", page: 120 },
      { name: "IGAB Industrial Co. Ltd", role: "Signed by Chief Ignatius Agbalizu", page: 129 },
      { name: "Rapidlink Resources Limited", role: "Signed by Bassel Mourad, CEO", date: "29 October 2023", page: 96 },
      { name: "Vybz Lifestyle Lounge", date: "27 September 2023", page: 137 },
    ],
  },
];

export const tributeCount = tributeGroups.reduce((n, g) => n + g.items.filter((t) => !t.notice).length, 0);

/** Recent photographs for the gallery, cut from the publication's Career and Politics and Later Years pages. */
export const recentPhotos: { src: string; alt: string }[] = [];
