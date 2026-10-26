export const founder = {
  name: "Dr Chinwoke Clement Mbadinuju",
  title: "Odera 1 of Uli",
  born: "14 June 1945",
  died: "11 April 2023",
  roles: ["Scholar", "Lawyer", "Journalist", "Evangelist", "Author", "Governor", "Statesman"],
  summary:
    "A life of ideas, conviction and service. From humble beginnings in Uli to universities across the world, from journalism and law to Christian ministry and public office, Dr Chinwoke Mbadinuju lived a remarkable life of purpose.",
};

// Photos for each period and chapter: add the path (under public/images) to `image` when the
// Foundation supplies one. Until then the page shows an empty frame.
type Photo = { image?: string };

export const timeline: ({ period: string; title: string; body: string } & Photo)[] = [
  {
    period: "1945",
    title: "Humble Beginnings",
    body: "Born on 14 June 1945 into a Christian home in Uli, Anambra State.",
  },
  {
    period: "1960s",
    title: "Education",
    body: "From Nigeria to the United States. Studied at SLU, Ohio University and Cornell University, where he earned his doctorate.",
  },
  {
    period: "1970s",
    title: "Academic Career",
    body: "University teacher in the United States, eventually Associate Professor and Chairman of Black and African Studies at SUNY Cortland.",
  },
  {
    period: "1980s",
    title: "Journalism & Law",
    body: "Editor and lecturer with the Daily Times, later training in law and entering legal practice in Nigeria.",
  },
  {
    period: "1990s",
    title: "Public Service",
    body: "Served in government and as Special Assistant to Vice President Dr Alex Ekwueme, and later returned to private legal practice in Onitsha.",
  },
  {
    period: "1999 – 2003",
    title: "Governor of Anambra State",
    body: "Elected Governor of Anambra State. Focused on security, education, infrastructure, peacebuilding and the state's oil and gas development.",
  },
  {
    period: "2000s – 2023",
    title: "Writing, Ministry & Legacy",
    body: "Continued writing, evangelism and community service. Established the Chinwoke Mbadinuju Foundation in 2012. Died on 11 April 2023, aged 77.",
  },
];

export const chapters: ({ id: string; title: string; body: string } & Photo)[] = [
  { id: "early-life", title: "Early Life", body: "A disciplined upbringing in a Christian home in Uli shaped his values and character." },
  { id: "education", title: "Education", body: "An extraordinary academic journey across Nigeria, the United States and Britain." },
  { id: "professional-life", title: "Professional Life", body: "Journalism, university teaching, legal practice and public service." },
  { id: "christian-ministry", title: "Faith & Ministry", body: "A committed evangelist and Christian leader, involved in national and international fellowships." },
  { id: "governorship", title: "Governorship", body: "Leadership in challenging times, with enduring contributions to Anambra State." },
  { id: "writer-author", title: "Writer & Author", body: "22 published works on Christianity, leadership, law, governance and society." },
  { id: "family-life", title: "Family Life", body: "A devoted husband, father and grandfather." },
  { id: "later-years", title: "Later Years", body: "Continuing the mission through the Foundation." },
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
