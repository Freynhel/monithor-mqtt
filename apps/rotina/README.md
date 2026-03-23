   git clone https://github.com/Freynhel/monithor-rotina-mqtt.git

2. Navigate to the project directory:
   ```bash
   cd monithor-rotina-mqtt
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and configure your environment variables:

```env
MQTT_HOST=mqtt://your-broker-address
MQTT_PORT=1883
MQTT_USER=your-username
MQTT_PASS=your-password
```

## Usage

### MQTT Routine

To start the MQTT routine run the following command:
```bash
npx tsx .\app\mqtt.ts
```


### Alarm Email Routine

To start the Alarm Email routine in production mode, modify the line 9 of the file `.\app\alarm\email.routine.ts` to:
```typescript
await updateAlarmEmailQueue({ includeEmployees: true, includeGlobal: true });
```


To run the Alarm Email routine in development mode you need to modify the line 9 of the file `.\app\alarm\email.routine.ts` to:
```typescript
await updateAlarmEmailQueue({ includeEmployees: false, includeGlobal: true });
```

Then run the following command:
```bash
npx tsx .\app\alarm\email.routine.ts
```
