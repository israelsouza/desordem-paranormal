import { CronJob } from "cron";
import { WikiService } from "../services/wiki-service";

export const job = new CronJob(
  "0 0 * * *",
  function () {
    WikiService.UpdatePageConnections();
  },
  null,
  true
);
