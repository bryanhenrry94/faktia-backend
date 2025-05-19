export class CreateTenantDto {
  name: string;
  taxId: string;
  subdomain: string;
  plan: string;
  email: string;
  tradeName: string | null;
  establishmentNumber: string | null;
  accountingRequired: boolean | null;
  specialTaxpayer: boolean | null;
  largeTaxpayer: boolean | null;
  rimpeRegimeTaxpayer: boolean | null;
  rimpe: string | null;
  withholdingAgent: boolean | null;
  city: string | null;
  phone: string | null;
  address: string | null;
  logo: string | null;
}
