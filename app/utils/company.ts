// Bedrijfsgegevens zoals ze in de KvK staan. Meta controleert deze bij de
// bedrijfsverificatie: houd naam, adres en telefoonnummer overal gelijk.
export const company = {
	legalName: "CapitalManagementGroup B.V.",
	tradeName: "LoanLink",
	kvk: "88986039",
	street: "Ilpendammerstraat 17",
	postalCity: "1023 AS Amsterdam",
	email: "info@loanlink.nl",
	phone: "06 17 41 23 48",
	phoneHref: "+31617412348",
} as const;
