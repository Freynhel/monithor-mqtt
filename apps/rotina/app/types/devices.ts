/*-----------------------------------------------------------------------------*/
/* 🔶 PCC1302, PCC1301 Mapping
/*-----------------------------------------------------------------------------*/

	export type PCC1302 = {
		general: {
			controller_type: number | null;
			switch_position: number | null;
			genset_state: number | null;
			active_fault: number | null;
			active_fault_type: number | null;
			battery_voltage: string | null;
			oil_pressure: number | null;
			coolant_temperature: string | null;
			rotation: number | null;
			starts: number | null;
			hourmeter_highbyte: number | null;
			hourmeter_lowbyte: number | null;
			hourmeter: number | null;
		};
		
		alarm: {
			fault_register: string | null;
			fault_register_extended: string | null;
		};

		generator: {
			gen_phase_an: number | null;
			gen_phase_bn: number | null;
			gen_phase_cn: number | null;
			gen_phase_ab: number | null;
			gen_phase_bc: number | null;
			gen_phase_ca: number | null;
			gen_phase_a: number | null;
			gen_phase_b: number | null;
			gen_phase_c: number | null;
			gen_apparent: number | null;
		};
	};

/*-----------------------------------------------------------------------------*/
/* 🔶 PCC3300 Mapping
/*-----------------------------------------------------------------------------*/

	export type PCC3300 = {
		general: {
			controller_type: number | null;
			switch_position: number | null;
			genset_state: number | null;
			active_fault: number | null;
			active_fault_type: number | null;
			battery_voltage: string | null;
			oil_pressure: number | null;
			coolant_temperature: string | null;
			rotation: number | null;
			starts: number | null;
			hourmeter_highbyte: number | null;
			hourmeter_lowbyte: number | null;
			hourmeter: number | null;
		},
		
		alarm: {
			fault_register: string | null;
			fault_register_extended: string | null;
		},

		network: {
			net_phase_an: number | null;
			net_phase_bn: number | null;
			net_phase_cn: number | null;
			net_phase_ab: number | null;
			net_phase_bc: number | null;
			net_phase_ca: number | null;
			net_phase_a: number | null;
			net_phase_b: number | null;
			net_phase_c: number | null;
			net_active: number | null;
			net_reactive: number | null;
			net_factor: number | null;
			net_apparent: number | null;
			net_frequency: string | null;
		},

		generator: {
			gen_phase_an: number | null;
			gen_phase_bn: number | null;
			gen_phase_cn: number | null;
			gen_phase_ab: number | null;
			gen_phase_bc: number | null;
			gen_phase_ca: number | null;
			gen_phase_a: number | null;
			gen_phase_b: number | null;
			gen_phase_c: number | null;
			gen_active: number | null;
			gen_reactive: number | null;
			gen_apparent: number | null;
			gen_factor: number | null;
			gen_frequency: string | null;
		}
	}
	
