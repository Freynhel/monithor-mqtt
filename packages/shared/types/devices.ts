/*-----------------------------------------------------------------------------*/
/* 🛠️ Utility Types
/*-----------------------------------------------------------------------------*/

	type Nullable<T> = T | null

	/** Prepends a string prefix to all keys of T */
	type Prefixed<P extends string, T> = {
		[K in keyof T as `${P}${string & K}`]: T[K]
	}

/*-----------------------------------------------------------------------------*/
/* ⚡ Shared Electrical Measurement Shapes
/*-----------------------------------------------------------------------------*/
	
	type PhaseVoltages = {
		phase_an: Nullable<number>
		phase_bn: Nullable<number>
		phase_cn: Nullable<number>
		phase_ab: Nullable<number>
		phase_bc: Nullable<number>
		phase_ca: Nullable<number>
	}

	type PhaseCurrents = {
		phase_a: Nullable<number>
		phase_b: Nullable<number>
		phase_c: Nullable<number>
	}

	type PowerMetrics = {
		active:    Nullable<number>
		reactive:  Nullable<number>
		factor:    Nullable<number>
		apparent:  Nullable<number>
	}

	type ElectricalMeasurements = PhaseVoltages & PhaseCurrents & PowerMetrics

	/** Reusable prefixed sections */
	type GeneratorSection = Prefixed<'gen_', ElectricalMeasurements>
	type NetworkSection   = Prefixed<'net_', ElectricalMeasurements>

/*-----------------------------------------------------------------------------*/
/* 🚨 Alarm Shape
/*-----------------------------------------------------------------------------*/

	type AlarmSection = {
		fault_register: Nullable<string>
		fault_register_extended: Nullable<string>
	}

/*-----------------------------------------------------------------------------*/
/* 🧩 General Shape
/*-----------------------------------------------------------------------------*/

	type GeneralSection = {
		controller_type: Nullable<number>
		switch_position: Nullable<number>
		genset_state: Nullable<number>
		active_fault: Nullable<number>
		active_fault_type: Nullable<number>
		battery_voltage: Nullable<string>
		oil_pressure: Nullable<string>
		coolant_temperature: Nullable<string>
		rotation: Nullable<number>
		starts: Nullable<number>
		hourmeter_highbyte: Nullable<number>
		hourmeter_lowbyte: Nullable<number>
		hourmeter: Nullable<number>
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PCC1302, PCC1301 Mapping
/*-----------------------------------------------------------------------------*/

	export type PCC1302 = {
		general: GeneralSection
		alarm: AlarmSection
		generator: GeneratorSection
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PS600 Mapping
/*-----------------------------------------------------------------------------*/

	export type PS600 = {
		general: GeneralSection & { fuel_level: Nullable<number> }
		generator: Prefixed<'gen_', PhaseVoltages & PhaseCurrents>
		alarm: AlarmSection
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PCC3300 Mapping
/*-----------------------------------------------------------------------------*/

	export type PCC3300 = {
		general: GeneralSection
		alarm: AlarmSection
		generator: GeneratorSection & { gen_frequency: Nullable<string> }
		network: NetworkSection & { net_frequency: Nullable<string> }
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 MCM3320 Mapping
/*-----------------------------------------------------------------------------*/

	export type MCM3320 = {
		general: {
			number_gensets: Nullable<number>
			system_capacity: Nullable<number>
			online_capacity: Nullable<number>
			operation_mode: Nullable<number>
			controller_on_time: Nullable<number>
			ptc_state: Nullable<number>
			genset_state: Nullable<number>
			active_fault: Nullable<number>
		}
		generator: GeneratorSection & { 
			gen_frequency: Nullable<string> 
		}
		network: NetworkSection & { 
			net_frequency: Nullable<string> 
		}
		unifilar: {
			generator: Nullable<number>
			network: Nullable<number>
			cgr: Nullable<number>
			crd: Nullable<number>
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PC40 Mapping
/*-----------------------------------------------------------------------------*/

	export type PC40 = {
		network: Prefixed<'net_', PhaseVoltages & PhaseCurrents> & { 
			net_frequency: Nullable<string>
			net_total_watts: Nullable<number>
			net_total_kva: Nullable<number>
			net_total_kvar: Nullable<number>
			net_avg_power_factor: Nullable<number>
		}

		generator: Prefixed<'gen_', PhaseVoltages & PhaseCurrents> & {
			gen_frequency: Nullable<string>
			gen_total_watts: Nullable<number>
			gen_total_kva: Nullable<number>
			gen_total_kvar: Nullable<number>
			gen_avg_power_factor: Nullable<number>
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 DSE7320-QTA Mapping
/*-----------------------------------------------------------------------------*/

	export type DSE7320_QTA = {
		general: {
			control_mode: Nullable<number>
			oil_pressure: Nullable<number>
			coolant_temperature: Nullable<number>
			oil_temperature: Nullable<number>
			fuel_level: Nullable<number>
			alternator_voltage: Nullable<number>
			battery_voltage: Nullable<string>
			rotation: Nullable<number>
			engine_operating_status: Nullable<number>
			engine_run_time_high: Nullable<number>
			engine_run_time_low: Nullable<number>
			starts: Nullable<number>
		}

		generator: Prefixed<'gen_', PhaseVoltages & PhaseCurrents> & {
			gen_frequency: Nullable<string>
			gen_total_watts: Nullable<number>
			gen_total_va: Nullable<number>
			gen_total_var: Nullable<number>
			gen_total_fp: Nullable<string>
		}
		
		network: Prefixed<'net_', PhaseVoltages & PhaseCurrents> & {
			net_frequency: Nullable<string>
			net_total_watts: Nullable<number>
			net_total_va: Nullable<number>
			net_total_var: Nullable<number>
			net_total_fp: Nullable<string>
		}

		alarms: {
			alarms_1: Nullable<number>
			alarms_2: Nullable<number>
			alarms_3: Nullable<number>
			alarms_4: Nullable<number>
			alarms_5: Nullable<number>
			alarms_6: Nullable<number>
			alarms_7: Nullable<number>
			alarms_8: Nullable<number>
			alarms_9: Nullable<number>
			alarms_10: Nullable<number>
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 COMAP-AMF25 Mapping
/*-----------------------------------------------------------------------------*/

	export type COMAP_AMF25 = {
		general: {
			rotation: Nullable<number>
			hourmeter_highbyte: Nullable<number>
			hourmeter_lowbyte: Nullable<number>
			starts: Nullable<number>
			hourmeter: Nullable<string>
			battery_voltage: Nullable<string>
			switch_position: Nullable<string>
			status: Nullable<number>
			binary1: Nullable<number>
			binary2: Nullable<number>
			binary3: Nullable<number>
			pressure: Nullable<string>
			temp_refrig: Nullable<number>
			fuel_rate: Nullable<string>
		}

		generator: Prefixed<'gen_', PhaseVoltages> & {
			gen_frequency: Nullable<string>
		}
		network: Prefixed<'net_', PhaseVoltages> & {
			gen_frequency: Nullable<string>
		}
	}

/*-----------------------------------------------------------------------------*/
/* ⭕ Pendentes: AUX101 (Aux), HF6508 (Aux), PS500
/*-----------------------------------------------------------------------------*/
