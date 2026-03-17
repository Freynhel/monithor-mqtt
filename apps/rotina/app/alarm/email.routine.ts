import { updateAlarmEmailQueue } from "./email.queue";
import { sendQueuedAlarmEmails } from "./email.sender";

async function run() {

	//update alarm email queue update every 10 seconds
	setInterval(async () => {
		try {
			await updateAlarmEmailQueue({ includeEmployees: false, includeGlobal: true });
		} catch (err) {
			console.error("❌ Alarm email queue update error:", err);
		}
	}, 10 * 1000); // every 10 seconds

	//send alarm email every 10 seconds
	setInterval(async () => {
		try {
			await sendQueuedAlarmEmails();
		} catch (err) {
			console.error("❌ Alarm email sending error:", err);
		}
	}, 10 * 1000); // every 10 seconds

}

run();