/*-----------------------------------------------------------------------------*/
/* 🔶 MCM3320 Mapping
/*-----------------------------------------------------------------------------*/

	export type MCM3320 = {
		generator: {
			gen_status: number | null;
			gen_phase_an: number | null;
			gen_phase_bn: number | null;
			gen_phase_cn: number | null;
			gen_phase_ab: number | null;
			gen_phase_bc: number | null;
			gen_phase_ca: number | null;
			gen_phase_a: number | null;
			gen_phase_b: number | null;
			gen_phase_c: number | null;
			gen_active: number | null;
			gen_reactive: number | null;
			gen_factor: number | null;
			gen_apparent: number | null;
			gen_frequency: string | null;
		},
		network: {
			net_status: number | null;
			net_phase_an: number | null;
			net_phase_bn: number | null;
			net_phase_cn: number | null;
			net_phase_ab: number | null;
			net_phase_bc: number | null;
			net_phase_ca: number | null;
			net_phase_a: number | null;
			net_phase_b: number | null;
			net_phase_c: number | null;
			net_active: number | null;
			net_reactive: number | null;
			net_factor: number | null;
			net_apparent: number | null;
			net_frequency: string | null;
		},
		unifilar: {
			generator: number | null;
			network: number | null;
			cgr: number | null;
			crd: number | null;
		},
		other: {
			number_gensets: number | null;
			system_capacity: number | null;
			online_capacity: number | null;
			operation_mode: number | null;
			controller_on_time: number | null;
			ptc_state: number | null;
			genset_state: number | null;
			active_fault: number | null;
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PC40 Mapping
/*-----------------------------------------------------------------------------*/

	export type PC40 = {
		network: {
			net_frequency: string | null;
			net_phase_an: string | null;
			net_phase_bn: string | null;
			net_phase_cn: string | null;
			net_phase_ab: string | null;
			net_phase_bc: string | null;
			net_phase_ca: string | null;
			net_phase_a: number | null;
			net_phase_b: number | null;
			net_phase_c: number | null;
			net_total_watts: number | null;
			net_total_kva: number | null;
			net_total_kvar: number | null;
			net_avg_power_factor: number | null;
		},
		generator: {
			gen_frequency: string | null;
			gen_phase_an: string | null;
			gen_phase_bn: string | null;
			gen_phase_cn: string | null;
			gen_phase_ab: string | null;
			gen_phase_bc: string | null;
			gen_phase_ca: string | null;
			gen_phase_a: number | null;
			gen_phase_b: number | null;
			gen_phase_c: number | null;
			gen_total_watts: number | null;
			gen_total_kva: number | null;
			gen_total_kvar: number | null;
			gen_avg_power_factor: number | null;
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 PS600 Mapping
/*-----------------------------------------------------------------------------*/

	export type PS600 = {
		general: {
			controller_type: number | null;
			switch_position: number | null;
			genset_state: number | null;
			active_fault: number | null;
			active_fault_type: number | null;
			battery_voltage: string | null;
			oil_pressure: number | null;
			coolant_temperature: string | null;
		},
		voltage: {
			phase_an: number | null;
			phase_bn: number | null;
			phase_cn: number | null;
			phase_ab: number | null;
			phase_bc: number | null;
			phase_ca: number | null;
		},
		current: {
			phase_a: number | null;
			phase_b: number | null;
			phase_c: number | null;
		},
		engine: {
			rotation: number | null;
			starts: number | null;
			hourmeter_highbyte: number | null;
			hourmeter_lowbyte: number | null;
			fuel_level: number | null;
			hourmeter: number | null;
		},
		alarm: {
			fault_register: string | null;
			fault_register_extended: string | null;
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 DSE7320-QTA Mapping
/*-----------------------------------------------------------------------------*/

	export type DSE7320_QTA = {
		generator: {
			control_mode: number | null;
			oil_pressure: number | null;
			coolant_temperature: number | null;
			oil_temperature: number | null;
			fuel_level: number | null;
			alternator_voltage: number | null;
			battery_voltage: string | null;
			rotation: number | null;
			gen_frequency: string | null;
			gen_phase_an: string | null;
			gen_phase_bn: string | null;
			gen_phase_cn: string | null;
			gen_phase_ab: string | null;
			gen_phase_bc: string | null;
			gen_phase_ca: string | null;
			gen_phase_a: string | null;
			gen_phase_b: string | null;
			gen_phase_c: string | null;
			engine_operating_status: number | null;
			gen_total_watts: number | null;
			gen_total_va: number | null;
			gen_total_var: number | null;
			gen_total_fp: string | null;
			engine_run_time_high: number | null;
			engine_run_time_low: number | null;
			number_of_starts: number | null;
		},
		network: {
			net_frequency: string | null;
			net_phase_an: string | null;
			net_phase_bn: string | null;
			net_phase_cn: string | null;
			net_phase_ab: string | null;
			net_phase_bc: string | null;
			net_phase_ca: string | null;
			net_phase_a: string | null;
			net_phase_b: string | null;
			net_phase_c: string | null;
			net_total_watts: number | null;
			net_total_va: number | null;
			net_total_var: number | null;
			net_total_fp: string | null;
		},
		alarms: {
			alarms_1: number | null;
			alarms_2: number | null;
			alarms_3: number | null;
			alarms_4: number | null;
			alarms_5: number | null;
			alarms_6: number | null;
			alarms_7: number | null;
			alarms_8: number | null;
			alarms_9: number | null;
			alarms_10: number | null;
		}
	}

/*-----------------------------------------------------------------------------*/
/* 🔶 COMAP-AMF25 Mapping
/*-----------------------------------------------------------------------------*/

	export type COMAP_AMF25 = {
		engine: {
			rotation: number | null;
			hourmeter_highbyte: number | null;
			hourmeter_lowbyte: number | null;
			starts: number | null;
			hourmeter: string | null;
		},
		generator: {
			gen_frequency: string | null;
			gen_phase_an: number | null;
			gen_phase_bn: number | null;
			gen_phase_cn: number | null;
			gen_phase_ab: number | null;
			gen_phase_bc: number | null;
			gen_phase_ca: number | null;
			binary1: number | null;
			binary2: number | null;
			binary3: number | null;
		},
		network: {
			net_frequency: string | null;
			net_phase_an: number | null;
			net_phase_bn: number | null;
			net_phase_cn: number | null;
			net_phase_ab: number | null;
			net_phase_bc: number | null;
			net_phase_ca: number | null;
			pressao: string | null;
			temp_refrig: number | null;
			fuel_rate: string | null;
		},
		general: {
			battery_voltage: string | null;
			switch_position: string | null;
			status: string | null;
		}
	}

/*-----------------------------------------------------------------------------*/
/* ⭕ Pendentes: AUX101 (Aux), HF6508 (Aux), PS500
/*-----------------------------------------------------------------------------*/