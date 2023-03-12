const Challenge = require("../models/challenge.model");
const Item = require("../models/item.model");
const Skill = require("../models/skill.model");

const Challenges = require("./Challenges.json");
const Items = require("./Items.json");
const Skills = require("./Skills.json");

const mongooseLoader = require("../loaders/mongooseLoader");

function fixObjects(objects) {
  return objects.map(obj => {
    const keys = Object.keys(obj);
    for (const key of keys) {
      const value = obj[key];
      if (Array.isArray(value)) {
        obj[key] = value.map(item => {
          if (item && item.$oid) {
            return item.$oid;
          }
          return item;
        });
      } else if (value && typeof value === "object") {
        if (value.$oid) {
          obj[key] = value.$oid;
        } else {
          fixObjects([value]);
        }
      }
    }
    return obj;
  });
}


async function importCollection(model, data) {
  data = fixObjects(data);
  return new Promise((reject, resolve) => {
    model.insertMany(data, { timeout: 30000 }, (error) => {
      if (error) {
        console.log(`Error: ${error}`);
        return reject(error);
      }
      
      console.log("Successfuly imported");
      return resolve();
    });
  });
}

async function main() {
  mongooseLoader();
  await importCollection(Challenge, Challenges).catch(err => console.log(err));
  await importCollection(Item, Items).catch(err => console.log(err));
  await importCollection(Skill, Skills).catch(err => console.log(err));
}

(async () => {
  await main();
  process.exit();
})();