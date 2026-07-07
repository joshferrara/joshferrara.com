// S.E.A. Archives - Data Module
// This file contains structured data parsed from the markdown files

const SEAData = {
    // Timeline Events
    timeline: [
        { date: '1538-08-12', era: 'founding', title: 'S.E.A. Founded', description: 'The Society of Explorers and Adventurers is established at Explorers Landing in Porto Paradiso, Italy.', location: 'Fortress Explorations, Tokyo DisneySea' },
        { date: '1795', era: 'founding', title: 'Henry Ravenswood Born', description: 'Henry Ravenswood is born. He would later strike gold in Big Thunder Mountain.', location: 'Thunder Mesa' },
        { date: '1802', era: 'expansion', title: 'Martha Ravenswood Born', description: 'Martha Ravenswood, future wife of Henry Ravenswood, is born.', location: 'Thunder Mesa' },
        { date: '1842', era: 'expansion', title: 'Melanie Ravenswood Born', description: 'Melanie Ravenswood, daughter of Henry and Martha, is born.', location: 'Thunder Mesa' },
        { date: '1848', era: 'expansion', title: 'Big Thunder Mining Company Founded', description: 'Barnabas T. Bullion receives a land grant to establish the Big Thunder Mining Company.', location: 'Big Thunder Mountain' },
        { date: '1851', era: 'expansion', title: 'First Female Member', description: 'Vitale Robustelli inducts Camellia Falco as the first female S.E.A. member.', location: 'S.E.A. Headquarters' },
        { date: '1860', era: 'expansion', title: 'Thunder Mesa Earthquake', description: 'Massive earthquake kills Henry Ravenswood and much of Thunder Mesa. Henry becomes The Phantom.', location: 'Phantom Manor, Disneyland Paris' },
        { date: '1877', era: 'expansion', title: 'George Hightower Murdered', description: 'Constance Hatchaway marries and murders George Hightower, inheriting his estate.', location: 'Haunted Mansion' },
        { date: '1880', era: 'expansion', title: 'Jason Chandler Becomes President', description: 'Jason Chandler is elected president of the Society of Explorers and Adventurers.', location: 'S.E.A. Headquarters' },
        { date: '1882', era: 'expansion', title: 'British Columbia Expedition', description: 'Jason Chandler embarks on a riverboat expedition through British Columbia.', location: 'British Columbia, Canada' },
        { date: '1899', era: 'expansion', title: 'Shiriki Utundu Stolen', description: 'Harrison Hightower III steals the cursed idol Shiriki Utundu from the Mtundu tribe.', location: 'Congo Basin, Africa' },
        { date: '1899-12-31', era: 'expansion', title: 'Hightower Disappears', description: 'Harrison Hightower III mocks the curse and disappears at midnight amid green lightning and screams.', location: 'Tower of Terror, Tokyo DisneySea' },
        { date: '1901-12-05', era: 'modern', title: 'Golden Sword Discovered', description: 'Captain Mary Oceaneer discovers a golden sword during a deep sea dive with her parrot Salty.', location: 'Miss Adventure Falls' },
        { date: '1907', era: 'modern', title: 'Mapping the Mekong', description: 'Jason Chandler and Captain Brieux map regions of the Mekong River from the airship Hyperion.', location: 'Mekong River, Southeast Asia' },
        { date: '1921', era: 'modern', title: 'Adventurers Club Founded', description: 'Merriweather Adam Pleasure builds the Adventurers Club as his personal S.E.A. chapter.', location: 'Pleasure Island, WDW' },
        { date: '1938', era: 'modern', title: 'Florida Discovery', description: 'Jock Lindsay and Indiana Jones discover Disney Springs while chasing a mythology tip in Florida.', location: "Jock Lindsey's Hangar Bar" },
        { date: '1938', era: 'modern', title: 'Jungle Cruise Incident', description: 'Dr. Kon Chunosuke and Alberta Falls\' expedition crashes, stranding them in the African veldt.', location: 'Jungle Cruise' },
    ],

    // Characters
    characters: [
        {
            id: 'hightower',
            name: 'Harrison Hightower III',
            status: 'Deceased',
            type: 'member',
            occupation: 'Collector, Industrialist',
            membership: 'Corrupt S.E.A. Member',
            description: 'A wealthy and corrupt member of S.E.A. who collected treasures through questionable means. Stole the cursed idol Shiriki Utundu and disappeared on New Year\'s Eve 1899.',
            connections: ['George Hightower', 'Lord Henry Mystic', 'Professor Garrett Reed'],
            locations: ['Tower of Terror (Tokyo DisneySea)'],
            artifacts: ['Shiriki Utundu']
        },
        {
            id: 'mystic',
            name: 'Lord Henry Mystic',
            status: 'Active',
            type: 'member',
            occupation: 'Explorer, Collector',
            membership: 'Senior S.E.A. Member',
            description: 'Prominent explorer who established Mystic Manor. Rescued his monkey companion Albert from a giant spider. Expelled Professor Garrett Reed from S.E.A.',
            connections: ['Harrison Hightower III', 'Professor Garrett Reed', 'Albert'],
            locations: ['Mystic Manor (Hong Kong Disneyland)'],
            artifacts: ['Enchanted Music Box']
        },
        {
            id: 'bullion',
            name: 'Barnabas T. Bullion',
            status: 'Historical',
            type: 'member',
            occupation: 'Mining Magnate',
            membership: 'S.E.A. Member',
            description: 'Established the Big Thunder Mining Company in 1848. Ignored warnings about the Thunderbird curse and continued mining operations.',
            connections: ['Jason Chandler', 'Madame Zarkov', 'Henry Ravenswood'],
            locations: ['Big Thunder Mountain Railroad'],
            artifacts: []
        },
        {
            id: 'oceaneer',
            name: 'Captain Mary Oceaneer',
            status: 'Active',
            type: 'member',
            occupation: 'Sea Captain, Treasure Hunter',
            membership: 'S.E.A. Member',
            description: 'World-famous treasure hunter whose collection was scattered by a typhoon. Her ship became the RV Oceaneer Lab.',
            connections: ['Duncan', 'Salty'],
            locations: ['Miss Adventure Falls', 'Disney Cruise Line'],
            artifacts: ['Golden Sword', 'Salty\'s Diving Suit']
        },
        {
            id: 'chandler',
            name: 'Jason Chandler',
            status: 'Historical',
            type: 'member',
            occupation: 'Inventor, Explorer',
            membership: 'S.E.A. President (c. 1880)',
            description: '19th-century inventor who became president of S.E.A. Mapped the Mekong River with Captain Brieux.',
            connections: ['Barnabas T. Bullion', 'Captain Brieux', 'Madame Zarkov', 'Vitale Robustelli'],
            locations: ['Big Thunder Mountain Railroad'],
            artifacts: ['The Hyperion']
        },
        {
            id: 'falls-albert',
            name: 'Dr. Albert Falls',
            status: 'Missing',
            type: 'member',
            occupation: 'Explorer',
            membership: 'S.E.A. Member',
            description: 'Founded the Jungle Navigation Company. Mysteriously disappeared, leaving his granddaughter Alberta to carry on his legacy.',
            connections: ['Alberta Falls', 'Dr. Kon Chunosuke'],
            locations: ['Jungle Skipper Canteen', 'Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'falls-alberta',
            name: 'Alberta Falls',
            status: 'Active',
            type: 'associate',
            occupation: 'Company Owner, Mechanic',
            membership: 'Granddaughter of S.E.A. Member',
            description: 'Current owner of the Jungle Navigation Company. Met Dr. Kon Chunosuke in 1938 during an ill-fated expedition.',
            connections: ['Dr. Albert Falls', 'Dr. Kon Chunosuke', 'Felix Pechman XIII'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'falco',
            name: 'Camellia Falco',
            status: 'Historical',
            type: 'member',
            occupation: 'Aviation Pioneer',
            membership: 'First Female S.E.A. Member (1851)',
            description: 'Developed the Dream Flyer, inspired by Leonardo da Vinci\'s designs. First female member inducted by Vitale Robustelli.',
            connections: ['Vitale Robustelli'],
            locations: ['Soaring: Fantastic Flight (Tokyo DisneySea)'],
            artifacts: ['The Dream Flyer']
        },
        {
            id: 'robustelli',
            name: 'Vitale Robustelli',
            status: 'Historical',
            type: 'member',
            occupation: 'Explorer',
            membership: 'S.E.A. President (1851)',
            description: 'Served as S.E.A. president in 1851. Made history by inducting Camellia Falco as the first female member.',
            connections: ['Camellia Falco', 'Jason Chandler'],
            locations: ['Fortress Explorations'],
            artifacts: ['The Renaissance']
        },
        {
            id: 'pleasure',
            name: 'Merriweather Adam Pleasure',
            status: 'Historical',
            type: 'member',
            occupation: 'Explorer, Adventurer',
            membership: 'S.E.A. Member',
            description: 'Founded the Adventurers Club in 1921 as his personal S.E.A. chapter on Pleasure Island.',
            connections: [],
            locations: ['Adventurers Club (defunct)'],
            artifacts: []
        },
        {
            id: 'lindsay',
            name: 'Jock Lindsay',
            status: 'Active',
            type: 'member',
            occupation: 'Pilot',
            membership: 'S.E.A. Member',
            description: 'Indiana Jones\' trusted pilot. Settled in Florida and invited fellow S.E.A. members to his hangar.',
            connections: ['Indiana Jones'],
            locations: ['Jock Lindsey\'s Hangar Bar'],
            artifacts: []
        },
        {
            id: 'chunosuke',
            name: 'Dr. Kon Chunosuke',
            status: 'Active',
            type: 'member',
            occupation: 'Entomologist',
            membership: 'S.E.A. Member',
            description: 'Japanese entomologist who met Alberta Falls in 1938. Their expedition ended with a boat crash and rhino chase.',
            connections: ['Alberta Falls', 'Dr. Albert Falls'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'reed',
            name: 'Professor Garrett Reed',
            status: 'Expelled',
            type: 'antagonist',
            occupation: 'Archaeologist',
            membership: 'Former S.E.A. Member',
            description: 'Expelled from S.E.A. by Lord Henry Mystic for questionable tactics. Now seeks the Emerald Trinity.',
            connections: ['Lord Henry Mystic'],
            locations: ['Jungle Cruise - Hong Kong'],
            artifacts: ['Emerald Trinity']
        },
        {
            id: 'george-hightower',
            name: 'George Hightower',
            status: 'Deceased',
            type: 'associate',
            occupation: 'World-Traveler',
            membership: 'Related to S.E.A. Member',
            description: 'Wealthy traveler and relative of Harrison Hightower III. Married Constance Hatchaway who murdered him in 1877.',
            connections: ['Harrison Hightower III', 'Constance Hatchaway'],
            locations: ['Haunted Mansion'],
            artifacts: []
        },
        {
            id: 'constance',
            name: 'Constance Hatchaway',
            status: 'Deceased',
            type: 'antagonist',
            occupation: 'Serial Killer',
            membership: 'None',
            description: 'The "Black Widow Bride" who married wealthy men and murdered them. George Hightower was her last victim.',
            connections: ['George Hightower'],
            locations: ['Haunted Mansion'],
            artifacts: []
        },
        {
            id: 'ravenswood-henry',
            name: 'Henry Ravenswood',
            status: 'Deceased/Spirit',
            type: 'antagonist',
            occupation: 'Mining Magnate',
            membership: 'None',
            description: 'Founded Thunder Mesa. Died in 1860 earthquake and became The Phantom, murdering his daughter\'s suitors.',
            connections: ['Melanie Ravenswood', 'Barnabas T. Bullion'],
            locations: ['Phantom Manor (Disneyland Paris)'],
            artifacts: []
        },
        {
            id: 'ravenswood-melanie',
            name: 'Melanie Ravenswood',
            status: 'Deceased/Spirit',
            type: 'associate',
            occupation: 'None',
            membership: 'None',
            description: 'Daughter of Henry Ravenswood. All her suitors were murdered by her father\'s ghost.',
            connections: ['Henry Ravenswood'],
            locations: ['Phantom Manor'],
            artifacts: []
        },
        {
            id: 'zarkov',
            name: 'Madame Zarkov',
            status: 'Historical',
            type: 'associate',
            occupation: 'Museum Proprietress',
            membership: 'Associate',
            description: 'Romani proprietress of the Museum of the Weird. Warned Barnabas T. Bullion about the Thunderbird curse.',
            connections: ['Jason Chandler', 'Barnabas T. Bullion'],
            locations: ['Museum of the Weird (unbuilt)'],
            artifacts: []
        },
        {
            id: 'brieux',
            name: 'Captain Brieux',
            status: 'Historical',
            type: 'member',
            occupation: 'Aviator',
            membership: 'S.E.A. Member',
            description: 'French aviator who mapped regions of the Mekong River with Jason Chandler after 1907, flying his airship The Hyperion.',
            connections: ['Jason Chandler'],
            locations: ['Referenced in S.E.A. lore'],
            artifacts: ['The Hyperion']
        },
        {
            id: 'ravenswood-martha',
            name: 'Martha Ravenswood',
            status: 'Deceased/Spirit',
            type: 'associate',
            occupation: 'None',
            membership: 'None',
            description: 'Wife of Henry Ravenswood and mother of Melanie. Born 1802, she perished alongside her husband in the 1860 Thunder Mesa earthquake.',
            connections: ['Henry Ravenswood', 'Melanie Ravenswood'],
            locations: ['Phantom Manor (Disneyland Paris)'],
            artifacts: []
        },
        {
            id: 'smelding',
            name: 'Smelding',
            status: 'Unknown',
            type: 'associate',
            occupation: 'Valet',
            membership: 'None',
            description: 'Harrison Hightower III\'s loyal valet and accomplice. Helped his master steal the head of the water god idol from the Raging Spirits temple.',
            connections: ['Harrison Hightower III'],
            locations: ['Tower of Terror (Tokyo DisneySea)'],
            artifacts: ['Water God Idol Head']
        },
        {
            id: 'albert',
            name: 'Albert',
            status: 'Active',
            type: 'associate',
            occupation: 'Monkey Companion',
            membership: 'Companion to S.E.A. Member',
            description: 'Lord Henry Mystic\'s loyal monkey companion, rescued from a giant spider during their travels. Famously opened the enchanted music box, bringing the manor\'s collection to life.',
            connections: ['Lord Henry Mystic'],
            locations: ['Mystic Manor (Hong Kong Disneyland)'],
            artifacts: ['Enchanted Music Box']
        },
        {
            id: 'duncan',
            name: 'Duncan',
            status: 'Active',
            type: 'associate',
            occupation: 'Parrot, Diving Partner',
            membership: 'Companion to S.E.A. Member',
            description: 'Captain Mary Oceaneer\'s trusted parrot and current diving partner. Keeps watch, chats, and sings while Mary searches for treasure.',
            connections: ['Captain Mary Oceaneer'],
            locations: ['Miss Adventure Falls'],
            artifacts: []
        },
        {
            id: 'salty',
            name: 'Salty',
            status: 'Historical',
            type: 'associate',
            occupation: 'Parrot, Diving Companion',
            membership: 'Companion to S.E.A. Member',
            description: 'Captain Mary Oceaneer\'s parrot who accompanied her on the famous December 5, 1901 deep-sea dive in a custom-made diving suit.',
            connections: ['Captain Mary Oceaneer'],
            locations: ['Miss Adventure Falls'],
            artifacts: ['Salty\'s Diving Suit']
        },
        {
            id: 'pechman',
            name: 'Felix Pechman XIII',
            status: 'Active',
            type: 'associate',
            occupation: 'Jungle Navigation Co. Skipper',
            membership: 'None',
            description: 'A skipper for the Jungle Navigation Company. In 1938, he crashed the boat carrying Dr. Kon Chunosuke and Alberta Falls, stranding the expedition in the African veldt.',
            connections: ['Alberta Falls', 'Dr. Kon Chunosuke'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'murphy',
            name: 'Siobhan "Puffin" Murphy',
            status: 'Active',
            type: 'associate',
            occupation: 'Adventurer',
            membership: 'None',
            description: 'Distant cousin of Alberta Falls, introduced in the 2021 Jungle Cruise update.',
            connections: ['Alberta Falls'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'moss',
            name: 'Dr. Leonard Moss',
            status: 'Missing',
            type: 'associate',
            occupation: 'Botanist',
            membership: 'None',
            description: 'Acclaimed Canadian botanist and member of the missing VIP tour in the 2021 Jungle Cruise storyline.',
            connections: ['Rosa Soto Dominguez'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'dominguez',
            name: 'Rosa Soto Dominguez',
            status: 'Missing',
            type: 'associate',
            occupation: 'Artist',
            membership: 'None',
            description: 'Celebrated Mexican artist and member of the missing VIP tour in the 2021 Jungle Cruise storyline.',
            connections: ['Dr. Leonard Moss'],
            locations: ['Jungle Cruise'],
            artifacts: []
        },
        {
            id: 'tandaji',
            name: 'Chef Tandaji',
            status: 'Historical',
            type: 'member',
            occupation: 'Chef, Author',
            membership: 'S.E.A. Member (confirmed via fez)',
            description: 'Author of "Great Recipes of Africa," found on the shelves of the Skipper Canteen. His fez confirms his S.E.A. membership.',
            connections: [],
            locations: ['Skipper Canteen'],
            artifacts: ['Great Recipes of Africa']
        },
        {
            id: 'sango-sio',
            name: 'Sango Sio',
            status: 'Historical',
            type: 'member',
            occupation: 'Unknown',
            membership: 'S.E.A. Member (confirmed via fez)',
            description: 'A S.E.A. member whose membership is confirmed by a fez displayed at the Skipper Canteen. Little else is known.',
            connections: [],
            locations: ['Skipper Canteen'],
            artifacts: []
        },
        {
            id: 'teixeira',
            name: 'Luana Teixeira',
            status: 'Historical',
            type: 'member',
            occupation: 'Photographer',
            membership: 'S.E.A. Member (confirmed via fez)',
            description: 'A photographer whose S.E.A. membership is confirmed by a fez displayed at the Skipper Canteen.',
            connections: [],
            locations: ['Skipper Canteen'],
            artifacts: []
        },
        {
            id: 'kouame-beauciel',
            name: 'Aya Kouame-Beauciel',
            status: 'Historical',
            type: 'member',
            occupation: 'Astronomer',
            membership: 'S.E.A. Member',
            description: 'An early 20th-century astronomer, introduced to the lore via a letter discovered at the Adventureland Treehouse in November 2023.',
            connections: [],
            locations: ['Adventureland Treehouse'],
            artifacts: []
        },
        {
            id: 'baterista',
            name: 'Dr. J.L. Baterista',
            status: 'Historical',
            type: 'member',
            occupation: 'Unknown',
            membership: 'S.E.A. Member',
            description: 'A S.E.A. member referenced in society materials. Their exploits remain a mystery of the archives.',
            connections: [],
            locations: ['Referenced in S.E.A. lore'],
            artifacts: []
        },
        {
            id: 'blauerhimmel',
            name: 'Professor R. Blauerhimmel',
            status: 'Historical',
            type: 'member',
            occupation: 'Unknown',
            membership: 'S.E.A. Member',
            description: 'A S.E.A. member referenced in society materials. Their exploits remain a mystery of the archives.',
            connections: [],
            locations: ['Referenced in S.E.A. lore'],
            artifacts: []
        }
    ],

    // Relationships for graph visualization
    relationships: [
        { source: 'hightower', target: 'george-hightower', type: 'family', label: 'Related (cousins/brothers)' },
        { source: 'hightower', target: 'mystic', type: 'professional', label: 'Fellow S.E.A. members' },
        { source: 'george-hightower', target: 'constance', type: 'family', label: 'Husband/wife' },
        { source: 'mystic', target: 'reed', type: 'rivalry', label: 'Expelled from S.E.A.' },
        { source: 'chandler', target: 'bullion', type: 'friendship', label: 'Close friends' },
        { source: 'chandler', target: 'zarkov', type: 'professional', label: 'Consulted on curses' },
        { source: 'chandler', target: 'robustelli', type: 'professional', label: 'Secretary under president' },
        { source: 'bullion', target: 'zarkov', type: 'professional', label: 'Received warnings' },
        { source: 'bullion', target: 'ravenswood-henry', type: 'professional', label: 'Mining oversight (Paris)' },
        { source: 'falls-albert', target: 'falls-alberta', type: 'family', label: 'Grandfather/granddaughter' },
        { source: 'falls-albert', target: 'chunosuke', type: 'friendship', label: 'Fellow S.E.A. members' },
        { source: 'falls-alberta', target: 'chunosuke', type: 'professional', label: '1938 expedition' },
        { source: 'robustelli', target: 'falco', type: 'professional', label: 'Inducted first female member' },
        { source: 'ravenswood-henry', target: 'ravenswood-melanie', type: 'family', label: 'Father/daughter' },
        { source: 'ravenswood-henry', target: 'ravenswood-martha', type: 'family', label: 'Husband/wife' },
        { source: 'ravenswood-martha', target: 'ravenswood-melanie', type: 'family', label: 'Mother/daughter' },
        { source: 'chandler', target: 'brieux', type: 'professional', label: 'Mapped the Mekong from The Hyperion' },
        { source: 'hightower', target: 'smelding', type: 'professional', label: 'Master and valet, partners in theft' },
        { source: 'mystic', target: 'albert', type: 'friendship', label: 'Rescued from a giant spider; inseparable' },
        { source: 'oceaneer', target: 'duncan', type: 'friendship', label: 'Current diving partner' },
        { source: 'oceaneer', target: 'salty', type: 'friendship', label: 'Companion on the 1901 golden sword dive' },
        { source: 'falls-alberta', target: 'murphy', type: 'family', label: 'Distant cousins' },
        { source: 'falls-alberta', target: 'pechman', type: 'professional', label: 'Skipper who crashed the 1938 expedition' },
        { source: 'moss', target: 'dominguez', type: 'professional', label: 'Fellow members of the missing VIP tour' },
    ],

    // Locations
    locations: [
        {
            name: 'Fortress Explorations',
            park: 'Tokyo DisneySea',
            region: 'asia',
            country: 'Japan',
            opened: '2001',
            type: 'Walk-through',
            description: 'Original S.E.A. headquarters established 1538 in Porto Paradiso',
            characters: ['Vitale Robustelli', 'Camellia Falco']
        },
        {
            name: 'Tower of Terror',
            park: 'Tokyo DisneySea',
            region: 'asia',
            country: 'Japan',
            opened: '2006',
            type: 'Drop tower',
            description: 'Hotel Hightower, site of Harrison Hightower III\'s disappearance',
            characters: ['Harrison Hightower III']
        },
        {
            name: 'Mystic Manor',
            park: 'Hong Kong Disneyland',
            region: 'asia',
            country: 'Hong Kong',
            opened: '2013',
            type: 'Trackless dark ride',
            description: 'Lord Henry Mystic\'s manor with enchanted music box',
            characters: ['Lord Henry Mystic']
        },
        {
            name: 'Jungle Skipper Canteen',
            park: 'Magic Kingdom',
            region: 'america',
            country: 'USA',
            opened: '2015',
            type: 'Restaurant',
            description: 'Founded by Dr. Albert Falls, features S.E.A. member books',
            characters: ['Dr. Albert Falls']
        },
        {
            name: 'Big Thunder Mountain Railroad',
            park: 'Multiple Parks',
            region: 'america',
            country: 'USA',
            opened: '1979',
            type: 'Roller coaster',
            description: 'Big Thunder Mining Company, site of supernatural curse',
            characters: ['Barnabas T. Bullion', 'Jason Chandler']
        },
        {
            name: 'Phantom Manor',
            park: 'Disneyland Paris',
            region: 'europe',
            country: 'France',
            opened: '1992',
            type: 'Dark ride',
            description: 'Ravenswood Manor, haunted by The Phantom',
            characters: ['Henry Ravenswood', 'Melanie Ravenswood']
        },
        {
            name: 'Miss Adventure Falls',
            park: 'Typhoon Lagoon',
            region: 'america',
            country: 'USA',
            opened: '2017',
            type: 'Water slide',
            description: 'Captain Mary Oceaneer\'s scattered treasure collection',
            characters: ['Captain Mary Oceaneer']
        },
        {
            name: 'Jock Lindsey\'s Hangar Bar',
            park: 'Disney Springs',
            region: 'america',
            country: 'USA',
            opened: '2015',
            type: 'Bar/Restaurant',
            description: 'Jock Lindsay\'s hangar hosting fellow S.E.A. members',
            characters: ['Jock Lindsay']
        },
        {
            name: 'Soaring: Fantastic Flight',
            park: 'Tokyo DisneySea',
            region: 'asia',
            country: 'Japan',
            opened: '2019',
            type: 'Flying theater',
            description: 'Museum of Fantastic Flight honoring Camellia Falco',
            characters: ['Camellia Falco']
        },
        {
            name: 'Disney Cruise Line Oceaneer Lab',
            park: 'Disney Cruise Line',
            region: 'sea',
            country: 'At Sea',
            opened: 'Various',
            type: 'Kids club',
            description: 'Captain Mary Oceaneer\'s ship with S.E.A. artifacts',
            characters: ['Captain Mary Oceaneer']
        },
        {
            name: 'Raging Spirits',
            park: 'Tokyo DisneySea',
            region: 'asia',
            country: 'Japan',
            opened: '2005',
            type: 'Roller coaster',
            description: '5,000-year-old temple site where restoration work enraged the fire and water deities',
            characters: ['Harrison Hightower III', 'Smelding']
        },
        {
            name: 'Indiana Jones Adventure: Temple of the Crystal Skull',
            park: 'Tokyo DisneySea',
            region: 'asia',
            country: 'Japan',
            opened: '2001',
            type: 'Dark ride',
            description: 'Lost River Delta temple tied to the Fountain of Youth; Harrison Hightower III was photographed here',
            characters: ['Harrison Hightower III']
        },
        {
            name: 'Tropical Hideaway',
            park: 'Disneyland',
            region: 'america',
            country: 'USA',
            opened: '2018',
            type: 'Quick service',
            description: 'Traders\' market featuring a wall of expedition paddles left behind by S.E.A. members',
            characters: []
        },
        {
            name: 'Haunted Mansion',
            park: 'Disneyland',
            region: 'america',
            country: 'USA',
            opened: '1969',
            type: 'Dark ride',
            description: 'New Orleans mansion where Constance Hatchaway murdered George Hightower in 1877',
            characters: ['Constance Hatchaway', 'George Hightower']
        },
        {
            name: 'Adventurers Club',
            park: 'Pleasure Island, WDW',
            region: 'america',
            country: 'USA',
            opened: '1989 (closed 2008)',
            type: 'Club (defunct)',
            description: 'Merriweather Adam Pleasure\'s personal S.E.A. chapter, packed with artifacts and curios',
            characters: ['Merriweather Adam Pleasure']
        },
        {
            name: 'Expedition Everest',
            park: 'Animal Kingdom',
            region: 'america',
            country: 'USA',
            opened: '2006',
            type: 'Roller coaster',
            description: 'The Forbidden Mountain expedition referenced in Harrison Hightower III\'s books at the Skipper Canteen',
            characters: ['Harrison Hightower III']
        },
        {
            name: 'Adventureland Treehouse',
            park: 'Disneyland',
            region: 'america',
            country: 'USA',
            opened: '2023',
            type: 'Walk-through',
            description: 'Where a letter from astronomer Aya Kouame-Beauciel was discovered in November 2023',
            characters: ['Aya Kouame-Beauciel']
        }
    ],

    // Family Trees
    families: {
        hightower: {
            name: 'Hightower Family',
            members: [
                { id: 'hightower', name: 'Harrison Hightower III', dates: '? - 1899', relation: 'root' },
                { id: 'george-hightower', name: 'George Hightower', dates: '? - 1877', relation: 'sibling', parent: 'hightower' },
                { id: 'constance', name: 'Constance Hatchaway', dates: '? - ?', relation: 'spouse', parent: 'george-hightower' }
            ]
        },
        ravenswood: {
            name: 'Ravenswood Family',
            members: [
                { id: 'ravenswood-henry', name: 'Henry Ravenswood', dates: '1795 - 1860', relation: 'root' },
                { id: 'ravenswood-martha', name: 'Martha Ravenswood', dates: '1802 - 1860', relation: 'spouse', parent: 'ravenswood-henry' },
                { id: 'ravenswood-melanie', name: 'Melanie Ravenswood', dates: '1842 - 1860', relation: 'child', parent: 'ravenswood-henry' }
            ]
        },
        falls: {
            name: 'Falls Family',
            members: [
                { id: 'falls-albert', name: 'Dr. Albert Falls', dates: '? - ?', relation: 'root' },
                { id: 'falls-alberta', name: 'Alberta Falls', dates: '? - Active', relation: 'grandchild', parent: 'falls-albert' },
                { id: 'murphy', name: 'Siobhan "Puffin" Murphy', dates: '? - Active', relation: 'cousin', parent: 'falls-alberta' }
            ]
        }
    },

    // Artifacts
    artifacts: [
        {
            name: 'Shiriki Utundu',
            type: 'cursed',
            origin: 'Mtundu tribe, Congo Basin',
            owner: 'Harrison Hightower III',
            description: 'Cursed wooden idol meaning "Believe the Misfortune". Caused Harrison Hightower\'s disappearance.',
            location: 'Tower of Terror',
            danger: 'high'
        },
        {
            name: 'Enchanted Music Box',
            type: 'magical',
            origin: 'Unknown',
            owner: 'Lord Henry Mystic',
            description: 'Magical music box that brings inanimate objects to life when opened.',
            location: 'Mystic Manor',
            danger: 'medium'
        },
        {
            name: 'Golden Sword',
            type: 'treasure',
            origin: 'Deep sea',
            owner: 'Captain Mary Oceaneer',
            description: 'Golden sword discovered December 5, 1901 during deep sea dive.',
            location: 'Miss Adventure Falls',
            danger: 'none'
        },
        {
            name: 'The Dream Flyer',
            type: 'vehicle',
            origin: 'Invented by Camellia Falco',
            owner: 'Museum of Fantastic Flight',
            description: 'Glider inspired by Leonardo da Vinci\'s flying machine designs.',
            location: 'Soaring: Fantastic Flight',
            danger: 'none'
        },
        {
            name: 'The Renaissance',
            type: 'vehicle',
            origin: 'S.E.A. Headquarters',
            owner: 'Society of Explorers and Adventurers',
            description: 'Sailing ship docked at original S.E.A. headquarters since 1538.',
            location: 'Fortress Explorations',
            danger: 'none'
        },
        {
            name: 'The Hyperion',
            type: 'vehicle',
            origin: 'France',
            owner: 'Captain Brieux',
            description: 'Airship used to map the Mekong River with Jason Chandler.',
            location: 'Referenced in lore',
            danger: 'none'
        },
        {
            name: 'Water God Idol Head',
            type: 'cursed',
            origin: 'Raging Spirits Temple',
            owner: 'Stolen by Harrison Hightower III',
            description: 'Sacred artifact from 5,000-year-old temple. Angered deities when stolen.',
            location: 'Raging Spirits',
            danger: 'high'
        },
        {
            name: 'Salty\'s Diving Suit',
            type: 'equipment',
            origin: 'Custom made',
            owner: 'Captain Mary Oceaneer',
            description: 'Custom diving suit for Captain Mary\'s parrot Salty.',
            location: 'Miss Adventure Falls',
            danger: 'none'
        },
        {
            name: 'S.E.A. Fezes',
            type: 'document',
            origin: 'S.E.A. Headquarters',
            owner: 'Various members',
            description: 'Traditional fezes displaying S.E.A. logo, confirming membership.',
            location: 'Skipper Canteen',
            danger: 'none'
        },
        {
            name: 'Expedition Paddles',
            type: 'document',
            origin: 'Various expeditions',
            owner: 'S.E.A. Members',
            description: 'Commemorative paddles from various S.E.A. expeditions.',
            location: 'Tropical Hideaway',
            danger: 'none'
        },
        {
            name: 'The Emerald Trinity',
            type: 'treasure',
            origin: 'Unknown',
            owner: 'Sought by Professor Garrett Reed',
            description: 'Legendary trio of emeralds pursued by the disgraced Professor Garrett Reed after his expulsion from S.E.A.',
            location: 'Jungle Cruise - Curse of the Emerald Trinity',
            danger: 'medium'
        },
        {
            name: 'The Crystal Skull',
            type: 'cursed',
            origin: 'Lost River Delta temple',
            owner: 'None (temple guardian)',
            description: 'Mysterious skull tied to the search for the Fountain of Youth in the Lost River Delta.',
            location: 'Indiana Jones Adventure: Temple of the Crystal Skull',
            danger: 'high'
        },
        {
            name: 'Jock Lindsay\'s Seaplane',
            type: 'vehicle',
            origin: 'United States',
            owner: 'Jock Lindsay',
            description: 'Seaplane Jock used for tours across Florida after settling at Disney Springs in 1938.',
            location: 'Jock Lindsey\'s Hangar Bar',
            danger: 'none'
        },
        {
            name: 'RV Oceaneer Lab',
            type: 'vehicle',
            origin: 'Custom research vessel',
            owner: 'Captain Mary Oceaneer',
            description: 'Captain Mary\'s first ship, now a floating museum of her expeditions and discoveries.',
            location: 'Disney Cruise Line',
            danger: 'none'
        },
        {
            name: 'Great Recipes of Africa',
            type: 'document',
            origin: 'Written by Chef Tandaji',
            owner: 'Chef Tandaji',
            description: 'Chef Tandaji\'s cookbook, shelved in the Skipper Canteen meeting room among other S.E.A. members\' works.',
            location: 'Skipper Canteen',
            danger: 'none'
        },
        {
            name: 'Captain Mary\'s Letters',
            type: 'document',
            origin: 'Various voyages',
            owner: 'Captain Mary Oceaneer',
            description: 'Letters and portraits chronicling Captain Mary\'s treasure-hunting voyages across the seven seas.',
            location: 'Oceaneer Lab',
            danger: 'none'
        },
        {
            name: 'Hightower Disappearance Newspaper',
            type: 'document',
            origin: 'New York City, 1900',
            owner: 'Archive collection',
            description: 'Front-page report of Harrison Hightower III\'s mysterious New Year\'s Eve disappearance at Hotel Hightower.',
            location: 'Oceaneer Lab',
            danger: 'none'
        },
        {
            name: 'Leonardo da Vinci\'s Designs',
            type: 'document',
            origin: 'Renaissance Italy',
            owner: 'Fortress Explorations',
            description: 'Flying machine designs that inspired Camellia Falco\'s Dream Flyer, honored in the Hall of Explorers.',
            location: 'Fortress Explorations',
            danger: 'none'
        }
    ]
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEAData;
}
