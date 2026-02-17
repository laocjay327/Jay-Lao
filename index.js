import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

// Generate random commit dates between Sept 22 and Dec 28, 2024
const generateRandomCommitDates = () => {
  const start = moment("2024-09-22");
  const end = moment("2024-12-28");
  const days = end.diff(start, "days");
  let dates = [];

  // Randomly decide how many days will have commits (not all days)
  const daysWithCommits = random.int(Math.floor(days * 0.5), days); // 50% to 100% of days
  let usedDays = new Set();

  while (usedDays.size < daysWithCommits) {
    usedDays.add(random.int(0, days));
  }

  usedDays.forEach(dayOffset => {
    // Random number of commits for this day (1-4)
    const numCommits = random.int(1, 4);
    for (let i = 0; i < numCommits; i++) {
      // Randomize commit time during the day
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const date = moment(start).add(dayOffset, "days").set({ hour, minute, second }).format();
      dates.push(date);
    }
  });

  // Shuffle dates for randomness
  dates = dates.sort(() => Math.random() - 0.5);
  return dates;
};

const commitDates = generateRandomCommitDates();

const makeCommits = (dates) => {
  if (dates.length === 0) return simpleGit().push();
  const date = dates[0];
  const data = { date };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }, () => makeCommits(dates.slice(1)));
  });
};

makeCommits(commitDates);