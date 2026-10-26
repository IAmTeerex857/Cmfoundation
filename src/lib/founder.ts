export const founder = {
  name: "Dr Chinwoke Clement Mbadinuju",
  title: "Odera 1 of Uli",
  born: "14 June 1945",
  died: "11 April 2023",
  roles: ["Scholar", "Lawyer", "Journalist", "Evangelist", "Author", "Governor", "Statesman"],
  summary:
    "A life of ideas, conviction and service. From humble beginnings in Uli to universities across the world, from journalism and law to Christian ministry and public office, Dr Chinwoke Mbadinuju lived a remarkable life of purpose.",
};

// Photos for each period and chapter, from the Foundation's archive (public/images/founder). A period
// or chapter without a suitable photo yet shows an empty frame; add the path to `image` to fill it.
type Photo = { image?: string };

export const timeline: ({ period: string; title: string; body: string } & Photo)[] = [
  {
    period: "1945",
    title: "Humble Beginnings",
    body: "Born on 14 June 1945 into a Christian home in Uli, Anambra State.",
  },
  {
    period: "1960s",
    image: "/images/founder/doctoral-robes.jpg",
    title: "Education",
    body: "From Nigeria to the United States. Studied at SLU, Ohio University and Cornell University, where he earned his doctorate.",
  },
  {
    period: "1970s",
    image: "/images/founder/office-conversation.jpg",
    title: "Academic Career",
    body: "University teacher in the United States, eventually Associate Professor and Chairman of Black and African Studies at SUNY Cortland.",
  },
  {
    period: "1980s",
    image: "/images/founder/law-office.jpg",
    title: "Journalism & Law",
    body: "Editor and lecturer with the Daily Times, later training in law and entering legal practice in Nigeria.",
  },
  {
    period: "1990s",
    image: "/images/founder/official-meeting.jpg",
    title: "Public Service",
    body: "Served in government and as Special Assistant to Vice President Dr Alex Ekwueme, and later returned to private legal practice in Onitsha.",
  },
  {
    period: "1999 – 2003",
    image: "/images/founder/salute-parade.jpg",
    title: "Governor of Anambra State",
    body: "Elected Governor of Anambra State. Focused on security, education, infrastructure, peacebuilding and the state's oil and gas development.",
  },
  {
    period: "2000s – 2023",
    image: "/images/founder/later-years-cap.jpg",
    title: "Writing, Ministry & Legacy",
    body: "Continued writing, evangelism and community service. Established the Chinwoke Mbadinuju Foundation in 2012. Died on 11 April 2023, aged 77.",
  },
];

export const chapters: ({ id: string; title: string; body: string } & Photo)[] = [
  { id: "early-life", title: "Early Life", body: "A disciplined upbringing in a Christian home in Uli shaped his values and character." },
  { id: "education", title: "Education", body: "An extraordinary academic journey across Nigeria, the United States and Britain.", image: "/images/founder/graduation-dignitaries.jpg" },
  { id: "professional-life", title: "Professional Life", body: "Journalism, university teaching, legal practice and public service.", image: "/images/founder/bow-tie.jpg" },
  { id: "christian-ministry", title: "Faith & Ministry", body: "A committed evangelist and Christian leader, involved in national and international fellowships." },
  { id: "governorship", title: "Governorship", body: "Leadership in challenging times, with enduring contributions to Anambra State.", image: "/images/founder/podium-wave.jpg" },
  { id: "writer-author", title: "Writer & Author", body: "22 published works on Christianity, leadership, law, governance and society.", image: "/images/founder/bowler-seated.jpg" },
  { id: "family-life", title: "Family Life", body: "A devoted husband, father and grandfather.", image: "/images/founder/family.jpg" },
  { id: "later-years", title: "Later Years", body: "Continuing the mission through the Foundation.", image: "/images/founder/later-years-family.jpg" },
];

