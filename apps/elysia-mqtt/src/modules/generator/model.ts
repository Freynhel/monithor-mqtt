// DTO / schemas

import { t } from "elysia";

export const GeneratorModel = {
	generator: t.Object({
		GeneratorID: t.Number(),
		ModelID: t.Optional(t.Number()),
		Name: t.Optional(t.String()),
		Address: t.Optional(t.String()),
		Year: t.Optional(t.Number()),
		ClientCompanyID: t.Optional(t.Number()),
		Status: t.Optional(t.String()),
		DefaultType: t.Optional(t.String()),
		HasMonithor: t.Optional(t.Boolean()),
		RemoteControl: t.Optional(t.Boolean()),
		SerialNumber: t.Optional(t.String()),
		Mode: t.Optional(t.String()),
		TankSize: t.Optional(t.Number()),
		State: t.Optional(t.String()),
		Latitude: t.Optional(t.Number()),
		Longitude: t.Optional(t.Number()),
		ContactName: t.Optional(t.String()),
		ContactNumber: t.Optional(t.String()),
		ContactEmail: t.Optional(t.String()),
		Commissioning: t.Optional(t.Boolean()),
		TopicMQTT: t.Optional(t.String()),
		Active: t.Optional(t.Boolean())
	}),
	createGenerator: t.Object({
		ModelID: t.Optional(t.Number()),
		Name: t.Optional(t.String()),
		Address: t.Optional(t.String()),
		Year: t.Optional(t.Number()),
		ClientCompanyID: t.Optional(t.Number()),
		Status: t.Optional(t.String()),
		DefaultType: t.Optional(t.String()),
		HasMonithor: t.Optional(t.Boolean()),
		RemoteControl: t.Optional(t.Boolean()),
		SerialNumber: t.Optional(t.String()),
		Mode: t.Optional(t.String()),
		TankSize: t.Optional(t.Number()),
		State: t.Optional(t.String()),
		Latitude: t.Optional(t.Number()),
		Longitude: t.Optional(t.Number()),
		ContactName: t.Optional(t.String()),
		ContactNumber: t.Optional(t.String()),
		ContactEmail: t.Optional(t.String()),
		Commissioning: t.Optional(t.Boolean()),
		TopicMQTT: t.Optional(t.String()),
		Active: t.Optional(t.Boolean())
	}),
	updateGenerator: t.Object({
		ModelID: t.Optional(t.Number()),
		Name: t.Optional(t.String()),
		Address: t.Optional(t.String()),
		Year: t.Optional(t.Number()),
		ClientCompanyID: t.Optional(t.Number()),
		Status: t.Optional(t.String()),
		DefaultType: t.Optional(t.String()),
		HasMonithor: t.Optional(t.Boolean()),
		RemoteControl: t.Optional(t.Boolean()),
		SerialNumber: t.Optional(t.String()),
		Mode: t.Optional(t.String()),
		TankSize: t.Optional(t.Number()),
		State: t.Optional(t.String()),
		Latitude: t.Optional(t.Number()),
		Longitude: t.Optional(t.Number()),
		ContactName: t.Optional(t.String()),
		ContactNumber: t.Optional(t.String()),
		ContactEmail: t.Optional(t.String()),
		Commissioning: t.Optional(t.Boolean()),
		TopicMQTT: t.Optional(t.String()),
		Active: t.Optional(t.Boolean())
	}),
};

export type Generator = typeof GeneratorModel.generator.static;
export type CreateGeneratorInput = typeof GeneratorModel.createGenerator.static;
export type UpdateGeneratorInput = typeof GeneratorModel.updateGenerator.static;
