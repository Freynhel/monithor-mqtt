// DTO / schemas

/* Generator table:

USE [MotormacNext]
GO

Object:  Table [dbo].[Generator]

CREATE TABLE [dbo].[Generator](
	[GeneratorID] [int] IDENTITY(1,1) NOT NULL,
	[ModelID] [int] NULL,
	[Name] [varchar](99) NULL,
	[Address] [varchar](150) NULL,
	[Year] [smallint] NULL,
	[ClientCompanyID] [int] NULL,
	[Status] [varchar](20) NULL,
	[DefaultType] [varchar](20) NULL,
	[HasMonithor] [bit] NULL,
	[RemoteControl] [bit] NULL,
	[SerialNumber] [varchar](70) NULL,
	[Mode] [varchar](20) NULL,
	[TankSize] [decimal](8, 2) NULL,
	[State] [varchar](2) NULL,
	[Latitude] [decimal](9, 6) NULL,
	[Longitude] [decimal](9, 6) NULL,
	[ContactName] [varchar](99) NULL,
	[ContactNumber] [varchar](20) NULL,
	[ContactEmail] [varchar](200) NULL,
	[Commissioning] [bit] NULL,
	[TopicMQTT] [varchar](30) NULL,
	[Active] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[GeneratorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 95, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Generator]  WITH CHECK ADD  CONSTRAINT [FK_Generator_ClientCompany] FOREIGN KEY([ClientCompanyID])
REFERENCES [dbo].[ClientCompany] ([ClientCompanyID])
GO

ALTER TABLE [dbo].[Generator] CHECK CONSTRAINT [FK_Generator_ClientCompany]
GO

ALTER TABLE [dbo].[Generator]  WITH CHECK ADD  CONSTRAINT [FK_Generator_Model] FOREIGN KEY([ModelID])
REFERENCES [dbo].[Model] ([ModelID])
GO

ALTER TABLE [dbo].[Generator] CHECK CONSTRAINT [FK_Generator_Model]
GO

*/

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
