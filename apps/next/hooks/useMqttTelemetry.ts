"use client";

/**
 * hooks/useMqttTelemetry.ts
 *
 * Connects to the MQTT broker over WebSocket, subscribes to a single
 * generator topic, and exposes the latest normalized telemetry.
 *
 * - Transport:  WebSocket (mqtt.js auto-selects it in the browser)
 * - Refresh:    Throttled to UPDATE_INTERVAL_MS (~2 s) to avoid unnecessary renders
 * - Reconnect:  Handled automatically by mqtt.js (reconnectPeriod = 5 s)
 * - Cleanup:    Unsubscribes and ends connection on component unmount or topic change
 *
 * Usage:
 *   const { telemetry, status, lastUpdate } = useMqttTelemetry(generator.TopicMQTT);
 */

import { useCallback, useEffect, useRef, useState } from "react";
import mqtt, { type MqttClient } from "mqtt";
import {
	normalizeMqttPayload,
	type NormalizedTelemetry,
} from "@/lib/mqttNormalizer";

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * WebSocket URL for the MQTT broker.
 * The backend connects over plain TCP (port 1883); the browser must use the
 * WebSocket endpoint (port 8080 = ws, 8081 = wss).
 * Override via NEXT_PUBLIC_MQTT_WS_URL environment variable.
 */
const MQTT_WS_BROKER =
	process.env.NEXT_PUBLIC_MQTT_WS_URL ?? "ws://broker.hivemq.com:8000/mqtt";

/** Minimum ms between React state updates — prevents unnecessary re-renders. */
const UPDATE_INTERVAL_MS = 2_000;

// ─── Types ────────────────────────────────────────────────────────────────────

export type MqttConnectionStatus =
	| "idle" // no topic configured yet
	| "connecting" // initial connection attempt
	| "connected" // broker ACK received, subscribed
	| "reconnecting" // connection lost, retrying
	| "error" // unrecoverable error
	| "disconnected"; // deliberately closed

export type UseMqttTelemetryResult = {
	/** Latest normalized telemetry frame. Null until first message arrives. */
	telemetry: NormalizedTelemetry | null;
	/** Current WebSocket/MQTT connection state. */
	status: MqttConnectionStatus;
	/** Wall-clock time of the last processed message. */
	lastUpdate: Date | null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMqttTelemetry(
	topic: string | null | undefined,
): UseMqttTelemetryResult {
	const [telemetry, setTelemetry] = useState<NormalizedTelemetry | null>(
		null,
	);
	const [status, setStatus] = useState<MqttConnectionStatus>("idle");
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

	// Track the last state-update timestamp without triggering re-renders
	const lastUpdateTsRef = useRef<number>(0);
	const clientRef = useRef<MqttClient | null>(null);

	// Stable message handler — avoids re-creating the effect on every render
	const handleMessage = useCallback((_topic: string, payload: Buffer) => {
		try {
			const msg = JSON.parse(payload.toString()) as {
				dl?: Record<string, number>;
				ts?: string;
				da?: string;
			};

			const { dl, ts, da } = msg;
			console.log(msg);
			if (!dl || !da) return;

			// Throttle: drop frames that arrive faster than UPDATE_INTERVAL_MS
			const now = Date.now();
			if (now - lastUpdateTsRef.current < UPDATE_INTERVAL_MS) return;
			lastUpdateTsRef.current = now;

			const normalized = normalizeMqttPayload(dl, da, ts ?? null);
			if (!normalized) return;

			setTelemetry(normalized);
			setLastUpdate(ts ? new Date(ts + "Z") : new Date(now));
		} catch (err) {
			console.error("[useMqttTelemetry] Failed to parse message:", err);
		}
	}, []);

	useEffect(() => {
		// No topic → stay idle, don't open a connection
		if (!topic) {
			setStatus("idle");
			return;
		}

		setStatus("connecting");

		const client = mqtt.connect(MQTT_WS_BROKER, {
			// Unique client ID to prevent session collisions
			clientId: `dashboard_${Math.random().toString(16).slice(2, 10)}`,
			clean: true,
			reconnectPeriod: 5_000,
			connectTimeout: 10_000,
		});

		clientRef.current = client;

		client.on("connect", () => {
			setStatus("connected");
			client.subscribe(topic, { qos: 0 }, (err) => {
				if (err)
					console.error(
						`[useMqttTelemetry] Subscribe error on "${topic}":`,
						err,
					);
				else
					console.info(`[useMqttTelemetry] Subscribed to "${topic}"`);
			});
		});

		client.on("message", handleMessage);
		client.on("error", (err) => {
			console.error("[useMqttTelemetry] Error:", err);
			setStatus("error");
		});
		client.on("offline", () => setStatus("disconnected"));
		client.on("reconnect", () => setStatus("reconnecting"));
		client.on("close", () => setStatus("disconnected"));

		return () => {
			// Unsubscribe first (best-effort), then close the connection
			if (client.connected) client.unsubscribe(topic);
			client.end(true);
			clientRef.current = null;
			setStatus("idle");
		};
		// Re-run only when the target topic changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [topic]);

	return { telemetry, status, lastUpdate };
}
