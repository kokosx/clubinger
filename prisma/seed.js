import { PrismaClient } from "@prisma/client";

const bookGenres = [
  "fantasy",
  "science-fiction",
  "dystopian",
  "action_and_adventure",
  "mystery",
  "horror",
  "thriller",
  "historical_fiction",
  "romance",
  "literary_fiction",
  "magical_realism",
  "graphic_novel",
  "short_story",
  "young_adult",
  "new_adult",
  "children",
  "biography",
  "foods",
  "art",
  "philosophy",
  "self-help",
  "history",
  "travel",
  "true_crime",
  "humor",
  "essay",
  "guide",
  "religion",
  "families",
  "science",
];
const musicGenres = [
  "Alternative dance",
  "Alternative metal",
  "Alternative rock",
  "Art punk",
  "Art rock",
  "Baggy",
  "Balearic Beat",
  "Baltimore Club",
  "Bassline",
  "Beat music",
  "Bebop",
  "Big beat",
  "Bitpop",
  "Black metal",
  "Boogie-woogie",
  "Boogie",
  "Bossa nova",
  "Bouncy house",
  "Bouncy techno",
  "Breakbeat hardcore",
  "Breakbeat",
  "Breakcore",
  "Breakstep",
  "British dance",
  "Britpop",
  "Broken beat",
  "Bubblegum dance",
  "Canterbury scene",
  "Cape jazz",
  "Celtic metal",
  "Celtic punk",
  "Celtic",
  "Chamber jazz",
  "Chicago house",
  "Chill out",
  "Chillwave",
  "Chinese rock",
  "Chiptune",
  "Christian metal",
  "Christian punk",
  "Christian rock",
  "Classic trance",
  "Coldwave",
  "Contemporary folk",
  "Continental Jazz",
  "Cool jazz",
  "Cosmic disco",
  "Cowpunk",
  "Crossover jazz",
  "Crossover thrash",
  "Crunk",
  "Crust punk",
  "Crustgrind",
  "Cybergrind",
  "D-beat",
  "Dance-pop",
  "Dance-punk",
  "Dance-rock",
  "Dark ambient",
  "Dark cabaret",
  "Dark electro",
  "Dark psytrance",
  "Dark Wave",
  "Darkcore",
  "Darkside jungle",
  "Darkstep",
  "Death industrial",
  "Death metal",
  "Deathcore",
  "Deathrock",
  "Deep house",
  "Desert rock",
  "Detroit techno",
  "Digital hardcore",
  "Disco house",
  "Disco polo",
  "Disco",
  "Diva house",
  "Dixieland",
  "Djent",
  "Doom metal",
  "Doomcore",
  "Downtempo",
  "Dream house",
  "Dream pop",
  "Dream trance",
  "Drone metal",
  "Drone",
  "Drum and bass",
  "Drumfunk",
  "Drumstep",
  "Dub",
  "Dubstep",
  "Dubstyle",
  "Dubtronica",
  "Dunedin Sound",
  "Dutch house",
  "EDM",
  "Electro backbeat",
  "Electro house",
  "Electro-grime",
  "Electro-industrial",
  "Electro",
  "Electroacoustic",
  "Electroclash",
  "Electronic art music",
  "Electronic rock",
  "Electronica",
  "Electronicore",
  "Electropop",
  "Electropunk",
  "Emo",
  "Epic doom",
  "Ethereal wave",
  "Ethnic electronica",
  "Euro disco",
  "Eurobeat",
  "Eurodance",
  "European free jazz",
  "Europop",
  "Experimental rock",
  "Filk",
  "Florida breaks",
  "Folk metal",
  "Folk punk",
  "Folk rock",
  "Folk",
  "Folktronica",
  "Freak folk",
  "Freakbeat",
  "Free tekno",
  "Freestyle house",
  "Freestyle",
  "French house",
  "Full on",
  "Funeral doom",
  "Funk metal",
  "Funky house",
  "Funky",
  "Futurepop",
  "Gabber",
  "Garage punk",
  "Garage rock",
  "Ghetto house",
  "Ghettotech",
  "Glam metal",
  "Glam rock",
  "Glitch",
  "Goregrind",
  "Gothic metal",
  "Gothic rock",
  "Grime",
  "Grindcore",
  "Groove metal",
  "Grunge",
  "Happy hardcore",
  "Hard bop",
  "Hard NRG",
  "Hard rock",
  "Hard trance",
  "Hardbag",
  "Hardcore punk",
  "Hardcore/Hard dance",
  "Hardstep",
  "Hardstyle",
  "Heavy metal",
  "Hi-NRG",
  "Hip house",
  "Horror punk",
  "House",
  "IDM",
  "Illbient",
  "Indie folk",
  "Indie pop",
  "Indie rock",
  "Indietronica",
  "Industrial folk",
  "Industrial metal",
  "Industrial rock",
  "Industrial",
  "Intelligent drum and bass",
  "Italo dance",
  "Italo disco",
  "Italo house",
  "Japanoise",
  "Jazz blues",
  "Jazz fusion",
  "Jazz rap",
  "Jazz rock",
  "Jazz-funk",
  "Jump-Up",
  "Jumpstyle",
  "Krautrock",
  "Laptronica",
  "Latin house",
  "Latin jazz",
  "Liquid funk",
  "Livetronica",
  "Lowercase",
  "Lo-fi",
  "Madchester",
  "Mainstream jazz",
  "Makina",
  "Math rock",
  "Mathcore",
  "Medieval metal",
  "Melodic death metal",
  "Metalcore",
  "Minimal house/Microhouse",
  "Minimal",
  "Modal jazz",
  "Moombahton",
  "Neo-bop jazz",
  "Neo-psychedelia",
  "Neo-swing",
  "Neofolk",
  "Neurofunk",
  "New Beat",
  "New jack swing",
  "New prog",
  "New rave",
  "New wave",
  "New-age",
  "Nintendocore",
  "No wave",
  "Noise pop",
  "Noise rock",
  "Noise",
  "Noisegrind",
  "Nortec",
  "Novelty ragtime",
  "Nu jazz",
  "Nu metal",
  "Nu skool breaks",
  "Nu-disco",
  "Oldschool jungle",
  "Orchestral jazz",
  "Orchestral Uplifting",
  "Paisley Underground",
  "Pop punk",
  "Pop rock",
  "Post-bop",
  "Post-Britpop",
  "Post-disco",
  "Post-grunge",
  "Post-hardcore",
  "Post-metal",
  "Post-punk revival",
  "Post-punk",
  "Post-rock",
  "Power electronics",
  "Power metal",
  "Power noise",
  "Power pop",
  "Powerviolence",
  "Progressive breaks",
  "Progressive drum & bass",
  "Progressive folk",
  "Progressive house",
  "Progressive metal",
  "Progressive rock",
  "Progressive techno",
  "Progressive",
  "Psybreaks",
  "Psychedelic folk",
  "Psychedelic rock",
  "Psychedelic trance",
  "Psychobilly",
  "Psyprog",
  "Punk jazz",
  "Punk rock",
  "Raga rock",
  "Ragga-jungle",
  "Raggacore",
  "Ragtime",
  "Rap metal",
  "Rap rock",
  "Rapcore",
  "Riot grrrl",
  "Rock and roll",
  "Rock in Opposition",
  "Sadcore",
  "Sambass",
  "Screamo",
  "Shibuya-kei",
  "Shoegaze",
  "Ska jazz",
  "Ska punk",
  "Skate punk",
  "Skweee",
  "Slowcore",
  "Sludge metal",
  "Smooth jazz",
  "Soft rock",
  "Soul jazz",
  "Sound art",
  "Southern rock",
  "Space disco",
  "Space house",
  "Space rock",
  "Speed garage",
  "Speed metal",
  "Speedcore",
  "Stoner rock",
  "Straight-ahead jazz",
  "Street punk",
  "Stride jazz",
  "Sufi rock",
  "Sung poetry",
  "Suomisaundi",
  "Surf rock",
  "Swing house",
  "Swing",
  "Symphonic metal",
  "Synthcore",
  "Synthpop",
  "Synthpunk",
  "Tech house",
  "Tech trance",
  "Technical death metal",
  "Techno-DNB",
  "Techno-folk",
  "Techno",
  "Technopop",

  "Thrash metal",
  "Thrashcore",

  "Trad jazz",

  "Trance",
  "Trap",

  "Turbofolk",
  "Twee Pop",
  "Uplifting trance",
  "Vaporwave",
  "Vocal house",
  "Vocal jazz",
  "Vocal trance",
  "West Coast jazz",
  "Western",
];

const db = new PrismaClient();

const main = async () => {
  await db.bookGenre.deleteMany();
  await db.musicGenre.deleteMany();

  await db.bookGenre.createMany({
    data: bookGenres.map((v) => {
      return {
        name: v,
      };
    }),
  });

  await db.musicGenre.createMany({
    data: musicGenres.map((v) => {
      return { name: v };
    }),
  });
};

main();
