// Config for the difficuties chosen during setup.

// Inherit option means that each difficulty will inherit from the one above it.
// The first difficulty is always the easiest and will not inherit from anything.
// The last difficulty is always the hardest and will inherit from everything.

// The default field is the one that everything will inherit from regardless if inherit is set to true or false.

const Item = require("../models/item.model");
const Skill = require("../models/skill.model");

const config = {
  "inherit": true,
  "default": {
    "items": [
      "SELF IMPROVEMENT GUIDE BOOK",
      "RUSTY DAGGER"
    ]
  },
  "difficulties": {
    "easy": {},
    "medium": {
      "completed": [
        "MEDITATION 1",
        "FITNESS 1",
        "JOURNALING 1"
      ],
      "inprogress": [
        "FITNESS 2",
        "MEDITATION 2",
        "JOURNALING 2"
      ],
      "items": [
        "STRONG APP",
        "HOW TO START MEDITATING",
        "MYFITNESSPAL"
      ]
    },
    "hard": {
      "completed": [
        "MEDITATION 2",
        "FITNESS 2",
        "JOURNALING 2",
        "RELATIONSHIPS 1"
      ],
      "inprogress": [
        "FITNESS 3",
        "MEDITATION 3",
        "JOURNALING 3",
        "RELATIONSHIPS 2",
        "READING 1"
      ],
      "items": [
        "ADVANCED JOURNAL"
      ]
    }
  }
};

async function createConfig() {
  const newConfig = {};
  // Convert the config to a constant JSON that can be used in the code.
  if (config.inherit) {
    let lastDifficulty = structuredClone(config.default);
    for (const difficulty in config.difficulties) {
      const keys = new Set(Object.keys(config.difficulties[difficulty]).concat(Object.keys(lastDifficulty)));
      newConfig[difficulty] = {};
      for (const key of keys) {
        if(key == "inprogress") {
          newConfig[difficulty][key] = config.difficulties[difficulty][key];
          continue;
        }
        newConfig[difficulty][key] = (config.difficulties[difficulty][key] || []).concat(lastDifficulty[key] || []);
      }
      
      lastDifficulty = structuredClone(newConfig[difficulty]);
    }
  }
  else {
    for (const difficulty in config.difficulties) {
      for (const field in config.default) {
        newConfig[difficulty] = config.difficulties[difficulty];
        newConfig[difficulty][field] = config.default[field].concat(config.difficulties[difficulty][field] || []);
      }
    }
  }
  
  console.log(newConfig);

  return newConfig;
}


// Replace all the names to ids and save them to the config.
async function convertNamesToIds(config) {
  for (const difficulty in config) {
    for (const field in config[difficulty]) {
      if (field === "items") {
        for (const item of config[difficulty][field]) {
          const newItem = await Item.findOne({ name: item });
          if (newItem) {
            config[difficulty][field].splice(config[difficulty][field].indexOf(item), 1, newItem.id);
          }
          else {
            console.log(`Item ${item} not found.`);
          }
        }
      }
      else if (field === "completed" || field === "inprogress") {
        for (const skill of config[difficulty][field]) {
          const skillName = skill.split(" ")[0];
          const skillLevel = skill.split(" ")[1];
          const newSkill = await Skill.findOne({ title: skillName, level: skillLevel });
          if (newSkill) {
            config[difficulty][field].splice(config[difficulty][field].indexOf(skill), 1, newSkill.id);
          }
          else {
            console.log(`Could not find skill ${skill}`);
          }
        }
      }
    }
  }
  return config;
}

// Print out the new config. (Debugging purposes)
// eslint-disable-next-line no-unused-vars
async function printConfig(config) {
  console.log(config);
}


async function run() {
  const config = await createConfig();
  const configWithIds = await convertNamesToIds(config);
  return configWithIds;
}

module.exports = run();