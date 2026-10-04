import "dotenv/config";
import fs from "fs";
import path from "path";

const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
  throw new Error("API_FOOTBALL_KEY is missing from .env.local");
}

type SelectedPlayer = {
  name: string;
  teamId: number; // Internal API lookup only
  league: string;
};

const selectedPlayers: SelectedPlayer[] = [
  // =========================
  // PREMIER LEAGUE
  // =========================

  { name: "Erling Haaland", teamId: 50, league: "Premier League" },
  { name: "Phil Foden", teamId: 50, league: "Premier League" },
  { name: "Ruben Dias", teamId: 50, league: "Premier League" },
  { name: "Gianluigi Donnarumma", teamId: 50, league: "Premier League" },
  { name: "Jeremy Doku", teamId: 50, league: "Premier League" },

  { name: "Bukayo Saka", teamId: 42, league: "Premier League" },
  { name: "Martin Odegaard", teamId: 42, league: "Premier League" },
  { name: "Viktor Gyokeres", teamId: 42, league: "Premier League" },
  { name: "Declan Rice", teamId: 42, league: "Premier League" },
  { name: "William Saliba", teamId: 42, league: "Premier League" },
  { name: "Gabriel Magalhaes", teamId: 42, league: "Premier League" },

  { name: "Mohamed Kudus", teamId: 47, league: "Premier League" },
  { name: "Xavi Simons", teamId: 47, league: "Premier League" },

  { name: "Bruno Fernandes", teamId: 33, league: "Premier League" },
  { name: "Marcus Rashford", teamId: 33, league: "Premier League" },

  { name: "Cole Palmer", teamId: 49, league: "Premier League" },
  { name: "Moises Caicedo", teamId: 49, league: "Premier League" },

  { name: "Virgil van Dijk", teamId: 40, league: "Premier League" },
  { name: "Florian Wirtz", teamId: 40, league: "Premier League" },
  { name: "Alexander Isak", teamId: 40, league: "Premier League" },

  // =========================
  // LA LIGA
  // =========================

  { name: "Kylian Mbappe", teamId: 541, league: "La Liga" },
  { name: "Vinicius Junior", teamId: 541, league: "La Liga" },
  { name: "Jude Bellingham", teamId: 541, league: "La Liga" },
  { name: "Federico Valverde", teamId: 541, league: "La Liga" },
  { name: "Thibaut Courtois", teamId: 541, league: "La Liga" },

  { name: "Lamine Yamal", teamId: 529, league: "La Liga" },
  { name: "Raphinha", teamId: 529, league: "La Liga" },
  { name: "Robert Lewandowski", teamId: 529, league: "La Liga" },
  { name: "Pedri", teamId: 529, league: "La Liga" },
  { name: "Ronald Araujo", teamId: 529, league: "La Liga" },
  { name: "Frenkie de Jong", teamId: 529, league: "La Liga" },

  { name: "Antoine Griezmann", teamId: 530, league: "La Liga" },
  { name: "Julian Alvarez", teamId: 530, league: "La Liga" },

  { name: "Nico Williams", teamId: 531, league: "La Liga" },
  { name: "Inaki Williams", teamId: 531, league: "La Liga" },

  // =========================
  // SERIE A
  // =========================

  { name: "Lautaro Martinez", teamId: 505, league: "Serie A" },
  { name: "Marcus Thuram", teamId: 505, league: "Serie A" },
  { name: "Nicolo Barella", teamId: 505, league: "Serie A" },
  { name: "Alessandro Bastoni", teamId: 505, league: "Serie A" },
  { name: "Hakan Calhanoglu", teamId: 505, league: "Serie A" },
  { name: "Federico Dimarco", teamId: 505, league: "Serie A" },

  { name: "Christian Pulisic", teamId: 489, league: "Serie A" },
  { name: "Rafael Leao", teamId: 489, league: "Serie A" },
  { name: "Luka Modric", teamId: 489, league: "Serie A" },
  { name: "Adrien Rabiot", teamId: 489, league: "Serie A" },
  { name: "Mike Maignan", teamId: 489, league: "Serie A" },

  { name: "Bremer", teamId: 496, league: "Serie A" },
  { name: "Kenan Yildiz", teamId: 496, league: "Serie A" },
  { name: "Dusan Vlahovic", teamId: 496, league: "Serie A" },

  { name: "Kevin De Bruyne", teamId: 492, league: "Serie A" },
];

const CACHE_DIR = path.join(
  process.cwd(),
  "data",
  "squad-cache"
);

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCachePath(teamId: number) {
  return path.join(
    CACHE_DIR,
    `${teamId}.json`
  );
}