// The photo gallery (/founder/gallery): photographs from the Foundation's archive.
export const gallery: { src: string; alt: string }[] = [
  { src: "/images/founder/hero-smiling.jpg", alt: "Dr Mbadinuju smiling at a public ceremony" },
  { src: "/images/founder/red-cap-portrait.jpg", alt: "Portrait of Dr Mbadinuju in a red cap and coral beads" },
  { src: "/images/founder/doctoral-robes.jpg", alt: "Dr Mbadinuju in doctoral robes at his graduation" },
  { src: "/images/founder/graduation-dignitaries.jpg", alt: "Dr Mbadinuju in academic robes with university dignitaries" },
  { src: "/images/founder/robes-seated.jpg", alt: "Dr Mbadinuju seated in academic robes on a university campus" },
  { src: "/images/founder/office-conversation.jpg", alt: "A young Dr Mbadinuju in conversation in an office" },
  { src: "/images/founder/bow-tie.jpg", alt: "Dr Mbadinuju in a suit and bow tie" },
  { src: "/images/founder/law-office.jpg", alt: "Dr Mbadinuju at his desk in barrister's wig" },
  { src: "/images/founder/bowler-seated.jpg", alt: "Dr Mbadinuju in a bowler hat and pinstripe suit" },
  { src: "/images/founder/official-meeting.jpg", alt: "Dr Mbadinuju at an official meeting" },
  { src: "/images/founder/handshake.jpg", alt: "Dr Mbadinuju shaking hands at a formal reception" },
  { src: "/images/founder/podium-wave.jpg", alt: "Dr Mbadinuju waving from a podium" },
  { src: "/images/founder/salute-parade.jpg", alt: "Dr Mbadinuju taking a salute at a parade during his governorship" },
  { src: "/images/founder/red-caps-conversation.jpg", alt: "Dr Mbadinuju in conversation at a traditional gathering" },
  { src: "/images/founder/group.jpg", alt: "Dr Mbadinuju with a group of men" },
  { src: "/images/founder/yellow-agbada.jpg", alt: "Dr Mbadinuju in a yellow agbada and red cap" },
  { src: "/images/founder/family.jpg", alt: "Dr Mbadinuju with his family" },
  { src: "/images/founder/later-years-cap.jpg", alt: "Dr Mbadinuju in his later years" },
  { src: "/images/founder/later-years-family.jpg", alt: "Dr Mbadinuju in his later years with a family member" },
  { src: "/images/founder/archive-02.jpg", alt: "Dr Mbadinuju beside a car" },
  { src: "/images/founder/archive-03.jpg", alt: "Dr Mbadinuju at a family occasion" },
  { src: "/images/founder/archive-04.jpg", alt: "Dr Mbadinuju with a wedding party" },
  { src: "/images/founder/archive-05.jpg", alt: "Dr Mbadinuju with friends outside a house" },
  { src: "/images/founder/archive-06.jpg", alt: "Dr Mbadinuju with family and friends outside a church" },
  { src: "/images/founder/archive-07.jpg", alt: "Dr Mbadinuju with family and friends" },
  { src: "/images/founder/archive-08.jpg", alt: "Dr Mbadinuju in doctoral robes beside a car" },
  { src: "/images/founder/archive-09.jpg", alt: "Graduates in academic robes at a commencement ceremony" },
  { src: "/images/founder/archive-10.jpg", alt: "Dr Mbadinuju in academic robes at a commencement ceremony" },
  { src: "/images/founder/archive-11.jpg", alt: "Dr Mbadinuju at home" },
  { src: "/images/founder/archive-12.jpg", alt: "Dr Mbadinuju at a wedding" },
  { src: "/images/founder/archive-13.jpg", alt: "Dr Mbadinuju seated at a dinner" },
  { src: "/images/founder/archive-14.jpg", alt: "Dr Mbadinuju in doctoral robes on a lawn" },
  { src: "/images/founder/archive-15.jpg", alt: "Dr Mbadinuju in doctoral robes with fellow graduates" },
  { src: "/images/founder/archive-16.jpg", alt: "Dr Mbadinuju with family and friends beside a car" },
  { src: "/images/founder/archive-17.jpg", alt: "Dr Mbadinuju in a close portrait" },
  { src: "/images/founder/archive-18.jpg", alt: "Dr Mbadinuju with a friend outside a building" },
  { src: "/images/founder/archive-19.jpg", alt: "Dr Mbadinuju in a suit in a garden" },
  { src: "/images/founder/archive-20.jpg", alt: "Dr Mbadinuju smiling in doctoral robes" },
  { src: "/images/founder/archive-21.jpg", alt: "Dr Mbadinuju at a family gathering" },
  { src: "/images/founder/archive-22.jpg", alt: "Dr Mbadinuju in a suit and striped tie" },
  { src: "/images/founder/archive-23.jpg", alt: "Dr Mbadinuju at home" },
  { src: "/images/founder/archive-24.jpg", alt: "Dr Mbadinuju on a balcony" },
  { src: "/images/founder/archive-25.jpg", alt: "Dr Mbadinuju in a white kaftan and cap in a garden" },
  { src: "/images/founder/archive-26.jpg", alt: "Dr Mbadinuju with a mother and newborn baby" },
  { src: "/images/founder/archive-27.jpg", alt: "Dr Mbadinuju in a dark suit" },
  { src: "/images/founder/archive-28.jpg", alt: "Dr Mbadinuju beside a Jeep" },
  { src: "/images/founder/archive-29.jpg", alt: "Dr Mbadinuju with family outside a house" },
  { src: "/images/founder/archive-30.jpg", alt: "Dr Mbadinuju with a mother and child" },
  { src: "/images/founder/archive-31.jpg", alt: "Dr Mbadinuju at a presentation ceremony" },
  { src: "/images/founder/archive-32.jpg", alt: "Dr Mbadinuju at a celebration with guests" },
];

// Quotes as given in the Foundation's page designs.
export const quotes = [
  {
    text: "The true measure of a society is found in how it treats its most vulnerable and in how it invests in the next generation.",
    by: "Dr Chinwoke Clement Mbadinuju",
    role: "Founder",
    place: "Uli, Anambra State",
  },
  { text: "Be faithful in the use of what God has entrusted to you.", by: "Dr Chinwoke Clement Mbadinuju", role: "Founder", place: "Uli, Anambra State" },
  { text: "Service is the rental we pay for the space we occupy.", by: "Dr Chinwoke Clement Mbadinuju", role: "Founder", place: "Uli, Anambra State" },
  { text: "A better tomorrow is possible.", by: "Chetachi Chinwoke Mbadinuju", role: "Chinwoke Mbadinuju Foundation", place: "Abuja, Nigeria" },
];
