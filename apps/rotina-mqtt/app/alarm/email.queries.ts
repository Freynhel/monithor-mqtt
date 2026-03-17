export const GET_GLOBAL_EMAILS = `
	SELECT Email 
	FROM Alarm.AlarmEmail
	WHERE SendEmail = 1
		AND Email IS NOT NULL
		AND LTRIM(RTRIM(Email)) <> ''
`;

export const GET_COMPANIES = `
	SELECT ClientCompanyID
	FROM dbo.ClientCompany
`;

export const GET_EMPLOYEE_EMAILS = `
	SELECT EmployeeEmail
	FROM dbo.CompanyEmployee
	WHERE ClientCompanyID = @companyID
		AND EmployeeEmail IS NOT NULL
		AND LTRIM(RTRIM(EmployeeEmail)) <> ''
`;

export const GET_GENERATORS_BY_COMPANY = `
	SELECT GeneratorID
	FROM dbo.Generator
	WHERE ClientCompanyID = @companyID
`;

export const GET_ACTIVE_ALARMS_BY_GENERATORS = `
	SELECT AlarmID, Message
	FROM Modbus.Alarm
	WHERE GeneratorID IN (@generatorIds)
	AND [Exit] IS NULL
	AND DateTime >= DATEADD(HOUR, -720, GETDATE())
`;

/* Adjust table to not allow dupes */
export const INSERT_QUEUE = `
IF NOT EXISTS (
	SELECT 1 FROM Alarm.EmailList
	WHERE AlarmID = @alarmID AND RecipientEmail = @email
)
INSERT INTO Alarm.EmailList (RecipientEmail, AlarmID, AlarmMessage, EmailSent, LastTried)
VALUES (@email, @alarmID, @msg, 0, NULL)
`;