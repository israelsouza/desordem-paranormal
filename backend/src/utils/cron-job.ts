import { CronJob } from "cron";
import { WikiService } from "../services/wiki-service";

WikiService.UpdatePageConnections();
new CronJob(
  "0 0 * * *",
  function () {
  },
  null,
  true
);
