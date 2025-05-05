export class CreateOrganizationDto {
  taxId: string;
  legalName: string;
  tradeName: string;
  establishmentNumber: string;
  accountingRequired: boolean;
  specialTaxpayer: boolean;
  largeTaxpayer: boolean;
  rimpeRegimeTaxpayer: boolean;
  rimpe: string;
  withholdingAgent: boolean;
  city: string;
  phone: string;
  address: string;
  logo: string;
}