async function getSquad(teamId: number) {
  const cachePath = getCachePath(teamId);

  // Use local cache if available
  if (fs.existsSync(cachePath)) {
    console.log(
      `Using cached squad for team ${teamId}`
    );

    return JSON.parse(
      fs.readFileSync(
        cachePath,
        "utf-8"
      )
    );
  }

  const url =
    `https://v3.football.api-sports.io/players/squads?team=${teamId}`;

  let attempts = 0;

  while (attempts < 5) {
    attempts++;

    console.log(
      `API request for team ${teamId} ` +
      `(attempt ${attempts}/5)...`
    );

    const response = await fetch(
      url,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    // Successful response
    if (response.ok) {
      const data = await response.json();

      const squad =
        data.response?.[0]?.players ?? [];

      // Save squad locally
      fs.writeFileSync(
        cachePath,
        JSON.stringify(
          squad,
          null,
          2
        )
      );

      console.log(
        `Saved team ${teamId} squad to cache.`
      );

      return squad;
    }

    // Rate limit
    if (response.status === 429) {
      console.log(
        "API rate limit reached."
      );

      console.log(
        "Waiting 30 seconds before retry..."
      );

      await wait(30000);

      continue;
    }

    throw new Error(
      `Failed to fetch team ${teamId}: ` +
      `${response.status} ` +
      `${response.statusText}`
    );
  }

  throw new Error(
    `Could not fetch team ${teamId} ` +
    "after 5 attempts."
  );
}

function normalizeName(name: string) {
  return name
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]/g,
      ""
    );
}

async function buildPlayers() {
  // Get unique club IDs
  const teamIds = [
    ...new Set(
      selectedPlayers.map(
        (player) =>
          player.teamId
      )
    ),
  ];

  console.log(
    `Teams to fetch: ${teamIds.length}`
  );

  console.log(
    `Players requested: ` +
    `${selectedPlayers.length}`
  );

  console.log(
    "\nFetching selected club squads...\n"
  );

  const allSquadPlayers: any[] = [];

  // =========================
  // FETCH CLUB SQUADS
  // =========================

  for (
    let i = 0;
    i < teamIds.length;
    i++
  ) {
    const teamId = teamIds[i];

    const cachePath =
      getCachePath(teamId);

    const alreadyCached =
      fs.existsSync(cachePath);

    console.log(
      `\nTeam ${i + 1}/${teamIds.length}: ${teamId}`
    );

    const squad =
      await getSquad(teamId);

    allSquadPlayers.push(
      ...squad.map(
        (player: any) => ({
          ...player,
          teamId,
        })
      )
    );

    // Only wait if we actually
    // made an API request.
    if (
      !alreadyCached &&
      i < teamIds.length - 1
    ) {
      console.log(
        "Waiting 8 seconds..."
      );

      await wait(8000);
    }
  }

  console.log(
    "\nAll club squads collected."
  );

  // =========================
  // FIND OUR SELECTED PLAYERS
  // =========================

  const finalPlayers = [];

  for (
    const selected of selectedPlayers
  ) {
    const targetName =
      normalizeName(
        selected.name
      );

    const player =
      allSquadPlayers.find(
        (item) =>
          normalizeName(
            item.name
          ) === targetName
      );

    if (!player) {
      console.log(
        `NOT FOUND: ${selected.name}`
      );

      continue;
    }

    // IMPORTANT:
    // teamId is NOT included here.
    //
    // This is the exact structure
    // that will go into players.json.

    finalPlayers.push({
      id: String(player.id),
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      club: player.team.name,
      league: selected.league,
      imageUrl: player.photo,
    });

    console.log(
      `FOUND: ${player.name} ` +
      `→ ${player.team.name}`
    );
  }

  // =========================
  // SAVE players.json
  // =========================

  const outputPath =
    path.join(
      process.cwd(),
      "data",
      "players.json"
    );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      finalPlayers,
      null,
      2
    )
  );

  console.log(
    "\n=============================="
  );

  console.log(
    "CURATED PLAYER DATA COMPLETE"
  );

  console.log(
    "=============================="
  );

  console.log(
    `Players found: ` +
    `${finalPlayers.length}`
  );

  console.log(
    `Players requested: ` +
    `${selectedPlayers.length}`
  );

  console.log(
    `Saved to: ${outputPath}`
  );
}

buildPlayers().catch(
  (error) => {
    console.error(
      "\nIMPORT FAILED:"
    );

    console.error(error);

    process.exit(1);
  }
);