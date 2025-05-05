export class CreateElectronicInvoicingConfigDto {
  digitalCertificate: Buffer;
  certificatePassword: string;
  certificateExpiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
